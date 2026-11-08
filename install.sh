#!/usr/bin/env bash
# Instala ou atualiza a skill Cartaz Histórico no Claude Code.
set -euo pipefail
REPO="https://github.com/ojosuevfx/cartaz-historico-motion.git"
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/cartaz-historico-motion"

command -v git >/dev/null || { echo "Instale o git primeiro."; exit 1; }
mkdir -p "$(dirname "$DEST")"
if [ -d "$DEST/.git" ]; then
  git -C "$DEST" pull --ff-only
  echo "Skill atualizada em $DEST"
elif [ -e "$DEST" ]; then
  echo "$DEST já existe e não é um clone do repositório. Mova ou apague essa pasta e rode de novo."
  exit 1
else
  git clone --depth 1 "$REPO" "$DEST"
  echo "Skill instalada em $DEST"
fi
command -v node >/dev/null || echo "Aviso: para renderizar, instale o Node.js."
command -v ffmpeg >/dev/null || echo "Aviso: para renderizar, instale o ffmpeg."
echo "Reinicie o Claude Code e peça: anima este mini-doc no estilo cartaz histórico."
