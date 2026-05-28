# 종이 청첩장 웹 원본

`main.jpg`를 대표 사진으로 사용한 A5 양면 인쇄용 청첩장입니다. 앞면은 대표 사진, 뒷면은 초대 문구와 예식 정보를 담은 2페이지 구성입니다. 웹 컴포넌트 방식의 작은 로컬 프레임워크로 구성되어 있어 외부 패키지 설치 없이 열 수 있습니다.

## 수정 위치

- 이름, 날짜, 장소, 초대 문구: `src/data.js`
- 두 번째 페이지 QR 이미지: `src/data.js`의 `qr.image` 값과 루트의 `site-qr.svg`
- 인쇄 크기, 색감, 여백: `styles/invitation.css`
- 화면 구성: `src/app.js`

## 미리보기

`index.html`을 직접 열어도 미리보기할 수 있습니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\preview.ps1
```

브라우저에서 `http://127.0.0.1:4173`을 열면 됩니다.

## PDF로 만들기

미리보기 화면의 `PDF로 인쇄` 버튼을 누른 뒤, 대상 프린터를 `PDF로 저장`으로 선택하세요.

자동 내보내기가 가능한 환경에서는 아래 명령으로 `dist/wedding-invitation-a5.pdf`를 만들 수 있습니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\export-pdf.ps1
```

권장 인쇄 설정:

- 용지: A5
- 배율: 100%
- 여백: 없음
- 배경 그래픽: 켬
- 양면 인쇄: 긴 쪽으로 넘김

대표 사진은 1200 x 1800px이라 A5 풀컷 기준 약 206dpi입니다. 일반 청첩장 인쇄에는 무난하지만, 더 선명한 고급 인쇄를 원하면 같은 구도의 더 큰 원본 사진으로 교체하는 편이 좋습니다.
