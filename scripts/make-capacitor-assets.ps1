# scripts/make-capacitor-assets.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Paths
$root = Resolve-Path "."
$iconsDir = Join-Path $root "public\icons"
$resourcesDir = Join-Path $root "resources"
New-Item -ItemType Directory -Force -Path $resourcesDir | Out-Null

# Source art
$iconSrc = Join-Path $iconsDir "open-bible-gold.png"
if (-not (Test-Path $iconSrc)) { throw "Missing $iconSrc" }

# 1) ICON: 1024x1024 transparent PNG
$iconSize = 1024
$iconBmp = New-Object System.Drawing.Bitmap($iconSize,$iconSize,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(0,0,0,0))
$src = [System.Drawing.Image]::FromFile($iconSrc)
# scale to 88% of canvas
$scale = [Math]::Min(($iconBmp.Width*0.88)/$src.Width, ($iconBmp.Height*0.88)/$src.Height)
$w = [int]($src.Width*$scale); $h = [int]($src.Height*$scale)
$dx = [int](($iconSize-$w)/2); $dy = [int](($iconSize-$h)/2)
$g.DrawImage($src, (New-Object System.Drawing.Rectangle($dx,$dy,$w,$h)))
$iconOut = Join-Path $resourcesDir "icon.png"
$iconBmp.Save($iconOut, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $src.Dispose(); $iconBmp.Dispose()

# 2) SPLASH: 2732x2732 PNG with brand background and centered art (1200px wide)
$splashW = 2732; $splashH = 2732
$bg = [System.Drawing.Color]::FromArgb(255, 0, 0, 0) # brand background
$splash = New-Object System.Drawing.Bitmap($splashW,$splashH,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gs = [System.Drawing.Graphics]::FromImage($splash)
$gs.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gs.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gs.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$brush = New-Object System.Drawing.SolidBrush($bg)
$gs.FillRectangle($brush,0,0,$splashW,$splashH)
$src2 = [System.Drawing.Image]::FromFile($iconSrc)
$targetW = 1200
$scale2 = $targetW / $src2.Width
$tw = [int]($src2.Width*$scale2); $th = [int]($src2.Height*$scale2)
$tx = [int](($splashW-$tw)/2); $ty = [int](($splashH-$th)/2)
$gs.DrawImage($src2, (New-Object System.Drawing.Rectangle($tx,$ty,$tw,$th)))
$brush.Dispose(); $src2.Dispose()
$splashOut = Join-Path $resourcesDir "splash.png"
$splash.Save($splashOut, [System.Drawing.Imaging.ImageFormat]::Png)
$gs.Dispose(); $splash.Dispose()

Write-Host "Wrote $iconOut and $splashOut"
