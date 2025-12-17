# How to Add Environment Variables to Vercel

## The Problem

Your Vercel deployment shows:
```
Warning: GEMINI_API_KEY is not set. AI features will not work
Checked: GEMINI_API_KEY = NOT SET
Checked: NEXT_PUBLIC_GEMINI_API_KEY = NOT SET
```

This means your API keys from `.env.local` are **not available** in Vercel. The `.env.local` file only works locally on your computer.

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Your Vercel Project Settings

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your **CampusAI** project
3. Click on **Settings** (in the top navigation)
4. Click on **Environment Variables** (in the left sidebar)

### Step 2: Add Your API Keys

You need to add **TWO** environment variables:

#### Variable 1: `NEXT_PUBLIC_GEMINI_API_KEY`
1. Click **"Add New"** button
2. **Key**: `NEXT_PUBLIC_GEMINI_API_KEY`
3. **Value**: Your Gemini API key (e.g., `AIzaSyDQYfmSawG0APZR4f1b3hnLwi9el5TAx-E`)
4. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

#### Variable 2: `GEMINI_API_KEY` (Optional but Recommended)
1. Click **"Add New"** button again
2. **Key**: `GEMINI_API_KEY`
3. **Value**: Same Gemini API key as above
4. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

### Step 3: Add Firebase Variables (If Needed)

If your app uses Firebase, also add these:

1. **NEXT_PUBLIC_FIREBASE_API_KEY**
   - Value: Your Firebase API key
   - Environments: All three

2. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
   - Value: Your Firebase auth domain
   - Environments: All three

3. **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
   - Value: Your Firebase project ID
   - Environments: All three

4. **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
   - Value: Your Firebase storage bucket
   - Environments: All three

5. **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
   - Value: Your Firebase messaging sender ID
   - Environments: All three

6. **NEXT_PUBLIC_FIREBASE_APP_ID**
   - Value: Your Firebase app ID
   - Environments: All three

7. **NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID** (Optional)
   - Value: Your Firebase measurement ID
   - Environments: All three

### Step 4: Redeploy Your Project

After adding the environment variables:

1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Make sure **"Use existing Build Cache"** is **UNCHECKED**
6. Click **"Redeploy"**

**OR** simply push a new commit to trigger a new deployment:
```bash
git add .
git commit -m "Trigger redeploy with env vars"
git push
```

### Step 5: Verify It Worked

After redeployment:

1. Check the build logs - you should **NOT** see the warning anymore
2. Visit your deployed site
3. Try the chatbot - it should work now!

## Important Notes

### Security
- ✅ **Never commit** `.env.local` to git (it's already in `.gitignore`)
- ✅ Environment variables in Vercel are **encrypted** and secure
- ✅ Only people with access to your Vercel project can see these variables

### Finding Your API Keys

If you need to find your API keys:

1. **Gemini API Key**: Check your `.env.local` file locally:
   ```bash
   # On Windows PowerShell:
   Get-Content .env.local
   ```

2. **Firebase Keys**: Check your `.env.local` file or your Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings → General
   - Scroll to "Your apps" section

## Troubleshooting

### Still Seeing "NOT SET" After Adding Variables?

1. **Make sure you redeployed** - Environment variables only apply to new deployments
2. **Check the variable names** - They must match exactly (case-sensitive):
   - `NEXT_PUBLIC_GEMINI_API_KEY` ✅
   - `next_public_gemini_api_key` ❌ (wrong case)
3. **Check environments** - Make sure you selected the right environments (Production, Preview, Development)

### Variables Not Working?

1. **Restart the deployment** - Sometimes Vercel needs a fresh build
2. **Check for typos** - Variable names must match exactly
3. **Verify the values** - Make sure you copied the full API key without extra spaces

## Quick Checklist

- [ ] Added `NEXT_PUBLIC_GEMINI_API_KEY` to Vercel
- [ ] Added `GEMINI_API_KEY` to Vercel (optional)
- [ ] Added all Firebase variables (if using Firebase)
- [ ] Selected all three environments (Production, Preview, Development)
- [ ] Redeployed the project
- [ ] Verified the warning is gone in build logs
- [ ] Tested the chatbot on the deployed site

## Summary

**Yes, the AI won't work without the API keys in Vercel!** But it's easy to fix - just add the environment variables in Vercel's dashboard and redeploy. The process takes about 2 minutes.
