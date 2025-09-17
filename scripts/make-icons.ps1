# scripts/make-icons.ps1
$ErrorActionPreference = 'Stop'

# Ensure System.Drawing is available (Windows)
Add-Type -AssemblyName System.Drawing

# Brand gold on dark background
$gold = [System.Drawing.Color]::FromArgb(255,212,175,55)

# Output folder
$iconsDir = Join-Path -Path (Resolve-Path .) -ChildPath 'public\icons'
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

# Sizes per RC10 plan
$sizes = 48,72,96,128,144,192,256,384,512

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $brush = New-Object System.Drawing.SolidBrush($gold)

    # Fill background
    $gfx.FillRectangle($brush, 0, 0, $s, $s)

    # Save as PNG
    $outPath = Join-Path $iconsDir ("icon-{0}.png" -f $s)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Cleanup
    $gfx.Dispose()
    $brush.Dispose()
    $bmp.Dispose()
}

Write-Host "Icons generated in $iconsDir"
