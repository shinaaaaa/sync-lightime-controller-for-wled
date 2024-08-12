"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimerHR {
    /**
     * ナノ秒をミリ秒にする
     * @param nanoSec ナノ秒
     */
    static nanoToMilli(nanoSec) {
        return Number(nanoSec / 1000000n);
    }
    /**
     * スリープする
     * @param interval 待ち時間
     */
    static async sleep(interval) {
        const start = process.hrtime.bigint();
        let nano_interval = BigInt(interval * 1e6);
        let currentTime = process.hrtime.bigint();
        let diffTime = currentTime - start;
        // 時間まで待つ
        do {
            currentTime = process.hrtime.bigint();
            diffTime = currentTime - start;
        } while (nano_interval >= diffTime);
        // 一応実際の待ち時間を返しておく
        return this.nanoToMilli(diffTime);
    }
    /**
     * カウントダウンのログ出力
     * @param seconds 待ち時間
     */
    static async countdown(seconds) {
        while (seconds !== 0) {
            seconds = seconds - 0.5;
            await this.sleep(500);
            console.log(seconds);
        }
    }
    static getTime() {
        return this.nanoToMilli(process.hrtime.bigint());
    }
}
exports.default = TimerHR;
