class Utility {
    static undo()
    {
        try {
            const runModalFunction = async () => {
                const psAction = require("photoshop").action;
            
                await require("photoshop").core.executeAsModal(async () => {
                const command = [
                    {"_obj":"select","_target":[{"_enum":"ordinal","_ref":"historyState","_value":"previous"}]}
                ];
                await psAction.batchPlay(command, {});
                }, {"commandName": "Action Commands"});
            };

            runModalFunction();
        } catch (error) {
            console.error("Error Undo:", error);
        }
    }
}