"""
Mood board : 6 styles différents sur 1 photo (jeremy-1.jpg) pour orienter le choix.
"""
import os
import urllib.request
import time
from pathlib import Path
import fal_client

os.environ["FAL_KEY"] = "b0011a85-cbcd-4d6e-aee3-057345fe8587:47aef6499895c5a1043bad69c8bdef35"

SRC = Path(__file__).parent / "img" / "jeremy-1.jpg"
OUT_DIR = Path(__file__).parent / "img" / "moodboard"
OUT_DIR.mkdir(exist_ok=True, parents=True)

STYLES = [
    {
        "name": "01-memoji",
        "label": "Memoji 3D Apple",
        "prompt": (
            "transform into memoji style 3d avatar, two bearded men sitting, smooth glossy plastic, "
            "huge simplified eyes, oversized rounded heads, apple emoji aesthetic, "
            "white plain background, soft pastel skin, no realistic details"
        ),
    },
    {
        "name": "02-flat-vector",
        "label": "Flat vector éditorial",
        "prompt": (
            "flat vector illustration of two bearded men, geometric simplified shapes only, "
            "completely flat solid colors no gradient no shading, bold thick outlines, "
            "minimalist tech style notion stripe, two tone palette teal and cream, "
            "editorial illustration"
        ),
    },
    {
        "name": "03-comic-us",
        "label": "Comic book US",
        "prompt": (
            "two bearded men drawn as american superhero comic book art, super thick black ink outlines, "
            "ben-day dots halftone shading dots everywhere, saturated red blue yellow primary colors only, "
            "vintage marvel kirby ditko comic style, panel illustration"
        ),
    },
    {
        "name": "04-new-yorker",
        "label": "Editorial New Yorker",
        "prompt": (
            "new yorker magazine cover illustration of two bearded men, gouache painting on textured paper, "
            "muted earthy palette ochre olive cream, expressive loose visible brushstrokes, "
            "hand-painted imperfections, sophisticated editorial tone, tom gauld olimpia zagnoli christoph niemann style"
        ),
    },
    {
        "name": "05-risograph",
        "label": "Risograph print",
        "prompt": (
            "risograph print illustration of two bearded men, only fluorescent pink and teal blue inks, "
            "obvious misregistered layers offset, heavy paper grain texture, screen print aesthetic, "
            "limited 2 color palette only, indie zine punk style, hand drawn loose"
        ),
    },
    {
        "name": "06-ghibli",
        "label": "Studio Ghibli anime",
        "prompt": (
            "studio ghibli anime style illustration of two bearded men sitting, hand drawn 2d animation cels, "
            "soft watercolor painted background, warm pastel palette, miyazaki characters with simplified noses, "
            "totoro spirited away aesthetic, cinematic warm lighting"
        ),
    },
    {
        "name": "07-vinyl-toy-2d",
        "label": "Vinyl toy 2D Pop Mart",
        "prompt": (
            "two pop mart vinyl figure characters with bearded faces, chunky kawaii toy bodies "
            "with massive oversized round heads tiny bodies, super thick black ink outlines, "
            "completely flat 4 color posterize, the monsters blind box style, "
            "designer vinyl toy 2d illustration on plain pastel background"
        ),
    },
    {
        "name": "08-watercolor-loose",
        "label": "Aquarelle libre",
        "prompt": (
            "loose watercolor painting of two bearded men, expressive wet-on-wet brushwork, "
            "transparent ink washes, earthy muted ochre olive palette, sketchy hand-drawn ink contours visible, "
            "unfinished raw aesthetic, paper grain visible, editorial illustration"
        ),
    },
]


def upload(p):
    print(f"upload {p.name}...")
    return fal_client.upload_file(str(p))


def gen_style(image_url, prompt, strength=0.88):
    return fal_client.run(
        "fal-ai/flux/dev/image-to-image",
        arguments={
            "image_url": image_url,
            "prompt": prompt,
            "strength": strength,
            "num_images": 1,
            "num_inference_steps": 30,
            "guidance_scale": 7,
        },
    )


def main():
    image_url = upload(SRC)
    print(f"  url={image_url}\n")
    for style in STYLES:
        try:
            t0 = time.time()
            print(f"  → {style['name']} ({style['label']})...", end=" ", flush=True)
            r = gen_style(image_url, style["prompt"])
            for i, img in enumerate(r.get("images", [])):
                out = OUT_DIR / f"{style['name']}.jpg"
                urllib.request.urlretrieve(img["url"], out)
            print(f"ok {time.time()-t0:.1f}s")
        except Exception as e:
            print(f"ERR {str(e)[:90]}")


if __name__ == "__main__":
    main()
