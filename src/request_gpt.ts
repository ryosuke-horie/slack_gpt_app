import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

// 認証
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// APIのインスタンス作成
const openai = new OpenAIApi(configuration)

/**
 * ChatGPT APIへの質問処理
 * @param content 質問分
 * @param model   APIモデルはgpt-3.5-turboを指定（安くて最新）
 */
export async function ask(content: string, model = "gpt-3.5-turbo-0301") {
    // APIに質問文を送信
    const response = await openai.createChatCompletion({
        model: model,
        messages: [{ role: "user", content: content }],
    });

    // APIからの返答を取得する。
    const answer = response.data.choices[0].message?.content;
    console.log(answer)
}

const questionExample = "あなたはテスト用のGPT-3としてふるまってください。"
ask(questionExample)