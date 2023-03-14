import axios from "axios";
import http  from "http";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * slackからメッセージを受け取る。
 */
const getSlackMessage = () => {
    // const SlackEvents = axios.;
}

/**
 * メッセージを送信する
 * @param message ChatGPT APIからの返答メッセージ
 */
export const postSlackToMessage = (message: string) => {
    // messageをJSON形式に変換
    const message_json = {
        text: message,
    }

    axios.post(process.env.WEBHOOK_URL || '', message_json);
}

