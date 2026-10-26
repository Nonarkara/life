#!/usr/bin/env python3
"""Cut the generated cel-animation art into stage plates and keyed sprite frames.

The character sheets arrive as painted panels on a pale ground. This finds the
panels, trims each figure to its ink outline, keys the ground away without
eating a white shirt, and writes small WebP files plus a manifest the runtime
reads.

Usage: python3 scripts/prepare-anime-assets.py [all|plates|sheets]
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SOURCE = Path("scratch/anime/src")
TARGET = Path("dist/course/anime")
SPRITE_HEIGHT = 400  # working height of a keyed figure, in pixels
PLATE_WIDTH = 1760   # working width of a painted plate, in pixels
GROUND_TOLERANCE = 26

# Panel names in reading order for each sheet: top-left, top-right, bottom-left,
# bottom-right. The runtime maps a game pose onto these names.
SHEETS = {
    "player": ["walk-a", "walk-b", "stand-a", "stand-b"],
    "player-b": ["sit-read", "sit-desk", "stand-paint", "kneel"],
    "mother": ["stand", "basket", "crouch", "cook"],
    "father": ["stand", "tool", "sit-desk", "walk"],
    "friend": ["stand", "walk", "sit", "wave"],
    "partner": ["stand", "walk", "sit", "wave"],
    "child": ["run", "stand", "crouch", "sit"],
    "elder": ["walk-stick", "stand", "sit", "kneel"],
    "player-c": ["punch", "dodge", "cheer", "lie"],
    "player-bike": ["ride", "ride-b", "push", "stand-bike"],
    "friend-b": ["ride", "ride-b", "push", "fold"],
    "child-b": ["ride", "ride-b", "read", "write"],
    "rival": ["wind", "hit", "stagger", "guard"],
}
# The layout of each sheet was checked against the drawings.
LAYOUTS = {name: "2x2" for name in SHEETS}
SOURCES = {
    "player": "sheet-player.jpg",
    "player-b": "sheet-player-b.png",
    "mother": "sheet-mother.jpg",
    "father": "sheet-father.png",
    "friend": "sheet-friend.jpg",
    "partner": "sheet-partner.jpg",
    "child": "sheet-child.jpg",
    "elder": "sheet-elder.png",
    "player-c": "sheet-player-c.jpg",
    "player-bike": "sheet-player-bike.jpg",
    "friend-b": "sheet-friend-b.jpg",
    "child-b": "sheet-child-b.jpg",
    "rival": "sheet-rival.png",
}
# Some sheets are not laid out as an even grid: the model drew them in its own
# arrangement. Their panels are written down here, in fractions of the sheet.
OVERRIDES = {
    "friend": [(0.00, 0.00, 0.26, 1.00), (0.50, 0.00, 0.75, 0.50),
               (0.26, 0.50, 0.50, 1.00), (0.75, 0.00, 1.00, 1.00)],
    "mother": [(0.00, 0.00, 0.24, 1.00), (0.24, 0.00, 0.46, 1.00),
               (0.46, 0.00, 0.70, 1.00), (0.70, 0.00, 1.00, 1.00)],
    "father": [(0.00, 0.00, 0.245, 1.00), (0.245, 0.00, 0.47, 1.00),
               (0.47, 0.00, 0.78, 1.00), (0.78, 0.00, 1.00, 1.00)],
    "player": [(0.00, 0.00, 0.26, 1.00), (0.26, 0.00, 0.52, 1.00),
               (0.52, 0.00, 0.74, 1.00), (0.74, 0.00, 1.00, 1.00)],
    "partner": [(0.00, 0.00, 0.22, 1.00), (0.22, 0.00, 0.41, 1.00),
                (0.41, 0.00, 0.66, 1.00), (0.66, 0.00, 1.00, 1.00)],
}
PLATES = {
    "home-morning": "home-day",
    "home-evening": "home-night",
    "soi-day": "street-day",
    "soi-dusk": "street-dusk",
    "school": "school",
    "work": "work",
    "garden": "garden",
    "stall": "stall",
    "plate-bedroom-morning": "bedroom-day",
    "plate-bedroom-night": "bedroom-night",
    "plate-court": "court",
    "plate-town": "town",
    "plate-street-night": "street-night",
    "plate-shop": "shop",
    "plate-hospital": "hospital",
    "plate-site": "site",
    "plate-abroad": "abroad",
    "plate-beat-court": "beat-court",
    "plate-beat-alley": "beat-alley",
    "plate-beat-classroom": "beat-classroom",
    "plate-beat-bridge": "beat-bridge",
    "plate-beat-lane": "beat-lane",
    "plate-beat-room": "beat-room",
}


def longest_runs(line):
    """The longest run of drawn pixels in each row or column."""
    if not line.any():
        return np.zeros(len(line), dtype=int)
    padded = np.concatenate([[False], line, [False]])
    changes = np.diff(padded.astype(np.int8))
    starts = np.where(changes == 1)[0]
    ends = np.where(changes == -1)[0]
    if len(starts) == 0:
        return np.zeros(len(line), dtype=int)
    lengths = ends - starts
    best = np.zeros(len(line), dtype=int)
    for start, length in zip(starts, lengths):
        best[start:start + length] = length
    return best


def rule_pixels(mask):
    """The ruled panel borders the model drew around each pose.

    A border is a straight line across a large part of the sheet, and it is
    thin. Only thin bands are taken out: a wide dark mass, such as a head of
    hair above an apron, is a drawing and not a rule, and it stays.
    """
    height, width = mask.shape
    rules = np.zeros(mask.shape, dtype=bool)

    def bands(indices):
        grouped = []
        for index in indices:
            if grouped and index == grouped[-1][1] + 1:
                grouped[-1][1] = index
            else:
                grouped.append([index, index])
        return grouped

    horizontal = longest_runs(mask, axis=1)
    limit = max(2, int(height * 0.02))
    for band in bands(np.where(horizontal > width * 0.35)[0]):
        if band[1] - band[0] + 1 > limit:
            continue
        for y in range(band[0], band[1] + 1):
            rules[y] |= mask[y]
    vertical = longest_runs(mask.T, axis=1)
    limit = max(2, int(width * 0.02))
    for band in bands(np.where(vertical > height * 0.35)[0]):
        if band[1] - band[0] + 1 > limit:
            continue
        for x in range(band[0], band[1] + 1):
            rules[:, x] |= mask[:, x]
    return rules


def longest_runs(block, axis=1):
    """The longest unbroken run of drawn pixels along each line of a block."""
    data = block if axis == 1 else block.T
    lines = data.shape[0]
    out = np.zeros(lines, dtype=int)
    for index in range(lines):
        line = data[index]
        if not line.any():
            continue
        padded = np.concatenate([[False], line, [False]])
        changes = np.diff(padded.astype(np.int8))
        starts = np.where(changes == 1)[0]
        ends = np.where(changes == -1)[0]
        if len(starts):
            out[index] = int((ends - starts).max())
    return out


def panels(mask, layout="2x2"):
    """Split a sheet into its painted panels.

    Each cut is slid into the emptiest place near its nominal position, so no
    cut lands on a figure.
    """
    height, width = mask.shape
    if layout == "1x4":
        cuts_x, cuts_y = [width // 4, width // 2, 3 * width // 4], []
    elif layout == "4x1":
        cuts_x, cuts_y = [], [height // 4, height // 2, 3 * height // 4]
    else:
        cuts_x, cuts_y = [width // 2], [height // 2]

    def slide(cut, vertical):
        span = width if vertical else height
        half = max(8, int(span * 0.08))
        best, best_score = cut, None
        for position in range(max(0, cut - half), min(span, cut + half)):
            band = mask[:, position - 3:position + 4] if vertical else mask[position - 3:position + 4, :]
            score = int(band.sum())
            if best_score is None or score < best_score:
                best, best_score = position, score
        return best

    cuts_x = [slide(cut, True) for cut in cuts_x]
    cuts_y = [slide(cut, False) for cut in cuts_y]
    xs = [0] + list(cuts_x) + [width]
    ys = [0] + list(cuts_y) + [height]
    boxes = []
    for row in range(len(ys) - 1):
        for column in range(len(xs) - 1):
            window = mask[ys[row]:ys[row + 1], xs[column]:xs[column + 1]]
            if not window.any():
                continue
            found = np.where(window)
            boxes.append([xs[column] + int(found[1].min()), ys[row] + int(found[0].min()),
                          xs[column] + int(found[1].max()) + 1, ys[row] + int(found[0].max()) + 1])
    return boxes, cuts_x, cuts_y


def figure_boxes(mask):
    """Find the drawn figures on a sheet.

    The model draws the poses in a loose grid, and a figure often spills over
    the line of its own panel. Cutting on a fixed grid therefore cuts through
    people. Instead the figures are found: connected pieces are joined into
    bodies, the bodies are put back in reading order, and each body is cropped
    where it was drawn.
    """
    height, width = mask.shape
    labels, _ = ndimage.label(mask)
    slices = ndimage.find_objects(labels)
    parts = []
    for index, window in enumerate(slices):
        if window is None:
            continue
        ys, xs = window
        box = [int(xs.start), int(ys.start), int(xs.stop), int(ys.stop)]
        area = (box[2] - box[0]) * (box[3] - box[1])
        drawn = int((labels[ys, xs] == index + 1).sum())
        # A ruled panel border is a long thin line, not a body.
        thin = min(box[2] - box[0], box[3] - box[1]) <= 10
        long_line = max(box[2] - box[0], box[3] - box[1]) > width * 0.15
        if thin and long_line and drawn < area * 0.6:
            continue
        if drawn < mask.size * 0.0008:
            continue
        parts.append(box)
    if len(parts) < 2:
        return []
    # Join the pieces of one body. The pieces are found through a coarse
    # spatial grid rather than by comparing every pair, so a sheet full of
    # bicycle spokes does not turn the join into a search over all pairs.
    cell = max(8, int(max(width, height) * 0.05))
    buckets = {}
    for index, box in enumerate(parts):
        for cx in range(box[0] // cell, box[2] // cell + 1):
            for cy in range(box[1] // cell, box[3] // cell + 1):
                buckets.setdefault((cx, cy), []).append(index)

    def close(a, b):
        gap_x = max(a[0] - b[2], b[0] - a[2])
        gap_y = max(a[1] - b[3], b[1] - a[3])
        return gap_x < width * 0.04 and gap_y < height * 0.04

    parent = list(range(len(parts)))

    def find(index):
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    for (bx, by), members in buckets.items():
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                others = members if (dx == 0 and dy == 0) else buckets.get((bx + dx, by + dy), [])
                for i in members:
                    for j in others:
                        if i != j and close(parts[i], parts[j]):
                            ri, rj = find(i), find(j)
                            if ri != rj:
                                parent[max(ri, rj)] = min(ri, rj)
    families = {}
    for index, box in enumerate(parts):
        families.setdefault(find(index), []).append(box)
    parts = [[min(b[0] for b in family), min(b[1] for b in family),
              max(b[2] for b in family), max(b[3] for b in family)] for family in families.values()]
    if len(parts) < 2:
        return []
    # Cluster every piece into four bodies: a chair, a desk or a bicycle
    # belongs to the figure it stands beside, not to a body of its own.
    def centre(box):
        return ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)

    seeds = sorted(range(len(parts)), key=lambda i: (parts[i][2] - parts[i][0]) * (parts[i][3] - parts[i][1]), reverse=True)[:4]
    groups = [[parts[i]] for i in seeds]
    centres = [centre(group[0]) for group in groups]
    for box in parts:
        if any(box is group[0] for group in groups):
            continue
        point = centre(box)
        nearest = min(range(len(groups)), key=lambda i: abs(centres[i][0] - point[0]) + abs(centres[i][1] - point[1]))
        groups[nearest].append(box)
    bodies = []
    for group in groups:
        if not group:
            continue
        bodies.append([min(b[0] for b in group), min(b[1] for b in group),
                       max(b[2] for b in group), max(b[3] for b in group)])
    # Reading order: the upper pair first, then the lower pair.
    centres = sorted(((b[1] + b[3]) / 2, (b[0] + b[2]) / 2, b) for b in bodies)
    middle = len(centres) // 2
    upper = sorted(centres[:middle], key=lambda c: c[1])
    lower = sorted(centres[middle:], key=lambda c: c[1])
    return [box for _, _, box in upper + lower]


def panel_boxes(mask, content, name=''):
    """The four poses on a sheet, found from the sheet itself.

    Some sheets carry the borders the model drew around each pose. Those
    borders are the truest division of the sheet, so they are used when they
    are there. The rest are divided by the halves of the sheet, and a piece
    that is drawn across a half belongs to the half its body is in.
    """
    height, width = mask.shape
    row_runs = longest_runs(content, axis=1)
    column_runs = longest_runs(content.T, axis=1)
    rows = [y for y in range(height) if row_runs[y] > width * 0.6]
    columns = [x for x in range(width) if column_runs[x] > height * 0.6]

    def bands(indices):
        grouped = []
        for index in indices:
            if grouped and index == grouped[-1][1] + 1:
                grouped[-1][1] = index
            else:
                grouped.append([index, index])
        return [(first + last) // 2 for first, last in grouped]

    cuts_x = bands(columns)
    cuts_y = bands(rows)
    if len(cuts_x) != 1 or len(cuts_y) != 1:
        cuts_x = [width // 2]
        cuts_y = [height // 2]
    written = OVERRIDES.get(name)
    if written:
        cells = [(int(x0 * width), int(y0 * height), int(x1 * width), int(y1 * height))
                 for x0, y0, x1, y1 in written]
    else:
        edges_x = [0] + cuts_x + [width]
        edges_y = [0] + cuts_y + [height]
        cells = [(edges_x[column], edges_y[row], edges_x[column + 1], edges_y[row + 1])
                 for row in range(len(edges_y) - 1) for column in range(len(edges_x) - 1)]

    labels, _ = ndimage.label(mask)
    slices = ndimage.find_objects(labels)
    pieces = []
    for index, window in enumerate(slices):
        if window is None:
            continue
        ys, xs = window
        box = [int(xs.start), int(ys.start), int(xs.stop), int(ys.stop)]
        area = (box[2] - box[0]) * (box[3] - box[1])
        drawn = int((labels[ys, xs] == index + 1).sum())
        thin = min(box[2] - box[0], box[3] - box[1]) <= 10
        long_line = max(box[2] - box[0], box[3] - box[1]) > width * 0.15
        if thin and long_line and drawn < area * 0.6:
            continue
        if drawn < mask.size * 0.0008:
            continue
        pieces.append(box)

    panels = []
    for left, top, right, bottom in cells:
        inside = [box for box in pieces
                  if left <= (box[0] + box[2]) / 2 < right and top <= (box[1] + box[3]) / 2 < bottom]
        if not inside:
            continue
        panels.append([min(box[0] for box in inside), min(box[1] for box in inside),
                       max(box[2] for box in inside), max(box[3] for box in inside)])
    return panels


def grid_boxes(mask):
    """The even grid, used when the figures cannot be found."""
    height, width = mask.shape
    return [[0, 0, width // 2, height // 2], [width // 2, 0, width, height // 2],
            [0, height // 2, width // 2, height], [width // 2, height // 2, width, height]]


def fill_rules(rgb, ruled):
    """Take the ruled lines out of the drawing without cutting the figures.

    A long straight line is removed from the picture, but it is filled with
    the colour around it rather than left as a hole. A panel border therefore
    disappears into the ground, while a line that happens to cross a figure
    is closed up instead of cutting the body in two.
    """
    valid = (~ruled).astype(np.float32)
    kernel = np.ones((9, 9))
    filled = rgb.astype(np.float32).copy()
    for channel in range(3):
        plane = rgb[:, :, channel].astype(np.float32) * valid
        total = ndimage.convolve(plane, kernel, mode='nearest')
        count = ndimage.convolve(valid, kernel, mode='nearest')
        filled[:, :, channel] = np.where(count > 0, total / np.maximum(count, 1), rgb[:, :, channel])
    cleaned = rgb.copy()
    cleaned[ruled] = np.clip(filled[ruled], 0, 255).astype(np.uint8)
    return cleaned


def sheet_ground(rgb):
    """The colour of the pale ground the sheet was drawn on."""
    edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    return np.median(edge, axis=0)


def key_background(rgb, ground):
    """Cut a figure out of its ground.

    The drawn parts are the ink and the colour; the ground is everything the
    same pale tone as the sheet. The drawn parts are closed up and filled, so
    the pale ground around the figure stays out and the pale ground inside it
    (a white shirt) stays in.
    """
    distance = np.abs(rgb.astype(np.int32) - ground).max(axis=2)
    drawn = distance >= GROUND_TOLERANCE
    solid = ndimage.binary_fill_holes(ndimage.binary_closing(drawn, structure=np.ones((7, 7))))
    alpha = np.zeros(solid.shape, dtype=np.uint8)
    alpha[solid] = 255
    # A soft edge where the line work was drawn thin.
    edge = ndimage.binary_dilation(solid, structure=np.ones((3, 3))) & ~solid
    pale = rgb.min(axis=2) >= 200
    alpha[edge & pale] = 140
    return alpha


def prepare_sheet(name):
    image = Image.open(SOURCE / SOURCES[name]).convert("RGB")
    rgb = np.asarray(image)
    content = rgb.min(axis=2) < 236
    ruled = rule_pixels(content)
    content = content & ~ruled
    boxes = panel_boxes(content & ~ruled, content, name)
    if len(boxes) != len(SHEETS[name]):
        print(f"  ! {name}: panels found {len(boxes)}, expected {len(SHEETS[name])}", flush=True)
        boxes = figure_boxes(content & ~ruled)
        if len(boxes) != len(SHEETS[name]):
            print(f"  ! {name}: found {len(boxes)} figures, expected {len(SHEETS[name])}", flush=True)
            boxes = grid_boxes(content)
    # A ruled panel border that touches a figure would close the pale ground
    # around it and hide the body, so the rules are taken out of the picture.
    cleaned = fill_rules(rgb, ruled)
    ground = sheet_ground(cleaned)
    frames = []
    for index, box in enumerate(boxes[:len(SHEETS[name])]):
        left, top, right, bottom = box
        cell = cleaned[top:bottom, left:right]
        alpha = key_background(cell, ground)
        drawn = alpha > 128
        if not drawn.any():
            print(f"  ! {name} panel {index}: nothing left to draw", flush=True)
            continue
        ys, xs = np.where(drawn)
        pad = 4
        rows = slice(max(0, int(ys.min()) - pad), int(ys.max()) + pad + 1)
        columns = slice(max(0, int(xs.min()) - pad), int(xs.max()) + pad + 1)
        out = Image.fromarray(np.dstack([cell[rows, columns], alpha[rows, columns]]))
        scale = SPRITE_HEIGHT / out.height
        out = out.resize((max(1, round(out.width * scale)), SPRITE_HEIGHT), Image.LANCZOS)
        file = f"sprites/{name}-{SHEETS[name][index]}.webp"
        out.save(TARGET / file, "WEBP", quality=82, method=4)
        frames.append((SHEETS[name][index], file))
    return frames


def prepare_plate(name, key):
    jpg = SOURCE / f"{name}.jpg"
    image = Image.open(jpg if jpg.exists() else SOURCE / f"{name}.png").convert("RGB")
    if image.width > PLATE_WIDTH:
        image = image.resize((PLATE_WIDTH, round(image.height * PLATE_WIDTH / image.width)), Image.LANCZOS)
    file = f"plates/{key}.webp"
    image.save(TARGET / file, "WEBP", quality=68, method=2)
    return file


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else "all"
    (TARGET / "plates").mkdir(parents=True, exist_ok=True)
    (TARGET / "sprites").mkdir(parents=True, exist_ok=True)
    manifest_path = TARGET / "manifest.json"
    manifest = {"plates": {}, "sprites": {}}
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text())
    if only in ("all", "plates"):
        for source, key in PLATES.items():
            manifest["plates"][key] = prepare_plate(source, key)
            print(f"plate {key}", flush=True)
    if only in ("all", "sheets"):
        for name in SHEETS:
            manifest["sprites"][name] = dict(prepare_sheet(name))
            print(f"sheet {name}: {', '.join(n for n, _ in manifest['sprites'][name].items())}", flush=True)
    manifest_path.write_text(json.dumps(manifest, indent=1) + "\n")
    total = sum(path.stat().st_size for path in TARGET.rglob("*") if path.is_file())
    print(f"assets: {total/1024:.0f} kB in {TARGET}")


if __name__ == "__main__":
    main()
