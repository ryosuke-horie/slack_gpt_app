import axios from "axios";
import http  from "http";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * メッセージを送信する
 * @param message ChatGPT APIからの返答メッセージ
 */
export async function postSlackToMessage(message: any): Promise<any> {
// export const postSlackToMessage = (message: string) => {
    // messageをJSON形式に変換
    const message_json = {
        text: message,
    }

    axios.post(process.env.WEBHOOK_URL || '', message_json);
}

