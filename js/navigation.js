// ========== 개미 마을 메인 애플리케이션 ==========
// 의존성: api.js, data.js, storage.js, ui-utils.js, auth.js

// 페이지 전환
async function showPage(pageName) {
    console.log(`[DEBUG] showPage 호출: ${pageName}`);

    // 스크롤을 상단으로 이동
    window.scrollTo(0, 0);

    // 로그인 페이지는 제외하고 전환
    const pages = document.querySelectorAll('.page:not(#loginPage)');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    const pageMap = {
        'main': 'mainPage',
        'villages': 'villagesPage',
        'analysis': 'analysisPage',
        'briefing': 'briefingPage',
        'daily': 'dailyBriefingPage',
        'neighbors': 'neighborsPage',
        'mypage': 'mypagePage'
    };

    const targetPageId = pageMap[pageName];
    const targetPage = document.getElementById(targetPageId);

    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log(`[DEBUG] 페이지 전환 완료: ${targetPageId}`);
    } else {
        console.error(`[ERROR] 페이지를 찾을 수 없음: ${targetPageId}`);
    }

    // 네비게이션 활성 상태 업데이트
    updateNavigationState(pageName);

    // 페이지별 API 데이터 로드 및 초기화
    try {
        if (pageName === 'villages') {
            await renderVillages();
        } else if (pageName === 'main') {
            await renderMain();
        } else if (pageName === 'analysis') {
            await renderAnalysis();
        } else if (pageName === 'mypage') {
            await loadMypage();
        } else if (pageName === 'briefing') {
            console.log('[DEBUG] 브리핑 페이지 렌더링 시작');
            await renderBriefing();
        } else if (pageName === 'neighbors') {
            await renderNeighbors();
        } else if (pageName === 'daily') {
            await renderDaily();
        }
    } catch (error) {
        console.error('페이지 로드 오류:', error);
        showToast('페이지 로드 중 오류가 발생했습니다.', 'error');
    }
}

// 네비게이션 활성 상태 업데이트
function updateNavigationState(pageName) {
    // 데스크톱 네비게이션
    const desktopButtons = document.querySelectorAll('.desktop-nav button:not(.logout-button)');
    desktopButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 모바일 네비게이션
    const mobileButtons = document.querySelectorAll('.mobile-nav button:not(.mobile-logout-button)');
    mobileButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 현재 페이지에 해당하는 버튼 활성화
    const pageButtonMap = {
        'main': 0,
        'villages': 1,
        'briefing': 2,
        'neighbors': 3,
        'analysis': 4,
        'mypage': 5
    };

    const index = pageButtonMap[pageName];
    if (index !== undefined) {
        if (desktopButtons[index]) {
            desktopButtons[index].classList.add('active');
        }
        if (mobileButtons[index]) {
            mobileButtons[index].classList.add('active');
        }
    }
}

// 마을 카드 렌더링
