class ConvertPowerOfTwo {
    static app = require("photoshop").app;

    static async convertCanvasToNearestPowerOfTwo() {
        try {
            const doc = this.app.activeDocument;
            const width = doc.width;
            const height = doc.height;

            const nearestWidth = this.nearestPowerOfTwo(width);
            const nearestHeight = this.nearestPowerOfTwo(height);

            console.log(`Original size: ${width}x${height}`);
            console.log(`Nearest power of two size: ${nearestWidth}x${nearestHeight}`);

            const runModalFunction = async () => {
            const psAction = require("photoshop").action;
            
            await require("photoshop").core.executeAsModal(async () => {
                const command = [
                {"_obj":"imageSize",
                    "height":{
                        "_unit":"pixelsUnit",
                        "_value":nearestHeight
                    },
                    "interfaceIconFrameDimmed":{
                        "_enum":"interpolationType",
                        "_value":"automaticInterpolation"
                    },
                    "width":{
                        "_unit":"pixelsUnit",
                        "_value":nearestWidth
                    }
                }
                ];
                await psAction.batchPlay(command, {});
            }, {"commandName": "Action Commands"});
            };

            await runModalFunction();

            console.log("Canvas resized to the nearest power of two.");
        } catch (error) {
            console.error("Error converting canvas size:", error);
        }
    }

    static nearestPowerOfTwo(value) {
        return Math.pow(2, Math.round(Math.log(value) / Math.log(2)));
    }
}