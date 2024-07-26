class InputSetManager {
  constructor(containerId) {
      this.app = require("photoshop").app;
      this.lffs = require("uxp").storage.localFileSystem;
      this.container = document.querySelector(containerId);
      this.initializeEventListeners();

      this.addNewInputSet();
  }

  addNewInputSet() {
    const div = document.createElement("div");
    div.classList.add("input-set");
    div.appendChild(this.textInputElement("folder path"));

    const fileNameInput = this.textInputElement("file name");
    div.appendChild(fileNameInput);
    this.setFileName(fileNameInput);

    const selectBox = this.selectBoxElement();
    div.appendChild(selectBox);

    const exporPowerOfTwo = this.checkboxElement("2の累乗で書き出し");
    const convertAlphachannelToMask = this.checkboxElement("アルファチャンネルをマスクに変換");
    convertAlphachannelToMask.container.style.display = selectBox.value === ".png" ? 'flex' : 'none';
    const selectFolderButton = this.buttonElement("フォルダ選択");
    const exportButton = this.buttonElement("書き出し");
    const deleteButton = this.buttonElement("削除");

    const hiddenPathElement = document.createElement("p");
    hiddenPathElement.style.display = 'none';

    div.appendChild(exporPowerOfTwo.container);
    div.appendChild(convertAlphachannelToMask.container);
    div.appendChild(selectFolderButton);
    div.appendChild(exportButton);
    div.appendChild(deleteButton);
    div.appendChild(hiddenPathElement);

    this.setUpEventListeners(div, selectBox, exporPowerOfTwo, convertAlphachannelToMask, selectFolderButton, exportButton, deleteButton, hiddenPathElement);
    this.container.appendChild(div);
  }

  setFileName(fileNameInput)
  {
    const filename = this.app.activeDocument.name.split('.').slice(0, -1).join('.');
    fileNameInput.value = filename;
  }

  textInputElement(placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    return input;
  }

  buttonElement(textContent) {
    const button = document.createElement("button");
    button.textContent = textContent;
    return button;
  }

  checkboxElement(textContent) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
  
    const label = document.createElement('label');
    label.textContent = textContent;
  
    container.appendChild(checkbox);
    container.appendChild(label);
  
    return { container, checkbox };
  }

  selectBoxElement() {
    const select = document.createElement('select');
    const options = FileExporter.getSupportedExtensions();
    options.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option;
        newOption.textContent = option;
        select.appendChild(newOption);
    });
    select.value = options[0];
    return select;
  }

  setUpEventListeners(div, selectBox, exporPowerOfTwo, convertAlphachannelToMask, selectFolderButton, exportButton, deleteButton, hiddenPathElement) {
    try{
      selectFolderButton.addEventListener("click", async () => {
          const folderName = await this.lffs.getFolder();
          if (folderName) {
              div.querySelector("[placeholder='folder path']").value = folderName.nativePath;
              this.updateFullPath(div, hiddenPathElement);
          }
      });

      div.querySelectorAll("input, select").forEach(input => {
          input.addEventListener("input", () => this.updateFullPath(div, hiddenPathElement));
          input.addEventListener("change", () => this.updateFullPath(div, hiddenPathElement));
      });

      exportButton.addEventListener("click", () => this.fileExport(hiddenPathElement.textContent,
                                                                   exporPowerOfTwo.checkbox.checked,
                                                                   convertAlphachannelToMask.checkbox.checked));
      deleteButton.addEventListener("click", () => div.remove());

      selectBox.addEventListener("change", () => {
        convertAlphachannelToMask.container.style.display = selectBox.value === ".png" ? 'flex' : 'none';
      });
    }catch(e)
    {
      console.error(e);
    }
  }

  fileExport(textContent, isPowerOfTwo, isAlphachannelToMask) {

    if(isPowerOfTwo)
    {
      ConvertPowerOfTwo.convertCanvasToNearestPowerOfTwo();
    }

    if(isAlphachannelToMask)
    {
      AlphachannelToMask.alphachannelToMask();
    }

    FileExporter.exportFile(textContent);

    if(isPowerOfTwo)
    {
      Utility.undo();
    }

    if(isAlphachannelToMask)
    {
      Utility.undo(-5);
    }
  }

  updateFullPath(div, hiddenPathElement) {
    const folderNameInput = div.querySelector("[placeholder='folder path']");
    const fileNameInput = div.querySelector("[placeholder='file name']");
    const selectBox = div.querySelector("select");
    const fileFullPath = path.join(folderNameInput.value, fileNameInput.value + selectBox.value);
    hiddenPathElement.textContent = fileFullPath;
  }

  initializeEventListeners() {
    document.getElementById("addButton").addEventListener("click", () => this.addNewInputSet());
    document.getElementById("exportAllButton").addEventListener("click", () => this.exportAll());
  }

  exportAll() {
    const inputSets = this.container.querySelectorAll(".input-set");
    inputSets.forEach(div => {
        const hiddenPathElement = div.querySelector("p");
        const checkbox  = div.querySelector("input[type='checkbox']");
        const isPowerOfTwo = checkbox.checked;
        if (hiddenPathElement && hiddenPathElement.textContent) {
            console.log("Exporting file at path: ", hiddenPathElement.textContent);
            this.fileExport(hiddenPathElement.textContent, isPowerOfTwo);
        }
    });
  }
}
