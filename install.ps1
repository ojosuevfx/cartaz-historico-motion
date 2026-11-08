# Instala ou atualiza a skill Cartaz Historico no Claude Code.
$ErrorActionPreference = 'Stop'
$repo = 'https://github.com/ojosuevfx/cartaz-historico-motion.git'
$base = if ($env:CLAUDE_SKILLS_DIR) { $env:CLAUDE_SKILLS_DIR } else { Join-Path $HOME '.claude\skills' }
$dest = Join-Path $base 'cartaz-historico-motion'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Write-Host 'Instale o git primeiro.'; return }
New-Item -ItemType Directory -Force -Path $base | Out-Null
if (Test-Path (Join-Path $dest '.git')) {
  git -C $dest pull --ff-only
  Write-Host "Skill atualizada em $dest"
} elseif (Test-Path $dest) {
  Write-Host "$dest ja existe e nao e um clone do repositorio. Mova ou apague essa pasta e rode de novo."
  return
} else {
  git clone --depth 1 $repo $dest
  Write-Host "Skill instalada em $dest"
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host 'Aviso: para renderizar, instale o Node.js.' }
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Write-Host 'Aviso: para renderizar, instale o ffmpeg.' }
Write-Host 'Reinicie o Claude Code e peca: anima este mini-doc no estilo cartaz historico.'
