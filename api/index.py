"""
Vercel Serverless Function Entry Point

This file serves as the entry point for Vercel's Python runtime.
It handles HTTP requests and routes them appropriately.
"""

import json
import os
import requests
from typing import Any, Dict, Tuple

# Configuration from environment variables
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8361020073:AAFfPXu1trr71fxQXKVA0xU5WX_f9z8IN6Y")
API_URL = os.getenv("API_URL", "http://localhost:3000/api/control")

# Telegram API base URL
TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"


def handle_callback_query(callback_query: Dict[str, Any]) -> bool:
    """
    Process a callback query from Telegram.
    
    When a user clicks an inline button, Telegram sends a callback_query.
    We extract the IP and state from the callback data and update the user state.
    
    Args:
        callback_query: The callback query object from Telegram
        
    Returns:
        True if successful, False otherwise
    """
    try:
        data = callback_query.get("data", "")
        callback_id = callback_query.get("id")
        message = callback_query.get("message", {})
        
        # Parse the callback data format: "control:IP:STATE"
        if not data.startswith("control:"):
            return False
            
        parts = data.split(":")
        if len(parts) != 3:
            return False
            
        _, ip, state = parts
        
        print(f"[Webhook] Received control request: IP={ip}, State={state}")
        
        # Send the state update to the Next.js API
        response = requests.post(
            API_URL,
            json={"ip": ip, "state": state},
            timeout=5
        )
        
        if response.status_code != 200:
            print(f"[Webhook] Failed to update state: {response.status_code} {response.text}")
            return False
        
        # Answer the callback query to show success in Telegram UI
        requests.post(
            f"{TELEGRAM_API}/answerCallbackQuery",
            json={
                "callback_query_id": callback_id,
                "text": f"✓ User {ip} set to {state}",
                "show_alert": False
            },
            timeout=5
        )
        
        # Update the message to show the action was applied
        original_text = message.get("text", "")
        
        # Avoid appending multiple times
        if "✅ Action Applied:" in original_text:
            base_text = original_text.split("✅ Action Applied:")[0].strip()
        else:
            base_text = original_text.strip()
        
        new_text = base_text + f"\n\n✅ <b>Action Applied: {state}</b>"
        
        requests.post(
            f"{TELEGRAM_API}/editMessageText",
            json={
                "chat_id": message.get("chat", {}).get("id"),
                "message_id": message.get("message_id"),
                "text": new_text,
                "parse_mode": "HTML",
                "reply_markup": message.get("reply_markup")
            },
            timeout=5
        )
        
        print(f"[Webhook] Successfully processed callback for IP={ip}")
        return True
        
    except Exception as e:
        print(f"[Webhook] Error processing callback: {e}")
        return False


def handler(request) -> Tuple[int, str, Dict[str, str]]:
    """
    Main handler for Vercel Serverless Function.
    
    This function is called by Vercel when a request comes to /api.
    It processes the incoming Telegram webhook and returns a response.
    
    Args:
        request: The HTTP request object (Vercel's Request object)
        
    Returns:
        A tuple of (status_code, body, headers)
    """
    
    # Only accept POST requests
    if request.method != "POST":
        return (
            405,
            json.dumps({"error": "Method not allowed"}),
            {"Content-Type": "application/json"}
        )
    
    try:
        # Parse the request body
        body = request.get_json()
        
        print(f"[Webhook] Received update: {json.dumps(body, indent=2)}")
        
        # Check if this is a callback query (button click)
        if "callback_query" in body:
            success = handle_callback_query(body["callback_query"])
            if success:
                return (
                    200,
                    json.dumps({"ok": True}),
                    {"Content-Type": "application/json"}
                )
            else:
                return (
                    400,
                    json.dumps({"ok": False, "error": "Failed to process callback"}),
                    {"Content-Type": "application/json"}
                )
        
        # Acknowledge other types of updates (messages, etc.)
        return (
            200,
            json.dumps({"ok": True}),
            {"Content-Type": "application/json"}
        )
        
    except Exception as e:
        print(f"[Webhook] Unexpected error: {e}")
        return (
            500,
            json.dumps({"error": "Internal server error"}),
            {"Content-Type": "application/json"}
        )
