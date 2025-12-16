# How to Enable Gemini API in Google Cloud Console

## Step-by-Step Guide

### Step 1: Go to Google Cloud Console

1. **Open your browser** and go to: https://console.cloud.google.com/
2. **Sign in** with the same Google account you used to create the API key

### Step 2: Select Your Project

1. **At the top of the page**, you'll see a project dropdown
2. **Click on it** and select the project where you created your API key
   - If you don't see your project, you might need to create one first
   - Or the API key might be associated with a different project

### Step 3: Enable the Gemini API

1. **In the search bar at the top**, type: `Generative Language API`
2. **Click on "Generative Language API"** from the results
3. **Click the "Enable" button** (if it's not already enabled)
   - If you see "API Enabled" or "Manage", it's already enabled ✅
   - If you see "Enable", click it and wait for it to enable

### Step 4: Verify API Key Permissions

1. **Go to "APIs & Services"** in the left menu
2. **Click "Credentials"**
3. **Find your API key** in the list (it starts with `AIzaSy...`)
4. **Click on the API key** to open its settings

### Step 5: Check API Restrictions

1. **Look for "API restrictions"** section
2. **Make sure it's set correctly:**
   - **Option 1 (Recommended)**: "Don't restrict key" - allows all APIs
   - **Option 2**: "Restrict key" - then make sure "Generative Language API" is in the list

### Step 6: Check Application Restrictions (Optional)

1. **Look for "Application restrictions"** section
2. **For development**, you can set it to "None" (no restrictions)
3. **For production**, you might want to restrict by IP or HTTP referrer

### Step 7: Save Changes

1. **Click "Save"** at the bottom
2. **Wait a few minutes** for changes to take effect

## Quick Checklist

✅ **Generative Language API is enabled** in your project
✅ **API key has access** to Generative Language API (not restricted)
✅ **API key is not expired** or revoked
✅ **You're using the correct project** that has the API enabled

## Verify It's Working

After enabling the API:

1. **Wait 2-3 minutes** for changes to propagate
2. **Restart your development server:**
   ```
   # Stop: Ctrl+C, then Y
   # Start: npm run dev
   ```
3. **Check the console** for: "Gemini AI model initialized successfully"
4. **Test the chatbot** - it should work now!

## Common Issues

### Issue: "API not enabled"
**Solution**: Follow Step 3 above to enable "Generative Language API"

### Issue: "API key restricted"
**Solution**: In Step 5, either:
- Set to "Don't restrict key" (easiest for development)
- Or add "Generative Language API" to the allowed APIs list

### Issue: "Quota exceeded"
**Solution**: 
- Check your usage in Google Cloud Console
- Free tier has rate limits
- You might need to wait or upgrade your plan

### Issue: "Invalid API key"
**Solution**:
- Make sure you copied the entire key (starts with `AIzaSy`)
- Check there are no extra spaces in `.env.local`
- Verify the key is active (not deleted) in Google Cloud Console

## Alternative: Create a New API Key

If you're having trouble with the current key:

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Click "Create API Key"**
3. **Select your project** (or create a new one)
4. **Copy the new key**
5. **Update `.env.local`** with the new key
6. **Restart your server**

## Need More Help?

- **Google Cloud Console**: https://console.cloud.google.com/
- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Gemini API Docs**: https://ai.google.dev/
