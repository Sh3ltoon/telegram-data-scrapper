# telegram-data-scrapper


Message data-scraping tool for telegram.
Learnt python on the fly when needed to build this tool, sharing with you guys, to improve and to help anybody that needs the same solution.

Easy setup to mimic channels, bypassing the restriction of copy and forwarding, by using the Telethon python library.


Setup:
-> pip3 install telethon
-> Getting telegram api_id and api_hash:
    - Sign up for Telegram using any application.
    - Log in to your Telegram core: https://my.telegram.org.
    - Go to "API development tools" and fill out the form.
    - You will get basic addresses as well as the api_id and api_hash parameters required for user authorization.
    - For the moment each number can only have one api_id connected to it.
      ***They will be sending important developer notifications to the phone number that you use in this process, so please use an up-to-date number      connected to your active Telegram account.***
      
 -> Edit config.ini file and add your api_id, api_hash, credentials and input/output channel
 -> run the script with python3 ChannelListenerForwarder.py:
      - Insert your phone number or bot token, to setup your session. Follow the terminal prompt
      
      
 Now share the content of your private channel subscriptions automatically.


NOTE: If you want to have it continously running, do a service on systemctl (Linux) or launchctl (macOS).


