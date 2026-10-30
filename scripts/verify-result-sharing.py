"""Verify direct intake/new sharing modules against the released local bytes."""
import concurrent.futures, hashlib, json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
build=json.loads((root/'out/build.json').read_text())['build']
paths=['/intake/','/intake/intake.js','/course/birthcode.js','/course/share-result.js','/study/share-result.html']
def check(item):
 host,path=item;local=root/'out'/path.lstrip('/');local=local/'index.html' if path.endswith('/') else local
 expected=local.read_bytes();url=host+path
 response=subprocess.run(['curl','--fail','--location','--compressed','--silent','--show-error','--max-time','35',url],capture_output=True)
 return {'url':url,'match':response.returncode==0 and response.stdout==expected,'sha256':hashlib.sha256(response.stdout).hexdigest(),'expected':hashlib.sha256(expected).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 rows=list(pool.map(check,[(host,path)for host in ['https://life.nonarkara.org','https://life-5wz.pages.dev']for path in paths]))
receipt={'build':build,'checks':rows};dest=root/'review/daily-share/share-delivery.json';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(receipt,indent=2)+'\n')
assert all(row['match']for row in rows),json.dumps(receipt,indent=2)
print('Both public hosts match intake, birth code, sharing module and readonly result fixture.')
