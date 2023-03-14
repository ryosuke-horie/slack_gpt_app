import { postSlackToMessage } from './slack';
import { ask } from './request_gpt';

// Lambdaハンドラー
export async function handler(event): Promise<any> {
    const slack_message: string = await event.body["event"]["blocks"][0]["elements"][0]["elements"][0]["type"] || 'エラー';

    const message: string = await ask(slack_message) || 'エラー';
    postSlackToMessage(message);
}

// handler()