# create-env-example.ps1

Write-Host "============================================="
Write-Host " Creando archivo .env.example"
Write-Host "============================================="

@"
# =============================================
# HealthTrack - Variables de entorno de ejemplo
# =============================================

DB_URL=jdbc:postgresql://localhost:5432/smartgym_db
DB_USERNAME=postgres
DB_PASSWORD=CAMBIAR_CONTRASENA
DB_MAX_POOL_SIZE=10
DB_MIN_IDLE=2

SERVER_PORT=8080

SHOW_SQL=false
FORMAT_SQL=false

HEALTH_SHOW_DETAILS=never

LOG_LEVEL_ROOT=INFO
LOG_LEVEL_HIBERNATE_SQL=INFO
"@ | Out-File -FilePath .env.example -Encoding utf8

Write-Host ""
Write-Host "Archivo creado correctamente:"
Write-Host ""
Write-Host "$(Get-Location)\.env.example"
Write-Host ""
Get-Content .env.example
