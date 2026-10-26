param([int]$Port = 8000)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$rootPrefix = $root.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'text/javascript; charset=utf-8'; '.json' = 'application/json'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.gif' = 'image/gif'
  '.ico' = 'image/x-icon'; '.mp3' = 'audio/mpeg'; '.mp4' = 'video/mp4'
  '.webm' = 'video/webm'; '.woff' = 'font/woff'; '.woff2' = 'font/woff2'
}

$server = [System.Net.HttpListener]::new()
$server.Prefixes.Add("http://localhost:$Port/")
$server.Start()
Write-Host "Website available at http://localhost:$Port/"

try {
  while ($server.IsListening) {
    $context = $server.GetContext()
    $response = $context.Response
    try {
      $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      if (-not $relative) { $relative = 'index.html' }
      $path = [IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $path.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        $response.StatusCode = 403
        continue
      }
      if ([IO.Directory]::Exists($path)) { $path = Join-Path $path 'index.html' }
      if (-not [IO.File]::Exists($path)) {
        $publicRoot = [IO.Path]::GetFullPath((Join-Path $root 'public'))
        $publicPath = [IO.Path]::GetFullPath((Join-Path $publicRoot $relative))
        if ($publicPath.StartsWith($publicRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -and [IO.File]::Exists($publicPath)) {
          $path = $publicPath
        } else {
          $response.StatusCode = 404
          continue
        }
      }

      $extension = [IO.Path]::GetExtension($path).ToLowerInvariant()
      if ($mime.ContainsKey($extension)) { $response.ContentType = $mime[$extension] }
      else { $response.ContentType = 'application/octet-stream' }
      $stream = [IO.File]::OpenRead($path)
      try {
        $start = [long]0
        $end = $stream.Length - 1
        $response.Headers['Accept-Ranges'] = 'bytes'
        $range = $context.Request.Headers['Range']
        if ($range -match '^bytes=(\d+)-(\d*)$') {
          $start = [long]$Matches[1]
          if ($Matches[2]) { $end = [Math]::Min([long]$Matches[2], $end) }
          if ($start -gt $end) {
            $response.StatusCode = 416
            $response.Headers['Content-Range'] = "bytes */$($stream.Length)"
            continue
          }
          $response.StatusCode = 206
          $response.Headers['Content-Range'] = "bytes $start-$end/$($stream.Length)"
        }
        $response.ContentLength64 = $end - $start + 1
        $stream.Position = $start
        $buffer = [byte[]]::new(65536)
        $remaining = $response.ContentLength64
        while ($remaining -gt 0) {
          $count = $stream.Read($buffer, 0, [Math]::Min($buffer.Length, $remaining))
          if ($count -eq 0) { break }
          $response.OutputStream.Write($buffer, 0, $count)
          $remaining -= $count
        }
      } finally { $stream.Dispose() }
    } catch {
      Write-Warning $_
    } finally {
      $response.Close()
    }
  }
} finally {
  $server.Stop()
  $server.Close()
}
