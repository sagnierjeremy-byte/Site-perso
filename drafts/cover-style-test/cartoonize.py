"""
Cartoonize photos for Pop Mart × Fiesta covers.
Generates 3 styles per photo so we can compare.
"""
import cv2
import numpy as np
from pathlib import Path

SRC_DIR = Path(__file__).parent / "img"
OUT_DIR = Path(__file__).parent / "img" / "cartoon"
OUT_DIR.mkdir(exist_ok=True)

PHOTOS = ["jeremy-1.jpg", "jeremy-2.jpg", "kev-jer.jpg", "kev-jer-2.jpg", "jer-jean.jpg"]


def style_smooth(img):
    """Bilateral filter répété + edge detect doux. Look "anime soft"."""
    color = img.copy()
    for _ in range(7):
        color = cv2.bilateralFilter(color, d=9, sigmaColor=75, sigmaSpace=75)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 7)
    edges = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 2
    )
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    return cv2.bitwise_and(color, edges_color)


def style_bold(img):
    """Posterize fort + edges noires épaisses. Look "comic 80s"."""
    h, w = img.shape[:2]
    # Down-up pour smooth
    small = cv2.pyrDown(img)
    small = cv2.pyrDown(small)
    for _ in range(10):
        small = cv2.bilateralFilter(small, d=9, sigmaColor=80, sigmaSpace=80)
    color = cv2.pyrUp(small)
    color = cv2.pyrUp(color)
    color = cv2.resize(color, (w, h))
    # Quantize couleurs (k-means 8 clusters)
    Z = color.reshape((-1, 3)).astype(np.float32)
    K = 8
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, labels, centers = cv2.kmeans(Z, K, None, criteria, 5, cv2.KMEANS_PP_CENTERS)
    quant = centers[labels.flatten()].astype(np.uint8).reshape(color.shape)
    # Edges noires épaisses
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 5
    )
    # Épaissir les edges
    kernel = np.ones((2, 2), np.uint8)
    edges = cv2.erode(edges, kernel, iterations=1)
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    return cv2.bitwise_and(quant, edges_color)


def style_popmart(img):
    """Posterize 4 tons + saturation boost + edges noires épaisses. Look "Pop Mart toy box"."""
    h, w = img.shape[:2]
    # Smoothing fort
    small = cv2.pyrDown(img)
    for _ in range(8):
        small = cv2.bilateralFilter(small, d=11, sigmaColor=100, sigmaSpace=100)
    color = cv2.pyrUp(small)
    color = cv2.resize(color, (w, h))
    # Quantize très agressif (4 clusters seulement)
    Z = color.reshape((-1, 3)).astype(np.float32)
    K = 5
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 25, 0.5)
    _, labels, centers = cv2.kmeans(Z, K, None, criteria, 8, cv2.KMEANS_PP_CENTERS)
    quant = centers[labels.flatten()].astype(np.uint8).reshape(color.shape)
    # Boost saturation HSV
    hsv = cv2.cvtColor(quant, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.5, 0, 255)
    hsv[..., 2] = np.clip(hsv[..., 2] * 1.05, 0, 255)
    quant = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    # Edges très épaisses noires
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 7)
    edges = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 4
    )
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.erode(edges, kernel, iterations=1)
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    return cv2.bitwise_and(quant, edges_color)


def main():
    for fname in PHOTOS:
        src = SRC_DIR / fname
        if not src.exists():
            print(f"skip {fname} (not found)")
            continue
        img = cv2.imread(str(src))
        if img is None:
            print(f"skip {fname} (read failed)")
            continue
        # Resize pour rapidité
        h, w = img.shape[:2]
        if max(h, w) > 800:
            scale = 800 / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)))
        stem = src.stem
        for name, fn in [
            ("smooth", style_smooth),
            ("bold", style_bold),
            ("popmart", style_popmart),
        ]:
            out = OUT_DIR / f"{stem}-{name}.jpg"
            result = fn(img)
            cv2.imwrite(str(out), result, [cv2.IMWRITE_JPEG_QUALITY, 88])
            print(f"  {out.name}")
        print(f"done {fname}")


if __name__ == "__main__":
    main()
