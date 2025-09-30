# KingsMSG – OG Meta Auto Patch (main + regions)

이 패치는 `index.html`(메인)과 `regions/*.html`(지역 페이지)에 **Open Graph/Twitter/Canonical** 메타를 자동 주입합니다.
썸네일 이미지는 공통으로 **https://kingsmsg.com/main/og-kingsmsg-1200x630.png** 를 사용합니다.

## 준비물
- Python 3.8+

## 사용 방법
1) 이 폴더(`og-meta-patch`)를 프로젝트 루트와 같은 위치에 둡니다. (예: `KingsMassage` 폴더와 동일한 상위)
2) 터미널에서 프로젝트 루트로 이동:
   ```bash
   cd /path/to/KingsMassage  # index.html 이 있는 위치
   ```
3) 패치를 실행:
   ```bash
   python3 ../og-meta-patch/og_patch.py
   ```
   - Windows라면: `py ..\og-meta-patch\og_patch.py`
4) 완료 후 변경된 파일 수가 출력됩니다. 브라우저로 열어 `<head>` 내 메타가 올바른지 확인해주세요.

## 작동 원리
- `index.html`: 메인 전용 OG 메타 템플릿 삽입
- `regions/*.html`: 파일명/경로에서 지역명을 파싱(예: `regions/seoul-강남.html`)하여 `title/description/url/canonical`을 지역 최적화 문구로 생성
- 기존 중복 `og:image`, `twitter:image`, `og:title/description/url`, `canonical`은 우선 제거한 후 새 템플릿을 삽입 (idempotent)

## 되돌리기(백업)
- 실행 시 같은 경로에 `.bak_yyyyMMddHHMMSS` 백업 디렉터리를 만듭니다.
- 문제가 있으면 해당 백업에서 파일을 되돌리세요.

## 재색인
- 배포 후 카카오/페북/트위터 캐시를 아래 도구로 초기화하세요.
  - Kakao: https://developers.kakao.com/tool/clear/og?url=페이지URL
  - Facebook: https://developers.facebook.com/tools/debug/
  - Twitter: https://cards-dev.twitter.com/validator
