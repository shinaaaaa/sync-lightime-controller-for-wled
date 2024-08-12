const axios = require('axios');
const sltcs = require('./sltcs')

// WLEDデバイスのIPアドレス
const WLED_IP = 'http://wled-shina.local';

// WLEDの電源をオン/オフする関数
async function togglePower(state) {
    try {
        const response = await axios.post(`${WLED_IP}/json/state`, {
            on: state
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error toggling power:', error);
    }
}

// 色を設定する関数
async function setColor(r, g, b, a = '255') {
    try {
        const response = await axios.post(`${WLED_IP}/json/state`, {
            on:true,
            bri: a,
            seg: [{
                col: [[r, g, b]]
            }]
        });
        console.log(`Set color to: R=${r}, G=${g}, B=${b}, A=${a}`);
    } catch (error) {
        console.error('Error setting color:', error);
    }
}

async function setTransition(time) {
    try {
        const response = await axios.post(`${WLED_IP}/json/state`, {
            transition: time
        });
        console.log(`Set transition time to: ${time}`);
    } catch (error) {
        console.error('Error setting color:', error);
    }
}

// デモ実行
(async () => {
    console.log("ready?");
    await new Promise(resolve => setTimeout(resolve, 1500));

    let a = new sltcs('./test2.sltcs');
    let controlData = a.getControlData();
    console.log(controlData);

    let timeDataCount = controlData.shift().TIME_DATA_COUNT;

    console.log("START");
    for (let i = 0; i < timeDataCount; i++) {
        let waitTime = controlData.shift().DATA.WAIT_TIME;
        if (waitTime !== 0) await new Promise(resolve => setTimeout(resolve, waitTime));

        try {
            let flag = true;
            while (flag) {
                let currentData = controlData[0];
                switch (currentData.TYPE) {
                    case "COLOR":
                        // setColor(currentData.DATA.R, currentData.DATA.G, currentData.DATA.B, currentData.DATA.A);
                        console.log(currentData)
                        controlData.shift();
                        break;

                    case "TIME":
                        flag = false;
                        break;

                    case "TRANSITION":
                        // await setTransition(currentData.DATA);
                        controlData.shift();
                        break;
                }
            }
        } catch (e) {
            console.error('Error processing control data:', e);
        }
    }
})();
