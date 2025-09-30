#!/usr/bin/env python3
import os, re, time, shutil, pathlib, sys

ROOT = pathlib.Path(".").resolve()
REGIONS = ROOT / "regions"
TARGETS = list(ROOT.glob("*.html"))
if REGIONS.exists():
    TARGETS += list(REGIONS.glob("*.html"))
if not TARGETS:
    print("대상 HTML 없음. 레포 루트에서 실행해주세요.")
    sys.exit(0)

ROW_HTML = (
    '<tr class="course-kor-swedish">\n'
    '  <td data-label="코스"><strong>한국인 스웨디시</strong></td>\n'
    '  <td data-label="60분"><span class="price">140,000원</span></td>\n'
    '  <td data-label="90분"><span class="price">180,000원</span></td>\n'
    '  <td data-label="120분"><span class="dim">-</span></td>\n'
    '</tr>\n'
)

THEAD_STD = (
    "<thead>\n"
    "  <tr>\n"
    "    <th>코스</th>\n"
    "    <th>60분</th>\n"
    "    <th>90분</th>\n"
    "    <th>120분</th>\n"
    "  </tr>\n"
    "</thead>\n"
)

def backup(paths):
    stamp = time.strftime("%Y%m%d%H%M%S")
    bdir = ROOT / f".bak_{stamp}"
    for p in paths:
        dst = bdir / p.relative_to(ROOT)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dst)
    return bdir

def read(p): return p.read_text(encoding="utf-8", errors="ignore")
def write(p,s): p.write_text(s, encoding="utf-8")

def patch_one(html):
    # 첫 번째 pricing-table만 대상으로
    m_table = re.search(r'(<table[^>]*class=["\']?[^>"\']*pricing-table[^>"\']*["\']?[^>]*>)(.*?)(</table>)',
                        html, flags=re.I|re.S)
    if not m_table:
        return html, False, "no_pricing_table"

    t_open, t_body, t_close = m_table.group(1), m_table.group(2), m_table.group(3)

    # thead / tbody 잡기
    m_thead = re.search(r'(<thead[^>]*>.*?</thead>)', t_body, flags=re.I|re.S)
    m_tbody = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', t_body, flags=re.I|re.S)

    # thead 보강: 60/90/120/150 누락 시 표준으로 교체/삽입
    need_head = False
    if m_thead:
        head_txt = re.sub(r'<[^>]+>', '', m_thead.group(1))
        if not all(k in head_txt for k in ["60분","90분","120분","150분"]):
            need_head = True
    else:
        need_head = True

    if need_head:
        if m_thead:
            t_body = t_body.replace(m_thead.group(1), THEAD_STD)
        else:
            if m_tbody:
                t_body = t_body.replace(m_tbody.group(1), THEAD_STD + m_tbody.group(1))
            else:
                t_body = THEAD_STD + "<tbody>\n</tbody>\n"

    # tbody 확보(없으면 생성)
    m_tbody = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', t_body, flags=re.I|re.S)
    if not m_tbody:
        if THEAD_STD in t_body:
            t_body = t_body.replace(THEAD_STD, THEAD_STD + "<tbody>\n</tbody>\n")
        else:
            t_body = "<tbody>\n</tbody>\n" + t_body
        m_tbody = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', t_body, flags=re.I|re.S)

    tbody_open, tbody_inner, tbody_close = m_tbody.group(1), m_tbody.group(2), m_tbody.group(3)

    # 중복 방지
    if "한국인 스웨디시" in tbody_inner:
        new_tbody_inner = tbody_inner
        where = "exists_already"
    else:
        # "스페셜 감성 힐링마사지" 뒤에 삽입 시도(띄어쓰기/개행 허용)
        m_special = re.search(r'(<tr[^>]*>.*?스페셜\s*감성\s*힐링마사지.*?</tr>)', tbody_inner, flags=re.I|re.S)
        if m_special:
            idx = m_special.end()
            new_tbody_inner = tbody_inner[:idx] + "\n" + ROW_HTML + tbody_inner[idx:]
            where = "after_special"
        else:
            new_tbody_inner = tbody_inner.rstrip() + "\n" + ROW_HTML
            where = "append"

    # 테이블 재조립
    t_body_new = t_body[:m_tbody.start()] + tbody_open + new_tbody_inner + tbody_close + t_body[m_tbody.end():]
    new_html = html[:m_table.start()] + t_open + t_body_new + t_close + html[m_table.end():]
    return (new_html, new_html != html, where)

# 실행
bdir = backup(TARGETS)
print("백업 폴더:", bdir)

changed = 0
for p in TARGETS:
    html = read(p)
    new_html, did, why = patch_one(html)
    if did:
        write(p, new_html); changed += 1
    print(f"- {p.name}: {why}")

print(f"수정된 파일 수: {changed}/{len(TARGETS)}")
