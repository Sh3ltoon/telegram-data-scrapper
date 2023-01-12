const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = 1231;
const apiHash = "1231asda";
const session = new StringSession(""); // You should put your string session here
const client = new TelegramClient(session, apiId, apiHash, {});

(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.channels.GetMessages({
      channel: -1001770197116,
      id: [36],
    })
  );
  console.log(result.messages); // prints the result
})();