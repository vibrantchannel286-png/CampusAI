# Understanding Gemini API Rate Limits

## The Error You're Seeing

**429 Too Many Requests** - This means you've hit the rate limit for the free tier.

## Free Tier Limits

- **5 requests per minute** per model
- **20 requests per day** per model (daily quota)
- This applies to each model separately (gemini-2.5-flash, gemini-pro-latest, etc.)
- After 5 requests per minute, you must wait about 60 seconds before making more requests
- After 20 requests per day, you must wait until the next day (quota resets daily)

## What This Means

✅ **Your API key is working correctly!**
✅ **The model is working correctly!**
⚠️ **You're just making requests too quickly**

## Solutions

### Solution 1: Wait and Retry (Easiest)

1. **Wait 60 seconds** after getting the error
2. **Try the chatbot again**
3. The error message will tell you exactly how long to wait

### Solution 2: Slow Down Your Requests

- **Don't send multiple messages quickly**
- **Wait a few seconds between messages**
- The limit resets every minute

### Solution 3: Use Different Models (Advanced)

The code now tries multiple models automatically. If one hits the limit, it will try others.

### Solution 4: Upgrade Your Plan (For Production)

If you need more requests:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Upgrade your billing plan
3. This increases your rate limits

## How the Code Handles This

The updated code now:
- ✅ Detects rate limit errors (429)
- ✅ Shows a friendly message telling you to wait
- ✅ Tells you how long to wait
- ✅ Doesn't crash - gracefully handles the error

## Best Practices

1. **Don't spam the chatbot** - wait a few seconds between messages
2. **For testing** - make one request, wait, then make another
3. **For production** - consider upgrading your plan if you expect high traffic

## Monitoring Your Usage

- Check your usage: https://ai.dev/usage?tab=rate-limit
- Learn about limits: https://ai.google.dev/gemini-api/docs/rate-limits

## Summary

This is **normal behavior** for the free tier. Just wait a minute between batches of requests, and you'll be fine!
