# K-AMIs (캐미s) - 개미 마을 🐜

> "방치된 내 주식, 개미 마을이 깨워줍니다."

개인 투자자("개미")를 위한 직관적이고 친근한 포트폴리오 관리 및 일일 브리핑 서비스입니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 목차

- [주요 기능](#-주요 기능)
- [기술 스택](#-기술 스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트 구조)
- [주요 기능 상세](#-주요 기능-상세)
- [디자인 시스템](#-디자인-시스템)
- [개발 가이드](#-개발-가이드)
- [브라우저 지원](#-브라우저-지원)
- [라이선스](#-라이선스)

## ✨ 주요 기능

### 🏘️ 마을별 포트폴리오 관리
- 투자 테마별로 자산을 "마을"로 그룹화
- 실시간 수익률 및 자산 현황 모니터링
- 세계 지도 기반 시각화

### 📢 음성 브리핑 시스템
- 마을별 맞춤 일일 브리핑
- TTS(Text-to-Speech) 기반 음성 재생
- 출근길에 듣는 투자 인사이트

### 🎯 투자 성향 진단
- 25개 질문 기반 심층 분석
- 5가지 투자 유형 판별 (안정형 → 공격투자형)
- 성향별 맞춤 포트폴리오 추천
- 가중치 기반 정밀 분석

### 👥 이웃 마을 추천
- AI 기반 포트폴리오 다각화 제안
- 상관관계 분석을 통한 리스크 관리
- 원클릭 마을 추가

### 🔗 마이데이터 연동 (Mock)
- 금융기관 자산 자동 연동
- 4단계 연동 프로세스
- 실시간 자산 동기화

### 📊 자산 분석 차트
- 마을별 자산 분포 도넛 차트
- 유형별 자산 분류
- 실시간 업데이트

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - CSS Grid, Flexbox, Animations
- **Vanilla JavaScript (ES6+)** - 프레임워크 없는 순수 JS
- **Chart.js 4.4** - 데이터 시각화
- **chartjs-plugin-datalabels** - 차트 라벨 플러그인
- **SheetJS (xlsx)** - 엑셀 내보내기
- **jsPDF + html2canvas** - PDF 내보내기

### Storage
- **LocalStorage API** - 클라이언트 사이드 데이터 저장

### APIs
- **Web Speech API** - TTS 음성 브리핑
- **Intersection Observer API** - 스크롤 애니메이션

### Design
- **Google Fonts (Noto Sans KR, Gowun Batang)** - 한글 폰트
- **CSS Variables** - 테마 시스템
- **Responsive Design** - 모바일 우선 설계

## 🚀 시작하기

### 필수 요구사항
- 모던 웹 브라우저 (Chrome, Edge, Safari, Firefox)
- 로컬 개발 서버 (선택사항)

### 설치 및 실행

#### 방법 1: 직접 실행
```bash
# 브라우저에서 index.html 직접 열기
start index.html  # Windows
open index.html   # macOS
```

#### 방법 2: HTTP 서버 사용 (권장)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# 브라우저에서 접속
http://localhost:8000
```

### 로그인
데모 버전이므로 아무 아이디/비밀번호나 입력하면 로그인됩니다.

## 📁 프로젝트 구조

```
front/
├── index.html                  # 메인 HTML (SPA 구조)
├── css/
│   ├── variables.css           # CSS 변수 (색상, 폰트 등)
│   ├── layout.css              # 레이아웃 (헤더, 네비게이션, 컨테이너)
│   ├── login.css               # 로그인 페이지 스타일
│   ├── components.css          # 공통 컴포넌트 (카드, 모달, Toast 등)
│   ├── pages-main.css          # 메인/홈 페이지 스타일
│   ├── pages-analysis.css      # 자산 분석 페이지 스타일
│   ├── pages-mypage.css        # 마이페이지 스타일
│   ├── pages-original.css      # 기존 페이지 스타일 (마을, 브리핑, 이웃)
│   └── responsive.css          # 반응형 디자인 (미디어 쿼리)
├── js/
│   ├── data.js                 # 샘플 데이터 정의
│   ├── storage.js              # LocalStorage 데이터 관리 (load/save)
│   ├── navigation.js           # SPA 페이지 전환 로직
│   ├── ui-utils.js             # Toast 알림, 확인 모달 등 UI 유틸리티
│   ├── auth.js                 # 로그인/인증 처리
│   ├── main-page.js            # 메인 페이지 로직
│   ├── villages.js             # 마을 관리 기능
│   ├── tts.js                  # TTS 음성 브리핑
│   ├── analysis.js             # 자산 분석 차트
│   ├── mypage.js               # 마이페이지 기능
│   ├── mydata.js               # 마이데이터 연동
│   ├── investment-test.js      # 투자 성향 진단 테스트
│   └── api.js                  # API 통신 모듈
├── public/
│   ├── logo.png                # 로고 이미지
│   ├── map.png                 # 세계 지도 이미지 (PNG)
│   ├── map.jpg                 # 세계 지도 이미지 (JPG)
│   └── map.svg                 # 세계 지도 이미지 (SVG)
├── CLAUDE.md                   # 개발 가이드 (Claude Code용)
└── README.md                   # 프로젝트 문서 (이 파일)
```

## 🎨 주요 기능 상세

### 1. SPA 네비게이션
- JavaScript 기반 페이지 전환
- 현재 페이지 하이라이트
- 부드러운 페이드 인 애니메이션
- 페이지 전환 시 자동 스크롤 상단 이동

### 2. 마을 관리 시스템
```javascript
// 마을 데이터 구조
{
    id: "v1",
    name: "미장마을",
    icon: "🇺🇸",
    assets: [
        { name: "AAPL", type: "기술주", value: 4000000 },
        { name: "TSLA", type: "성장주", value: 3500000 }
    ],
    type: "growth",
    goal: "long-term",
    totalValue: 15000000,
    returnRate: 12.5,
    allocation: 32.3
}
```

### 3. 브리핑 시스템
- 마을별 대표 개미 선택
- 맞춤형 브리핑 내용 생성
- TTS 음성 재생 (ko-KR)
- 읽음 상태 관리

### 4. 투자 성향 진단
- **질문 수**: 25개
- **투자 유형**: 5가지
  - 🛡️ 안정형 (Conservative)
  - 🌱 안정추구형 (Moderate Conservative)
  - ⚖️ 위험중립형 (Moderate)
  - 🚀 적극투자형 (Moderate Aggressive)
  - ⚡ 공격투자형 (Aggressive)
- **분석 방식**: 가중치 기반 점수 집계
- **결과**: 도넛 차트 + 성향 설명 + 포트폴리오 추천

### 5. UI/UX 혁신

#### Toast 알림 시스템
- `alert()` 대체
- 3가지 타입: success, error, info
- 자동 슬라이드 인/아웃
- 3초 후 자동 사라짐

#### 커스텀 확인 모달
- `confirm()` 대체
- 애니메이션 아이콘
- 타입별 색상 (danger/primary)
- ESC 키/오버레이 클릭으로 닫기

#### 접근성 개선
- **키보드 네비게이션**: Tab, Enter, Space, ESC
- **Focus 스타일**: 모든 인터랙티브 요소
- **터치 영역**: 최소 44×44px (WCAG 기준)
- **색맹 지원**: 아이콘으로 정보 보조
- **ARIA 라벨**: 스크린 리더 지원

## 🎨 디자인 시스템

### 색상 팔레트
```css
--primary: #FF6B35      /* 주황색 - 주요 액션 */
--secondary: #F7931E    /* 진한 주황 - 보조 */
--accent: #FFD23F       /* 노랑 - 강조 */
--success: #4ECDC4      /* 청록 - 성공/긍정 */
--danger: #FF6B6B       /* 빨강 - 경고/부정 */
--text: #333            /* 기본 텍스트 */
--text-light: #555      /* 보조 텍스트 */
```

### 타이포그래피
- **제목**: Gowun Batang (세리프)
- **본문**: Noto Sans KR (산세리프)
- **크기 체계**: 11px ~ 64px

### 반응형 Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px ~ 768px
- **Desktop**: > 768px

### 애니메이션
- **fadeIn**: 페이지 전환
- **slideDown**: 히어로 타이틀
- **bounce**: 개미 캐릭터
- **toastSlideIn/Out**: Toast 알림
- **modalSlideIn**: 모달 등장

## 💻 개발 가이드

### 새 페이지 추가하기

1. **HTML에 페이지 구조 추가**
```html
<div id="newPage" class="page">
    <div class="container">
        <h1 class="page-title">새 페이지</h1>
        <!-- 컨텐츠 -->
    </div>
</div>
```

2. **네비게이션 버튼 추가**
```html
<button onclick="showPage('new')">새 메뉴</button>
```

3. **JavaScript pageMap 업데이트**
```javascript
const pageMap = {
    'new': 'newPage'  // 추가
};
```

### 새 마을 타입 추가하기

```javascript
// sampleData.villages 배열에 추가
{
    id: "v7",
    name: "새마을",
    icon: "🌟",
    assets: [...],
    type: "new-type",
    goal: "new-goal",
    totalValue: 1000000,
    returnRate: 5.0,
    allocation: 10
}
```

### Toast 알림 사용하기

```javascript
// 성공
showToast('작업이 완료되었습니다!', 'success');

// 에러
showToast('오류가 발생했습니다.', 'error');

// 정보
showToast('새로운 알림이 있습니다.', 'info');
```

### 확인 모달 사용하기

```javascript
showConfirmModal({
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    icon: '🗑️',
    confirmText: '삭제',
    cancelText: '취소',
    confirmType: 'danger',
    onConfirm: () => {
        // 확인 시 실행
    },
    onCancel: () => {
        // 취소 시 실행 (선택사항)
    }
});
```

### 데이터 관리

```javascript
// 데이터 읽기
const data = loadData();

// 데이터 수정
data.villages.push(newVillage);

// 데이터 저장
saveData(data);

// 데이터 초기화 (개발용)
resetData();
```

## 🌐 브라우저 지원

| Browser | Version | TTS Support |
|---------|---------|-------------|
| Chrome | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Firefox | Latest | ⚠️ Limited |
| IE11 | ❌ Not Supported | ❌ No |

### 필수 기능
- ✅ ES6+ JavaScript
- ✅ CSS Grid & Flexbox
- ✅ LocalStorage API
- ✅ Web Speech API (TTS)

## 🎯 향후 계획

- [ ] 실제 증권 API 연동
- [O] 백엔드 서버 구축
- [ ] 사용자 인증 시스템
- [ ] 실시간 주가 업데이트
- [ ] 푸시 알림
- [O] 다크모드 완전 지원
- [ ] 다국어 지원 (영어, 일본어)
- [ ] PWA 변환
- [ ] 소셜 로그인
- [ ] 포트폴리오 백테스팅

### 코딩 컨벤션
- **JavaScript**: ESLint (Airbnb Style Guide)
- **CSS**: BEM 방법론 권장
- **커밋 메시지**: Conventional Commits

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **백엔드 & 인프라**: 김병수 사원 [IT]
- **AI 에이전트**: 이정욱 사원 [IT]
- **프론트**: 박상욱 사원 [IT]
- **디자인**: 박상욱 사원 [IT]
- **기획**: 박경연 사원 [경영]

## 📞 문의

- **이슈**: [GitHub Issues](https://github.com/26-Koscom-4/front/issues)
- **이메일**: dkxkqkrtkddn@naver.com

## 🙏 감사의 말

- [Chart.js](https://www.chartjs.org/) - 데이터 시각화
- [Google Fonts](https://fonts.google.com/) - 한글 웹폰트
- 모든 개인 투자자들에게

---

**Made with ❤️ for Korean Retail Investors (개미들)**

🐜 개미는 작지만 함께 모이면 강합니다!
