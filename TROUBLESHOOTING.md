# Troubleshooting Guide - Gemini API 404 Errors

## If you're still seeing 404 errors after updating the code:

### 1. **Verify Environment Variable in Vercel**

Make sure `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify `NEXT_PUBLIC_GEMINI_API_KEY` exists
4. Check that it's enabled for **Production**, **Preview**, and **Development**
5. The value should be: `AIzaSyB7D3L0eko5Rak1ucas0CMjj4iYoXuODZY`

### 2. **Clear Build Cache and Redeploy**

Vercel might be using cached builds. Force a fresh build:

1. In Vercel dashboard, go to **Deployments**
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Check **"Use existing Build Cache"** → **UNCHECK IT**
5. Click **"Redeploy"**

Or via CLI:
```bash
vercel --force
```

### 3. **Verify the Code Changes Were Deployed**

Check that the updated code is in your deployment:

1. In Vercel, go to the deployment logs
2. Look for the commit that includes the `gemini-1.5-flash` update
3. If the latest commit doesn't have the changes, push again:
   ```bash
   git add lib/gemini.ts
   git commit -m "Fix: Update to gemini-1.5-flash and improve error handling"
   git push
   ```

### 4. **Test the API Key Directly**

Verify your API key works with the new model:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

Replace `YOUR_API_KEY` with your actual key.

### 5. **Check Build Logs**

Look at the Vercel build logs for:
- Environment variable warnings
- API errors during build
- Any 404 errors in the logs

### 6. **Verify Model Name**

The code now uses `gemini-1.5-flash`. If you want to use a different model, you can change it in `lib/gemini.ts`:

- `gemini-1.5-flash` - Fast, free tier friendly (current)
- `gemini-1.5-pro` - More capable, better for complex tasks
- `gemini-pro` - **DEPRECATED** - Don't use this

### 7. **Check API Key Permissions**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify your API key is active
3. Check if there are any restrictions or quotas
4. Make sure the key has access to Gemini models

### 8. **Alternative: Skip AI During Build**

If errors persist during build, the code now gracefully falls back to truncated text. The build should complete successfully even if the API fails.

## Common Issues:

### Issue: "404 Not Found" during build
**Solution**: The model name was updated to `gemini-1.5-flash`. Make sure you've redeployed with the latest code.

### Issue: "403 Forbidden"
**Solution**: Check that your API key is correct and has proper permissions in Google AI Studio.

### Issue: Build succeeds but chatbot doesn't work
**Solution**: 
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set in Vercel
3. Make sure it's available at runtime (not just build time)

### Issue: Environment variable not found
**Solution**: 
- Variable name must be exactly `NEXT_PUBLIC_GEMINI_API_KEY`
- Must be set for the correct environment (Production/Preview/Development)
- Redeploy after adding/changing environment variables

## Still Having Issues?

1. Check the Vercel function logs for runtime errors
2. Test the API endpoint directly: `/api/chat`
3. Verify the API key works in Google AI Studio's playground
4. Check if there are any regional restrictions on your API key
