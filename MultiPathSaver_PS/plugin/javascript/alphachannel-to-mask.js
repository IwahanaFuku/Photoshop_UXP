class AlphachannelToMask {
    static alphachannelToMask() {
        let command = [
            // 画像を統合
            {"_obj":"flattenImage"},
            // 選択範囲 チャンネル “アルファチャンネル 1”
            {"_obj":"select","_target":[{"_name":"アルファチャンネル 1","_ref":"channel"}]},
            // 設定 : 選択範囲
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_ref":"channel","_value":"targetEnum"}},
            // 選択範囲を反転
            {"_obj":"inverse"},
            // 消去 :  現在のチャンネル
            {"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"channel","_value":"targetEnum"}]},
            // 作成 :
            {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
        ];

        Utility.batchPlay(command);
    }
}