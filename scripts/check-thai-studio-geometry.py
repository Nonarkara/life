"""Bounded task geometry, not visual approval. Reject the observed pre-pager failure."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
folder = root / 'review/thai-studio'
expected = {
    'urgent-844': (844, 390), 'urgent-1024': (1024, 768),
    'urgent-1440': (1440, 900), 'pressure-1440': (1440, 900),
    'pressure-390': (390, 844), 'quiet-390': (390, 844),
    'thai-xl-context-390': (390, 844), 'thai-xl-choices-390': (390, 844),
}

def fits(box, area, tolerance=1):
    return box and box['width'] > 0 and box['height'] > 0 and (
        box['x'] >= area.get('x', 0)-tolerance and box['y'] >= area.get('y', 0)-tolerance
        and box['right'] <= area['right']+tolerance and box['bottom'] <= area['bottom']+tolerance)

def problems(case):
    errors = []
    view, page, dialog = case['viewport'], case['page'], case['dialog']
    width, height = view['width'], view['height']
    area = {'right': width, 'bottom': height}
    if page['width'] > width+1 or page['height'] > height+1:
        errors.append('page bleeds')
    if not fits(dialog, area):
        errors.append('dialog outside viewport')
    action = case.get('primary', {}).get('box')
    if action is None:
        action = next((c['box'] for c in case.get('choices', []) if not c['disabled']), None)
    if not fits(action, dialog):
        errors.append('first useful action clipped or missing')
    if action and width < 1280 and width > height:
        groups = case.get('groups', [])
        if groups and not any(fits(action, group['box']) for group in groups):
            errors.append('action clipped by its own reading region')
    if width < 1280:
        budget = height / (3 if height >= width else 5)
        if abs(dialog['height']-budget) > 1:
            errors.append('fixed RPG budget changed')
        if case['world']['bottom'] > dialog['y']+1:
            errors.append('world behind controls')
        if case['world']['height'] <= dialog['height']:
            errors.append('world became a thumbnail')
    else:
        if dialog['width'] > 460.5 or abs(dialog['right']-(width-16)) > 1:
            errors.append('desktop dialog expanded or lost its exit anchor')
    return errors

cases = json.loads((folder/'geometry.json').read_text())
assert {c['name'] for c in cases} == set(expected), 'missing or duplicate case names'
assert len(cases) == len(expected), 'duplicate captures'
for case in cases:
    size = case['viewport']
    assert (size['width'], size['height']) == expected[case['name']], 'wrong actual viewport: '+case['name']
    assert case['build'] == json.loads((root/'out/build.json').read_text())['build'], 'stale runtime: '+case['name']
    errors = problems(case)
    assert not errors, case['name']+': '+', '.join(errors)
    print('PASS', case['name'])
old = json.loads((folder/'before-xl.json').read_text())
assert 'first useful action clipped or missing' in problems(old), 'old observed defect must fail the same gate'
print('PASS falsifier: pre-pager action is rejected')
