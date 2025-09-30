# KingsMSG – Add "한국인 스웨디시" Pricing Row (Sitewide)

**목표:** 모든 페이지의 요금표(`<table class="pricing-table">`)에 새로운 코스 **"한국인 스웨디시"**를 자동 추가합니다.
- 60분: **140,000원**
- 90분: **180,000원**
- 120/150분은 `-` 로 표시 (미제공)

## 동작
- 대상: 루트 `*.html` + `regions/*.html`
- 표 머리글에 `60분`, `90분`, `120분`, `150분` 컬럼이 있는 표만 처리
- 이미 "한국인 스웨디시" 행이 있으면 **중복 추가하지 않음**
- 우선 **"스페셜 감성 힐링마사지"** 행 바로 아래에 삽입. 없으면 `<tbody>` 시작 직후 삽입
- 백업 자동 생성: `.bak_YYYYmmddHHMMSS/`

## 사용법
1) 이 폴더(`pricing-patch`)를 **레포 루트**(= `index.html`이 있는 위치)에 넣습니다.
2) 루트에서 실행:
   ```bash
   python3 pricing-patch/patch_add_kor_swedish.py
   # Windows: py pricing-patch\patch_add_kor_swedish.py
   ```
3) 출력된 “수정된 파일 수” 확인 후 커밋/배포하세요.

## 삽입되는 행 예시 (HTML)
```html
<tr class="course-kor-swedish">
  <td data-label="코스"><strong>한국인 스웨디시</strong></td>
  <td data-label="60분"><span class="price">140,000원</span></td>
  <td data-label="90분"><span class="price">180,000원</span></td>
  <td data-label="120분"><span class="dim">-</span></td>
  <td data-label="150분"><span class="dim">-</span></td>
</tr>
```
> 위 구조는 모바일 카드뷰(`data-label`)와 네온 스타일(`.price`, `.dim`)을 그대로 활용합니다.
