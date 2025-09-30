# 츄츄마사지 — 새 사이트 스타터 패키지

## 구성
- 전 페이지 브랜드: **츄츄마사지**
- 전 페이지 키워드 삽입: **출장스웨디시** (타이틀/디스크립션/인트로 문장)
- 조직/업체 JSON-LD(Organization/LocalBusiness) `name: "츄츄마사지"` 통일
- 파비콘/로고 세트: `assets/brand/*`
- 지역 허브 문장형 내부링크 자동 삽입
- 가격표 OfferCatalog 런타임 주입 스크립트: `assets/offers-injector.js`

## 배포 순서
1. **GitHub 새 리포** 생성 → 이 패키지 전체 업로드
2. **Netlify 연결**(Build command 없음, Framework: None, Publish dir: 루트)
3. **커스텀 도메인** 연결(예: `chuchu-massage.com`)
4. 도메인 연결 후, `sitemap.xml`은 나중에 생성/제출 권장(검색콘솔에서 사이트맵 제출)

## 유의사항
- 도메인 미정 상태이므로 canonical 절대 URL은 제거했습니다.
- 도메인 확정 후 `Organization` JSON-LD의 `url`을 해당 도메인으로 업데이트 권장.
- 가격표가 JS로 렌더되면 Google이 구조화데이터를 읽지 못할 수 있어, 가능하면 **정적 HTML 가격표**로 전환 권장.