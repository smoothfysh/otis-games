# Backup Process

Before making any changes to a game's `index.html`, create a timestamped backup:

## Manual Backup

```powershell
# From the kidsgames root directory:
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item shape-sorter/index.html backups/shape-sorter-index-$ts.html.bak
```

## Bulk Backup (all games)

Run the backup script:

```powershell
.\backups\backup-all.ps1
```

This creates timestamped copies of every `index.html` in `backups/` with the naming pattern:
`{game-name}-index-{YYYYMMDD-HHmmss}.html.bak`

## Restore from Backup

```powershell
# List available backups
Get-ChildItem -Path backups -Filter "*.bak" | Sort-Object Name

# Restore a specific one
Copy-Item backups/shape-sorter-index-20260722-093123.html.bak shape-sorter/index.html -Force
```
