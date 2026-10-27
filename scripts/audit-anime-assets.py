"""Inspect delivery cost, not machine RAM usage. No image generation or rewriting."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'dist/course/anime'
manifest = json.loads((root / 'manifest.json').read_text())
paths = set(manifest.get('plates', {}).values())
paths.update(path for frames in manifest.get('sprites', {}).values() for path in frames.values())
rows = []
for relative in sorted(paths):
    path = root / relative.split('?', 1)[0]
    with Image.open(path) as source:
        width, height = source.size
    rows.append({'path': relative, 'downloadBytes': path.stat().st_size,
                 'width': width, 'height': height, 'estimatedRgbaBytes': width * height * 4})
print(json.dumps({'scope': 'unique manifest-referenced images; not measured browser RSS',
                  'images': len(rows), 'downloadBytes': sum(r['downloadBytes'] for r in rows),
                  'estimatedRgbaBytes': sum(r['estimatedRgbaBytes'] for r in rows),
                  'largestDecoded': sorted(rows, key=lambda r: r['estimatedRgbaBytes'], reverse=True)[:3]}, indent=2))
