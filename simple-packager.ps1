param(
    [string]$Command,
    [string]$ModuleId
)

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

Write-Host "================================================================"
Write-Host "                   MODULE PACKAGER"
Write-Host "         Dong goi modules thanh package"
Write-Host "================================================================"
Write-Host ""

if (-not $Command) {
    Write-Host "Cach su dung:"
    Write-Host "  .\simple-packager.ps1 list"
    Write-Host "  .\simple-packager.ps1 folder tax-calculator"
    Write-Host "  .\simple-packager.ps1 standalone tax-calculator"
    Write-Host ""
    exit
}

# Kiem tra Node.js
try {
    $nodeVersion = node --version
    Write-Info "Node.js: $nodeVersion"
} catch {
    Write-Error "Node.js khong duoc cai dat"
    exit 1
}

# Tao thu muc output
$outputPath = "dist\packages"
if (!(Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
    Write-Info "Tao thu muc output: $outputPath"
}

# Xu ly lenh
switch ($Command.ToLower()) {
    "list" {
        Write-Info "Danh sach modules:"
        $modules = Get-ChildItem -Path "modules" -Directory
        foreach ($module in $modules) {
            Write-Host "  - $($module.Name)"
        }
    }
    "folder" {
        if (-not $ModuleId) {
            Write-Error "Vui long cung cap Module ID"
            exit 1
        }
        Write-Info "Dong goi module $ModuleId thanh folder..."
        npx ts-node scripts/module-packager.ts folder $ModuleId
    }
    "standalone" {
        if (-not $ModuleId) {
            Write-Error "Vui long cung cap Module ID"
            exit 1
        }
        Write-Info "Tao standalone package cho module $ModuleId..."
        npx ts-node scripts/module-packager.ts standalone $ModuleId
    }
    "package-all" {
        Write-Info "Dong goi tat ca modules..."
        npx ts-node scripts/module-packager.ts package-all
    }
    default {
        Write-Error "Lenh khong hop le: $Command"
        exit 1
    }
}

Write-Host ""
Write-Info "Hoan thanh!"
Write-Warning "Ket qua tai: $outputPath"
