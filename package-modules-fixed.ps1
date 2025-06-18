# Module Packager PowerShell Script
# Đóng gói modules thành file .zip hoặc folder để sử dụng bên ngoài

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("package", "folder", "standalone", "package-all", "list")]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$ModuleId,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "dist\packages"
)

# Màu sắc cho output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colors = @{
        "Red" = [ConsoleColor]::Red
        "Green" = [ConsoleColor]::Green
        "Yellow" = [ConsoleColor]::Yellow
        "Blue" = [ConsoleColor]::Blue
        "Cyan" = [ConsoleColor]::Cyan
        "White" = [ConsoleColor]::White
        "Gray" = [ConsoleColor]::Gray
    }
    
    Write-Host $Message -ForegroundColor $colors[$Color]
}

# Banner
function Show-Banner {
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════╗" "Cyan"
    Write-ColorOutput "║                    📦 MODULE PACKAGER                        ║" "Cyan"
    Write-ColorOutput "║              Đóng gói modules thành package                  ║" "Cyan"
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════╝" "Cyan"
    Write-Host ""
}

# Kiểm tra Node.js và TypeScript
function Test-Prerequisites {
    Write-ColorOutput "🔍 Kiểm tra điều kiện..." "Yellow"
    
    # Kiểm tra Node.js
    try {
        $nodeVersion = node --version
        Write-ColorOutput "✅ Node.js: $nodeVersion" "Green"
    }
    catch {
        Write-ColorOutput "❌ Node.js không được cài đặt" "Red"
        Write-ColorOutput "Vui lòng cài đặt Node.js từ: https://nodejs.org" "Yellow"
        exit 1
    }
    
    # Kiểm tra TypeScript
    try {
        $tsVersion = npx tsc --version
        Write-ColorOutput "✅ TypeScript: $tsVersion" "Green"
    }
    catch {
        Write-ColorOutput "⚠️  TypeScript không được cài đặt, sẽ sử dụng ts-node" "Yellow"
    }
    
    Write-Host ""
}

# Liệt kê tất cả modules
function Get-AllModules {
    Write-ColorOutput "📋 Danh sách modules có sẵn:" "Blue"
    
    $modulesPath = "modules"
    if (Test-Path $modulesPath) {
        $modules = Get-ChildItem -Path $modulesPath -Directory | ForEach-Object { $_.Name }
        
        foreach ($module in $modules) {
            $manifestPath = Join-Path $modulesPath $module "manifest.json"
            if (Test-Path $manifestPath) {
                try {
                    $manifest = Get-Content $manifestPath | ConvertFrom-Json
                    Write-ColorOutput "  📦 $($module) - $($manifest.name) (v$($manifest.version))" "White"
                    Write-ColorOutput "     🏷️  Category: $($manifest.category) | Tier: $($manifest.tier)" "Gray"
                    Write-ColorOutput "     📄 $($manifest.description)" "Gray"
                    Write-Host ""
                }
                catch {
                    Write-ColorOutput "  📦 $module (lỗi đọc manifest.json)" "Yellow"
                }
            }
            else {
                Write-ColorOutput "  📦 $module (không có manifest.json)" "Yellow"
            }
        }
    }
    else {
        Write-ColorOutput "❌ Thư mục modules không tồn tại" "Red"
        exit 1
    }
}

# Chạy packager
function Invoke-Packager {
    param(
        [string]$Cmd,
        [string]$Module
    )
    
    # Tạo thư mục output
    if (!(Test-Path $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        Write-ColorOutput "📁 Tạo thư mục output: $OutputPath" "Green"
    }
    
    # Chạy TypeScript packager
    $scriptPath = "scripts\module-packager.ts"
    
    if (!(Test-Path $scriptPath)) {
        Write-ColorOutput "❌ Không tìm thấy script: $scriptPath" "Red"
        exit 1
    }
    
    try {
        if ($Module) {
            Write-ColorOutput "🚀 Đang chạy: $Cmd cho module $Module..." "Blue"
            npx ts-node $scriptPath $Cmd $Module
        }
        else {
            Write-ColorOutput "🚀 Đang chạy: $Cmd..." "Blue"
            npx ts-node $scriptPath $Cmd
        }
    }
    catch {
        Write-ColorOutput "❌ Lỗi khi chạy packager: $($_.Exception.Message)" "Red"
        exit 1
    }
}

# Hiển thị hướng dẫn sử dụng
function Show-Usage {
    Write-ColorOutput "📖 Cách sử dụng:" "Yellow"
    Write-Host ""
    Write-ColorOutput "Đóng gói module thành folder:" "White"
    Write-ColorOutput "  .\package-modules.ps1 folder <module-id>" "Cyan"
    Write-Host ""
    Write-ColorOutput "Đóng gói module thành .zip (tạo folder trước):" "White"
    Write-ColorOutput "  .\package-modules.ps1 package <module-id>" "Cyan"
    Write-Host ""
    Write-ColorOutput "Tạo standalone package (có thể chạy độc lập):" "White"
    Write-ColorOutput "  .\package-modules.ps1 standalone <module-id>" "Cyan"
    Write-Host ""
    Write-ColorOutput "Đóng gói tất cả modules:" "White"
    Write-ColorOutput "  .\package-modules.ps1 package-all" "Cyan"
    Write-Host ""
    Write-ColorOutput "Liệt kê tất cả modules:" "White"
    Write-ColorOutput "  .\package-modules.ps1 list" "Cyan"
    Write-Host ""
    Write-ColorOutput "Ví dụ:" "Yellow"
    Write-ColorOutput "  .\package-modules.ps1 folder tax-calculator" "Green"
    Write-ColorOutput "  .\package-modules.ps1 standalone qr-generator-v2" "Green"
    Write-ColorOutput "  .\package-modules.ps1 list" "Green"
}

# Tạo file .zip từ folder
function Create-ZipFromFolder {
    param(
        [string]$FolderPath,
        [string]$ZipPath
    )
    
    if (Test-Path $FolderPath) {
        try {
            Write-ColorOutput "🗜️  Tạo file .zip từ folder..." "Blue"
            Compress-Archive -Path "$FolderPath\*" -DestinationPath $ZipPath -Force
            Write-ColorOutput "✅ File .zip đã được tạo: $ZipPath" "Green"
            
            # Hiển thị kích thước
            $zipSize = (Get-Item $ZipPath).Length
            $sizeFormatted = if ($zipSize -gt 1MB) { "{0:N2} MB" -f ($zipSize / 1MB) } else { "{0:N2} KB" -f ($zipSize / 1KB) }
            Write-ColorOutput "📏 Kích thước: $sizeFormatted" "Yellow"
        }
        catch {
            Write-ColorOutput "❌ Lỗi tạo file .zip: $($_.Exception.Message)" "Red"
        }
    }
}

# Main execution
try {
    Show-Banner
    Test-Prerequisites
    
    switch ($Command.ToLower()) {
        "list" {
            Get-AllModules
        }
        "package" {
            if (!$ModuleId) {
                Write-ColorOutput "❌ Vui lòng cung cấp Module ID" "Red"
                Show-Usage
                exit 1
            }
            
            Invoke-Packager "folder" $ModuleId
            
            # Tạo file .zip từ folder
            $folderPattern = Join-Path $OutputPath "$ModuleId-v*"
            $folders = Get-ChildItem -Path $folderPattern -Directory 2>$null
            if ($folders) {
                $latestFolder = $folders | Sort-Object Name -Descending | Select-Object -First 1
                $zipPath = $latestFolder.FullName + ".zip"
                Create-ZipFromFolder $latestFolder.FullName $zipPath
            }
        }
        "folder" {
            if (!$ModuleId) {
                Write-ColorOutput "❌ Vui lòng cung cấp Module ID" "Red"
                Show-Usage
                exit 1
            }
            
            Invoke-Packager "folder" $ModuleId
        }
        "standalone" {
            if (!$ModuleId) {
                Write-ColorOutput "❌ Vui lòng cung cấp Module ID" "Red"
                Show-Usage
                exit 1
            }
            
            Invoke-Packager "standalone" $ModuleId
        }
        "package-all" {
            Invoke-Packager "package-all"
        }
        default {
            Write-ColorOutput "❌ Lệnh không hợp lệ: $Command" "Red"
            Show-Usage
            exit 1
        }
    }
    
    Write-Host ""
    Write-ColorOutput "🎉 Hoàn thành!" "Green"
    Write-ColorOutput "📁 Kết quả tại: $OutputPath" "Yellow"
    
}
catch {
    Write-ColorOutput "❌ Lỗi không mong muốn: $($_.Exception.Message)" "Red"
    exit 1
}
