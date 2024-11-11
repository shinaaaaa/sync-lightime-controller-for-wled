import * as fs from 'node:fs';
import * as os from 'node:os';
import moment from "moment";


class Sltcs {
  private readonly _filepath: string;
  private _rawData: string;
  private readonly _controlData;


  constructor(filepath: string) {
    this._filepath = filepath;
    this._rawData = this.read();
    this._controlData = this.formatControlData();
  }

  private read() {
    return fs.readFileSync(this._filepath, 'utf8')
  }

  public getControlData() {
    return this._controlData;
  }

  private formatControlData() {
    let lines: string[] = this._rawData.split(os.EOL).map((item: string) => item.trim());
    let controlData: string | any[] = [];

    for (let line of lines) {
      if (line) {
        let splitData: string[] = line.split(' ');
        switch (splitData[0].toUpperCase()) {
          case  'TIME':
            let executeTime = this.toMillSec(splitData[1]);
            controlData.push({
              TYPE: 'TIME',
              DATA: {
                TIME: executeTime,
                WAIT_TIME: this.getNextTime(controlData, executeTime)
              }
            });
            break;

          case 'COLOR':
            controlData.push({
              TYPE: 'COLOR',
              DATA: {
                R: Math.round(Number(splitData[1]) * Number(splitData[4])),
                G: Math.round(Number(splitData[2]) * Number(splitData[4])),
                B: Math.round(Number(splitData[3]) * Number(splitData[4])),
                A: splitData[4]
              }
            });
            break;

          case 'TRANSITION':
            controlData.push({
              TYPE: 'TRANSITION',
              DATA: splitData[1]
            });
            break;

          default:
            break;
        }
      }
    }

    // TIMEの個数を入れる
    controlData.unshift({
      TIME_DATA_COUNT: controlData.reduce((count, item)=>{
        if(item.TYPE === 'TIME')count++;
        return count;
      },0)
    });

    return controlData;
  }

  private toMillSec(time: string) {
    const duration = moment.duration(time);
    return duration.asMilliseconds();
  }

  private getNextTime(controlData: string | any[], currentTime: number) {
    for (let i = controlData.length - 1; i >= 0; i--) {
      if (controlData[i].TYPE.includes('TIME')) {
        return currentTime - controlData[i].DATA.TIME;
      }
    }
    return currentTime;
  }

}

export default Sltcs;