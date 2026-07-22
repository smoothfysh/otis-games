# Backup all game index.html files with timestamp
# Run from the kidsgames root directory: .\backups\backup-all.ps1

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $PSScriptRoot "."

$games = @(
    @{ dir = "shape-sorter"; name = "shape-sorter" },
    @{ dir = "color-splash"; name = "color-splash" },
    @{ dir = "shape-pop"; name = "shape-pop" },
    @{ dir = "memory-path"; name = "memory-path" },
    @{ dir = "otisbird"; name = "otisbird" },
    @{ dir = "."; name = "homepage" }
)

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "Backing up all games to: $backupDir" -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp" -ForegroundColor Cyan
Write-Host ""

$games | ForEach-Object {
    $srcDir = Join-Path $projectRoot $_.dir
    $srcFile = Join-Path $srcDir "index.html"
    $destFile = Join-Path $backupDir "$($_.name)-index-$timestamp.html.bak"

    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination $destFile
        Write-Host "  ✔ $($_.name)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($_.name) — NOT FOUND at $srcFile" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done — $($games.Count) files processed." -ForegroundColor Cyan
