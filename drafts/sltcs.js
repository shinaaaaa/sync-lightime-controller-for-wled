const fs = require('fs');
const os = require("os");

class Sltcs {
    get filepath() {
        return this._filepath;
    }

    constructor(filepath) {
        this._filepath = filepath;
        this._rawData = this.read();
        // console.log( this._rawData);
    }

    read() {
        return fs.readFileSync(this._filepath, 'utf8');
    }

    getControlData() {
        let lines = this._rawData.split(os.EOL).map(item => item.trim());
        let controlData = [];

        for (let line of lines) {
            if (line) {
                let splitData = line.split(' ');
                switch (splitData[0].toUpperCase()) {
                    case "TIME":
                        // console.log("TIME:" + splitData.length);
                        let currentTime = this.timeToMilliseconds(splitData[1]);
                        controlData.push({
                            TYPE: "TIME",
                            DATA: {
                                TIME: currentTime,
                                WAIT_TIME: this.getNextTime(controlData, currentTime)
                            }
                        });
                        break;

                    case "COLOR":
                        // console.log("COLOR:" + splitData.length)
                        controlData.push({
                                TYPE: "COLOR",
                                DATA: {
                                    R: splitData[1],
                                    G: splitData[2],
                                    B: splitData[3],
                                    A: splitData[4]
                                }
                            }
                        )
                        ;
                        break;

                    case "TRANSITION":
                        // console.log("COLOR:" + splitData.length)
                        controlData.push({
                                TYPE: "TRANSITION",
                                DATA: splitData[1]
                            }
                        )
                        ;
                        break;

                    default:
                        break;
                }
            }
        }

        controlData.unshift({
            TIME_DATA_COUNT: controlData.reduce((count, item) => {
                if (item.TYPE === 'TIME') count++;
                return count;
            }, 0)
        })

        // console.log(controlData);
        return controlData;
    }

    timeToMilliseconds(time) {
        const parts = time.split(':');
        const secondsAndMilliseconds = parts[2].split('.');

        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(secondsAndMilliseconds[0], 10);
        const milliseconds = parseInt(secondsAndMilliseconds[1], 10);

        return ((hours * 3600) + (minutes * 60) + seconds) * 1000 + milliseconds / 1000;
    }

    getNextTime(controlData, currentTime) {
        for (let i = controlData.length - 1; i >= 0; i--) {
            if (controlData[i].TYPE.includes('TIME')) {
                return currentTime - controlData[i].DATA.TIME;
            }
        }
        return currentTime;
    }


}

module.exports = Sltcs;