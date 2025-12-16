# Security Verification Script for .env.local
# This script verifies that .env.local is NOT committed to git

Write-Host "=== .env.local Security Verification ===" -ForegroundColor Cyan
Write-Host ""

$issues = @()

# Check 1: Is file tracked?
Write-Host "1. Checking if file is tracked by git..." -ForegroundColor Yellow
try {
    $result = git ls-files --error-unmatch .env.local 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ❌ ERROR: .env.local IS tracked by git!" -ForegroundColor Red
        $issues += "File is tracked in git"
    }
} catch {
    Write-Host "   ✅ File is NOT tracked (correct)" -ForegroundColor Green
}

# Check 2: Is file ignored?
Write-Host "2. Checking if file is properly ignored..." -ForegroundColor Yellow
$ignoreResult = git check-ignore -v .env.local
if ($ignoreResult) {
    Write-Host "   ✅ File is properly ignored: $ignoreResult" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: File is NOT ignored!" -ForegroundColor Red
    $issues += "File is not ignored by .gitignore"
}

# Check 3: Is file in git history?
Write-Host "3. Checking git history..." -ForegroundColor Yellow
$history = git log --all --full-history --source --pretty=format:"%H" -- .env.local
$historyCount = ($history | Measure-Object -Line).Lines
if ($historyCount -eq 0) {
    Write-Host "   ✅ No history found (file never committed)" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: File found in $historyCount commit(s)!" -ForegroundColor Red
    $issues += "File found in git history"
}

# Check 4: Is file in git objects?
Write-Host "4. Checking git objects..." -ForegroundColor Yellow
$objects = git rev-list --objects --all | Select-String -Pattern "\.env\.local"
$objectCount = ($objects | Measure-Object -Line).Lines
if ($objectCount -eq 0) {
    Write-Host "   ✅ No objects found (file not in repository)" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: File found in $objectCount git object(s)!" -ForegroundColor Red
    $issues += "File found in git objects"
}

# Check 5: Is file in current diff?
Write-Host "5. Checking current git status..." -ForegroundColor Yellow
$status = git status --porcelain .env.local
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "   ✅ File not in working tree or staged (correct)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  WARNING: File appears in git status: $status" -ForegroundColor Yellow
    $issues += "File appears in git status"
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan

if ($issues.Count -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED" -ForegroundColor Green
    Write-Host "   .env.local is properly secured and NOT in version control." -ForegroundColor Green
    Write-Host "   Your credentials are safe." -ForegroundColor Green
} else {
    Write-Host "❌ SECURITY ISSUES FOUND:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "   - $issue" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "   1. Remove file from git: git rm --cached .env.local" -ForegroundColor Yellow
    Write-Host "   2. Ensure .gitignore includes .env.local" -ForegroundColor Yellow
    Write-Host "   3. Rotate all exposed credentials immediately" -ForegroundColor Yellow
    Write-Host "   4. Remove from git history if needed (see SECURITY.md)" -ForegroundColor Yellow
}

Write-Host ""
