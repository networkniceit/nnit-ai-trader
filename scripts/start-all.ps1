$root = Split-Path -Parent $PSScriptRoot

Set-Location $root
docker-compose -f "$root\backend\docker-compose.yml" up -d postgres redis
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Postgres and Redis could not be started. Is Docker Desktop running?'
    exit $LASTEXITCODE
}

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$root\backend'; npm start"
)

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$root\dashboard'; npm run dev -- --host 0.0.0.0"
)

Write-Host 'Backend: http://localhost:5000'
Write-Host 'Dashboard: http://localhost:5173'