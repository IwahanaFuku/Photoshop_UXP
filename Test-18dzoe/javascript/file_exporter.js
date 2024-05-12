class FileExporter {

  static getSupportedExtensions() {
    return [".jpg", ".png", ".psd"];
  }

  static async exportFile(fullPath) {
    try {
      const dirName = fullPath.split('.').slice(0, -1).join('.');
      const extension = path.extname(fullPath);

      console.log(dirName);
      console.log(extension);

      // プライベート静的メソッドを呼び出し
      await require("photoshop").core.executeAsModal(() => this.#exportFileCommand(dirName, extension), { "commandName": "Action Commands" });

    } catch (e) {
      console.error(e);
    }
  }

  static async #exportFileCommand(exportPath, extension) {

    try {
      const fileProtocol = 'file:';

      const temp = await lffs.getTemporaryFolder();
      const filename = app.activeDocument.name.split('.').slice(0, -1).join('.');

      switch (extension) {
        case ".jpg":
          await app.activeDocument.saveAs.jpg(temp);
          break;
        case ".png":
          await app.activeDocument.saveAs.png(temp);
          break;
        case ".psd":
          await app.activeDocument.saveAs.psd(temp);
          break;
        default:
          break;
      }

      const tempPath = path.join(`${fileProtocol}${temp.nativePath}`, `${filename}${extension}`);
      const exportFullPath = `${fileProtocol}${exportPath}${extension}`;

      fs.copyFile(tempPath, exportFullPath);
      fs.unlink(tempPath);

      console.log("tempPath :" + tempPath);
      console.log("exportPath :" + exportFullPath);

    } catch (e) {
      console.error("Error:", e);
    }
  }
}
