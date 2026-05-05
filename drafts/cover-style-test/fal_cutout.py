"""
Détourage des 3 cartoonify pour effet "figurine isolée" (vinyl face).
Test 2 modèles fal.ai : imageutils/rembg + birefnet.
"""
import os
import urllib.request
import time
from pathlib import Path
import fal_client

os.environ["FAL_KEY"] = "b0011a85-cbcd-4d6e-aee3-057345fe8587:47aef6499895c5a1043bad69c8bdef35"

SRC_DIR = Path(__file__).parent / "img" / "fal"
OUT_DIR = Path(__file__).parent / "img" / "cutout"
OUT_DIR.mkdir(exist_ok=True, parents=True)

PHOTOS = [
    "jeremy-1-cartoonify-0.jpg",
    "kev-jer-cartoonify-0.jpg",
    "jer-jean-cartoonify-0.jpg",
]


def upload(p):
    print(f"  upload {p.name}...", end=" ", flush=True)
    u = fal_client.upload_file(str(p))
    print("ok")
    return u


def try_models(image_url, stem):
    candidates = [
        ("fal-ai/imageutils/rembg", {"image_url": image_url}),
        ("fal-ai/birefnet/v2", {"image_url": image_url}),
        ("fal-ai/bria/background/remove", {"image_url": image_url}),
    ]
    for mid, args in candidates:
        try:
            t0 = time.time()
            print(f"    → {mid}...", end=" ", flush=True)
            r = fal_client.run(mid, arguments=args)
            # tente d'extraire l'image
            if "image" in r:
                url = r["image"]["url"] if isinstance(r["image"], dict) else r["image"]
            elif "images" in r and r["images"]:
                url = r["images"][0]["url"] if isinstance(r["images"][0], dict) else r["images"][0]
            else:
                print(f"keys={list(r.keys())}")
                continue
            slug = mid.split("/")[-1]
            out = OUT_DIR / f"{stem}-{slug}.png"
            urllib.request.urlretrieve(url, out)
            print(f"ok {time.time()-t0:.1f}s → {out.name}")
            return out
        except Exception as e:
            print(f"ERR {str(e)[:90]}")
    return None


def main():
    for fname in PHOTOS:
        src = SRC_DIR / fname
        if not src.exists():
            continue
        stem = src.stem
        print(stem)
        url = upload(src)
        try_models(url, stem)
        print()


if __name__ == "__main__":
    main()
