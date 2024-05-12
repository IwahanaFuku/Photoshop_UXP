const { entrypoints, storage, dom } = require("uxp");
const { app } = require("photoshop");
const lffs = storage.localFileSystem;
const fs = require('fs');

showAlert = () => {
  alert("This is an alert message");
}

entrypoints.setup({
  commands: {
    showAlert,
  },
  panels: {
    vanilla: {
      show(node ) {
      }
    }
  }
});

function addNewInputSet() {

  const folderNameInput = textInputElement("folder path");
  const fileNameInput = textInputElement("file name");
  const selectFolderButton = buttonElement("フォルダ選択");
  const selectBox = selectBoxElement();
  const exportButton = buttonElement("書き出し");

  const div = document.createElement("div");

  div.appendChild(folderNameInput);
  div.appendChild(fileNameInput);
  div.appendChild(selectBox);
  div.appendChild(selectFolderButton);
  div.appendChild(exportButton);

  selectFolderButton.addEventListener("click", () => {
    folderName = selectFolder(folderNameInput);
  });

  exportButton.addEventListener("click", () => {

    let fileFullPath = path.join(folderNameInput.value, fileNameInput.value + selectBox.value);
    console.log(fileFullPath);

    FileExporter.exportFile(fileFullPath);
  });
  
  const container = document.querySelector("#container");
  container.appendChild(div);
}

function textInputElement(placeholder)
{
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;

  return input;
}

function buttonElement(textContent)
{
  const button = document.createElement("button");
  button.textContent = textContent;

  return button;
}

async function selectFolder(pathInput)
{
  let folderName;

  try
  {
      const folder = await lffs.getFolder();
      if (folder) {
          console.log("Selected folder: " + folder.nativePath);
          folderName = folder.nativePath;
      }
  } catch (error) {
      console.error("Error selecting folder:", error);
  }

  pathInput.value = folderName;

  return folderName;
}

function selectBoxElement() {
  // 新しいselect要素を作成
  const select = document.createElement('select');
  
  // Option要素を作成し、selectに追加
  const options = FileExporter.getSupportedExtensions();

  options.forEach(option => {
    const newOption = document.createElement('option');
    newOption.value = option;
    newOption.textContent = option;
    select.appendChild(newOption);
  });

  // select要素の初期値を設定
  select.value = options[0];

  // select要素にイベントリスナーを設定
  select.addEventListener('change', () => {
    console.log("Selected Item:", select.value);
  });

  return select;
}

document.getElementById("addButton").addEventListener("click", addNewInputSet);