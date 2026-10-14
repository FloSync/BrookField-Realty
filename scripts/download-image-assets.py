"""Download verified Brookfield wp-content images into public/."""
from __future__ import annotations

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BASE = "https://brookfieldrealtorltd.com/wp-content/uploads"

DOWNLOADS: list[tuple[str, Path]] = [
    # Section backgrounds (high-res, legacy site mapping)
    (
        f"{BASE}/2023/06/steve-driscoll-VsBl5PwVZpY-unsplash-1920x1362.jpg",
        PUBLIC / "backgrounds" / "home-services.jpg",
    ),
    (
        f"{BASE}/2024/05/IMG-20240510-WA0078.jpg",
        PUBLIC / "backgrounds" / "home-about-accent.jpg",
    ),
    (
        f"{BASE}/2023/08/IMG-20240510-WA0076.jpg",
        PUBLIC / "backgrounds" / "properties-header.jpg",
    ),
    (
        f"{BASE}/2023/08/austin-wehrwein-EZERpkl3Lso-unsplash-scaled.jpg",
        PUBLIC / "backgrounds" / "contact-office.jpg",
    ),
    (
        f"{BASE}/2023/08/ravi-avaala-mR1CIDduGLc-unsplash-1280x849.jpg",
        PUBLIC
        / "backgrounds"
        / "green-brooks-garden-a-wise-investment-in-serenity-and-growth.jpg",
    ),
    # Residential / commercial listings
    (
        f"{BASE}/2023/03/455-x-305-3bdr-flat.jpg",
        PUBLIC / "properties" / "luxury-3-bedroom-apartment" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/sidekix-media-wRzBarqn3hs-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "4-bedroom-semi-detached-beachwood" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/sidekix-media-5O-KFVmKSjY-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "3-bedroom-terrace-duplex-chevron" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/03/IMG-20220322-WA0028.jpg",
        PUBLIC / "properties" / "luxury-3-bedroom-terrace-duplex-chevron" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/03/455-x-305-6-Units-3bdr.jpg",
        PUBLIC / "properties" / "6-units-3-bedroom-flats" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/03/455-x-305-5bedroom-detached.jpg",
        PUBLIC / "properties" / "5-bedrooms-detached-for-rent" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/francesca-tosolini-Gu4R-0lwXVk-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "3-bedroom-semi-detached-for-rent" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/francesca-tosolini-kDtuOUIkwrk-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "3-bedroom-terrace-lekki-for-rent" / "01-cover.jpg",
    ),
    # Land listings (legacy properties page card images)
    (
        f"{BASE}/2023/08/ravi-avaala-mR1CIDduGLc-unsplash-1280x849.jpg",
        PUBLIC / "properties" / "greenbrooks-gardens" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/david-clode-92MgFhlWD-8-unsplash-1280x858.jpg",
        PUBLIC / "properties" / "beryl-gardens-ilamija" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/daniel-barnes-PyFzygP2eNg-unsplash-1280x719.jpg",
        PUBLIC / "properties" / "beryl-gardens-2-monastery-road" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/point3d-commercial-imaging-ltd-wC4QVZmAF58-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "canty-hills-phase-1" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/ravi-avaala-2d4lAQAlbDA-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "canty-hills-phase-2" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/sergey-pesterev-DWXR-nAbxCk-unsplash-1280x856.jpg",
        PUBLIC / "properties" / "canty-hills-phase-4" / "01-cover.jpg",
    ),
    (
        f"{BASE}/2023/08/charles-c-collingwood-fBQLoz0c1cE-unsplash-1280x853.jpg",
        PUBLIC / "properties" / "brooklyn-gardens-poka-epe" / "01-cover.jpg",
    ),
]


def fetch(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"GET {dest.relative_to(ROOT)}")
    req = urllib.request.Request(url, headers={"User-Agent": "BrookfieldMigration/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        dest.write_bytes(resp.read())


def main() -> None:
    failed: list[str] = []
    for url, path in DOWNLOADS:
        try:
            fetch(url, path)
        except Exception as exc:  # noqa: BLE001 — migration script
            failed.append(f"{path.name}: {exc}")
    if failed:
        print("FAILED:")
        for line in failed:
            print(" ", line)
        raise SystemExit(1)
    print("Done.")


if __name__ == "__main__":
    main()
