#!/bin/zsh
# Generate the art listed in art/missing-art-requests.json with local FLUX.1-schnell (mflux).
# Each request is generated once; an existing file is skipped, so the run can be resumed.
# Usage: scripts/generate-missing-art.sh [only-this-output-file]
set -u
cd "${0:A:h}/.."
GEN=~/Projects/_toolkit/mflux-venv/bin/mflux-generate
OUT=scratch/anime/src
mkdir -p "$OUT" scratch/anime/prompts
python3 - "$@" <<'PY' > scratch/anime/prompts/queue.tsv
import json,sys,zlib
for r in json.load(open('art/missing-art-requests.json'))['requests']:
    if len(sys.argv)>1 and r['output_file']!=sys.argv[1]:continue
    w,h=(2016,864) if r['aspect_ratio']=='21:9' else (1536,864)
    open(f"scratch/anime/prompts/{r['output_file']}.txt",'w').write(r['prompt'])
    print(f"{r['output_file']}\t{w}\t{h}\t{zlib.crc32(r['output_file'].encode())%100000}")
PY
while IFS=$'\t' read -r file w h seed; do
  [[ -f "$OUT/$file" && "$file" != sheet-rival.png ]] && continue
  [[ "$file" == sheet-rival.png && -f "$OUT/.rival-regenerated" ]] && continue
  echo "$(date +%T) $file"
  "$GEN" --model schnell --steps 4 --seed "$seed" --width "$w" --height "$h" \
    --prompt-file "scratch/anime/prompts/$file.txt" --output "$OUT/$file" >/dev/null 2>>scratch/anime/prompts/errors.log \
    && { [[ "$file" == sheet-rival.png ]] && touch "$OUT/.rival-regenerated"; } \
    || echo "  failed: $file"
done < scratch/anime/prompts/queue.tsv
echo "done"
