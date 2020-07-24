const { DynamoDB } = require('aws-sdk');
const line = require('@line/bot-sdk');
const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

exports.handler = function(event) {
    const dynamo = new DynamoDB();

    const id = event.events[0].message.text
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: id } }
    }

    dynamo.getItem(params, function (err, data) {
        if (err) {
            console.log('ERROR', err);
        } else if (data.Item === undefined) {
            const message = {
                type: 'text',
                text: '検索に失敗しました。\nガラル地方のポケモンの名前か確認してください\uDBC0\uDC86'
            };

            client.replyMessage(event.events[0].replyToken, message)
                .catch((err) => {
                    console.log('error', err)
                });
        } else {
            console.log('OK', data.Item.types);

            const types = data.Item.types.L.map(type => type.S)

            const message = {
                type: 'text',
                text: types.join(' ')
            };

            client.replyMessage(event.events[0].replyToken, message)
                .catch((err) => {
                    console.log('error', err)
                });
        }
    })
};
