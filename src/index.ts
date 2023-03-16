import { postSlackToMessage } from './slack';
import { ask } from './request_gpt';

// Lambdaハンドラー
export async function handler(event: any): Promise<any> {
  try {
    // event.bodyからJSONデータをパース
    const requestBody = JSON.parse(event.body);

    console.log('Request body:', requestBody);

    // challengeパラメータが存在する場合、その値をレスポンスとして返す
    if (requestBody.challenge) {
      return {
        statusCode: 200,
        body: requestBody.challenge,
      };
    }

    const slack_message: string = requestBody.text;
    const message: string = await ask(slack_message) || 'エラー';
    console.log('ask() result:', message);

    // SlackにGPTの回答を送信
    await postSlackToMessage(message);

    // HTTPステータスコード200を返す
    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    console.error('Error:', error);
    console.log('おかしい！')
    // 必要に応じてエラーレスポンスを返す
    return {
      statusCode: 200, // 500から変更中
      body: 'Internal Server Error',
    };
  }
}