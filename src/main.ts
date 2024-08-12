import Sltcs from "./libs/sltcs";
import TimerHR from "./libs/timerHR";
import timerHR from "./libs/timerHR";
import WebSocket from 'ws';

const WLED_WS_URL = 'ws://wled-shina.local/ws';
// WebSocketクライアントの作成と接続
const ws = new WebSocket(WLED_WS_URL);

// SLTCSの作成
const SLTCS_FILE_PATH = './drafts/test2.sltcs';
const SLTCS = new Sltcs(SLTCS_FILE_PATH);

let data = SLTCS.getControlData();


async function main() {

  console.log('Connecting...');

  // WebSocketの接続が確立するのを待つ
  await new Promise<void>((resolve, reject) => {
    ws.on('open', () => {
      console.log('WebSocket connection opened');
      resolve();
      setColorRGBA('0','0','0','0');
    });
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    });
  });

  console.log('ready');
  await TimerHR.countdown(2);


  // console.log(data);

  console.log('start');


  await hogehoge(data);

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
function setColorRGBA(r: string, g: string, b: string, a: string = '255') {
  try {
    // WLEDに送信するペイロードの作成
    const payload = {
      on: true,
      bri: Number(a) / 100,
      seg: [{
        col: [[r, g, b]]
      }]
    };

    // WebSocketメッセージの送信
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      console.log(`Set color to: R=${r}, G=${g}, B=${b}, A=${a}`);
    } else {
      console.error('WebSocket is not open');
    }
  } catch (err) {
    console.error('Error setting color:', err);
  }
}

async function setColorObj(controlData: { DATA: { R: string; G: string; B: string; A: string; }; }) {
  setColorRGBA(controlData.DATA.R, controlData.DATA.G, controlData.DATA.B, controlData.DATA.A);
}

async function hogehoge(controlData: any[]) {
  const startTime = TimerHR.getTime();
  let changeColorTime = startTime;
  let diffTime = 0;
  let timeDataCount = controlData.shift().TIME_DATA_COUNT;


  for (let i = 0; i < timeDataCount; i++) {
    let timeData = controlData.shift();
    let sleepTime = timeData.DATA.WAIT_TIME;
    let specTime = timeData.DATA.TIME;

    await timerHR.sleep(sleepTime - diffTime);

    try {
      let flag = true;

      while (flag) {
        let nextData = controlData[0];

        switch (nextData.TYPE) {
          case 'TIME':
            flag = false;
            break;

          case 'COLOR':
            changeColorTime = TimerHR.getTime() - startTime;
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
    } catch (err) {

    }
  }
}

function diffCalc(changeColorTime: number, specTime: number) {
  console.log(`ChangeTime: ${changeColorTime}`)
  console.log(`SpecTime  : ${specTime}`)
  console.log(`Diff      : ${changeColorTime - specTime}`)
  return changeColorTime - specTime;
}

main().then();
