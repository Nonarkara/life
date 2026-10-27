"""Verify canonical first, then custom domain, against the exact release output."""
import concurrent.futures, hashlib, json, subprocess, time
from pathlib import Path
root = Path(__file__).resolve().parent.parent
build = json.loads((root / 'out/build.json').read_text())['build']
manifest = json.loads((root / 'out/course/anime/manifest.json').read_text())
paths = ['build.json','course/boot.js','course/game.bundle.js','course/course.css',
         'course/console.css','course/personal-console.css','course/economy.css',
         'course/fonts.js','course/settings.css','study/scene-study.bundle.js',
         'study/deck-edge.bundle.js','course/anime/manifest.json']
paths += ['course/anime/' + manifest['plates'][k].split('?')[0] for k in ['beat-lane','beat-bridge']]
paths += ['course/anime/' + p.split('?')[0] for p in manifest['sprites']['player-m'].values()]
assets = {p:hashlib.sha256((root/'out'/p).read_bytes()).hexdigest() for p in paths}
receipt = {'build':build,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'targets':{}}
for host in ['https://life-5wz.pages.dev','https://life.nonarkara.org']:
    attempts, consecutive = [], 0
    def probe(item):
        path, expected = item
        query = '?release='+build if path=='build.json' else '?v='+build
        r = subprocess.run(['curl','--compressed','--fail','--silent','--show-error','--max-time','35',host+'/'+path+query],capture_output=True)
        actual = hashlib.sha256(r.stdout).hexdigest()
        return {'path':path,'match':r.returncode==0 and actual==expected,'sha256':actual,'expected':expected}
    for attempt in range(8):
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            rows = list(pool.map(probe,assets.items()))
        attempts.append(rows)
        good = all(r['match'] for r in rows)
        consecutive = consecutive+1 if good else 0
        print(host,attempt+1,sum(r['match'] for r in rows),'/',len(rows),flush=True)
        if consecutive>=3: break
        time.sleep(3)
    receipt['targets'][host] = attempts
    if consecutive<3: raise SystemExit('Assets did not converge at '+host)
(root/'review/deck-release/public-assets.json').write_text(json.dumps(receipt,indent=2)+'\n')
