# Security Guidelines

## ⚠️ IMPORTANT: API Keys and Secrets

**NEVER commit `.env.local` or any file containing API keys, secrets, or credentials to version control.**

## Current Status

✅ `.env.local` is properly ignored by `.gitignore`
✅ No `.env.local` file found in git history (verified)
✅ `.gitignore` has been strengthened to prevent accidental commits
✅ Pre-commit hook prevents accidental commits of `.env` files

**Latest Verification Results (as of latest check):**
- `git check-ignore -v .env.local` confirms file is ignored (`.gitignore:31:.env.*`)
- `git ls-files .env.local` returns empty (file is NOT tracked)
- `git log --all --source --full-history -- .env.local` returns empty (no history)
- `git diff HEAD -- .env.local` returns empty (not in working tree diff)
- `git diff --cached -- .env.local` returns empty (not staged)
- `git log --diff-filter=A -- .env.local` returns empty (never added to git)
- **Conclusion**: `.env.local` exists locally but is NOT in version control. Credentials are safe and have NEVER been committed.

## If Secrets Were Ever Committed

If API keys or secrets were accidentally committed to git:

1. **IMMEDIATELY rotate all exposed credentials:**
   - Gemini API Key: Revoke and create new key at [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Firebase credentials: Regenerate in [Firebase Console](https://console.firebase.google.com)

2. **Remove from git history** (if needed):
   ```bash
   # Remove file from all commits (use with caution!)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

3. **Update all environments:**
   - Local `.env.local`
   - Vercel environment variables
   - Any other deployment platforms

## Best Practices

1. ✅ Always use `.env.local` for local development
2. ✅ Use `env.example.txt` as a template (without real values) - this file IS tracked in git
3. ✅ Set environment variables in deployment platforms (Vercel, etc.)
4. ✅ Never share API keys in chat, email, or documentation
5. ✅ Rotate keys periodically
6. ✅ Use different keys for development and production

## File Tracking Strategy

- **Ignored**: `.env.local`, `.env.*`, `*.env` - These contain real secrets and are never tracked
- **Tracked**: `env.example.txt` - This is the template file (without leading dot) and IS tracked in git
- **Note**: `.gitattributes` git-crypt rules are not needed since `.env` files are ignored entirely

## Current Protected Files

The following patterns are ignored by git:
- `.env*.local`
- `.env.local`
- `.env`
- `.env.*`
- `*.env`

## Verification

To verify `.env.local` is not tracked:
```bash
git check-ignore -v .env.local
git ls-files | grep .env
```

Both commands should confirm the file is ignored and not tracked.
