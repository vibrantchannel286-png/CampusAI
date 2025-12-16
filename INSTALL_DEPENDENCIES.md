# Install Project Dependencies

## The Problem
You're seeing: `'next' is not recognized as an internal or external command`

This means the project dependencies (like Next.js) haven't been installed yet.

## Solution: Install Dependencies

### Step 1: Navigate to Your Project
Make sure you're in the project folder:
```
cd C:\Users\user\Downloads\CampusAI-1
```

### Step 2: Install Dependencies
Run this command:
```
npm install
```

This will download and install all the required packages (Next.js, React, Firebase, etc.)

**Note:** This might take a few minutes the first time.

### Step 3: Wait for Installation to Complete
You'll see a lot of output as packages are downloaded. Wait until you see:
- `added X packages`
- Or `npm WARN` messages (these are usually fine)

### Step 4: Start the Development Server
Once installation is complete, run:
```
npm run dev
```

## What npm install Does

`npm install` reads the `package.json` file and installs all the dependencies listed there:
- Next.js (the framework)
- React (for building the UI)
- Firebase (for the database)
- Gemini AI library
- And other required packages

These get installed in a folder called `node_modules` in your project.

## Troubleshooting

### If npm install fails:

1. **Check your internet connection** - npm needs to download packages

2. **Try clearing npm cache:**
   ```
   npm cache clean --force
   npm install
   ```

3. **Check if you're in the right folder:**
   ```
   dir
   ```
   You should see `package.json` in the list

4. **Make sure npm is working:**
   ```
   npm --version
   ```
   Should show a version number

### If you see permission errors:

- Try running PowerShell as Administrator
- Or use Command Prompt instead

## After Installation

Once `npm install` completes successfully:
1. You'll have a `node_modules` folder (this is normal, don't delete it)
2. You can now run `npm run dev` to start your server
3. The chatbot should work!
