import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

test('catalogue art fails closed before writes when frame approvals are missing',()=>{
 const result=spawnSync('python3',['-c',String.raw`
from pathlib import Path
from tempfile import TemporaryDirectory
import os, runpy, sys, types

# Approval/preflight runs before image processing. This contract needs only the
# Python standard library, not the offline art author's numerical dependencies.
def unexpected_decode(*args, **kwargs):
    raise AssertionError('image decoding reached before approval validation')
sys.modules['numpy']=types.ModuleType('numpy')
pil=types.ModuleType('PIL'); pil.Image=types.SimpleNamespace(open=unexpected_decode)
sys.modules['PIL']=pil
scipy=types.ModuleType('scipy'); scipy.ndimage=types.ModuleType('scipy.ndimage')
sys.modules['scipy']=scipy

source=Path('scripts/prepare-anime-assets.py').resolve()
current=runpy.run_path(str(source))
g=current['prepare_sheet'].__globals__
assert len(g['CATALOG_SHEETS']) == 18
assert len(set(g['SHEETS']) - g['CATALOG_SHEETS']) == 12
assert 'player-a' in __import__('json').loads(Path('dist/course/anime/manifest.json').read_text())['sprites']
assert g['approved_frames']('grandmother') == {'stand','basket','cook'}
assert 'crouch' not in g['approved_frames']('grandmother')
assert g['approved_frames']('player') is None  # older cast remains supported
for name in g['CATALOG_SHEETS']:
    assert g['approved_frames'](name)

with TemporaryDirectory() as tmp:
    # No approval file in this clean working directory; no image should be opened.
    os.chdir(tmp)
    missing=runpy.run_path(str(source))
    mg=missing['prepare_sheet'].__globals__
    assert mg['FRAME_APPROVALS'] == {}
    for name in ['grandmother','player-m']:
        try:
            mg['prepare_sheet'](name)
        except ValueError as error:
            assert 'Missing frame approval' in str(error)
        else:
            raise AssertionError('missing approval published '+name)
    mg['sys'].argv=['prepare-anime-assets.py','all']
    try:
        mg['main']()
    except ValueError as error:
        assert 'Missing frame approval' in str(error)
    else:
        raise AssertionError('missing batch approvals accepted')
    assert not mg['TARGET'].exists(), 'batch must fail before creating outputs'
    # Legacy-only and plate-only targets remain usable without catalogue approvals,
    # and a retained legacy manifest group is not erased by preflight.
    mg['TARGET'].mkdir(parents=True)
    manifest=mg['TARGET']/'manifest.json'
    legacy={'plates':{},'sprites':{'player-a':{'stand':'sprites/player-a.webp'}}}
    manifest.write_text(__import__('json').dumps(legacy))
    for target in ['player','plates']:
        mg['sys'].argv=['prepare-anime-assets.py',target]
        mg['main']()
        assert __import__('json').loads(manifest.read_text()) == legacy

os.chdir(source.parent.parent)
# A valid file with one missing entry must be rejected just like a missing file.
g['FRAME_APPROVALS'].pop('grandmother')
try:
    g['prepare_sheet']('grandmother')
except ValueError as error:
    assert 'Missing frame approval for grandmother' in str(error)
else:
    raise AssertionError('missing catalogue entry accepted')
assert g['approved_frames']('player') is None
for invalid in [[], ['unreviewed-pose'], 'stand']:
    g['FRAME_APPROVALS']['grandmother']=invalid
    try:
        g['prepare_sheet']('grandmother')
    except ValueError as error:
        assert 'Invalid frame approval' in str(error)
    else:
        raise AssertionError('invalid catalogue approval accepted')
print('PASS: 18 catalogue groups, 12 processable legacy groups plus retained player-a, missing file/entry and withheld crouch')
`],{encoding:'utf8',timeout:60000});
 assert.equal(result.status,0,result.stderr||result.stdout);
 assert.match(result.stdout,/PASS: 18 catalogue groups/);
});
