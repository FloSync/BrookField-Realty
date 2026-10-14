"""Extract wp-content image URLs from saved HTML pages."""
import re
import sys
from pathlib import Path

def extract(path: Path) -> list[str]:
    t = path.read_text(encoding="utf-8", errors="ignore")
    imgs = re.findall(
        r"https://brookfieldrealtorltd\.com/wp-content/uploads/[^\s\"'<>]+",
        t,
    )
    return sorted(set(imgs))

def main() -> None:
    temp = Path.home() / "AppData/Local/Temp"
    for name in sys.argv[1:]:
        p = temp / name
        if not p.exists():
            print(f"missing {p}")
            continue
        imgs = extract(p)
        print(f"=== {name} ({len(imgs)} images) ===")
        for u in imgs:
            print(u)

if __name__ == "__main__":
    main()
