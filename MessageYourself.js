const { TelegramClient } = require("telegram");
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
})();