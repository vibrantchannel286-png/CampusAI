# Fix PowerShell Execution Policy (Allow npm to Run)

## The Problem
You're seeing: `running scripts is disabled on this system`

This is a Windows security feature that blocks PowerShell scripts. npm needs to run scripts, so we need to allow it.

## Quick Fix (Recommended)

### Option 1: Change Policy for Current User (Safest)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Type `Y` when asked to confirm.

### Option 2: Bypass for This Session Only
If you don't want to change the policy permanently, you can bypass it just for this terminal session:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Step-by-Step Instructions

### Method 1: Run PowerShell as Administrator

1. **Open PowerShell as Administrator:**
   - Press `Windows Key + X`
   - Click "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" when asked for permission

2. **Run this command:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Type `Y` and press Enter** when asked to confirm

4. **Close the admin PowerShell** and open a regular PowerShell

5. **Navigate to your project:**
   ```powershell
   cd C:\Users\user\Downloads\CampusAI-1
   ```

6. **Try npm again:**
   ```powershell
   npm --version
   npm run dev
   ```

### Method 2: Bypass for Current Session (No Admin Needed)

1. **In your current PowerShell window**, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   ```

2. **Now try npm:**
   ```powershell
   npm --version
   npm run dev
   ```

   **Note:** This only works for the current PowerShell window. If you close it, you'll need to run the command again.

## What Each Policy Means

- **Restricted** (current): Blocks all scripts
- **RemoteSigned** (recommended): Allows local scripts, requires signed remote scripts
- **Bypass**: Allows all scripts (less secure, but works)

## Alternative: Use Command Prompt Instead

If you don't want to change PowerShell settings, you can use Command Prompt (cmd) instead:

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

Command Prompt doesn't have execution policy restrictions, so npm will work there.

## Verify It Worked

After changing the policy, test it:
```powershell
npm --version
```

You should see a version number (like `10.2.3`) instead of an error.

## Still Having Issues?

If you're still getting errors:

1. **Make sure you're using the right PowerShell:**
   - Try Command Prompt (cmd) instead
   - Or restart PowerShell after changing the policy

2. **Check Node.js is installed:**
   ```powershell
   node --version
   ```
   Should show a version number

3. **Try the bypass method** for the current session if you can't use admin
