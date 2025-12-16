# How to Install Node.js (Required for This Project)

## The Problem
You're seeing: `npm : The term 'npm' is not recognized`

This means Node.js (which includes npm) is not installed on your computer.

## Solution: Install Node.js

### Step 1: Download Node.js
1. Go to: https://nodejs.org/
2. Click the big green button that says **"Download Node.js (LTS)"**
   - LTS = Long Term Support (most stable version)
   - This will download an installer file

### Step 2: Install Node.js
1. **Run the downloaded file** (it will be something like `node-v20.x.x-x64.msi`)
2. Click **"Next"** through the installation wizard
3. **IMPORTANT**: Make sure "Add to PATH" is checked (it usually is by default)
4. Click **"Install"**
5. Wait for installation to complete
6. Click **"Finish"**

### Step 3: Restart Your Terminal
1. **Close** your current PowerShell/terminal window completely
2. **Open a new** PowerShell/terminal window
3. Navigate back to your project:
   ```
   cd C:\Users\user\Downloads\CampusAI-1
   ```

### Step 4: Verify Installation
Type these commands to check if it worked:

```powershell
node --version
npm --version
```

You should see version numbers (like `v20.11.0` and `10.2.3`)

### Step 5: Start Your Project
Now you can run:
```powershell
npm run dev
```

## Alternative: Using a Package Manager

If you have **Chocolatey** installed, you can also install Node.js with:
```powershell
choco install nodejs
```

If you have **Winget** (Windows 11), you can use:
```powershell
winget install OpenJS.NodeJS.LTS
```

## Still Having Issues?

### Check if Node.js is Installed but Not in PATH
1. Search for "Node.js" in Windows Start Menu
2. If you find it, it's installed but PATH might be wrong
3. Try restarting your computer after installation

### Reinstall Node.js
If it's still not working:
1. Uninstall Node.js from "Add or Remove Programs"
2. Restart your computer
3. Download and install again from nodejs.org
4. Make sure to restart your terminal after installation

## What is Node.js?
Node.js is a runtime that lets you run JavaScript on your computer. npm (Node Package Manager) comes with it and is used to install project dependencies and run the development server.
