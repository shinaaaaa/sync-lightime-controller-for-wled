"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const os = __importStar(require("node:os"));
const moment_1 = __importDefault(require("moment"));
class Sltcs {
    constructor(filepath) {
        this._filepath = filepath;
        this._rawData = this.read();
        this._controlData = this.formatControlData();
    }
    read() {
        return fs.readFileSync(this._filepath, 'utf8');
    }
    getControlData() {
        return this._controlData;
    }
    formatControlData() {
        let lines = this._rawData.split(os.EOL).map((item) => item.trim());
        let controlData = [];
        for (let line of lines) {
            if (line) {
                let splitData = line.split(' ');
                switch (splitData[0].toUpperCase()) {
                    case 'TIME':
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
            TIME_DATA_COUNT: controlData.reduce((count, item) => {
                if (item.TYPE === 'TIME')
                    count++;
                return count;
            }, 0)
        });
        return controlData;
    }
    toMillSec(time) {
        const duration = moment_1.default.duration(time);
        return duration.asMilliseconds();
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
exports.default = Sltcs;
