# How to Renew Your Expired Gemini API Key

## The Problem
You're seeing: `API key expired. Please renew the API key.`

Your Gemini API key has expired and needs to be replaced with a new one.

## Solution: Get a New API Key

### Step 1: Get a New API Key

1. **Go to Google AI Studio:**
   - Open your browser
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in** with your Google account (if not already signed in)

3. **Create a new API key:**
   - Click "Create API Key" or "Get API Key"
   - Select your Google Cloud project (or create a new one)
   - Copy the new API key (it will look like: `AIzaSy...`)

### Step 2: Update Your .env.local File

1. **Open `.env.local` file** in your project folder
   - Location: `C:\Users\user\Downloads\CampusAI-1\.env.local`
   - You can open it with Notepad or any text editor

2. **Find this line:**
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB7D3L0eko5Rak1ucas0CMjj4iYoXuODZY
   ```

3. **Replace the old key with your new key:**
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
   ```
   - Make sure there are NO spaces around the `=`
   - Make sure there are NO quotes around the key
   - Replace `YOUR_NEW_API_KEY_HERE` with the actual key you copied

4. **Save the file**

### Step 3: Restart Your Development Server

**IMPORTANT:** You must restart the server for the new key to work!

1. **Stop the server:**
   - In your terminal, press `Ctrl + C`

2. **Start it again:**
   ```
   npm run dev
   ```

3. **Wait for it to start** (you'll see "Ready" message)

4. **Try the chatbot again** - it should work now!

## Quick Steps Summary

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the new key
4. Open `.env.local` file
5. Replace the old key with the new one
6. Save the file
7. Restart your server (`Ctrl+C` then `npm run dev`)
8. Test the chatbot

## Verify It Worked

After restarting, check the server console. You should see:
- ✅ "Gemini API key found, initializing model..."
- ✅ "Gemini AI model initialized successfully"

If you still see errors, double-check:
- The new API key is correct (no extra spaces or quotes)
- You saved the `.env.local` file
- You restarted the server

## Need Help?

If you're having trouble:
1. Make sure you're signed in to the correct Google account
2. Check that the API key is enabled in Google Cloud Console
3. Verify the key format is correct (starts with `AIzaSy`)
4. Make sure you restarted the server after updating the file
