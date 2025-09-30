#!/usr/bin/env python3
import os, re, time, shutil, pathlib, sys
ROOT = pathlib.Path('.').resolve()
REGIONS = ROOT / 'regions'
TARGETS = list(ROOT.glob('*.html'))
if REGIONS.exists(): TARGETS += list(REGIONS.glob('*.html'))
if not TARGETS:
    print('대상 HTML 없음. 레포 루트에서 실행해주세요.'); sys.exit(0)
PANEL_BLOCK = '''<!-- [AUTO-HUBS] region hubs (panel) -->
<h4>지역 허브 빠른이동</h4>
<ul class="region-quick">
  <li><a href="/regions/seoul.html">서울 출장마사지 지역 전체 보기</a></li>
  <li><a href="/regions/incheon.html">인천 출장마사지 지역 전체 보기</a></li>
  <li><a href="/regions/gyeonggi.html">경기 출장마사지 지역 전체 보기</a></li>
</ul>
<!-- [/AUTO-HUBS] -->
FOOTER_BLOCK = '''<!-- [AUTO-HUBS] footer hubs -->
<div class="footer-hubs" style="margin-top:10px;font-size:14px;">
  <strong>지역 허브:</strong>
  <a href="/regions/seoul.html">서울</a> ·
  <a href="/regions/incheon.html">인천</a> ·
  <a href="/regions/gyeonggi.html">경기</a>
</div>
<!-- [/AUTO-HUBS] -->
def guess_breadcrumb(file_name):
    name = file_name.replace('.html','')
    seed_map = {'seoul':'서울','incheon':'인천','gyeonggi':'경기'}
    seed = '서울'; current = name
    if '-' in name:
        seed_key, current = name.split('-',1)
        seed = seed_map.get(seed_key, seed_key)
    seed_href = {'서울':'/regions/seoul.html','인천':'/regions/incheon.html','경기':'/regions/gyeonggi.html'}.get(seed,'/regions/seoul.html')
    bc = f'''<!-- [AUTO-HUBS] breadcrumb -->
<nav class="crumbs" style="margin:8px 0 4px;font-size:14px">
  <a href="/regions/">지역 전체</a> › 
  <a href="{seed_href}">{seed}</a> › 
  <span>{current}</span>
</nav>
<!-- [/AUTO-HUBS] -->
    return bc
def backup(paths):
    stamp = time.strftime('%Y%m%d%H%M%S')
    bdir = ROOT / f'.bak_{stamp}'
    for p in paths:
        dst = bdir / p.relative_to(ROOT)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dst)
    return bdir
def read(p): return p.read_text(encoding='utf-8', errors='ignore')
def write(p,s): p.write_text(s, encoding='utf-8')
def inject_panel(html):
    if '[AUTO-HUBS] region hubs (panel)' in html: return html, False
    m = re.search(r'(<div[^>]+class=["\']body["\'][^>]*>)', html, flags=re.I)
    if m:
        idx = m.end(); return html[:idx] + '\n' + PANEL_BLOCK + '\n' + html[idx:], True
    return re.sub(r'(?i)</body>', PANEL_BLOCK + '\n</body>', html, count=1), True
def inject_footer(html):
    if '[AUTO-HUBS] footer hubs' in html: return html, False
    if re.search(r'(?i)</footer>', html):
        return re.sub(r'(?i)</footer>', FOOTER_BLOCK + '\n</footer>', html, count=1), True
    return re.sub(r'(?i)</body>', FOOTER_BLOCK + '\n</body>', html, count=1), True
def inject_breadcrumb(html, file_path):
    if '[AUTO-HUBS] breadcrumb' in html: return html, False
    if '/regions/' not in file_path.as_posix(): return html, False
    m = re.search(r'(<h1[^>]*>.*?</h1>)', html, flags=re.I|re.S)
    if not m: return html, False
    block = guess_breadcrumb(file_path.name)
    idx = m.end(); return html[:idx] + '\n' + block + '\n' + html[idx:], True
bdir = backup(TARGETS)
print('백업 폴더:', bdir)
changed=panel_cnt=footer_cnt=crumb_cnt=0
for p in TARGETS:
    html = read(p)
    new_html = html
    new_html, a = inject_panel(new_html); panel_cnt += int(a)
    new_html, b = inject_footer(new_html); footer_cnt += int(b)
    new_html, c = inject_breadcrumb(new_html, p); crumb_cnt += int(c)
    if new_html != html:
        write(p, new_html); changed += 1
print(f'수정된 파일 수: {changed}/{len(TARGETS)}')
print(f' - 패널에 허브 추가: {panel_cnt}')
print(f' - 푸터에 허브 추가: {footer_cnt}')
print(f' - 지역 페이지 크럼브 추가: {crumb_cnt}')