"""Offline authoring: turn the measured reference linework into clean, detailed SVG silhouettes.

Requires Pillow, numpy, OpenCV. The source PNG never enters the production bundle.
Run compare first to establish uniform source coordinates and content exclusions.
"""
from pathlib import Path
import json
import sys

local_packages = Path(".visual-check/python").resolve()
if local_packages.is_dir():
    sys.path.insert(0, str(local_packages))
import numpy as np
from PIL import Image
import cv2

base = Path(".visual-check/comparison-before")
destination = Path("src/artwork")
destination.mkdir(parents=True, exist_ok=True)
nodes = {
    "projects": [("recent",508,170,57), ("prototype",350,288,54), ("gameplay",742,288,58), ("shader",242,534,57), ("featured",746,542,64)],
    "tools": [("unity",105,442,33), ("unreal",355,442,33), ("glsl",704,378,33), ("csharp",123,581,32), ("cpp",369,597,34), ("hlsl",655,541,33), ("git",842,617,32), ("webgl",156,724,34), ("tools",399,765,34), ("workflow",625,711,33), ("experiments",841,783,33)],
}
anchors = {}
stem_field = None
evidence = {"method": "measured variable-width silhouettes, smoothed vector boundaries, controlled detail and core contrast", "frame": {"width":1000,"height":870}, "networks": {}}


def number(value):
    return f"{value:.2f}".rstrip("0").rstrip(".") if value else "0"


def contour_path(contour):
    # Smooth the geometry along each boundary; no browser blur and no
    # uniform-width replacement of the reference's expressive silhouettes.
    points = contour.reshape(-1,2).astype(np.float32)/4+.125
    if len(points)<3: return ""
    closed = np.concatenate([points,points[:1]])
    lengths = np.linalg.norm(np.diff(closed,axis=0),axis=1)
    cumulative = np.concatenate([[0],np.cumsum(lengths)])
    if cumulative[-1]<3: return ""
    samples = np.arange(0,cumulative[-1],.5)
    points = np.column_stack([np.interp(samples,cumulative,closed[:,i]) for i in [0,1]])
    offsets = np.arange(-6,7)
    weights = np.exp(-.5*(offsets/2)**2); weights /= weights.sum()
    points = sum(weight*np.roll(points,int(offset),axis=0) for offset,weight in zip(offsets,weights))
    points = cv2.approxPolyDP(points.astype(np.float32).reshape(-1,1,2),.2,True).reshape(-1,2)
    if len(points)<3: return ""
    midpoint = (points[-1]+points[0])/2
    command = f"M{number(midpoint[0])},{number(midpoint[1])}"
    for i,point in enumerate(points):
        following = points[(i+1)%len(points)]
        end = (point+following)/2
        command += f"Q{number(point[0])},{number(point[1])} {number(end[0])},{number(end[1])}"
    return command+"Z"


def contours_path(mask):
    # Padding carries stems past the frame before fitting their outlines.
    padded = np.pad(mask,((3,3),(0,0)),mode="edge")
    enlarged = cv2.resize(padded,None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST)
    contours,_ = cv2.findContours(enlarged,cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
    commands = []
    for contour in contours:
        contour[:,:,1] -= 12
        command = contour_path(contour)
        if command: commands.append(command)
    return "".join(commands)

for section in ["projects", "tools"]:
    rgb = np.asarray(Image.open(base / f"{section}-source.png").convert("RGB"), dtype=np.float32)
    allowed = np.asarray(Image.open(base / f"{section}-allowed.png").convert("L")) > 0
    if section == "projects":
        # Restore the stem behind the scroll button; the comparison excludes the footer.
        allowed[740:, 460:536] = True
        yy,xx = np.indices(allowed.shape)
        allowed[np.hypot(xx-505,yy-828) < 38] = False
    luminance = rgb @ np.array([.2126,.7152,.0722], dtype=np.float32)
    padded = np.pad(luminance, 6, mode="edge")
    neighbors = [padded[6+dy:876+dy,6+dx:1006+dx] for dx,dy in [(-6,0),(6,0),(0,-6),(0,6),(-6,-6),(6,-6),(-6,6),(6,6)]]
    background = np.median(np.stack(neighbors), axis=0)
    difference = background-luminance if section == "projects" else luminance-background
    denominator = np.maximum(1, background-38 if section == "projects" else 190-background)
    normalized = np.clip(difference / denominator, 0, 1)
    # Recover the original branch tips that the comparison's padded node mask
    # excluded. Keep one pixel under the target ring for exact SVG clipping;
    # do not invent straight connectors across this gap.
    calibrated_allowed = allowed.copy()
    yy,xx = np.indices(allowed.shape)
    for identifier,x,y,radius in nodes[section]:
        distance = np.hypot(xx-x,yy-y)
        tip_radius = radius-1 if section == "projects" else radius+8
        allowed |= (distance >= tip_radius) & (distance < radius+14)
        # Node ring markers are UI decorations, not branch endpoints.
        for dot_x,dot_y in [(x,y-radius-2),(x-radius-1,y)]:
            allowed[np.hypot(xx-dot_x,yy-dot_y) < 5] = False
    binary = np.uint8((difference > 7) & allowed)
    count, labels, statistics, centers = cv2.connectedComponentsWithStats(binary, 8)
    kept = np.zeros_like(binary)
    linework = np.zeros_like(binary)
    marks = []
    for label in range(1,count):
        x,y,w,h,area = statistics[label]
        # Reject isolated glyph leftovers; retain long linework and compact technical marks.
        line = area >= 55 and max(w,h) >= 24
        dot = 7 <= area <= 65 and 3 <= w <= 9 and 3 <= h <= 9 and .55 <= w/h <= 1.8
        # The source ring markers can sit beyond the authored radius because
        # its circles and our UI circles have slightly different silhouettes.
        # Remove only isolated compact marks near the top/left ring positions;
        # preserve connected branch contours in the same area.
        cx,cy = centers[label]
        ring_marker = dot and any(
            np.hypot(cx-nx,cy-(ny-nr)) < 18 or
            np.hypot(cx-(nx-nr),cy-ny) < 18
            for _,nx,ny,nr in nodes[section]
        )
        # Restored pixels must belong to existing linework, not isolated glyphs
        # or circle decorations inside the comparison mask.
        attached = np.any(calibrated_allowed[labels == label])
        if (line or dot) and attached and not ring_marker:
            kept[labels == label] = 1
            if line: linework[labels == label] = 1
            if dot: marks.append({"x":round(float(centers[label,0]),1), "y":round(float(centers[label,1]),1)})
    # Derive both sets of stem silhouettes from one shared reference sample. The
    # measured field is shared before fitting the curved vector boundaries.
    if section == "projects":
        stem_field = (normalized*kept)[710:771,482:535].copy()
        for y in range(770,870):
            phase = (y-770) % 120
            sample = 60-phase if phase <= 60 else phase-60
            normalized[y,482:535] = stem_field[sample]
            kept[y,482:535] = stem_field[sample] > 0
    else:
        original = (normalized*kept)[:110,482:535].copy()
        for y in range(110):
            # Root row zero repeats the last tree row, with no gap at the seam.
            phase = (99+y) % 120
            sample = 60-phase if phase <= 60 else phase-60
            t = y/109
            blend = t*t*(3-2*t)
            field = stem_field[sample]*(1-blend) + original[y]*blend
            normalized[y,482:535] = field
            kept[y,482:535] = field > 0
    # Keep a diagnostic of what was actually authored, independently of rendering.
    Image.fromarray(kept*255).save(base / f"{section}-authored-mask.png")
    # Restore all retained linework and source width variation. A fine-detail base
    # and a narrower dark core retain the original hierarchy of line weights.
    core = np.uint8((kept>0) & (normalized>.28))
    faint = np.uint8((kept>0) & (normalized>.035))
    core_path = contours_path(core)
    # Attenuate pale rims with a luminance mask, instead of cutting up the
    # secondary paths and breaking their continuity at forks and node rings.
    detail_mask = f'{section}-detail-clearance'
    clearance = (
        f'<defs><mask id="{detail_mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="870" style="mask-type:luminance">'
        '<rect width="1000" height="870" fill="#b3b3b3"/>'
        f'<path fill="#333333" stroke="#333333" stroke-width="2.4" stroke-linejoin="round" fill-rule="evenodd" d="{core_path}"/>'
        f'<path fill="white" fill-rule="evenodd" d="{core_path}"/>'
        '</mask></defs>'
    )
    layers = [
        clearance,
        f'<path data-network-branch="detail" mask="url(#{detail_mask})" fill-rule="evenodd" opacity=".30" d="{contours_path(faint)}"/>',
        f'<path data-network-branch="principal" fill-rule="evenodd" opacity=".94" d="{core_path}"/>',
    ]
    # Recover the original faint construction dashes in their measured regions.
    columns = [327,349,431,482,526,553,590,650,742,794,888] if section=="projects" else [44,163,289,431,482,530,578,628,675,739,796,848,909]
    rows = [278,323,438,467,555,615,670] if section=="projects" else [104,153,257,400,486,598,714]
    guide_region = np.zeros_like(allowed)
    for x in columns: guide_region |= np.abs(xx-x)<=2
    for y in rows: guide_region |= np.abs(yy-y)<=2
    guide = np.uint8((difference>3) & allowed & guide_region & (kept==0))
    layers.insert(0,f'<path data-construction-guide="true" fill-rule="evenodd" opacity=".06" d="{contours_path(guide)}"/>')
    # Large faint construction arcs are kept as exact circular geometry.
    construction = [(480,188,94),(712,532,78),(347,698,57),(436,530,65)] if section=="projects" else [(869,280,21)]
    for x,y,r in construction:
        layers.insert(0,f'<circle data-construction-guide="true" cx="{x}" cy="{y}" r="{r}" fill="none" stroke="currentColor" stroke-width=".6" opacity=".08"/>')
    filename = "tree-network.svg" if section=="projects" else "root-network.svg"
    (destination/filename).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 870" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">\n'+"\n".join(layers)+"\n</svg>\n",encoding="utf8")
    # Diagnostic landmarks only: the fitted branch now reaches the ring.
    yy,xx = np.where((linework > 0) & (difference > 14))
    section_anchors = []
    for identifier,x,y,radius in nodes[section]:
        distance = np.hypot(xx-x,yy-y)
        candidate = int(np.argmin(distance))
        ax,ay = float(xx[candidate])+.5,float(yy[candidate])+.5
        section_anchors.append({"id":identifier,"x":ax,"y":ay,"width":1.8 if section=="projects" else 1.1})
    anchors[section] = section_anchors
    evidence["networks"][section] = {"principalOutlines":layers[-1].count("M"),"detailOutlines":layers[-2].count("M"),"retainedPixels":int(kept.sum()),"anchors":section_anchors,"marks":marks}

(destination/"anchors.ts").write_text("// Measured in the reference's uniformly scaled 1000 × 870 frame.\nexport const referenceAnchors = "+json.dumps(anchors,indent=2)+" as const;\n",encoding="utf8")
(base/"tracing-report.json").write_text(json.dumps(evidence,indent=2),encoding="utf8")
print(json.dumps({section: {"principal":data["principalOutlines"],"details":data["detailOutlines"],"pixels":data["retainedPixels"]} for section,data in evidence["networks"].items()},indent=2))
