class Utility {
    static batchPlay(command){
        try {
            const runModalFunction = async () => {
                const psAction = require("photoshop").action;
            
                await require("photoshop").core.executeAsModal(async () => {
                    command;
                    await psAction.batchPlay(command, {});
                }, {"commandName": "Action Commands"});
            };

            runModalFunction();
        } catch (error) {
            console.error("Error BatchPlay:", error);
        }
    }

    static undo(offset = -1)
    {
        const command = [
            {"_obj":"select","_target":[{"_offset":offset,"_ref":"historyState"}]}
        ];

        this.batchPlay(command)
    }
}