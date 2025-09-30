#!/usr/bin/env python3
import os, re, sys, time, shutil, pathlib

ROOT = pathlib.Path(".").resolve()
PATCH_DIR = pathlib.Path(__file__).parent.resolve()

# Load templates
meta_main = (PATCH_DIR/"meta_main.html").read_text(encoding="utf-8")
meta_region = (PATCH_DIR/"meta_region.html").read_text(encoding="utf-8")

OG_IMG = "https://kingsmsg.com/main/og-kingsmsg-1200x630.png"

# Helpers
def backup(paths):
    if not paths: return None
    stamp = time.strftime("%Y%m%d%H%M%S")
    bdir = ROOT / f".bak_{stamp}"
    bdir.mkdir(exist_ok=True)
    for p in paths:
        rel = p.relative_to(ROOT)
        dst = bdir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dst)
    return bdir

def read(p):
    return p.read_text(encoding="utf-8", errors="ignore")

def write(p, s):
    p.write_text(s, encoding="utf-8")

def clean_head(html):
    # Remove previous og/twitter/canonical to avoid duplicates
    html = re.sub(r'\s*<meta[^>]+property=["\']og:(?:title|description|url|image|image:secure_url|image:width|image:height)["\'][^>]*>\s*', '', html, flags=re.I)
    html = re.sub(r'\s*<meta[^>]+name=["\']twitter:(?:card|title|description|image)["\'][^>]*>\s*', '', html, flags=re.I)
    html = re.sub(r'\s*<link[^>]+rel=["\']canonical["\'][^>]*>\s*', '', html, flags=re.I)
    return html

def inject_meta(html, block):
    # Insert before </head>, or after <meta charset> as fallback
    if "</head>" in html.lower():
        return re.sub(r'</head>', block + "\n</head>", html, count=1, flags=re.I)
    m = re.search(r'<meta[^>]+charset=[^>]+>', html, flags=re.I)
    if m:
        i = m.end()
        return html[:i] + "\n" + block + html[i:]
    return block + html

def title_for_region(region_kor):
    return f"킹즈출장마사지 | {region_kor} 출장마사지 출장안마 홈케어 | 24시 후불제"

def desc_for_region(region_kor):
    return f"{region_kor} 출장마사지 출장안마 홈케어 전문. 20·30대 전문 관리사 배정, 후불제 선입금없음, 호텔/자택/오피스 방문. 지금 전화 010-4637-9556"

def tdesc_for_region(region_kor):
    return f"{region_kor} 출장마사지 · 후불제 · 호텔/자택 방문"

def parse_region_name(file_path):
    # Expect 'regions/seoul-강남.html' -> "서울 강남" or "서울 강남구"
    name = file_path.stem
    # Try to keep Korean slug part if exists after '-'
    if "-" in name:
        after = name.split("-", 1)[1]
        region_kor = after.replace("-", " ").replace("_", " ")
    else:
        region_kor = name.replace("-", " ").replace("_", " ")
    # Upstream may include encoded strings; just return as-is
    return region_kor.strip()

def make_block_region(page_url, region_kor):
    return meta_region.format(
        TITLE = title_for_region(region_kor),
        DESC  = desc_for_region(region_kor),
        TDESC = tdesc_for_region(region_kor),
        URL   = page_url
    )

def process():
    changed = []
    targets = []
    # index.html
    idx = ROOT/"index.html"
    if idx.exists():
        targets.append(idx)
    # regions/*.html
    reg_dir = ROOT/"regions"
    if reg_dir.exists():
        for p in reg_dir.glob("*.html"):
            targets.append(p)

    if not targets:
        print("HTML 대상이 없습니다. (index.html 또는 regions/*.html)")
        return

    bdir = backup(targets)
    print(f"백업: {bdir}")

    for p in targets:
        html = read(p)
        cleaned = clean_head(html)
        if p.name == "index.html":
            block = meta_main
        else:
            # page url
            url = f"https://kingsmsg.com/regions/{p.name}"
            region = parse_region_name(p)
            block = make_block_region(url, region)

        new_html = inject_meta(cleaned, "\\n" + block + "\\n")
        if new_html != html:
            write(p, new_html)
            changed.append(str(p.relative_to(ROOT)))

    print(f"변경된 파일: {len(changed)}")
    for c in changed[:20]:
        print(" -", c)
    if len(changed) > 20:
        print(" ...", len(changed)-20, "more")

if __name__ == "__main__":
    process()
