"""Check actual navigation URLs as well as build-scoped release probes."""
import concurrent.futures, hashlib, json, re, subprocess, time
from pathlib import Path
from urllib.parse import urljoin

root = Path(__file__).resolve().parent.parent
build = json.loads((root/'out/build.json').read_text())['build']
html = (root/'out/course/index.html').read_bytes()
refs = re.findall(r'(?:href|src)="([^"\s]+\.(?:css|js)\?v=[^"\s]+)"', html.decode())
assets = {urljoin('/course/', p): (root/'out/course'/p.split('?')[0]).read_bytes() for p in refs if not p.startswith('http')}
assets['/course/game.bundle.js?v='+build] = (root/'out/course/game.bundle.js').read_bytes()
receipt = {'build':build,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'targets':{}}

def get(url, expected):
    # Keep headers apart from the binary body; retain redirect and final URL evidence.
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        hdr, body = Path(d)/'headers', Path(d)/'body'
        r = subprocess.run(['curl','--location','--compressed','--fail','--silent','--show-error','--max-time','35','--dump-header',str(hdr),'--output',str(body),'--write-out','%{http_code}\n%{url_effective}',url],capture_output=True,text=True)
        raw = body.read_bytes() if body.exists() else b''
        blocks = re.split(r'\r?\n\r?\n',hdr.read_text() if hdr.exists() else '')
        headers = [b for b in blocks if b.startswith('HTTP/')]
        final = headers[-1] if headers else ''
        fields = {k.strip().lower():v.strip() for k,v in (line.split(':',1) for line in final.splitlines()[1:] if ':' in line)}
        result = r.stdout.splitlines()
        return {'url':url,'status':result[0] if result else None,'finalURL':result[-1] if len(result)>1 else None,'headers':fields,'redirects':max(0,len(headers)-1),'match':r.returncode==0 and raw==expected,'sha256':hashlib.sha256(raw).hexdigest(),'expected':hashlib.sha256(expected).hexdigest()}

for host in ['https://life-5wz.pages.dev','https://life.nonarkara.org']:
    target={'probes':[],'entries':[],'assets':[]}; streak=0
    for attempt in range(8):
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            rows=list(pool.map(lambda kv:get(host+kv[0]+'&probe='+str(attempt),kv[1]),assets.items()))
        target['probes'].append(rows)
        streak=streak+1 if all(r['match'] for r in rows) else 0
        if streak>=3: break
        time.sleep(3)
    assert streak>=3, host+' convergence failed'
    # These are the user's URLs, without a verification query or no-cache override.
    for path in ['/course/','/course/index.html']:
        row=get(host+path,html); target['entries'].append(row)
        assert row['match'],host+path+' stale entry'
        assert row['headers'].get('content-type','').startswith('text/html')
        assert 'no-store' in row['headers'].get('cache-control',''),row
    row=get(host+'/build.json',(root/'out/build.json').read_bytes());target['entries'].append(row)
    assert row['match'] and 'no-store' in row['headers'].get('cache-control','')
    for path, expected in assets.items():
        for url in [host+path,host+path.split('?')[0]]:
            row=get(url,expected);target['assets'].append(row)
            assert row['match'],url+' stale asset'
    receipt['targets'][host]=target
    print(host,'PASS: direct entries, headers,',len(target['assets']),'asset URLs',flush=True)
(root/'review/preview-freshness/public-delivery.json').write_text(json.dumps(receipt,indent=2)+'\n')
