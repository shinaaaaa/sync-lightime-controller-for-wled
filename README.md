# SyncLitimePlayer

## 概要
**SyncLitimePlayer**は、LEDデバイスを音楽や映像に合わせて光らせるシステムで、WLEDを搭載したESP32用のプレイヤーです。特定のLEDストリップを使用し、音楽や映像の演出に合わせて、LEDのカラーリングを動的に変えることが可能です。

## 使用するハードウェア
- **ESP32搭載のマイコン**  
  - テスト済み: SeeedStudio XAIO ESP32C3、ESP32S3

- **WS2812B LEDストリップ**  
  - テスト済み: BTF-LIGHTING製テープLED

- **DC 5V電源**

- **その他**  
  - ブレッドボード、配線類

## 初期設定

1. **ESP32にWLED 0.14.4の書き込み**
   - [WLEDのインストールサイト](https://install.wled.me/)にアクセスし、WLEDをESP32に書き込みます。

2. **WLEDの初期設定**
   - 初期Wi-Fi設定などの設定を行います。詳細は[WLED公式ドキュメント](https://kno.wled.ge/basics/getting-started/)を参照ください。

3. **Node.jsのインストール**
   - Node.jsのLTSバージョンをインストールします。

4. **SyncLitimeのダウンロード**
   - [SyncLitimeリポジトリ](https://github.com/shinaaaaa/sync-lightime-controller-for-wled/releases)から最新バージョンをダウンロードし、ファイルを解凍します。

5. **環境設定**
   - 解凍したフォルダ内の`pre-release`フォルダをターミナル（コマンドプロンプトやPowerShellなど）で開き、以下を実行します。
     ```bash
     npm install
     ```

6. **WLEDのIPアドレス設定**
   - `src/main.js`をエディタ（メモ帳やVSCodeなど）で開き、12行目の以下のコードを使用するWLEDのIPアドレスに変更します。
     ```javascript
     const WLED_WS_URL = 'ws://192.168.1.222/ws';
     ```

## 実行方法
1. `pre-release`フォルダをターミナルで開き、以下のコマンドを実行します。
   ```bash
   npm run run
   ```
2. ターミナルに「start」と表示されたら、再生する曲を開始してください。

## 再生するSLTCSファイルを変更する方法
1. `src/main.js`をエディタで開き、14行目の以下のコードを再生したいSLTCSファイルのパスに変更します。
   ```javascript
   const SLTCS_FILE_PATH = './src/taiyou_kiss.sltcs';
   ```

## 参考
- WLED公式ドキュメント: [https://kno.wled.ge/basics/getting-started/](https://kno.wled.ge/basics/getting-started/)
- WLED Web Installer: [https://install.wled.me/](https://install.wled.me/)
- Node.js公式サイト: [https://nodejs.org/en](https://nodejs.org/en)
