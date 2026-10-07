"""
One-time asset-prep script: extracts the hero character's cursor-tracking
frames from the raw source video into public/frames/.

Source video: Character_tracking_website_cursor_20261002194354.mp4
  240 frames @ 24fps, 1280x720, navy (#09101c) background.

Visual inspection used a fixed vertical centerline drawn over each candidate
frame at full resolution (small thumbnails are *not* reliable for judging
head yaw — an earlier pass misread frame 102 as "left" when it is still
clearly turned right) to find exact cardinal poses by checking which side
of the line the nose/eyes fall on:
  frame  28 = up          (angle -90)
  frame  97 = right        (angle   0)
  frame 150 = down         (angle  90)
  frame 210 = left         (angle 180)
These sit on ONE continuous, roughly constant-angular-speed sweep (~1.3-1.7
deg/frame across all three segments), so the whole 28->210 span is used as
the ring with simple linear angle interpolation across it — no need for
separate per-segment calibration. There is no footage covering the
remaining ~90 degree arc back from left to up, so the runtime engine
nearest-snaps to whichever of the two endpoints (up @ 28, left @ 210) is
closer for that arc, rather than fabricating or reusing an already-used
frame as if it were new footage there.

Frame 1 is a sharp, direct eye-contact neutral pose (the clip opens on it)
and is used both as center.webp (the cursor-near-face deadzone frame) and
as the source for public/character.png (portfolio thumbnail).

RING_START/RING_END/CENTER_FRAME are specific to this one source video —
re-pointing ATLAS_SRC_VIDEO at different footage means re-deriving them by
inspecting that footage's own frame timeline first.

Usage:
    pip install opencv-python pillow
    ATLAS_SRC_VIDEO=/path/to/character.mp4 python3 scripts/extract_frames.py
"""
import os

import cv2
from PIL import Image

# Point this at the raw character video before re-running.
SRC = os.environ.get("ATLAS_SRC_VIDEO", "character.mp4")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, "public", "frames")
CHARACTER_PNG = os.path.join(REPO_ROOT, "public", "character.png")

RING_START = 28
RING_END = 210
CENTER_FRAME = 1

WEBP_QUALITY = 84


def grab(cap, idx):
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f"could not read frame {idx}")
    return Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))


def main():
    cap = cv2.VideoCapture(SRC)

    ring_files = []
    for i, idx in enumerate(range(RING_START, RING_END + 1)):
        im = grab(cap, idx)
        name = f"r{i:03d}.webp"
        im.save(f"{OUT_DIR}/{name}", "WEBP", quality=WEBP_QUALITY, method=6)
        ring_files.append(name)

    center_im = grab(cap, CENTER_FRAME)
    center_im.save(f"{OUT_DIR}/center.webp", "WEBP", quality=WEBP_QUALITY, method=6)
    center_im.save(CHARACTER_PNG, "PNG")

    cap.release()

    import json

    map_json = {
        "srcW": 1280,
        "srcH": 720,
        "faceX": 0.5,
        "faceY": 0.4,
        "ring": ring_files,
        "ringStartAngle": -90,
        "ringEndAngle": 180,
        "center": "center.webp",
    }
    with open(f"{OUT_DIR}/map.json", "w") as f:
        json.dump(map_json, f, indent=2)

    print(f"wrote {len(ring_files)} ring frames + center.webp + map.json")


if __name__ == "__main__":
    main()
