"""One-off helper: dump WP posts/media for migration."""
import json
import re
from pathlib import Path

temp = Path.home() / "AppData/Local/Temp"
posts = json.loads((temp / "bf-posts.json").read_text(encoding="utf-8"))
media = json.loads((temp / "bf-media.json").read_text(encoding="utf-8"))
out = Path(__file__).resolve().parents[1] / "src" / "lib" / "migrated"
out.mkdir(parents=True, exist_ok=True)

for p in posts:
    slug = p["slug"]
    (out / f"post-{slug}.html").write_text(p["content"]["rendered"], encoding="utf-8")
    meta = {
        "slug": slug,
        "title": p["title"]["rendered"],
        "date": p["date"],
        "excerpt": p["excerpt"]["rendered"],
        "link": p["link"],
    }
    (out / f"post-{slug}.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")

team_urls = []
for m in media:
    title = m.get("title", {}).get("rendered", "")
    url = m.get("source_url", "")
    if re.search(r"team|fadare|yemi|florence|bukunmi|mercy|samuel|uzoigwe|rejoice|happiness", title + url, re.I):
        team_urls.append({"title": title, "url": url})

(out / "team-media.json").write_text(json.dumps(team_urls, indent=2), encoding="utf-8")
print("wrote", len(posts), "posts,", len(team_urls), "team media candidates")
