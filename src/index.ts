import { WebClient } from '@slack/web-api';
import { Configuration, OpenAIApi } from "openai";

// Slack APIトークンを環境変数から取得
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || '';

const webClient = new WebClient(SLACK_API_TOKEN);

// 認証
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// APIのインスタンス作成
const openai = new OpenAIApi(configuration);

// Lambdaハンドラー
export async function handler(event: any): Promise<any> {
  // event.bodyからJSONデータをパース
  const requestBody = JSON.parse(event.body);

  // challengeパラメータが存在する場合、その値をレスポンスとして返す
  if (requestBody.challenge) {
    return {
      statusCode: 200,
      body: requestBody.challenge,
    };
  }

  // HTTPステータスコード200をすぐに返す
  const response = {
    statusCode: 200,
    body: 'OK',
  };

  const slack_message: string = requestBody.event.text;
  const channel_id: string = requestBody.event.channel;
  const thread_ts: string = requestBody.event.ts;

  console.log(slack_message);
  console.log(channel_id);
  console.log(thread_ts);

  // GPT-3に問い合わせ、Slackに投稿する処理を非同期で実行
  ask(slack_message)
    .then((message) => {
      return postSlackMessage(message || 'エラー', channel_id, thread_ts);
    })
    .catch((error) => {
      console.error(`Error in processing: ${error}`);
    });

  return response;
}

async function postSlackMessage(
  text: string,
  channel: string,
  thread_ts?: string
): Promise<void> {
  try {
    await webClient.chat.postMessage({
      channel,
      text,
      thread_ts,
    });
    console.log(`Posted message to Slack: ${text}`);
  } catch (error) {
    console.error(`Error posting message to Slack: ${error}`);
  }
}

async function ask(content: string, model = "gpt-3.5-turbo-0301") {
  // APIに質問文を送信
  const response = await openai.createChatCompletion({
    model: model,
    messages: [{ role: "user", content: content }],
  });

  // APIからの返答を取得する。
  const answer = response.data.choices[0]?.message?.content;
  console.log(`Answer: ${answer}`);

  return answer;
}
