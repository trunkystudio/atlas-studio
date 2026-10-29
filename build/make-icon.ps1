Add-Type -AssemblyName System.Drawing
$atlasSourcePath = Join-Path $PSScriptRoot '..\src\assets\atlas-icon.png'
$atlasSourceImage = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $atlasSourcePath))
$atlasIconSizes = @(16,24,32,48,64,128,256)
$atlasFrames = [System.Collections.Generic.List[byte[]]]::new()
try {
    foreach ($atlasSize in $atlasIconSizes) {
        $atlasBitmap = [System.Drawing.Bitmap]::new($atlasSize,$atlasSize)
        $atlasGraphics = [System.Drawing.Graphics]::FromImage($atlasBitmap)
        $atlasGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $atlasGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $atlasGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $atlasGraphics.DrawImage($atlasSourceImage,0,0,$atlasSize,$atlasSize)
        $atlasStream = [System.IO.MemoryStream]::new()
        $atlasBitmap.Save($atlasStream,[System.Drawing.Imaging.ImageFormat]::Png)
        $atlasFrames.Add($atlasStream.ToArray())
        if ($atlasSize -eq 256) { [System.IO.File]::WriteAllBytes((Join-Path $PSScriptRoot 'icon.png'),$atlasStream.ToArray()) }
        $atlasStream.Dispose(); $atlasGraphics.Dispose(); $atlasBitmap.Dispose()
    }
    $atlasOutput = [System.IO.File]::Create((Join-Path $PSScriptRoot 'icon.ico'))
    $atlasWriter = [System.IO.BinaryWriter]::new($atlasOutput)
    try {
        $atlasWriter.Write([uint16]0); $atlasWriter.Write([uint16]1); $atlasWriter.Write([uint16]$atlasIconSizes.Count)
        $atlasOffset = 6 + 16 * $atlasIconSizes.Count
        for ($atlasIndex=0; $atlasIndex -lt $atlasIconSizes.Count; $atlasIndex++) {
            $atlasDimension = if ($atlasIconSizes[$atlasIndex] -eq 256) {0} else {$atlasIconSizes[$atlasIndex]}
            $atlasWriter.Write([byte]$atlasDimension); $atlasWriter.Write([byte]$atlasDimension)
            $atlasWriter.Write([byte]0); $atlasWriter.Write([byte]0)
            $atlasWriter.Write([uint16]1); $atlasWriter.Write([uint16]32)
            $atlasWriter.Write([uint32]$atlasFrames[$atlasIndex].Length); $atlasWriter.Write([uint32]$atlasOffset)
            $atlasOffset += $atlasFrames[$atlasIndex].Length
        }
        foreach ($atlasFrame in $atlasFrames) { $atlasWriter.Write([byte[]]$atlasFrame) }
    } finally { $atlasWriter.Dispose(); $atlasOutput.Dispose() }
} finally { $atlasSourceImage.Dispose() }
Write-Output 'Created a seven-size Windows icon from the supplied Atlas Studio logo.'
