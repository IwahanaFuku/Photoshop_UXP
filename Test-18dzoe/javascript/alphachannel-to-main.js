class AlphachannelToMain {

  static async alphachannelToMain() {

    const runModalFunction = async () => {
      const psAction = require("photoshop").action;
    
      await require("photoshop").core.executeAsModal(async () => {
        const command = [
          {"_obj": "flattenImage"}
        ];
        await psAction.batchPlay(command, {});
      }, {"commandName": "Action Commands"});
    };

    await runModalFunction();
  }
}
