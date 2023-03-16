import { WebClient } from '@slack/web-api';
import { Configuration, OpenAIApi } from "openai";

// Slack APIトークンを環境変数から取得
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || '';

const webClient = new WebClient(SLACK_API_TOKEN);

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

// 認証
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// APIのインスタンス作成
const openai = new OpenAIApi(configuration);

async function ask(content: string, model = "gpt-3.5-turbo-0301") {
  const response = await openai.createChatCompletion({
    model: model,
    messages: [{ role: "user", content: content }],
  });

  const answer = response.data.choices[0]?.message?.content;
  console.log(`Answer: ${answer}`);

  return answer;
}

// Lambdaハンドラー
// Lambdaハンドラー
export async function handler(event: any): Promise<any> {
  const requestBody = JSON.parse(event.body);

  if (requestBody.challenge) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: requestBody.challenge,
      }),
    };
  }

  const slack_message: string = requestBody.event.text;
  const channel_id: string = requestBody.event.channel;
  const thread_ts: string = requestBody.event.ts;

  console.log(slack_message);
  console.log(channel_id);
  console.log(thread_ts);

  try {
    const message = await ask(slack_message);
    await postSlackMessage(message || 'エラー', channel_id, thread_ts);
  } catch (error) {
    console.error(`Error in processing: ${error}`);
  }

  // 応答オブジェクトの作成
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: 'OK',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return response;
}
