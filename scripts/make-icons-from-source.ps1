# scripts/make-icons-from-source.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Source artwork (adjust if you want praying-hands instead)
$srcPath = Join-Path (Resolve-Path "public\icons") "open-bible-gold.png"
if (-not (Test-Path $srcPath)) {
  throw "Source icon not found at $srcPath"
}

# Output sizes
$sizes = 48,72,96,128,144,192,256,384,512
$destDir = Join-Path (Resolve-Path ".") "public\icons"
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

# Load source once
$src = [System.Drawing.Image]::FromFile($srcPath)

foreach ($s in $sizes) {
  # Create a transparent square canvas
  $bmp   = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gfx   = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gfx.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gfx.Clear([System.Drawing.Color]::FromArgb(0,0,0,0)) # transparent

  # Scale source proportionally to fit within square with ~10% margin
  $marginFactor = 0.9
  $maxW = [int]([double]$s * $marginFactor)
  $maxH = [int]([double]$s * $marginFactor)
  $scale = [Math]::Min($maxW / $src.Width, $maxH / $src.Height)
  $drawW = [int]([double]$src.Width * $scale)
  $drawH = [int]([double]$src.Height * $scale)

  # Center the image
  $dx = [int](($s - $drawW) / 2)
  $dy = [int](($s - $drawH) / 2)

  # Draw
  $destRect = New-Object System.Drawing.Rectangle($dx, $dy, $drawW, $drawH)
  $gfx.DrawImage($src, $destRect)

  # Save
  $outPath = Join-Path $destDir ("icon-{0}.png" -f $s)
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

  # Cleanup loop
  $gfx.Dispose()
  $bmp.Dispose()
}

$src.Dispose()
Write-Host "Generated centered icons in $destDir"
