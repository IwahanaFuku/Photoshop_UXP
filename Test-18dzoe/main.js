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

  const pathInput = textInputElement("path");
  const fileNameInput = textInputElement("file name");
  const selectFolderButton = buttonElement("フォルダ選択");
  const selectBox = selectBoxElement();
  const exportButton = buttonElement("書き出し");

  const div = document.createElement("div");

  div.appendChild(pathInput);
  div.appendChild(fileNameInput);
  div.appendChild(selectBox);
  div.appendChild(selectFolderButton);
  div.appendChild(exportButton);

  selectFolderButton.addEventListener("click", () => {
    folderName = selectFolder(pathInput);
  });

  exportButton.addEventListener("click", () => {
    runModalFunction();
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
      const folder = await lffs.getFolder(); // フォルダ選択ダイアログを開く
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

function selectBoxElement()
{
  // 新しいselect要素を作成
  const select = document.createElement('select');
  select.id = 'dynamicSelect';
  
  // Option要素を作成し、selectに追加
  const options = [".jpg", ".png", ".psd"];
  options.forEach(option => {
    const newOption = document.createElement('option');
    newOption.value = option;
    newOption.textContent = option;
    select.appendChild(newOption);
  });

  // select要素にイベントリスナーを設定
  select.addEventListener('change', () => {
    console.log("Selected Item:", select.value);
  });

  return select;
}

async function actionCommands() {
  try{
    const fileProtocol = 'file:';

    const initPath = path.dirname(app.activeDocument.path);
    const initName = path.basename(app.activeDocument.path ,path.extname(app.activeDocument.path));

    const temp = await lffs.getTemporaryFolder();
    await app.activeDocument.saveAs.png(temp);

    const filename = app.activeDocument.name.split('.').slice(0, -1).join('.');

    const tempPath = `${fileProtocol}${temp.nativePath}\\${filename}.png`;
    const exportPath = `file:D:\\test.png`;

    fs.copyFile(tempPath, exportPath);
    fs.unlink(tempPath);
    
    console.log("tempPath :" + tempPath);
    console.log("exportPath :" + exportPath);
    
  } catch (e) {
    console.error("Error selecting folder:", e);
  }
}

async function runModalFunction() {
  await require("photoshop").core.executeAsModal(actionCommands, {"commandName": "Action Commands"});
}

document.getElementById("addButton").addEventListener("click", addNewInputSet);