import requests
import time
import json
import sys
import os

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8361020073:AAFfPXu1trr71fxQXKVA0xU5WX_f9z8IN6Y")
# Use environment variable for API URL, default to localhost for development
API_URL = os.getenv("API_URL", "http://localhost:3000/api/control")

def handle_update(update):
    if "callback_query" in update:
        callback = update["callback_query"]
        data = callback["data"]
        
        if data.startswith("control:"):
            parts = data.split(":")
            if len(parts) == 3:
                _, ip, state = parts
                
                print(f"Received control request: IP={ip}, State={state}")
                
                try:
                    response = requests.post(API_URL, json={"ip": ip, "state": state}, timeout=5)
                    if response.status_code == 200:
                        # Answer callback query to show success in Telegram
                        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/answerCallbackQuery", 
                                     json={"callback_query_id": callback["id"], "text": f"User {ip} set to {state}"})
                        
                        # Optional: Edit message to show current status
                        msg = callback["message"]
                        original_text = msg.get("text", "")
                        # Avoid appending multiple times
                        if "✅ Action Applied:" in original_text:
                            base_text = original_text.split("✅ Action Applied:")[0].strip()
                        else:
                            base_text = original_text.strip()
                            
                        new_text = base_text + f"\n\n✅ <b>Action Applied: {state}</b>"
                        
                        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/editMessageText",
                                     json={
                                         "chat_id": msg["chat"]["id"],
                                         "message_id": msg["message_id"],
                                         "text": new_text,
                                         "parse_mode": "HTML",
                                         "reply_markup": msg.get("reply_markup")
                                     })
                    else:
                        print(f"Failed to update state: {response.status_code} {response.text}")
                except Exception as e:
                    print(f"Error updating state: {e}")

def main():
    offset = 0
    print(f"Telegram webhook listener started...")
    print(f"Bot Token: {BOT_TOKEN[:20]}...")
    print(f"API URL: {API_URL}")
    print("Waiting for Telegram updates...")
    
    while True:
        try:
            response = requests.get(f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates?offset={offset}&timeout=30", timeout=35)
            if response.status_code == 200:
                updates = response.json().get("result", [])
                for update in updates:
                    handle_update(update)
                    offset = update["update_id"] + 1
            else:
                print(f"Failed to get updates: {response.status_code}")
                time.sleep(5)
        except Exception as e:
            print(f"Error polling updates: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
