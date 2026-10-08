# Run this from your project root: C:\Users\Admin\raj-electricals-kiosk
# Usage:  powershell -ExecutionPolicy Bypass -File .\restructure.ps1

$ErrorActionPreference = "Stop"

Write-Host "Checking current structure..." -ForegroundColor Cyan

$quoteDir     = "src\app\api\quote"
$kioskSrc     = "$quoteDir\kiosk"
$libSrc       = "$quoteDir\lib"
$webhookSrc   = "$quoteDir\razorpay-webhook"

$kioskDest    = "src\app\kiosk"
$libDest      = "src\lib"
$webhookDest  = "src\app\api\razorpay-webhook"

function Move-IfExists($src, $dest, $label) {
    if (Test-Path $src) {
        $destParent = Split-Path $dest -Parent
        if ($destParent -and -not (Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent -Force | Out-Null
        }
        if (Test-Path $dest) {
            Write-Host "  SKIP: $label -> destination '$dest' already exists. Move it manually to avoid overwriting." -ForegroundColor Yellow
        } else {
            Move-Item -Path $src -Destination $dest
            Write-Host "  MOVED: $label  ($src -> $dest)" -ForegroundColor Green
        }
    } else {
        Write-Host "  SKIP: $label -> '$src' not found (already moved, or never existed here)." -ForegroundColor DarkGray
    }
}

Move-IfExists $kioskSrc   $kioskDest   "kiosk/"
Move-IfExists $libSrc     $libDest     "lib/"
Move-IfExists $webhookSrc $webhookDest "razorpay-webhook/"

Write-Host ""
Write-Host "Remaining contents of $quoteDir (should be just route.ts):" -ForegroundColor Cyan
if (Test-Path $quoteDir) {
    Get-ChildItem $quoteDir | Format-Table Name, Mode
} else {
    Write-Host "  '$quoteDir' does not exist." -ForegroundColor Red
}

Write-Host ""
Write-Host "Clearing Next.js build cache (.next)..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  .next removed." -ForegroundColor Green
} else {
    Write-Host "  .next not found, skipping." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Done. Now run: npm run dev" -ForegroundColor Cyan