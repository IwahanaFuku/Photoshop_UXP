const { entrypoints, storage, dom } = require("uxp");
const { app } = require("photoshop");
const lffs = storage.localFileSystem;
const fs = require('fs');

class InputSetManager {

  constructor(containerId) {
      this.container = document.querySelector(containerId);
      this.initializeEventListeners();
  }

  addNewInputSet() {
      const div = document.createElement("div");
      div.classList.add("input-set");
      div.appendChild(this.textInputElement("folder path"));
      div.appendChild(this.textInputElement("file name"));
      div.appendChild(this.selectBoxElement());

      const selectFolderButton = this.buttonElement("フォルダ選択");
      const exportButton = this.buttonElement("書き出し");
      const deleteButton = this.buttonElement("削除");
      const hiddenPathElement = document.createElement("p");
      div.appendChild(selectFolderButton);
      div.appendChild(exportButton);
      div.appendChild(deleteButton);
      div.appendChild(hiddenPathElement);

      this.setUpEventListeners(div, selectFolderButton, exportButton, deleteButton, hiddenPathElement);
      this.container.appendChild(div);
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

  setUpEventListeners(div, selectFolderButton, exportButton, deleteButton, hiddenPathElement) {
      selectFolderButton.addEventListener("click", async () => {
          const folderName = await lffs.getFolder();
          if (folderName) {
              div.querySelector("[placeholder='folder path']").value = folderName.nativePath;
              this.updateFullPath(div, hiddenPathElement);
          }
      });

      div.querySelectorAll("input, select").forEach(input => {
          input.addEventListener("input", () => this.updateFullPath(div, hiddenPathElement));
          input.addEventListener("change", () => this.updateFullPath(div, hiddenPathElement));
      });

      exportButton.addEventListener("click", () => FileExporter.exportFile(hiddenPathElement.textContent));
      deleteButton.addEventListener("click", () => div.remove());
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
          if (hiddenPathElement && hiddenPathElement.textContent) {
              console.log("Exporting file at path: ", hiddenPathElement.textContent);
              FileExporter.exportFile(hiddenPathElement.textContent);
          }
      });
  }
}

// Initialize InputSetManager
const inputSetManager = new InputSetManager("#container");