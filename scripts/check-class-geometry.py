"""Check captured task geometry; snapshots must come from the real browser."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent/'review/class-audit'
def issues(g):
 v=g['viewport'];w=g['world'];c=g['console'];a=g['action'];errors=[]
 if g['page']['width']>v['width']+1 or g['page']['height']>v['height']+1:errors.append('page overflow')
 if not w or not c or w['bottom']>c['y']+1:errors.append('world/control overlap')
 if not a or a['bottom']>v['height']+1:errors.append('advance action outside first screen')
 if v['width']>=1280:
  if c['height']>v['height']*.36+1:errors.append('desktop dock exceeds task budget')
  if g.get('set') and g['set']['width']>361:errors.append('editor stretched beyond its task')
 else:
  ratio=1/3 if v['height']>v['width'] else 1/5
  if abs(c['height']-v['height']*ratio)>1:errors.append('phone dock proportion')
  for key in ['forecast','measure']:
   if not g.get(key) or g[key]['bottom']>c['bottom']+1:errors.append(key+' outside first view')
  if v['height']>v['width'] and w['height']<=c['height']:errors.append('scene is not primary')
 return errors
cases={'geometry-after-1280.json':(1280,720),'geometry-after-1440.json':(1440,900),'geometry-after-1024.json':(1024,768),'geometry-after-390.json':(390,844),'geometry-phone-thai-extra.json':(390,844),'geometry-landscape-844.json':(844,390),'geometry-adult-1440.json':(1440,900)}
for name,expected in cases.items():
 g=json.loads((root/name).read_text());assert (g['viewport']['width'],g['viewport']['height'])==expected,(name,'wrong actual viewport');errors=issues(g);assert not errors,(name,errors);print(name,'PASS')
before=json.loads((root/'geometry-before.json').read_text());assert 'world/control overlap' in issues(before),'the recorded old overlap must fail the same gate'
print('Old overlap rejected by the same task gate. Pixel quality requires separate review.')
