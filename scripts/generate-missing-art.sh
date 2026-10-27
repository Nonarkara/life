#!/bin/zsh
# Offline authoring only. Output is quarantined for visual review, never live art.
# Usage: scripts/generate-missing-art.sh [output-file | --plates | --check]
set -u
cd "${0:A:h}/.."
GEN=~/Projects/_toolkit/mflux-venv/bin/mflux-generate
OUT=scratch/anime/candidates
# The illustration LoRA, by collection name. Measured in this repo: the
# --lora-style flag is inert on FLUX.1-schnell here, while an explicit
# --lora of this file changes the image completely.
LORA="ali-vilab/In-Context-LoRA:portrait-illustration.safetensors"
STEPS=${STEPS:-4}
mkdir -p "$OUT" scratch/anime/prompts
python3 - "$@" <<'PY' > scratch/anime/prompts/queue.tsv
import json,sys,zlib
args=[a for a in sys.argv[1:] if not a.startswith('--')]
check='--check' in sys.argv
plates_only='--plates' in sys.argv
for r in json.load(open('art/missing-art-requests.json'))['requests']:
    if args and r['output_file'] not in args:continue
    if plates_only and not r['output_file'].startswith('plate-'):continue
    w,h=(2016,864) if r['aspect_ratio']=='21:9' else (1536,864)
    open(f"scratch/anime/prompts/{r['output_file']}.txt",'w').write(r['prompt'])
    print(f"{r['output_file']}\t{w}\t{h}\t{zlib.crc32(r['output_file'].encode())%100000}")
PY
if [[ "${1:-}" == --check ]]; then
  python3 -c 'from pathlib import Path;print("Validated queued requests:",len(Path("scratch/anime/prompts/queue.tsv").read_text().splitlines()))'
  exit 0
fi
[[ -x "$GEN" ]] || { echo "Local generator unavailable; no art changed."; exit 127; }
failed=0
while IFS=$'\t' read -r file w h seed; do
  [[ -s "$OUT/$file" ]] && continue
  temporary="$OUT/.${file}.partial.png"
  started=$(date +%s)
  echo "$(date +%T) candidate: $file"
  if "$GEN" --model schnell --steps "$STEPS" --lora "$LORA" --seed "$seed" --width "$w" --height "$h" \
    --prompt-file "scratch/anime/prompts/$file.txt" --output "$temporary" >/dev/null 2>>scratch/anime/prompts/errors.log \
    && python3 - "$temporary" <<'PY'
from PIL import Image
import sys
with Image.open(sys.argv[1]) as image:
    image.verify()
PY
  then
    mv "$temporary" "$OUT/$file"
    echo "  done: $file ($(( $(date +%s) - started ))s)"
  else
    failed=$((failed+1)); echo "  failed: $file (not promoted)"
  fi
done < scratch/anime/prompts/queue.tsv
echo "Candidates only; visual approval and frame coverage are required before promotion. Failures: $failed"
(( failed == 0 ))
