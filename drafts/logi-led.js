const gLed = require('logitech-g-led-node');
const sltcs = require('./sltcs');
const axios = require("axios");


function sleep(x) {
    return new Promise(r => setTimeout(r, x));
}

// You need logitech G hub to be running in the background
// Also your device shouldn't be on onboard memory mode
async function main() {
    try {
        const initResult = gLed.init();
        await sleep(1000); // Logitech SDK documentation recommends sleep after init
        if (!initResult) {
            throw new Error("could not initialize logi led sdk");
        } else {
            console.log('Init complete');
            await sleep(100);
        }

        console.log("ready?")
        await new Promise(resolve => setTimeout(resolve, 1500));
        let a = new sltcs('./test2.sltcs');
        let controlData = a.getControlData();
        console.log(controlData);

        let timeDataCount = controlData.shift().TIME_DATA_COUNT;

        console.log("START");
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let i = 0; i < timeDataCount; i++) {
            let waitTime = controlData.shift().DATA.WAIT_TIME;
            if (waitTime !== 0) await new Promise(resolve => setTimeout(resolve, waitTime));

            try {
                let flag = true;
                while (flag) {
                    let currentData = controlData[0];
                    switch (currentData.TYPE) {
                        case "COLOR":
                            setColor(currentData.DATA.R, currentData.DATA.G, currentData.DATA.B, currentData.DATA.A);
                            controlData.shift();
                            break;

                        case "TIME":
                            flag = false;
                            break;
                    }

                }

            } catch (e) {

            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

function setColor(r, g, b, a) {
    a = a !== 0 ? (a / 255) : 0;
    r = r !== 0 ? (r / 255) * 100 * a : 0;
    g = g !== 0 ? (g / 255) * 100 * a : 0;
    b = b !== 0 ? (b / 255) * 100 * a : 0;

    try {
        gLed.setLighting(r, g, b);
        console.log(`Set:${r} ${g} ${b}`);
    } catch (error) {
        console.error('Error setting color:', error);
    }
}


main().then();