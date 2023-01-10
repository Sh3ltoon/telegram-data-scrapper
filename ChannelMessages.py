import configparser
import json
import asyncio
import time
from datetime import date, datetime

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.tl.functions.messages import (GetHistoryRequest)
from telethon import TelegramClient, events, sync
from telethon.tl.types import (
    PeerChannel
)
import configparser
import json
import re
from telethon import TelegramClient, events, sync



# some functions to parse json date
class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        if isinstance(o, bytes):
            return list(o)

        return json.JSONEncoder.default(self, o)


# Reading Configs
config = configparser.ConfigParser()
config.read("config.ini")

# Setting configuration values
api_id = config['Telegram']['api_id']
api_hash = config['Telegram']['api_hash']

api_hash = str(api_hash)
didBreak = False

phone = config['Telegram']['phone']
username = config['Telegram']['username']
user_input_channel = config['Telegram']['input_channel']
user_output_channel = config['Telegram']['output_channel']
user_password = config['Telegram']['password']

if user_input_channel.isdigit():
    chatToListen = PeerChannel(int(user_input_channel))
else:
    chatToListen = user_input_channel




# Create the client and connect
client = TelegramClient(username, api_id, api_hash)
client.start()
print('Client Started')

@client.on(events.NewMessage(chats=[chatToListen]))
async def handler(event):
    print("Client Created")
    # Ensure you're authorized
    if await client.is_user_authorized() == False:
        await client.send_code_request(phone)
        try:
            await client.sign_in(phone, input('Enter the code: '))
        except SessionPasswordNeededError:
            await client.sign_in(password=user_password)

    me = await client.get_me()

    print(event.message.message)
    if user_output_channel.isdigit():
        receiverEntity = PeerChannel(int(user_output_channel))
    else:
        receiverEntity = user_output_channel
    await client.send_message(receiverEntity, event.message.message, parse_mode='html')

client.run_until_disconnected()
