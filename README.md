# 모바일 청첩장

GitHub Pages에 바로 올릴 수 있는 모바일 청첩장입니다. 별도 빌드 과정은 없고, 화면은 JavaScript 기반의 풀스크린 페이지 전환 방식으로 동작합니다.

## 수정 방법

- 기본 정보와 문구: `invitation-data.js`
- 커버 이미지: `assets/cover.jpg`
- 갤러리 이미지: `assets/gallery-1.jpg`부터 `assets/gallery-4.jpg`
- 화면 스타일: `styles.css`

사진은 같은 파일명으로 교체하면 코드 수정 없이 반영됩니다. 파일명을 바꾸고 싶다면 `invitation-data.js`의 `cover.src` 또는 `gallery[].src` 값을 수정하면 됩니다.

## GitHub Pages 배포

1. 저장소 루트에 이 파일들을 올립니다.
2. GitHub 저장소의 Settings > Pages에서 배포 브랜치를 선택합니다.
3. 루트 경로(`/`)를 선택하면 `index.html`이 첫 화면으로 열립니다.
