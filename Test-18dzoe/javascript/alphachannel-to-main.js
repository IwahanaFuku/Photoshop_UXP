class AlphachannelToMain {
  static app = require("photoshop").app;
  static core = require("photoshop").core;

  static async AddRedFile() {
    console.log("test");

    const doc = app.activeDocument;
    const originalActiveLayer = doc.activeLayers[0];

    // 新しいレイヤーを作成
    const redLayer = await doc.createLayer({ name: "Red Fill" });

    // 新しいレイヤーをアクティブにする
    doc.activeLayers = [redLayer];

    // レイヤーを赤色で塗りつぶす
    await core.executeAsModal(() => {
        return app.batchPlay(
            [{
                _obj: "fill",
                using: { _enum: "color", _value: "red" },
                color: { _obj: "RGBColor", red: 255, green: 0, blue: 0 },
                opacity: 100,
                mode: { _enum: "blendMode", _value: "normal" }
            }],
            { synchronousExecution: false }
        );
    });
  }
}