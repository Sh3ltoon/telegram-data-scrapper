/*const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const apiId = 29924900;
const apiHash = "f61e9a5e31fb7e22dceccfb6fb23c653";
  await client.sendMessage("me", { message: "Hello!" });
const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAUBq0vqdkAzgFUUv7nR3E+u7moxSZOL0YgcghnVRjIBX4iCPN3fhWg6AA1E9TBoiMmf/XA6rEE0uv/DUe+WN4xWf2hA1TRiVewasj2fwJ6DCgVpgYMTOvCPtY8s6/0BJsi+s6sNMsVMtCDTazWvQomdzvPCX9Ewjc6ebWPSnwJTmsj+RrjaWmoMXhDr40mossTW8lawdkxKipe5G5D9c7OtjG2vBZ4i+9B7ckFqYQyjrzHnL8J3h+jsDxw4SfMJi/y+O6smuw0P5iD4L/AgXaslqkHcVH0U6CH1DQGMBMC2oahMCkGhgSAXyXwy4Z/F1PdYuz7tFC8K1d9Fi0q4KG3E8="); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
})();*/
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const MTProto = require("@mtproto/core");
const path = require("path");
const { getPhone, getCode, getPassword } = require("./utils");

const api_id = "29924900"; // insert api_id here
const apiId = 29924900
const api_hash = "f61e9a5e31fb7e22dceccfb6fb23c653"; // insert api_hash here
const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAUBq0vqdkAzgFUUv7nR3E+u7moxSZOL0YgcghnVRjIBX4iCPN3fhWg6AA1E9TBoiMmf/XA6rEE0uv/DUe+WN4xWf2hA1TRiVewasj2fwJ6DCgVpgYMTOvCPtY8s6/0BJsi+s6sNMsVMtCDTazWvQomdzvPCX9Ewjc6ebWPSnwJTmsj+RrjaWmoMXhDr40mossTW8lawdkxKipe5G5D9c7OtjG2vBZ4i+9B7ckFqYQyjrzHnL8J3h+jsDxw4SfMJi/y+O6smuw0P5iD4L/AgXaslqkHcVH0U6CH1DQGMBMC2oahMCkGhgSAXyXwy4Z/F1PdYuz7tFC8K1d9Fi0q4KG3E8="); // fill this later with the value from session.save()
const client = new TelegramClient(stringSession, apiId, api_hash, {
  connectionRetries: 5,
});

const mtproto = new MTProto({
  api_id: api_id,
  api_hash: api_hash,
  storageOptions: {
    path: path.resolve(__dirname, "./telegramData.json"),
  },
});

function startListener() {
  client.connect()
  console.log("[+] Starting message listener");
  mtproto.updates.on("updates", ({ updates }) => {
    const newChannelMessages = updates
      .filter((update) => update._ === "updateNewChannelMessage")
      .map(({ message }) => message);
    for (const message of newChannelMessages) {
      console.log(`[${message.peer_id.channel_id}] ${message.message}`);
      if (message.peer_id.channel_id == 1770197116) {
        console.log(message.message)
        client.sendMessage("-1001887391439", {message: message.message})
      } else {
        console.log("message from another channel")
      }
    }
  });
}

mtproto
  .call("users.getFullUser", {
    id: {
      _: "inputUserSelf",
    },
  })
  .then(startListener)
  .catch(async () => {
    console.log("[+] Login Required");
    const phone_number = await getPhone();
    mtproto
      .call("auth.sendCode", {
        phone_number,
        settings: {
          _: "codeSettings",
        },
      })
      .catch((error) => {
        if (error.error_message.includes("_MIGRATE_")) {
          const [type, nextDcId] = error.error_message.split("_MIGRATE_");
          mtproto.setDefaultDc(+nextDcId);
          return sendCode(phone_number);
        }
      })
      .then(async (result) => {
        return mtproto.call("auth.signIn", {
          phone_code: await getCode(),
          phone_number,
          phone_code_hash: result.phone_code_hash,
        });
      })
      .catch((error) => {
        if (error.error_message === "SESSION_PASSWORD_NEEDED") {
          return mtproto.call("account.getPassword").then(async (result) => {
            const { srp_id, current_algo, srp_B } = result;
            const { salt1, salt2, g, p } = current_algo;
            const { A, M1 } = await mtproto.crypto.getSRPParams({
              g,
              p,
              salt1,
              salt2,
              gB: srp_B,
              password: await getPassword(),
            });
            return mtproto.call("auth.checkPassword", {
              password: {
                _: "inputCheckPasswordSRP",
                srp_id,
                A,
                M1,
              },
            });
          });
        }
      })
      .then(() => {
        console.log("[+] successfully authenticated");
        startListener();
      });
  });