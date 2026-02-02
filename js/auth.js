// ========== 로그인 관리 ==========

// 로그인 상태 확인
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (isLoggedIn === 'true' && userId) {
        // 로그인된 상태
        showMainApp();
        return true;
    } else {
        // 로그인되지 않은 상태
        showLoginPage();
        return false;
    }
}

// 로그인 페이지 표시
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('mainHeader').style.display = 'none';

    // 다른 모든 페이지 숨기기
    const pages = ['mainPage', 'villagesPage', 'briefingPage', 'dailyBriefingPage', 'neighborsPage', 'mypagePage'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.remove('active');
            page.style.display = 'none';
        }
    });
}

// 메인 앱 표시
function showMainApp() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'block';

    // 메인 페이지로 이동
    showPage('main');
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();

    const userId = document.getElementById('loginId').value.trim();
    const userPw = document.getElementById('loginPw').value.trim();

    // 공백 체크
    if (!userId || !userPw) {
        showToast('아이디와 비밀번호를 입력해주세요.', 'error');
        return;
    }

    try {
        // API 로그인 호출
        const result = await fetchAPI('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: userId,
                password: userPw
            })
        });

        // 로그인 성공 처리
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.user?.name || userId);
        localStorage.setItem('accessToken', result.accessToken);

        // 입력 필드 초기화
        document.getElementById('loginId').value = '';
        document.getElementById('loginPw').value = '';

        // 메인 앱 표시
        showMainApp();

        // 환영 메시지
        setTimeout(() => {
            showToast(`✅ 환영합니다, ${result.user?.name || userId}님!`);
        }, 300);
    } catch (error) {
        console.error('로그인 오류:', error);
        showToast('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.', 'error');
    }
}

// 로그아웃 처리
function logout() {
    showConfirmModal({
        title: '로그아웃',
        message: '정말 로그아웃 하시겠습니까?',
        icon: '🚪',
        confirmText: '로그아웃',
        cancelText: '취소',
        confirmType: 'danger',
        onConfirm: async () => {
            try {
                // API 로그아웃 호출
                await fetchAPI('/logout', {
                    method: 'POST'
                });

                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('accessToken');

                // 로그인 페이지로 이동
                showLoginPage();

                showToast('로그아웃되었습니다.', 'info');
            } catch (error) {
                console.error('로그아웃 오류:', error);
                // 로그아웃 실패해도 로컬 상태는 정리
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('accessToken');
                showLoginPage();
            }
        }
    });
}

// 초기 로드
window.onload = () => {
    // 로그인 상태 확인
    const isLoggedIn = checkLoginStatus();

    if (isLoggedIn) {
        // 저장된 테마 적용
        const data = loadData();
        applyTheme(data.userProfile.theme || 'light');

        // showPage('main')이 호출되면서 자동으로 렌더링되므로 중복 호출 제거
        // renderVillages(), renderAssetChart() 등은 showPage()에서 처리됨
    }
};

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// 모달 외부 클릭 시 닫기
window.onclick = (event) => {
    const modal = document.getElementById('villageModal');
    if (event.target === modal) {
        closeModal();
    }

    const mydataModal = document.getElementById('mydataModal');
    if (event.target === mydataModal) {
        closeMydataModal();
    }
};

