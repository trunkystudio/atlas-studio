$ErrorActionPreference = 'Stop'
$atlasRoot = Split-Path $PSScriptRoot -Parent
$atlasManifest = Get-Content (Join-Path $atlasRoot 'build/RESOURCE-SOURCES.json') -Raw | ConvertFrom-Json
$atlasRuntime = $atlasManifest.origins[0]
$atlasModel = $atlasManifest.origins[1]
$atlasTemp = Join-Path ([IO.Path]::GetTempPath()) ('atlas-speech-' + [guid]::NewGuid())
$atlasTarget = Join-Path $atlasRoot 'native/speech-pack'
New-Item -ItemType Directory -Path $atlasTemp,$atlasTarget -Force | Out-Null
$atlasArchive = Join-Path $atlasTemp 'runtime.zip'
Invoke-WebRequest $atlasRuntime.url -OutFile $atlasArchive
if ((Get-FileHash $atlasArchive -Algorithm SHA256).Hash.ToLowerInvariant() -ne $atlasRuntime.archiveSHA256) { throw 'Runtime checksum mismatch' }
Expand-Archive -LiteralPath $atlasArchive -DestinationPath (Join-Path $atlasTemp 'runtime')
Copy-Item -LiteralPath (Join-Path $atlasRoot 'build/speech-runtime-source.json') -Destination (Join-Path $atlasTarget 'runtime-source.json')
Copy-Item -LiteralPath (Join-Path $atlasRoot 'build/speech-runtime-LICENSE.txt') -Destination (Join-Path $atlasTarget 'LICENSE.txt')
foreach ($atlasFile in $atlasManifest.files | Where-Object { $_.path -like 'native/speech-pack/*' -and $_.path -notlike '*.bin' -and $_.path -notlike '*/runtime-source.json' -and $_.path -notlike '*/LICENSE.txt' }) {
    $atlasName = Split-Path $atlasFile.path -Leaf
    $atlasSource = @(Get-ChildItem (Join-Path $atlasTemp 'runtime') -Recurse -File | Where-Object { $_.Name -eq $atlasName })
    if ($atlasSource.Count -ne 1) { throw "Missing or ambiguous runtime file: $atlasName" }
    if ((Get-FileHash $atlasSource[0].FullName -Algorithm SHA256).Hash.ToLowerInvariant() -ne $atlasFile.sha256) { throw "Checksum mismatch: $atlasName" }
    Copy-Item -LiteralPath $atlasSource[0].FullName -Destination (Join-Path $atlasTarget $atlasName)
}
$atlasModelPath = Join-Path $atlasTarget 'ggml-small-q5_1.bin'
Invoke-WebRequest $atlasModel.url -OutFile $atlasModelPath
if ((Get-FileHash $atlasModelPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $atlasModel.sha256) { throw 'Model checksum mismatch' }
Write-Host 'Verified offline speech runtime and model are ready. Download cache:' $atlasTemp
