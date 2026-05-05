"""
Cartoon via fal.ai sur 3-4 photos. Teste cartoonify + flux img2img Pop Mart.
"""
import os
import urllib.request
import time
from pathlib import Path
import fal_client

os.environ["FAL_KEY"] = "b0011a85-cbcd-4d6e-aee3-057345fe8587:47aef6499895c5a1043bad69c8bdef35"

OUT_DIR = Path(__file__).parent / "img" / "fal"
OUT_DIR.mkdir(exist_ok=True, parents=True)
SRC_DIR = Path(__file__).parent / "img"

# 3 photos seulement pour limiter le coût
PHOTOS = ["jeremy-1.jpg", "kev-jer.jpg", "jer-jean.jpg"]


def upload(path):
    print(f"  upload {path.name}...", end=" ", flush=True)
    url = fal_client.upload_file(str(path))
    print("ok")
    return url


def run_cartoonify(image_url):
    return fal_client.run("fal-ai/cartoonify", arguments={"image_url": image_url})


POP_MART_PROMPT = (
    "pop mart vinyl face blind box illustration style, chunky cartoon character "
    "with bold black outlines and posterized 4-color flat shading, retro 80s comic "
    "graffiti aesthetic, toy packaging vibe, saturated colors, hand-drawn edges, "
    "no realistic skin texture, designed by Pop Mart × Coca-Cola"
)


def run_flux_img2img(image_url):
    return fal_client.run(
        "fal-ai/flux/dev/image-to-image",
        arguments={
            "image_url": image_url,
            "prompt": POP_MART_PROMPT,
            "strength": 0.85,
            "num_images": 1,
            "image_size": "portrait_4_3",
            "num_inference_steps": 28,
        },
    )


def download(url, out):
    urllib.request.urlretrieve(url, out)


def main():
    for fname in PHOTOS:
        src = SRC_DIR / fname
        if not src.exists():
            print(f"skip {fname}")
            continue
        stem = src.stem
        url = upload(src)
        # Test 1 : cartoonify
        try:
            t0 = time.time()
            print(f"  → cartoonify...", end=" ", flush=True)
            r = run_cartoonify(url)
            for i, img in enumerate(r.get("images", [])):
                out = OUT_DIR / f"{stem}-cartoonify-{i}.jpg"
                download(img["url"], out)
            print(f"ok {time.time()-t0:.1f}s")
        except Exception as e:
            print(f"ERR {e}")
        # Test 2 : flux img2img Pop Mart
        try:
            t0 = time.time()
            print(f"  → flux-img2img Pop Mart...", end=" ", flush=True)
            r = run_flux_img2img(url)
            for i, img in enumerate(r.get("images", [])):
                out = OUT_DIR / f"{stem}-popmart-{i}.jpg"
                download(img["url"], out)
            print(f"ok {time.time()-t0:.1f}s")
        except Exception as e:
            print(f"ERR {e}")
        print()


if __name__ == "__main__":
    main()
