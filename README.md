# slack_gpt_app
自作のSlack App × ChatGPT APIの連携アプリケーション開発

## 実現すること

- ChatGPTとの会話
- 利用方法の表示コマンド
- ChatGPTが過去15件程度の会話をもとにそれを前提とした会話を実現
- 任意のタイミングで会話のログを消すコマンドの用意

## 技術スタック

| バックエンド | TypeScript |
| --- | --- |
| インフラ | Docker |
| クラウド | Lambda |
|  | API GateWay |
| API | Gpt-3.5-turbo |
|  | Slack |