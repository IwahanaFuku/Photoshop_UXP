class FileExporter {
  static lffs = require("uxp").storage.localFileSystem;
  static app = require("photoshop").app;
  static fs = require("fs");

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

      const temp = await this.lffs.getTemporaryFolder();
      const filename = this.app.activeDocument.name.split('.').slice(0, -1).join('.');

      switch (extension) {
        case ".jpg":
          await this.app.activeDocument.saveAs.jpg(temp);
          break;
        case ".png":
          await this.app.activeDocument.saveAs.png(temp);
          break;
        case ".psd":
          await this.app.activeDocument.saveAs.psd(temp);
          break;
        default:
          break;
      }

      const tempPath = path.join(`${fileProtocol}${temp.nativePath}`, `${filename}${extension}`);
      const exportFullPath = `${fileProtocol}${exportPath}${extension}`;

      this.fs.copyFile(tempPath, exportFullPath);
      this.fs.unlink(tempPath);

      console.log("tempPath :" + tempPath);
      console.log("exportPath :" + exportFullPath);

    } catch (e) {
      console.error("Error:", e);
    }
  }
}