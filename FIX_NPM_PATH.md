# Fix npm Not Found After Installing Node.js

## The Problem
You fixed the PowerShell execution policy, but npm is still not recognized. This usually means Node.js isn't in your PATH, or you need to restart your terminal.

## Quick Fixes

### Fix 1: Restart Your Terminal (Most Common)
1. **Close your current PowerShell window completely**
2. **Open a new PowerShell window**
3. **Navigate to your project:**
   ```
   cd C:\Users\user\Downloads\CampusAI-1
   ```
4. **Try npm again:**
   ```
   npm --version
   ```

### Fix 2: Use Full Path to npm
If restarting doesn't work, you can use the full path:
```powershell
& "C:\Program Files\nodejs\npm.cmd" --version
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### Fix 3: Add Node.js to PATH Manually
If Node.js isn't in your PATH:

1. **Find where Node.js is installed:**
   - Usually: `C:\Program Files\nodejs\`
   - Or: `C:\Program Files (x86)\nodejs\`

2. **Add it to PATH:**
   - Press `Windows Key` and search for "Environment Variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs\`
   - Click "OK" on all windows
   - **Restart your terminal**

### Fix 4: Use Command Prompt Instead
Command Prompt (cmd) sometimes works better:

1. **Open Command Prompt:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter

2. **Navigate to your project:**
   ```
   cd C:\Users\user\Downloads\CampusAI-1
   ```

3. **Run npm:**
   ```
   npm run dev
   ```

## Verify Node.js Installation

Check if Node.js is actually installed:
```powershell
Test-Path "C:\Program Files\nodejs\node.exe"
```

If this returns `True`, Node.js is installed. If `False`, you need to install Node.js first (see INSTALL_NODEJS.md).

## Check Current PATH

See if Node.js is in your PATH:
```powershell
$env:PATH -split ';' | Where-Object { $_ -like "*nodejs*" }
```

If nothing shows up, Node.js isn't in your PATH.

## After Fixing

Once npm works, you should be able to:
1. Navigate to your project: `cd C:\Users\user\Downloads\CampusAI-1`
2. Run: `npm run dev`
3. The chatbot should work!
