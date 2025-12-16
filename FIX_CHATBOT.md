# How to Fix the Chatbot - Simple Steps

## The Problem
The chatbot is showing: "I'm sorry, the AI service is currently unavailable..."

This happens because the server needs to be restarted after the API key was added to `.env.local`.

## Simple Fix - Just 3 Steps

### Step 1: Find Your Terminal/Command Prompt
- Look for the window where you ran `npm run dev` (it's probably showing server logs)
- OR open a new terminal/command prompt in your project folder

### Step 2: Stop the Server
- In the terminal window, press: **Ctrl + C**
- You should see the server stop

### Step 3: Start It Again
- Type this command and press Enter:
  ```
  npm run dev
  ```
- Wait for it to start (you'll see "Ready" message)

### Step 4: Try the Chatbot Again
- Go back to your browser
- Try sending a message in the chatbot
- It should work now!

## Still Not Working?

### Check the Terminal Output
When you start the server, look for these messages:

✅ **Good signs:**
- "Gemini API key found, initializing model..."
- "Gemini AI model initialized successfully"

❌ **Bad signs:**
- "Warning: GEMINI_API_KEY is not set"
- "No API key found in environment variables"

### If You See Warnings:

1. **Make sure `.env.local` file exists in the project root**
   - It should be in the same folder as `package.json`

2. **Check the file has the API key**
   - Open `.env.local` in a text editor
   - Look for this line:
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB7D3L0eko5Rak1ucas0CMjj4iYoXuODZY
     ```
   - Make sure there are NO spaces around the `=`
   - Make sure there are NO quotes around the value

3. **Restart the server again** after checking

## Need More Help?

If you're still stuck, check the terminal/console output and look for any error messages. The new code will show helpful messages about what's wrong.
