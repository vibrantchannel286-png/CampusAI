# Chatbot Troubleshooting Guide

## Issue: Chatbot shows "AI service is currently unavailable"

If you see the message: *"I'm sorry, the AI service is currently unavailable. Please check the API configuration..."*

This means the Gemini API key is not being loaded properly.

### Quick Fixes

1. **Restart the Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart it
   npm run dev
   ```
   **Important**: Next.js only loads `.env.local` when the server starts. If you updated `.env.local` while the server was running, you must restart it.

2. **Verify `.env.local` exists and has the correct key**
   ```bash
   # Check if file exists
   Test-Path .env.local
   
   # View the API key line (should show your key)
   Get-Content .env.local | Select-String -Pattern "GEMINI"
   ```
   
   Should show:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB7D3L0eko5Rak1ucas0CMjj4iYoXuODZY
   ```

3. **Check for typos in variable name**
   - Must be exactly: `NEXT_PUBLIC_GEMINI_API_KEY`
   - No spaces around the `=`
   - No quotes around the value

4. **Check the console/terminal**
   - Look for error messages when the server starts
   - Look for warnings about missing API keys
   - The updated code now logs more details in development mode

### Detailed Troubleshooting

#### Step 1: Verify Environment Variable Format

Your `.env.local` should look like this:
```env
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB7D3L0eko5Rak1ucas0CMjj4iYoXuODZY
```

**Common mistakes:**
- ❌ `NEXT_PUBLIC_GEMINI_API_KEY = value` (spaces around =)
- ❌ `NEXT_PUBLIC_GEMINI_API_KEY="value"` (quotes not needed)
- ❌ `GEMINI_API_KEY=value` (missing NEXT_PUBLIC_ prefix for client-side)
- ❌ Extra spaces or line breaks in the value

#### Step 2: Check Server Logs

When you start the dev server, you should see:
```
✓ Gemini API key found, initializing model...
✓ Gemini AI model initialized successfully
```

If you see:
```
⚠ Warning: GEMINI_API_KEY is not set
```

Then the environment variable is not being loaded.

#### Step 3: Verify File Location

The `.env.local` file must be in the **root directory** of your project:
```
CampusAI-1/
├── .env.local          ← Must be here
├── package.json
├── next.config.js
└── ...
```

#### Step 4: Clear Next.js Cache

Sometimes Next.js caches environment variables. Try:
```bash
# Delete .next folder
Remove-Item -Recurse -Force .next

# Restart server
npm run dev
```

#### Step 5: Check API Key Validity

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify your API key is active
3. Check if there are any usage limits or restrictions
4. Try creating a new API key if needed

### Testing the API Key

You can test if the API key is working by checking the browser console or server logs:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try sending a message in the chatbot
4. Check for any error messages

### Still Not Working?

1. **Check if you're using the correct environment variable name**
   - For client-side code: `NEXT_PUBLIC_GEMINI_API_KEY`
   - For server-side only: `GEMINI_API_KEY`
   - The chatbot uses `NEXT_PUBLIC_GEMINI_API_KEY`

2. **Verify the API key works**
   - Test it directly with a curl command or Postman
   - Make sure it's not expired or revoked

3. **Check for multiple `.env` files**
   - Make sure you're editing `.env.local` (not `.env` or `.env.development`)
   - Next.js loads `.env.local` with highest priority

4. **Restart everything**
   ```bash
   # Stop server
   # Close terminal
   # Reopen terminal
   # Navigate to project
   cd CampusAI-1
   # Start fresh
   npm run dev
   ```

### Production/Deployment

If this is happening on Vercel or another deployment:

1. **Check Vercel Environment Variables**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set
   - Make sure it's set for the correct environment (Production, Preview, Development)

2. **Redeploy after adding variables**
   - Environment variables are only loaded at build time
   - You must redeploy after adding/updating them

### Need More Help?

Check the server console output for detailed error messages. The updated code now provides better logging in development mode to help diagnose the issue.
