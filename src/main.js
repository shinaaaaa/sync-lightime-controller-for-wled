"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sltcs_1 = __importDefault(require("./libs/sltcs"));
const timerHR_1 = __importDefault(require("./libs/timerHR"));
const timerHR_2 = __importDefault(require("./libs/timerHR"));
const ws_1 = __importDefault(require("ws"));
// WLEDのアドレス
// ws://[IPアドレス]/ws <- IPアドレスならこっち
const WLED_WS_URL = 'ws://192.168.1.222/ws';
// SLTCSのファイルパス
const SLTCS_FILE_PATH = './src/taiyou_kiss.sltcs';
// WebSocketクライアントの作成と接続
const ws = new ws_1.default(WLED_WS_URL);
// SLTCSの作成
const SLTCS = new sltcs_1.default(SLTCS_FILE_PATH);
let data = SLTCS.getControlData();
async function main() {
    console.log('Connecting...');
    // WebSocketの接続が確立するのを待つ
    await new Promise((resolve, reject) => {
        ws.on('open', () => {
            console.log('WebSocket connection opened');
            resolve();
            setColorRGBA('0', '0', '0', '0');
        });
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        });
    });
    console.log('ready');
    await timerHR_1.default.countdown(2);
    console.log('start');
    await playSltcsData(data);
    console.log('END');
    ws.close();
}
/**
 * WLEDの色をWebSocketで変更する
 * @param r red
 * @param g green
 * @param b blue
 * @param a alpha (brightness)
 */
function setColorRGBA(r, g, b, a = '1') {
    try {
        // WLEDに送信するペイロードの作成
        const payload = {
            on: true,
            seg: [{
                    col: [[r, g, b]]
                }]
        };
        // WebSocketメッセージの送信
        if (ws.readyState === ws_1.default.OPEN) {
            ws.send(JSON.stringify(payload));
            console.log(`Set color to: R=${r}, G=${g}, B=${b}, A=${a}`);
        }
        else {
            console.error('WebSocket is not open');
        }
    }
    catch (err) {
        console.error('Error setting color:', err);
    }
}
async function setColorObj(controlData) {
    setColorRGBA(controlData.DATA.R, controlData.DATA.G, controlData.DATA.B, controlData.DATA.A);
}
async function playSltcsData(controlData) {
    const startTime = timerHR_1.default.getTime();
    let changeColorTime = startTime;
    let diffTime = 0;
    let timeDataCount = controlData.shift().TIME_DATA_COUNT;
    for (let i = 0; i < timeDataCount; i++) {
        let timeData = controlData.shift();
        let sleepTime = timeData.DATA.WAIT_TIME;
        let specTime = timeData.DATA.TIME;
        await timerHR_2.default.sleep(sleepTime - diffTime);
        try {
            let flag = true;
            while (flag) {
                let nextData = controlData[0];
                switch (nextData.TYPE) {
                    case 'TIME':
                        flag = false;
                        break;
                    case 'COLOR':
                        changeColorTime = timerHR_1.default.getTime() - startTime;
                        diffTime = diffCalc(changeColorTime, specTime);
                        await setColorObj(nextData);
                        controlData.shift();
                        break;
                    case 'TRANSITION':
                        // todo: set transition
                        controlData.shift();
                        break;
                }
            }
        }
        catch (err) {
        }
    }
}
// ラグ(nodejsの処理遅延)を計算する関数
function diffCalc(changeColorTime, specTime) {
    console.log(`ChangeTime: ${changeColorTime}`);
    console.log(`SpecTime  : ${specTime}`);
    console.log(`Diff      : ${changeColorTime - specTime}`);
    return changeColorTime - specTime;
}
main().then();
