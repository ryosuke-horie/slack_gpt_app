# 要修正：nodeの件で動かない。（tscコマンド＠wsl環境）
# distフォルダ
rm -rf ./dist
mkdir dist
# TypeScriptビルド
tsc -p ./src
# package.jsonをdistにコピー
cp -f ./src/package.json ./dist
cd dist
# packageのインストール
npm install --production
# uploadするためにzip化
zip -r ./lambda.zip ./
# zipデータをlambdaにアップロード
aws lambda update-function-code --function-name slack_chatGPT --zip-file fileb://lambda.zip
