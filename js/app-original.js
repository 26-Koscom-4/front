// ========== API 설정 ==========
// 실제 API 연결 (주석처리됨 - 목업 데이터 사용 중)
/*
const API_BASE_URL = 'http://localhost:8000/api';

// API 호출 유틸리티 함수
async function fetchAPI(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        // 인증 토큰이 있으면 헤더에 추가
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const defaultOptions = {
            headers: headers,
        };

        const response = await fetch(url, { ...defaultOptions, ...options, headers: { ...headers, ...options.headers } });

        if (!response.ok) {
            // 401 Unauthorized인 경우 로그인 페이지로 이동
            if (response.status === 401) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('accessToken');
                showLoginPage();
                throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API 호출 오류:', error);
        if (!error.message.includes('인증이 필요합니다')) {
            showToast(`API 오류: ${error.message}`, 'error');
        }
        throw error;
    }
}
*/

// ========== 목업 API (Mock API) ==========
// 실제 서버 없이 동작하도록 목업 데이터 사용
async function fetchAPI(endpoint, options = {}) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log(`[MOCK API] ${options.method || 'GET'} ${endpoint}`);

    try {
        // 마을 목록 조회
        if (endpoint === '/villages' && (!options.method || options.method === 'GET')) {
            return { villages: sampleData.villages };
        }

        // 마을 추가
        if (endpoint === '/villages' && options.method === 'POST') {
            const newVillage = JSON.parse(options.body);
            console.log('[MOCK API] 새 마을 추가:', newVillage);
            return { success: true, village: newVillage };
        }

        // 특정 마을 상세 정보
        if (endpoint.startsWith('/villages/')) {
            const villageId = endpoint.split('/')[2];
            const village = sampleData.villages.find(v => v.id === villageId || v.name === villageId);
            return village || sampleData.villages[0];
        }

        // 브리핑 데이터
        if (endpoint === '/briefing') {
            return {
                villages: sampleData.villages.map(v => ({
                    id: v.id,
                    name: v.name,
                    icon: v.icon,
                    returnRate: v.returnRate,
                    totalValue: v.totalValue,
                    allocation: v.allocation,
                    assets: v.assets,
                    type: v.type,
                    goal: v.goal,
                    briefing: `${v.name}의 오늘 브리핑입니다. 현재 수익률은 ${v.returnRate}%입니다.`
                }))
            };
        }

        // 이웃 개미 추천
        if (endpoint === '/neighbors') {
            return {
                recommendations: sampleData.recommendation.recommendedVillages
            };
        }

        // 데일리 브리핑
        if (endpoint === '/daily') {
            // 배당마을 데이터 사용
            const dividendVillage = sampleData.villages.find(v => v.name === "배당마을") || sampleData.villages[1];

            const assetsHtml = dividendVillage.assets.map(asset => {
                const returnClass = asset.dailyReturn >= 0 ? 'positive' : 'negative';
                const returnSign = asset.dailyReturn >= 0 ? '+' : '';
                return `<p><strong>${asset.name}</strong>: ${asset.type} - ${asset.value.toLocaleString()}원 <span class="stat-value ${returnClass}">(전일 ${returnSign}${asset.dailyReturn}%)</span></p>`;
            }).join('');

            return {
                briefing_content: `
                    <div class="briefing-section">
                        <h3>🏘️ ${dividendVillage.name} 요약</h3>
                        <p><strong>총 자산:</strong> ${dividendVillage.totalValue.toLocaleString()}원</p>
                        <p><strong>수익률:</strong> <span class="stat-value ${dividendVillage.returnRate >= 0 ? 'positive' : 'negative'}">${dividendVillage.returnRate >= 0 ? '+' : ''}${dividendVillage.returnRate}%</span></p>
                        <p><strong>포트폴리오 비중:</strong> ${dividendVillage.allocation}%</p>
                    </div>
                    <div class="briefing-section">
                        <h3>💼 보유 자산</h3>
                        ${assetsHtml}
                    </div>
                    <div class="briefing-section">
                        <h3>📊 투자 정보</h3>
                        <p><strong>투자 유형:</strong> 배당형</p>
                        <p><strong>투자 목표:</strong> 배당 수익</p>
                    </div>
                    <div class="briefing-section">
                        <h3>💡 오늘의 조언</h3>
                        <p>배당주는 안정적인 현금 흐름을 제공하며 배당락일 체크가 필요합니다.</p>
                        <p style="margin-top: 10px;">💰 배당락일 3일 전입니다. 배당 수익 예상액을 확인하세요.</p>
                    </div>
                `
            };
        }

        // 메인 페이지 데이터
        if (endpoint === '/main') {
            return {
                villages: sampleData.villages,
                recommendation: sampleData.recommendation
            };
        }

        // 포트폴리오 분석 데이터
        if (endpoint === '/analysis') {
            return {
                villages: sampleData.villages,
                totalAssets: sampleData.villages.reduce((sum, v) => sum + v.totalValue, 0),
                totalReturn: (sampleData.villages.reduce((sum, v) => sum + v.returnRate, 0) / sampleData.villages.length).toFixed(2),
                riskLevel: 'moderate',
                monthlyChange: 5.2
            };
        }

        // 마이페이지 데이터
        if (endpoint === '/mypage') {
            return {
                userProfile: sampleData.userProfile,
                settings: sampleData.settings,
                villages: sampleData.villages,
                investment_test: {
                    completed: false
                }
            };
        }

        // 로그인
        if (endpoint === '/login' && options.method === 'POST') {
            const credentials = JSON.parse(options.body);
            return {
                success: true,
                accessToken: 'mock-token-' + Date.now(),
                user: {
                    name: credentials.username || '김직장'
                }
            };
        }

        // 로그아웃
        if (endpoint === '/logout' && options.method === 'POST') {
            return { success: true };
        }

        // 기본 응답
        return { success: true };

    } catch (error) {
        console.error('[MOCK API] 오류:', error);
        throw error;
    }
}

// ========== Toast 알림 시스템 ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== 확인 모달 시스템 ==========
function showConfirmModal(options) {
    const {
        title = '확인',
        message = '정말로 진행하시겠습니까?',
        icon = '❓',
        confirmText = '확인',
        cancelText = '취소',
        confirmType = 'danger', // 'danger' or 'primary'
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    const modal = document.getElementById('confirmModal');
    const confirmIcon = document.getElementById('confirmIcon');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmConfirmBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    // 내용 설정
    confirmIcon.textContent = icon;
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    // 버튼 타입 설정
    confirmBtn.className = `confirm-button confirm ${confirmType}`;

    // 모달 표시
    modal.classList.add('active');

    // 이벤트 핸들러
    const handleConfirm = () => {
        modal.classList.remove('active');
        onConfirm();
        cleanup();
    };

    const handleCancel = () => {
        modal.classList.remove('active');
        onCancel();
        cleanup();
    };

    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // 오버레이 클릭으로 닫기
    modal.onclick = (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    };
}

// ========== 목업 데이터 (Mock Data) ==========
// 실제 서버 없이 동작하도록 사용되는 샘플 데이터
const sampleData = {
    userProfile: {
        name: "김직장",
        theme: "light"
    },
    recommendation: {
        hasNewRecommendation: true,
        lastCheckedDate: null,
        recommendedVillages: ['원자재 마을', '신흥국 마을', '채권 마을']
    },
    villages: [
        {
            id: "v1",
            name: "미장마을",
            icon: "🇺🇸",
            assets: [
                { name: "AAPL", type: "기술주", value: 4000000, ticker: "AAPL", previousOpen: 225.50, previousClose: 228.75, dailyReturn: 1.44 },
                { name: "TSLA", type: "성장주", value: 3500000, ticker: "TSLA", previousOpen: 412.30, previousClose: 405.80, dailyReturn: -1.58 },
                { name: "NVDA", type: "AI주", value: 4500000, ticker: "NVDA", previousOpen: 875.20, previousClose: 892.60, dailyReturn: 1.99 },
                { name: "MSFT", type: "기술주", value: 3000000, ticker: "MSFT", previousOpen: 421.85, previousClose: 425.30, dailyReturn: 0.82 }
            ],
            type: "growth",
            goal: "long-term",
            totalValue: 15000000,
            returnRate: 12.5,
            allocation: 32.3,
            lastBriefingRead: null
        },
        {
            id: "v2",
            name: "배당마을",
            icon: "💰",
            assets: [
                { name: "O", type: "배당ETF", value: 3000000, ticker: "O", previousOpen: 56.80, previousClose: 57.25, dailyReturn: 0.79 },
                { name: "SCHD", type: "배당ETF", value: 3000000, ticker: "SCHD", previousOpen: 78.50, previousClose: 78.95, dailyReturn: 0.57 },
                { name: "VYM", type: "배당ETF", value: 2000000, ticker: "VYM", previousOpen: 112.30, previousClose: 113.10, dailyReturn: 0.71 }
            ],
            type: "dividend",
            goal: "passive-income",
            totalValue: 8000000,
            returnRate: 8.3,
            allocation: 17.2,
            lastBriefingRead: null
        },
        {
            id: "v3",
            name: "레버리지마을",
            icon: "🚀",
            assets: [
                { name: "TQQQ", type: "레버리지ETF", value: 2000000, ticker: "TQQQ", previousOpen: 68.50, previousClose: 66.80, dailyReturn: -2.48 },
                { name: "UPRO", type: "레버리지ETF", value: 1500000, ticker: "UPRO", previousOpen: 62.30, previousClose: 61.10, dailyReturn: -1.93 },
                { name: "SOXL", type: "레버리지ETF", value: 1500000, ticker: "SOXL", previousOpen: 28.90, previousClose: 29.70, dailyReturn: 2.77 }
            ],
            type: "leverage",
            goal: "high-risk",
            totalValue: 5000000,
            returnRate: -5.2,
            allocation: 10.8,
            lastBriefingRead: null
        },
        {
            id: "v4",
            name: "국장마을",
            icon: "🇰🇷",
            assets: [
                { name: "삼성전자", type: "한국주식", value: 2000000, ticker: "005930", previousOpen: 72500, previousClose: 73200, dailyReturn: 0.97 },
                { name: "SK하이닉스", type: "한국주식", value: 1500000, ticker: "000660", previousOpen: 198000, previousClose: 201500, dailyReturn: 1.77 },
                { name: "NAVER", type: "한국주식", value: 1500000, ticker: "035420", previousOpen: 186500, previousClose: 184000, dailyReturn: -1.34 }
            ],
            type: "domestic",
            goal: "balanced",
            totalValue: 5000000,
            returnRate: 6.8,
            allocation: 10.8,
            lastBriefingRead: null
        },
        {
            id: "v5",
            name: "글로벌ETF마을",
            icon: "🌍",
            assets: [
                { name: "VTI", type: "성장ETF", value: 3000000, ticker: "VTI", previousOpen: 298.50, previousClose: 301.20, dailyReturn: 0.90 },
                { name: "QQQ", type: "성장ETF", value: 2500000, ticker: "QQQ", previousOpen: 522.80, previousClose: 527.30, dailyReturn: 0.86 },
                { name: "SPY", type: "성장ETF", value: 2000000, ticker: "SPY", previousOpen: 588.20, previousClose: 591.80, dailyReturn: 0.61 }
            ],
            type: "etf",
            goal: "diversification",
            totalValue: 7500000,
            returnRate: 9.2,
            allocation: 16.1,
            lastBriefingRead: null
        },
        {
            id: "v6",
            name: "반도체마을",
            icon: "🔬",
            assets: [
                { name: "TSM", type: "기술주", value: 2500000, ticker: "TSM", previousOpen: 195.30, previousClose: 199.80, dailyReturn: 2.30 },
                { name: "ASML", type: "기술주", value: 2000000, ticker: "ASML", previousOpen: 832.50, previousClose: 845.20, dailyReturn: 1.53 },
                { name: "AMD", type: "AI주", value: 1500000, ticker: "AMD", previousOpen: 128.40, previousClose: 131.90, dailyReturn: 2.73 }
            ],
            type: "semiconductor",
            goal: "sector-focus",
            totalValue: 6000000,
            returnRate: 15.3,
            allocation: 12.9,
            lastBriefingRead: null
        }
    ],
    settings: {
        briefing_time: "08:00",
        voice_speed: 1.0
    }
};

// 페이지 로드 시 초기화
// sampleData는 목업 API에서 사용됩니다

// [DEPRECATED] 레거시 함수 - API 기반으로 변경되었습니다
function loadData() {
    console.warn('loadData()는 더 이상 사용되지 않습니다. API를 사용하세요.');
    const data = localStorage.getItem('antVillageData');
    return data ? JSON.parse(data) : sampleData;
}

// 데이터 초기화 함수 (디버깅용)
function resetData() {
    localStorage.setItem('antVillageData', JSON.stringify(sampleData));
    console.log('데이터가 초기화되었습니다.');
    location.reload();
}

// [DEPRECATED] 레거시 함수 - API 기반으로 변경되었습니다
function saveData(data) {
    console.warn('saveData()는 더 이상 사용되지 않습니다. API를 사용하세요.');
    localStorage.setItem('antVillageData', JSON.stringify(data));
}

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
        'analysis': 2,
        'briefing': 3,
        'neighbors': 4,
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
async function renderVillages() {
    const grid = document.getElementById('villageGrid');
    grid.innerHTML = '<div style="text-align: center; padding: 40px;">로딩 중...</div>';

    try {
        const data = await fetchAPI('/villages');
        grid.innerHTML = '';

        if (!data.villages || data.villages.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">마을이 없습니다.</div>';
            return;
        }

        data.villages.forEach(village => {
            const card = document.createElement('div');
            card.className = 'village-card fade-in';
            card.onclick = () => showVillageDetail(village.id, village.name);

            const returnClass = village.returnRate >= 0 ? 'positive' : 'negative';
            const returnSign = village.returnRate >= 0 ? '+' : '';

            card.innerHTML = `
                <div class="village-header">
                    <div class="village-name">${village.name}</div>
                    <div class="village-icon">${village.icon}</div>
                </div>
                <div class="village-stats">
                    <div class="stat-row">
                        <span class="stat-label">총 자산</span>
                        <span class="stat-value">${village.totalValue.toLocaleString()}원</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">수익률</span>
                        <span class="stat-value ${returnClass}">${returnSign}${village.returnRate}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">포트폴리오 비중</span>
                        <span class="stat-value">${village.allocation}%</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${village.allocation}%"></div>
                </div>
                <div class="assets-list">
                    ${village.assets.map(asset => `<span class="asset-tag">${typeof asset === 'string' ? asset : asset.name}</span>`).join('')}
                </div>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--danger);">마을 목록을 불러오는데 실패했습니다.</div>';
    }
}

// 마을 상세 정보 모달
async function showVillageDetail(villageId, villageName) {
    try {
        const village = await fetchAPI(`/villages/${villageId}`);

        const modal = document.getElementById('villageModal');
        const content = document.getElementById('modalContent');

        const returnClass = village.returnRate >= 0 ? 'positive' : 'negative';
        const returnSign = village.returnRate >= 0 ? '+' : '';

        content.innerHTML = `
            <h2 style="color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 48px;">${village.icon}</span>
                <span>${village.name}</span>
            </h2>

            <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%); border-radius: 15px;">
                <h3 style="color: var(--primary); margin-bottom: 15px;">📊 마을 현황</h3>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-light);">총 자산</span>
                        <span style="font-weight: 700; color: var(--dark);">${village.totalValue.toLocaleString()}원</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-light);">수익률</span>
                        <span class="stat-value ${returnClass}" style="font-weight: 700;">${returnSign}${village.returnRate}%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-light);">포트폴리오 비중</span>
                        <span style="font-weight: 700; color: var(--dark);">${village.allocation}%</span>
                    </div>
                </div>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: var(--primary); margin-bottom: 10px;">💼 보유 자산 (${village.assets.length}개)</h3>
                <div class="assets-list" style="margin-top: 15px;">
                    ${village.assets.map(asset => {
                        const assetName = typeof asset === 'string' ? asset : asset.name;
                        return `<span class="asset-tag">${assetName}</span>`;
                    }).join('')}
                </div>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: var(--light); border-radius: 10px;">
                <div style="margin-bottom: 8px;">
                    <strong style="color: var(--dark);">투자 유형:</strong>
                    <span style="color: var(--text);">${getVillageTypeText(village.type)}</span>
                </div>
                <div>
                    <strong style="color: var(--dark);">투자 목표:</strong>
                    <span style="color: var(--text);">${getVillageGoalText(village.goal)}</span>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 25px;">
                <button class="audio-button" onclick="goToVillageAndCloseModal('${village.name}')" style="flex: 1; background: var(--success);">
                    🏘️ 마을로 이동
                </button>
                <button class="audio-button" onclick="closeModal()" style="flex: 1; background: var(--text-light);">
                    닫기
                </button>
            </div>
        `;

        modal.classList.add('active');
    } catch (error) {
        console.error('마을 상세 정보 로드 오류:', error);
        showToast('마을 정보를 불러오는데 실패했습니다.', 'error');
    }
}

function closeModal() {
    document.getElementById('villageModal').classList.remove('active');
}

// 모달을 닫고 마을로 이동
function goToVillageAndCloseModal(villageName) {
    closeModal();
    setTimeout(() => {
        goToVillage(villageName);
    }, 300); // 모달 닫기 애니메이션 대기
}

// 마을로 이동
function goToVillage(villageName) {
    const data = loadData();
    const village = data.villages.find(v => v.name === villageName);

    if (village) {
        // 마을 이름 업데이트
        document.getElementById('dailyVillageName').textContent = village.name;

        // 마을 아이콘으로 아바타 변경
        const avatar = document.querySelector('#dailyBriefingPage .ant-avatar');
        if (avatar) {
            avatar.textContent = village.icon;
        }

        // 브리핑 내용 업데이트
        const briefingContent = document.getElementById('dailyBriefingContent');
        briefingContent.innerHTML = `
            <div class="briefing-section">
                <h3>🏘️ ${village.name} 현황</h3>
                <p><strong>총 자산:</strong> ${village.totalValue.toLocaleString()}원</p>
                <p><strong>수익률:</strong> <span style="color: ${village.returnRate >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                    ${village.returnRate >= 0 ? '+' : ''}${village.returnRate}%
                </span></p>
                <p><strong>포트폴리오 비중:</strong> ${village.allocation}%</p>
            </div>

            <div class="briefing-section">
                <h3>💼 보유 자산</h3>
                ${village.assets.map(asset => {
                    const assetName = typeof asset === 'string' ? asset : asset.name;
                    const assetType = typeof asset === 'string' ? '' : ` (${asset.type})`;
                    const assetValue = typeof asset === 'string' ? '' : ` - ${asset.value.toLocaleString()}원`;
                    return `<p>• ${assetName}${assetType}${assetValue}</p>`;
                }).join('')}
            </div>

            <div class="briefing-section">
                <h3>📊 투자 정보</h3>
                <p><strong>투자 유형:</strong> ${getVillageTypeText(village.type)}</p>
                <p><strong>투자 목표:</strong> ${getVillageGoalText(village.goal)}</p>
            </div>

            <div class="briefing-section">
                <h3>💡 오늘의 조언</h3>
                <p>${getVillageAdvice(village)}</p>
            </div>
        `;

        // 브리핑 읽음 처리
        markBriefingAsRead(villageName);

        // 마을별 정기 브리핑 페이지로 이동
        showPage('daily');
    } else {
        showToast('해당 마을을 찾을 수 없습니다.', 'error');
    }
}

// 브리핑 읽음 처리
function markBriefingAsRead(villageName) {
    const data = loadData();
    const village = data.villages.find(v => v.name === villageName);

    if (village) {
        // 오늘 날짜를 저장
        village.lastBriefingRead = new Date().toISOString().split('T')[0];
        saveData(data);

        // 뱃지 업데이트
        renderMapBadges();
    }
}

// 브리핑 읽음 여부 체크 (오늘 날짜 기준)
function isBriefingUnread(village) {
    if (!village.lastBriefingRead) {
        return true; // 한 번도 읽지 않음
    }

    const today = new Date().toISOString().split('T')[0];
    return village.lastBriefingRead !== today; // 오늘 읽지 않았으면 미읽음
}

// 지도 뱃지 렌더링
function renderMapBadges(mainData = null) {
    if (!mainData || !mainData.villages) return;

    // 마을 이름과 뱃지 ID 매핑
    const villageBadgeMap = {
        '국장마을': 'badge-국장마을',
        '미장마을': 'badge-미장마을',
        '배당마을': 'badge-배당마을',
        '글로벌ETF마을': 'badge-글로벌ETF마을'
    };

    // 각 마을의 읽음 상태 확인
    mainData.villages.forEach(village => {
        const badgeId = villageBadgeMap[village.name];
        if (badgeId) {
            const badge = document.getElementById(badgeId);
            if (badge) {
                if (isBriefingUnread(village)) {
                    badge.style.display = 'block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    });
}

// 마을 유형 텍스트 변환
function getVillageTypeText(type) {
    const typeMap = {
        'growth': '성장형',
        'dividend': '배당형',
        'leverage': '레버리지형',
        'domestic': '국내주식',
        'etf': '글로벌 ETF',
        'semiconductor': '반도체 섹터'
    };
    return typeMap[type] || type;
}

// 마을 목표 텍스트 변환
function getVillageGoalText(goal) {
    const goalMap = {
        'long-term': '장기 투자',
        'passive-income': '배당 소득',
        'high-risk': '고위험 고수익',
        'balanced': '균형 투자',
        'diversification': '분산 투자',
        'sector-focus': '섹터 집중'
    };
    return goalMap[goal] || goal;
}

// 마을별 조언 생성
function getVillageAdvice(village) {
    const adviceMap = {
        'growth': '성장주는 장기적인 관점에서 접근하세요. 단기 변동성에 흔들리지 마세요.',
        'dividend': '배당주는 꾸준한 현금 흐름을 제공합니다. 배당락일을 체크하세요.',
        'leverage': '⚠️ 레버리지 상품은 높은 변동성을 가집니다. 리스크 관리에 주의하세요.',
        'domestic': '국내 시장 뉴스와 정책 변화를 주시하세요.',
        'etf': '글로벌 분산 투자로 리스크를 낮추고 있습니다. 좋은 전략입니다!',
        'semiconductor': '반도체 업황과 글로벌 수요 동향을 주목하세요.'
    };
    return adviceMap[village.type] || '꾸준한 모니터링과 리밸런싱을 권장합니다.';
}

// 브리핑 페이지 렌더링
async function renderBriefing() {
    console.log('[DEBUG] renderBriefing 시작');
    try {
        await renderVillageSelector();
        console.log('[DEBUG] renderBriefing 완료');
    } catch (error) {
        console.error('[ERROR] renderBriefing 오류:', error);
        showToast('브리핑 페이지 로드 중 오류가 발생했습니다.', 'error');
    }
}

// 마을 선택기 렌더링
async function renderVillageSelector() {
    console.log('[DEBUG] renderVillageSelector 시작');
    const grid = document.getElementById('villageSelectorGrid');
    const selector = document.querySelector('.village-selector');
    const selectedBriefing = document.getElementById('selectedVillageBriefing');

    if (!grid) {
        console.error('[ERROR] villageSelectorGrid 요소를 찾을 수 없습니다.');
        return;
    }

    grid.innerHTML = '<div style="text-align: center; padding: 40px;">로딩 중...</div>';

    try {
        const data = await fetchAPI('/briefing');
        console.log('[DEBUG] 브리핑 데이터:', data);

        grid.innerHTML = '';

        if (!data.villages || data.villages.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">마을이 없습니다.</div>';
            console.warn('[WARN] 마을 데이터가 없습니다.');
            return;
        }

        console.log(`[DEBUG] ${data.villages.length}개의 마을 렌더링 중...`);

        data.villages.forEach(village => {
            const card = document.createElement('div');
            card.className = 'village-selector-card';
            card.onclick = () => selectVillageForBriefing(village.name, village);

            const returnClass = village.returnRate >= 0 ? 'positive' : 'negative';
            const returnSign = village.returnRate >= 0 ? '+' : '';

            card.innerHTML = `
                <div class="village-selector-icon">${village.icon}</div>
                <div class="village-selector-name">${village.name}</div>
                <div class="village-selector-return ${returnClass}">${returnSign}${village.returnRate}%</div>
            `;

            grid.appendChild(card);
        });

        // 브리핑 컨텐츠 숨기고 마을 선택기 표시
        if (selectedBriefing) {
            selectedBriefing.style.display = 'none';
        }
        if (selector) {
            selector.style.display = 'block';
        }

        console.log('[DEBUG] 마을 선택기 렌더링 완료');
    } catch (error) {
        console.error('[ERROR] renderVillageSelector 오류:', error);
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--danger);">브리핑 데이터 로드에 실패했습니다.<br>개발자 도구(F12)에서 콘솔을 확인해주세요.</div>';
    }
}

// 마을 선택 시 브리핑 표시
function selectVillageForBriefing(villageName, villageData = null) {
    const village = villageData;

    if (!village) return;

    // 마을 아이콘과 이름 업데이트
    document.getElementById('briefingAntAvatar').textContent = village.icon;
    document.getElementById('briefingVillageName').textContent = village.name + ' 브리핑';

    // 브리핑 내용 생성
    const briefingContent = document.getElementById('briefingContent');
    briefingContent.innerHTML = generateVillageBriefingContent(village);

    // 선택기 숨기고 브리핑 표시
    document.querySelector('.village-selector').style.display = 'none';
    document.getElementById('selectedVillageBriefing').style.display = 'block';
}

// 마을별 브리핑 내용 생성
function generateVillageBriefingContent(village) {
    const returnClass = village.returnRate >= 0 ? 'positive' : 'negative';
    const returnSign = village.returnRate >= 0 ? '+' : '';

    return `
        <div class="briefing-section">
            <h3>🏘️ ${village.name} 현황</h3>
            <p>주인님, 좋은 아침입니다! ${village.name}의 현재 상황을 알려드립니다.</p>
            <p><strong>총 자산:</strong> ${village.totalValue.toLocaleString()}원</p>
            <p><strong>수익률:</strong> <span class="stat-value ${returnClass}">${returnSign}${village.returnRate}%</span></p>
            <p><strong>포트폴리오 비중:</strong> ${village.allocation}%</p>
        </div>

        <div class="briefing-section">
            <h3>💼 보유 자산 분석</h3>
            ${village.assets.map(asset => {
                const assetName = typeof asset === 'string' ? asset : asset.name;
                const assetType = typeof asset === 'string' ? '' : ` (${asset.type})`;

                // 전일자 시가/종가 수익률 표시
                let returnInfo = '';
                if (asset.dailyReturn !== undefined && asset.dailyReturn !== null) {
                    const returnClass = asset.dailyReturn >= 0 ? 'positive' : 'negative';
                    const returnSign = asset.dailyReturn >= 0 ? '+' : '';
                    returnInfo = ` <span class="stat-value ${returnClass}">[전일 ${returnSign}${asset.dailyReturn}%]</span>`;
                }

                return `<p>• <strong>${assetName}</strong>${assetType}${returnInfo} - 안정적으로 운영 중입니다.</p>`;
            }).join('')}
        </div>

        <div class="briefing-section">
            <h3>📊 투자 전략</h3>
            <p><strong>투자 유형:</strong> ${getVillageTypeText(village.type)}</p>
            <p><strong>투자 목표:</strong> ${getVillageGoalText(village.goal)}</p>
        </div>

        <div class="briefing-section">
            <h3>💡 오늘의 조언</h3>
            <p>${getVillageAdvice(village)}</p>
            ${getMarketAdvice(village)}
        </div>

        <div class="briefing-section">
            <h3>📅 금일 체크리스트</h3>
            <p>✓ 시장 변동성 모니터링</p>
            <p>✓ 주요 뉴스 확인</p>
            <p>✓ 리밸런싱 필요 여부 검토</p>
        </div>
    `;
}

// 마을 유형별 시장 조언
function getMarketAdvice(village) {
    const adviceMap = {
        'growth': '<p style="margin-top: 10px;">📈 기술주 중심 포트폴리오입니다. 실적 발표 시즌을 주목하세요.</p>',
        'dividend': '<p style="margin-top: 10px;">💰 배당락일 3일 전입니다. 배당 수익 예상액을 확인하세요.</p>',
        'leverage': '<p style="margin-top: 10px;">⚠️ VIX 지수가 상승 중입니다. 포지션 조정을 고려하세요.</p>',
        'domestic': '<p style="margin-top: 10px;">🇰🇷 오늘 국내 증시는 외국인 수급에 주목하세요.</p>',
        'etf': '<p style="margin-top: 10px;">🌍 글로벌 시장이 안정세를 보이고 있습니다.</p>',
        'semiconductor': '<p style="margin-top: 10px;">🔬 반도체 업황 지표와 수주 동향을 체크하세요.</p>'
    };
    return adviceMap[village.type] || '';
}

// 마을 선택기로 돌아가기
function showVillageSelector() {
    renderVillageSelector();
}

// 이웃 개미 페이지 렌더링
async function renderNeighbors() {
    try {
        const data = await fetchAPI('/neighbors');
        // 이웃 개미 페이지는 현재 정적 콘텐츠이므로 데이터만 로드
        console.log('이웃 개미 데이터 로드 완료:', data);
    } catch (error) {
        console.error('이웃 개미 데이터 로드 오류:', error);
    }
}

// 데일리 브리핑 페이지 렌더링
async function renderDaily() {
    try {
        const data = await fetchAPI('/daily');
        // 데일리 브리핑 데이터 표시
        if (data.briefing_content) {
            const contentElement = document.getElementById('dailyBriefingContent');
            if (contentElement) {
                contentElement.innerHTML = data.briefing_content;
            }
        }
    } catch (error) {
        console.error('데일리 브리핑 로드 오류:', error);
    }
}

// TTS 음성 브리핑
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

function playBriefing() {
    const content = document.getElementById('briefingContent').innerText;

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(content);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = 1.0;
    currentUtterance.pitch = 1.0;

    speechSynthesis.speak(currentUtterance);
}

function stopBriefing() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

function playDailyBriefing() {
    const content = document.getElementById('dailyBriefingContent').innerText;

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(content);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = 1.0;

    speechSynthesis.speak(currentUtterance);
}

// 마을 추가
async function addVillage(villageName) {
    try {
        const newVillage = {
            name: villageName,
            icon: villageName.includes('원자재') ? '🏆' : (villageName.includes('신흥국') ? '🌏' : '🏦'),
            type: "new",
            goal: "diversification"
        };

        const result = await fetchAPI('/villages', {
            method: 'POST',
            body: JSON.stringify(newVillage)
        });

        showToast(`"${villageName}"이(가) 내 포트폴리오에 추가되었습니다! 🎉`);

        // 마을 관리 페이지로 이동
        setTimeout(() => {
            showPage('villages');
        }, 1500);
    } catch (error) {
        console.error('마을 추가 오류:', error);
        showToast('마을 추가에 실패했습니다.', 'error');
    }
}

// ========== 추천 마을 관리 ==========

// 추천 배너 및 핫스팟 렌더링
function renderRecommendationBanner(mainData = null) {
    const banner = document.getElementById('recommendationBanner');
    const hotspot = document.getElementById('recommendationHotspot');

    if (!mainData || !mainData.recommendation) {
        if (banner) banner.style.display = 'none';
        if (hotspot) hotspot.style.display = 'none';
        return;
    }

    if (mainData.recommendation.hasNewRecommendation && mainData.recommendation.recommendedVillages && mainData.recommendation.recommendedVillages.length > 0) {
        // 추천이 있는 경우 배너와 핫스팟 표시
        if (banner) banner.style.display = 'flex';
        if (hotspot) hotspot.style.display = 'block';
    } else {
        // 추천이 없는 경우 숨김
        if (banner) banner.style.display = 'none';
        if (hotspot) hotspot.style.display = 'none';
    }
}

// 추천 페이지로 이동
function goToRecommendations() {
    const data = loadData();

    // 추천 확인 날짜 업데이트
    if (data.recommendation) {
        data.recommendation.lastCheckedDate = new Date().toISOString();
        saveData(data);
    }

    // 이웃 개미 페이지로 이동
    showPage('neighbors');

    // 활동 기록 추가
    addActivity('새로운 이웃 마을 추천을 확인했습니다');
}

// 추천 마을 생성 (테스트용 함수)
function generateNewRecommendation() {
    const data = loadData();

    if (!data.recommendation) {
        data.recommendation = {};
    }

    data.recommendation.hasNewRecommendation = true;
    data.recommendation.recommendedVillages = ['원자재 마을', '신흥국 마을', '채권 마을'];

    saveData(data);
    renderRecommendationBanner();

    showToast('✨ 새로운 이웃 마을 추천이 생성되었습니다!');
}

// 메인 페이지 렌더링
async function renderMain() {
    try {
        const data = await fetchAPI('/main');
        await renderAssetChart(data);
        renderMapBadges(data);
        renderRecommendationBanner(data);
    } catch (error) {
        console.error('메인 페이지 로드 오류:', error);
    }
}

// 자산 차트 생성
let assetChart = null;

async function renderAssetChart(mainData = null) {
    const canvas = document.getElementById('assetPieChart');

    if (!canvas) return;

    // 기존 차트가 있으면 제거
    if (assetChart) {
        assetChart.destroy();
    }

    // mainData가 없으면 API에서 가져오기
    let data = mainData;
    if (!data) {
        try {
            data = await fetchAPI('/main');
        } catch (error) {
            console.error('메인 데이터 로드 실패:', error);
            return;
        }
    }

    // 자산 유형별로 그룹화
    const assetTypeMap = {};
    let totalAssets = 0;

    data.villages.forEach(village => {
        village.assets.forEach(asset => {
            // 하위 호환성: asset이 문자열인 경우 처리
            const assetType = typeof asset === 'string' ? '기타' : asset.type;
            const assetValue = typeof asset === 'string' ? 0 : asset.value;

            if (!assetTypeMap[assetType]) {
                assetTypeMap[assetType] = {
                    value: 0,
                    assets: []
                };
            }
            assetTypeMap[assetType].value += assetValue;
            assetTypeMap[assetType].assets.push(typeof asset === 'string' ? asset : asset.name);
            totalAssets += assetValue;
        });
    });

    // 차트 데이터 준비
    const labels = Object.keys(assetTypeMap);
    const values = Object.values(assetTypeMap).map(item => item.value);

    // 유형별 아이콘 매핑
    const typeIcons = {
        '배당ETF': '💰',
        '성장ETF': '📈',
        '기술주': '💻',
        'AI주': '🤖',
        '성장주': '🚀',
        '레버리지ETF': '⚡',
        '한국주식': '🇰🇷',
        '기타': '📊'
    };

    // 유형별 색상
    const typeColors = {
        '배당ETF': 'rgba(255, 107, 53, 0.8)',
        '성장ETF': 'rgba(247, 147, 30, 0.8)',
        '기술주': 'rgba(78, 205, 196, 0.8)',
        'AI주': 'rgba(255, 210, 63, 0.8)',
        '성장주': 'rgba(155, 89, 182, 0.8)',
        '레버리지ETF': 'rgba(52, 152, 219, 0.8)',
        '한국주식': 'rgba(231, 76, 60, 0.8)',
        '기타': 'rgba(149, 165, 166, 0.8)'
    };

    const colors = labels.map(label => typeColors[label] || 'rgba(149, 165, 166, 0.8)');

    // 총 자산 표시
    document.getElementById('totalAssets').textContent = totalAssets.toLocaleString() + '원';

    // 범례 아이템 생성
    const legendContainer = document.getElementById('legendItems');
    legendContainer.innerHTML = '';

    labels.forEach((assetType, index) => {
        const value = values[index];
        const percentage = ((value / totalAssets) * 100).toFixed(1);
        const icon = typeIcons[assetType] || '📊';

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-item-left">
                <div class="legend-color" style="background: ${colors[index]}"></div>
                <span class="legend-icon">${icon}</span>
                <span class="legend-name">${assetType}</span>
            </div>
            <div class="legend-item-right">
                <div class="legend-value">${value.toLocaleString()}원</div>
                <div class="legend-percentage">${percentage}%</div>
            </div>
        `;
        legendContainer.appendChild(legendItem);
    });

    // 중앙 텍스트 플러그인
    const centerTextPlugin = {
        id: 'centerText',
        afterDatasetsDraw(chart) {
            const { ctx, chartArea: { left, top, right, bottom } } = chart;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;

            ctx.save();
            ctx.font = 'bold 14px "Noto Sans KR"';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('총 자산', centerX, centerY - 15);

            ctx.font = 'bold 20px "Noto Sans KR"';
            ctx.fillStyle = '#FF6B35';
            ctx.fillText(totalAssets.toLocaleString() + '원', centerX, centerY + 10);
            ctx.restore();
        }
    };

    // Chart.js로 차트 생성
    const ctx = canvas.getContext('2d');
    assetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toLocaleString()}원 (${percentage}%)`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 13,
                        family: '"Noto Sans KR", sans-serif'
                    },
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        const label = context.chart.data.labels[context.dataIndex];

                        // 비율이 5% 미만이면 라벨 숨김 (공간 절약)
                        if (percentage < 5) {
                            return '';
                        }

                        return label + '\n' + percentage + '%';
                    },
                    textAlign: 'center',
                    anchor: 'center',
                    align: 'center',
                    textShadowBlur: 4,
                    textShadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            cutout: '60%'
        },
        plugins: [centerTextPlugin]
    });
}

// ========== 포트폴리오 분석 페이지 ==========

let villagePerformanceChart = null;
let assetTypeChart = null;

// 포트폴리오 분석 페이지 렌더링
async function renderAnalysis() {
    try {
        const data = await fetchAPI('/analysis');

        // 요약 카드 업데이트
        document.getElementById('analysisTotalAssets').textContent = data.totalAssets.toLocaleString() + '원';
        document.getElementById('analysisTotalReturn').textContent = (data.totalReturn >= 0 ? '+' : '') + data.totalReturn + '%';
        document.getElementById('analysisVillageCount').textContent = data.villages.length + '개';

        // 자산 변화 계산
        const assetChange = (data.totalAssets * data.monthlyChange / 100);
        document.getElementById('analysisAssetChange').textContent =
            '+' + assetChange.toLocaleString() + '원 (+' + data.monthlyChange + '%)';
        document.getElementById('analysisAssetChange').className =
            'analysis-card-change ' + (data.monthlyChange >= 0 ? 'positive' : 'negative');

        // 수익률 변화
        document.getElementById('analysisReturnChange').textContent = '전월 대비 +2.3%p';
        document.getElementById('analysisReturnChange').className = 'analysis-card-change positive';

        // 자산 개수
        const totalAssetCount = data.villages.reduce((sum, v) => sum + v.assets.length, 0);
        document.getElementById('analysisVillageInfo').textContent = totalAssetCount + '개 자산 보유';

        // 리스크 등급
        const riskInfo = getRiskInfo(data.totalReturn);
        document.getElementById('analysisRiskLevel').textContent = riskInfo.level;
        document.getElementById('analysisRiskDesc').textContent = riskInfo.desc;

        // 차트 렌더링
        renderVillagePerformanceChart(data.villages);
        renderAssetTypeChart(data.villages);

        // 상위/하위 종목 렌더링
        renderTopPerformers(data.villages);
        renderBottomPerformers(data.villages);

        // 리밸런싱 추천
        renderRebalancingRecommendations(data);

    } catch (error) {
        console.error('포트폴리오 분석 로드 오류:', error);
    }
}

// 리스크 등급 계산
function getRiskInfo(totalReturn) {
    const returnNum = parseFloat(totalReturn);
    if (returnNum < 0) {
        return { level: '고위험', desc: '손실 발생 중' };
    } else if (returnNum < 5) {
        return { level: '안정', desc: '안정적인 운용' };
    } else if (returnNum < 10) {
        return { level: '중립', desc: '균형잡힌 포트폴리오' };
    } else {
        return { level: '공격', desc: '고수익 추구형' };
    }
}

// 마을별 수익률 차트
function renderVillagePerformanceChart(villages) {
    const canvas = document.getElementById('villagePerformanceChart');
    if (!canvas) return;

    if (villagePerformanceChart) {
        villagePerformanceChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const labels = villages.map(v => v.name);
    const data = villages.map(v => v.returnRate);
    const colors = data.map(rate => rate >= 0 ? 'rgba(78, 205, 196, 0.8)' : 'rgba(255, 107, 107, 0.8)');

    villagePerformanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '수익률 (%)',
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '수익률: ' + (context.parsed.y >= 0 ? '+' : '') + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 자산 유형별 분포 차트
function renderAssetTypeChart(villages) {
    const canvas = document.getElementById('assetTypeDistributionChart');
    if (!canvas) return;

    if (assetTypeChart) {
        assetTypeChart.destroy();
    }

    // 자산 유형별 집계
    const assetTypeMap = {};
    villages.forEach(village => {
        village.assets.forEach(asset => {
            const assetType = typeof asset === 'string' ? '기타' : asset.type;
            const assetValue = typeof asset === 'string' ? 0 : asset.value;
            assetTypeMap[assetType] = (assetTypeMap[assetType] || 0) + assetValue;
        });
    });

    const ctx = canvas.getContext('2d');
    const labels = Object.keys(assetTypeMap);
    const data = Object.values(assetTypeMap);

    assetTypeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 107, 53, 0.8)',
                    'rgba(247, 147, 30, 0.8)',
                    'rgba(78, 205, 196, 0.8)',
                    'rgba(255, 210, 63, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(149, 165, 166, 0.8)'
                ],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value.toLocaleString() + '원';
                        }
                    }
                }
            }
        }
    });
}

// 상위 종목 렌더링
function renderTopPerformers(villages) {
    const container = document.getElementById('topPerformers');
    if (!container) return;

    // 모든 자산 수집 및 수익률 계산 (임의 생성)
    const allAssets = [];
    villages.forEach(village => {
        village.assets.forEach(asset => {
            if (typeof asset !== 'string') {
                allAssets.push({
                    name: asset.name,
                    village: village.name,
                    return: Math.random() * 30 - 5 // -5% ~ 25% 임의 수익률
                });
            }
        });
    });

    // 수익률 기준 정렬
    allAssets.sort((a, b) => b.return - a.return);
    const topAssets = allAssets.slice(0, 5);

    container.innerHTML = '';
    topAssets.forEach((asset, index) => {
        const item = document.createElement('div');
        item.className = 'performance-item';
        item.innerHTML = `
            <div class="performance-item-left">
                <div class="performance-rank">${index + 1}</div>
                <div class="performance-info">
                    <div class="performance-name">${asset.name}</div>
                    <div class="performance-village">${asset.village}</div>
                </div>
            </div>
            <div class="performance-return positive">+${asset.return.toFixed(2)}%</div>
        `;
        container.appendChild(item);
    });
}

// 하위 종목 렌더링
function renderBottomPerformers(villages) {
    const container = document.getElementById('bottomPerformers');
    if (!container) return;

    // 모든 자산 수집 및 수익률 계산 (임의 생성)
    const allAssets = [];
    villages.forEach(village => {
        village.assets.forEach(asset => {
            if (typeof asset !== 'string') {
                allAssets.push({
                    name: asset.name,
                    village: village.name,
                    return: Math.random() * 30 - 5
                });
            }
        });
    });

    // 수익률 기준 정렬
    allAssets.sort((a, b) => a.return - b.return);
    const bottomAssets = allAssets.slice(0, 5);

    container.innerHTML = '';
    bottomAssets.forEach((asset, index) => {
        const item = document.createElement('div');
        item.className = 'performance-item';
        const returnClass = asset.return >= 0 ? 'positive' : 'negative';
        const returnSign = asset.return >= 0 ? '+' : '';
        item.innerHTML = `
            <div class="performance-item-left">
                <div class="performance-rank">${index + 1}</div>
                <div class="performance-info">
                    <div class="performance-name">${asset.name}</div>
                    <div class="performance-village">${asset.village}</div>
                </div>
            </div>
            <div class="performance-return ${returnClass}">${returnSign}${asset.return.toFixed(2)}%</div>
        `;
        container.appendChild(item);
    });
}

// 리밸런싱 추천
function renderRebalancingRecommendations(data) {
    const container = document.getElementById('rebalancingRecommendations');
    if (!container) return;

    const recommendations = [
        {
            icon: '⚖️',
            title: '포트폴리오 균형 조정',
            desc: '미장마을의 비중이 32%로 높습니다. 다른 마을로 일부 분산하여 리스크를 줄이는 것을 추천합니다.',
            action: '분산 투자 고려'
        },
        {
            icon: '📈',
            title: '수익률 개선 기회',
            desc: '레버리지마을이 -5.2% 손실 중입니다. 시장 상황을 고려하여 비중 조정이 필요합니다.',
            action: '비중 재조정 검토'
        },
        {
            icon: '💰',
            title: '배당 수익 강화',
            desc: '안정적인 현금 흐름을 위해 배당마을의 비중을 늘리는 것을 고려해보세요.',
            action: '배당마을 확대'
        }
    ];

    container.innerHTML = '';
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'rebalancing-card';
        card.innerHTML = `
            <div class="rebalancing-card-title">
                <span>${rec.icon}</span>
                <span>${rec.title}</span>
            </div>
            <div class="rebalancing-card-desc">${rec.desc}</div>
            <div class="rebalancing-action">💡 ${rec.action}</div>
        `;
        container.appendChild(card);
    });
}

// ========== 포트폴리오 다운로드 기능 ==========

// Excel 다운로드
async function downloadExcel() {
    try {
        showToast('Excel 파일을 생성하고 있습니다...', 'info');

        const data = await fetchAPI('/analysis');

        // 워크북 생성
        const wb = XLSX.utils.book_new();

        // 1. 요약 시트
        const summaryData = [
            ['K-AMIs 포트폴리오 분석 보고서'],
            ['생성일시', new Date().toLocaleString('ko-KR')],
            [],
            ['항목', '값'],
            ['총 자산', data.totalAssets.toLocaleString() + '원'],
            ['총 수익률', (data.totalReturn >= 0 ? '+' : '') + data.totalReturn + '%'],
            ['운영 마을 수', data.villages.length + '개'],
            ['보유 자산 수', data.villages.reduce((sum, v) => sum + v.assets.length, 0) + '개']
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, '포트폴리오 요약');

        // 2. 마을별 현황 시트
        const villageHeaders = ['마을명', '아이콘', '총 자산(원)', '수익률(%)', '비중(%)', '자산 개수'];
        const villageData = data.villages.map(v => [
            v.name,
            v.icon,
            v.totalValue,
            v.returnRate,
            v.allocation,
            v.assets.length
        ]);
        const villageSheet = XLSX.utils.aoa_to_sheet([villageHeaders, ...villageData]);
        XLSX.utils.book_append_sheet(wb, villageSheet, '마을별 현황');

        // 3. 보유 자산 시트
        const assetHeaders = ['자산명', '유형', '금액(원)', '소속 마을'];
        const assetData = [];
        data.villages.forEach(village => {
            village.assets.forEach(asset => {
                if (typeof asset !== 'string') {
                    assetData.push([
                        asset.name,
                        asset.type,
                        asset.value,
                        village.name
                    ]);
                }
            });
        });
        const assetSheet = XLSX.utils.aoa_to_sheet([assetHeaders, ...assetData]);
        XLSX.utils.book_append_sheet(wb, assetSheet, '보유 자산');

        // 4. 자산 유형별 분포 시트
        const typeMap = {};
        data.villages.forEach(village => {
            village.assets.forEach(asset => {
                if (typeof asset !== 'string') {
                    const type = asset.type;
                    typeMap[type] = (typeMap[type] || 0) + asset.value;
                }
            });
        });
        const typeHeaders = ['자산 유형', '금액(원)', '비중(%)'];
        const totalAssets = Object.values(typeMap).reduce((a, b) => a + b, 0);
        const typeData = Object.entries(typeMap).map(([type, value]) => [
            type,
            value,
            ((value / totalAssets) * 100).toFixed(2)
        ]);
        const typeSheet = XLSX.utils.aoa_to_sheet([typeHeaders, ...typeData]);
        XLSX.utils.book_append_sheet(wb, typeSheet, '자산 유형별 분포');

        // 파일 다운로드
        const fileName = `포트폴리오_분석_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        showToast('Excel 파일이 다운로드되었습니다! 📊', 'success');
        addActivity('포트폴리오 분석 Excel 다운로드');

    } catch (error) {
        console.error('Excel 다운로드 오류:', error);
        showToast('Excel 다운로드에 실패했습니다.', 'error');
    }
}

// PDF 다운로드 (개선된 레이아웃)
async function downloadPDF() {
    try {
        showToast('PDF 파일을 생성하고 있습니다... (최대 10초 소요)', 'info');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // A4 페이지 크기 (mm)
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const maxContentHeight = pageHeight - (margin * 2);

        let currentY = margin;
        let isFirstPage = true;

        // 헬퍼 함수: 이미지를 페이지에 추가하고 필요시 새 페이지 생성
        const addImageToDoc = (imgData, imgWidth, imgHeight, forceNewPage = false) => {
            // 새 페이지가 필요한 경우
            if (forceNewPage || (!isFirstPage && currentY + imgHeight > pageHeight - margin)) {
                doc.addPage();
                currentY = margin;
            }

            // 이미지가 페이지 높이를 초과하는 경우 크기 조정
            if (imgHeight > maxContentHeight) {
                const ratio = maxContentHeight / imgHeight;
                imgHeight = maxContentHeight;
                imgWidth = imgWidth * ratio;
            }

            // 현재 페이지에 공간이 부족한 경우
            if (currentY + imgHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
            }

            doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 5;
            isFirstPage = false;
        };

        // 1. 제목 및 요약 카드를 함께 캡처 (페이지 1)
        const titleElement = document.querySelector('.analysis-header');
        const summaryGrid = document.querySelector('.analysis-summary-grid');

        if (titleElement) {
            const canvas = await html2canvas(titleElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#f5f7fa'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            addImageToDoc(imgData, imgWidth, imgHeight);
        }

        if (summaryGrid) {
            const canvas = await html2canvas(summaryGrid, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            addImageToDoc(imgData, imgWidth, imgHeight);
        }

        // 2. 차트 섹션 캡처 (페이지 1 하단 또는 페이지 2)
        const chartsGrid = document.querySelector('.analysis-charts-grid');
        if (chartsGrid) {
            const canvas = await html2canvas(chartsGrid, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            addImageToDoc(imgData, imgWidth, imgHeight);
        }

        // 3. 성과 분석 및 리밸런싱을 함께 캡처 (페이지 2 또는 3)
        const performanceGrid = document.querySelector('.analysis-performance-grid');
        const rebalancingSection = document.querySelector('.rebalancing-section');

        // 성과 분석과 리밸런싱을 같은 페이지에 배치하기 위해 새 페이지로 시작
        if (performanceGrid) {
            const canvas = await html2canvas(performanceGrid, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            addImageToDoc(imgData, imgWidth, imgHeight, true); // 새 페이지 시작
        }

        if (rebalancingSection) {
            const canvas = await html2canvas(rebalancingSection, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            addImageToDoc(imgData, imgWidth, imgHeight);
        }

        // 파일 저장
        const fileName = `포트폴리오_분석_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

        showToast('PDF 파일이 다운로드되었습니다! 📄', 'success');
        addActivity('포트폴리오 분석 PDF 다운로드');

    } catch (error) {
        console.error('PDF 다운로드 오류:', error);
        showToast('PDF 다운로드에 실패했습니다. 다시 시도해주세요.', 'error');
    }
}

// 마이페이지 로드
async function loadMypage() {
    try {
        const data = await fetchAPI('/mypage');

        // 프로필 정보 로드
        document.getElementById('userName').value = data.userProfile?.name || '';
        document.getElementById('userTheme').value = data.userProfile?.theme || 'light';

        // 설정 정보 로드
        document.getElementById('briefingTime').value = data.settings?.briefing_time || '08:00';
        document.getElementById('voiceSpeed').value = data.settings?.voice_speed || 1.0;
        document.getElementById('voiceSpeedValue').textContent = (data.settings?.voice_speed || 1.0) + 'x';

        // 음성 속도 슬라이더 이벤트
        document.getElementById('voiceSpeed').addEventListener('input', function() {
            document.getElementById('voiceSpeedValue').textContent = this.value + 'x';
        });

        // 통계 정보 계산 및 표시
        updateStatistics(data);

        // 자산 연동 상태 업데이트
        updateIntegrationStatus();

        // 투자 진단 결과 로드
        if (data.investment_test && data.investment_test.completed) {
            const typeInfo = investmentTypes[data.investment_test.mainType];
            updateTestSummary(typeInfo);
        }
    } catch (error) {
        console.error('마이페이지 로드 오류:', error);
        showToast('마이페이지 로드에 실패했습니다.', 'error');
    }
}

// 통계 정보 업데이트
function updateStatistics(data) {
    if (!data.villages || data.villages.length === 0) {
        document.getElementById('statTotalAssets').textContent = '0원';
        document.getElementById('statVillageCount').textContent = '0개';
        document.getElementById('statAvgReturn').textContent = '0%';
        document.getElementById('statAssetCount').textContent = '0개';
        return;
    }

    // 총 자산
    const totalAssets = data.villages.reduce((sum, v) => sum + (v.totalValue || 0), 0);
    document.getElementById('statTotalAssets').textContent = totalAssets.toLocaleString() + '원';

    // 마을 수
    document.getElementById('statVillageCount').textContent = data.villages.length + '개';

    // 평균 수익률
    const avgReturn = data.villages.reduce((sum, v) => sum + (v.returnRate || 0), 0) / data.villages.length;
    const avgReturnFormatted = avgReturn >= 0 ? '+' + avgReturn.toFixed(1) : avgReturn.toFixed(1);
    document.getElementById('statAvgReturn').textContent = avgReturnFormatted + '%';
    document.getElementById('statAvgReturn').style.color = avgReturn >= 0 ? 'var(--success)' : 'var(--danger)';

    // 보유 자산 수
    let totalAssetCount = 0;
    data.villages.forEach(village => {
        totalAssetCount += village.assets ? village.assets.length : 0;
    });
    document.getElementById('statAssetCount').textContent = totalAssetCount + '개';
}

// 프로필 저장
function saveProfile() {
    const data = loadData();

    data.userProfile.name = document.getElementById('userName').value;
    data.userProfile.theme = document.getElementById('userTheme').value;

    saveData(data);

    // 테마 적용
    applyTheme(data.userProfile.theme);

    // 성공 메시지
    showToast('프로필이 저장되었습니다! ✅');

    // 활동 기록 추가
    addActivity('프로필 정보를 업데이트했습니다.');
}

// 테마 적용 함수
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// 설정 저장
function saveSettings() {
    const data = loadData();

    data.settings.briefing_time = document.getElementById('briefingTime').value;
    data.settings.voice_speed = parseFloat(document.getElementById('voiceSpeed').value);

    saveData(data);

    // 성공 메시지
    showToast('설정이 저장되었습니다! ✅');

    // 활동 기록 추가
    addActivity('설정을 변경했습니다.');
}

// 활동 기록 추가
function addActivity(title) {
    const activityList = document.getElementById('activityList');

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item fade-in';

    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    activityItem.innerHTML = `
        <div class="activity-icon">✨</div>
        <div class="activity-content">
            <div class="activity-title">${title}</div>
            <div class="activity-time">${timeString}</div>
        </div>
    `;

    // 최상단에 추가
    activityList.insertBefore(activityItem, activityList.firstChild);

    // 활동 기록이 10개를 넘으면 오래된 것 삭제
    if (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
}

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

        renderVillages();
        renderAssetChart();
        renderMapBadges();
        renderRecommendationBanner();
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

// ========== 마이데이터 연동 기능 ==========

// 금융기관 목업 데이터
const mockInstitutions = [
    { id: 'kb', name: 'KB증권', icon: '🏦', description: '보유 주식 3종목' },
    { id: 'samsung', name: '삼성증권', icon: '💼', description: '보유 주식 5종목' },
    { id: 'mirae', name: '미래에셋증권', icon: '🏢', description: '보유 ETF 2종목' },
    { id: 'nh', name: 'NH투자증권', icon: '🏛️', description: '보유 주식 4종목' },
    { id: 'kiwoom', name: '키움증권', icon: '💻', description: '보유 주식 2종목' },
    { id: 'shinhan', name: '신한은행', icon: '🏦', description: '예금 계좌 1개' },
    { id: 'kakao', name: '카카오뱅크', icon: '💛', description: '예금 계좌 1개' }
];

// 선택된 금융기관
let selectedInstitutions = [];

// 마이데이터 연동 시작
function startMyDataIntegration() {
    const data = loadData();

    // 모달 열기
    document.getElementById('mydataModal').classList.add('active');

    // 이미 연동된 경우 이전에 선택했던 금융기관을 자동으로 선택
    if (data.mydata_integration && data.mydata_integration.is_integrated) {
        selectedInstitutions = data.mydata_integration.integrated_institutions.map(inst => inst.id);
    } else {
        selectedInstitutions = [];
    }

    // Step 1으로 초기화
    showMydataStep(1);

    // 동의 체크박스 초기화
    document.getElementById('consent1').checked = false;
    document.getElementById('consent2').checked = false;
    document.getElementById('consent3').checked = false;
    document.getElementById('consentAll').checked = false;
    updateConsentButton();
}

// 마이데이터 모달 닫기
function closeMydataModal() {
    document.getElementById('mydataModal').classList.remove('active');
    selectedInstitutions = [];
}

// 스텝 전환
function showMydataStep(step) {
    // 모든 스텝 숨기기
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`mydataStep${i}`).style.display = 'none';
    }

    // 선택된 스텝만 보이기
    document.getElementById(`mydataStep${step}`).style.display = 'flex';

    // Step 2일 경우 금융기관 목록 렌더링
    if (step === 2) {
        renderInstitutionList();

        // 헤더 텍스트 업데이트 (최신화인 경우)
        const data = loadData();
        const headerTitle = document.querySelector('#mydataStep2 .mydata-header h2');
        const headerSubtitle = document.querySelector('#mydataStep2 .mydata-header p');

        if (data.mydata_integration && data.mydata_integration.is_integrated) {
            if (headerTitle) {
                headerTitle.innerHTML = '<span style="color: var(--primary);">🔄 자산 정보 최신화</span>';
            }
            if (headerSubtitle) {
                headerSubtitle.textContent = '최신화할 금융기관을 선택하세요 (이전 선택 자동 체크됨)';
            }
        } else {
            if (headerTitle) {
                headerTitle.innerHTML = '<span style="color: var(--primary);">📋 연동할 자산 선택</span>';
            }
            if (headerSubtitle) {
                headerSubtitle.textContent = '연동하려는 금융기관을 선택하세요';
            }
        }
    }
}

// 전체 동의 토글
function toggleAllConsents() {
    const allChecked = document.getElementById('consentAll').checked;

    document.getElementById('consent1').checked = allChecked;
    document.getElementById('consent2').checked = allChecked;
    document.getElementById('consent3').checked = allChecked;

    updateConsentButton();
}

// 개별 동의 체크 시 전체 동의 상태 업데이트
function updateConsentButton() {
    const consent1 = document.getElementById('consent1').checked;
    const consent2 = document.getElementById('consent2').checked;
    const consent3 = document.getElementById('consent3').checked;

    // 모든 필수 동의가 체크되면 다음 버튼 활성화
    const allConsented = consent1 && consent2 && consent3;
    document.getElementById('consentNextBtn').disabled = !allConsented;

    // 전체 동의 체크박스 상태 업데이트
    document.getElementById('consentAll').checked = allConsented;
}

// 개별 동의 체크박스 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    const consent1 = document.getElementById('consent1');
    const consent2 = document.getElementById('consent2');
    const consent3 = document.getElementById('consent3');

    if (consent1) consent1.addEventListener('change', updateConsentButton);
    if (consent2) consent2.addEventListener('change', updateConsentButton);
    if (consent3) consent3.addEventListener('change', updateConsentButton);
});

// Step 2: 자산 선택으로 이동
function goToAssetSelection() {
    showMydataStep(2);
}

// Step 1: 동의 화면으로 돌아가기
function backToConsent() {
    showMydataStep(1);
}

// 금융기관 목록 렌더링
function renderInstitutionList() {
    const listContainer = document.getElementById('institutionList');
    listContainer.innerHTML = '';

    mockInstitutions.forEach(institution => {
        const item = document.createElement('div');
        item.className = 'institution-item';
        item.onclick = () => toggleInstitution(institution.id);

        const isSelected = selectedInstitutions.includes(institution.id);

        if (isSelected) {
            item.classList.add('selected');
        }

        item.innerHTML = `
            <input type="checkbox" class="institution-checkbox" ${isSelected ? 'checked' : ''} onchange="toggleInstitution('${institution.id}')">
            <div class="institution-icon">${institution.icon}</div>
            <div class="institution-info">
                <div class="institution-name">${institution.name}</div>
                <div class="institution-description">${institution.description}</div>
            </div>
        `;

        listContainer.appendChild(item);
    });

    // 전체 선택 체크박스 상태 업데이트
    updateSelectAllCheckbox();
}

// 금융기관 선택 토글
function toggleInstitution(institutionId) {
    const index = selectedInstitutions.indexOf(institutionId);

    if (index > -1) {
        // 이미 선택된 경우 제거
        selectedInstitutions.splice(index, 1);
    } else {
        // 선택 추가
        selectedInstitutions.push(institutionId);
    }

    // 목록 다시 렌더링
    renderInstitutionList();

    // 전체 선택 체크박스 상태 업데이트
    updateSelectAllCheckbox();
}

// 전체 선택 토글
function toggleAllInstitutions() {
    const selectAllCheckbox = document.getElementById('selectAllInstitutions');

    if (selectAllCheckbox.checked) {
        // 모든 금융기관 선택
        selectedInstitutions = mockInstitutions.map(inst => inst.id);
    } else {
        // 모든 선택 해제
        selectedInstitutions = [];
    }

    // 목록 다시 렌더링
    renderInstitutionList();
}

// 전체 선택 체크박스 상태 업데이트
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllInstitutions');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedInstitutions.length === mockInstitutions.length;
    }
}

// Step 3: 로딩 시작
function startIntegrationLoading() {
    if (selectedInstitutions.length === 0) {
        showToast('연동할 금융기관을 최소 1개 이상 선택해주세요.', 'error');
        return;
    }

    showMydataStep(3);

    // 로딩 메시지 배열
    const loadingMessages = [
        '금융기관 연결 중...',
        '보안 인증 진행 중...',
        '자산 정보 수집 중...',
        '데이터 동기화 중...',
        '거의 완료되었습니다...'
    ];

    let progress = 0;
    let messageIndex = 0;
    const totalDuration = 3000; // 3초
    const intervalTime = 100; // 0.1초마다 업데이트
    const totalSteps = totalDuration / intervalTime;
    const progressIncrement = 100 / totalSteps;

    const interval = setInterval(() => {
        progress += progressIncrement;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // 완료 후 Step 4로 이동
            setTimeout(() => {
                showCompletionStep();
            }, 300);
        }

        // 진행률 업데이트
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.floor(progress) + '%';

        // 메시지 변경 (20%마다)
        const newMessageIndex = Math.floor(progress / 20);
        if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
            messageIndex = newMessageIndex;
            document.getElementById('loadingMessage').textContent = loadingMessages[messageIndex];
        }
    }, intervalTime);
}

// Step 4: 완료 화면 표시
function showCompletionStep() {
    showMydataStep(4);

    // 선택된 금융기관 정보 표시
    const summaryContainer = document.getElementById('completionSummary');
    summaryContainer.innerHTML = '';

    selectedInstitutions.forEach(institutionId => {
        const institution = mockInstitutions.find(inst => inst.id === institutionId);
        if (institution) {
            const item = document.createElement('div');
            item.className = 'completion-item fade-in';

            item.innerHTML = `
                <div class="completion-item-left">
                    <div class="completion-icon">${institution.icon}</div>
                    <div class="completion-name">${institution.name}</div>
                </div>
                <div class="completion-status">✓ 연동 완료</div>
            `;

            summaryContainer.appendChild(item);
        }
    });
}

// 연동 완료
function finishIntegration() {
    const data = loadData();

    // 연동 이력 저장
    if (!data.mydata_integration) {
        data.mydata_integration = {};
    }

    data.mydata_integration.is_integrated = true;
    data.mydata_integration.last_integration_date = new Date().toISOString();
    data.mydata_integration.integrated_institutions = selectedInstitutions.map(id => {
        const inst = mockInstitutions.find(i => i.id === id);
        return { id: inst.id, name: inst.name, icon: inst.icon };
    });
    data.mydata_integration.integration_count = (data.mydata_integration.integration_count || 0) + 1;

    saveData(data);

    // 활동 기록 추가
    const actionText = data.mydata_integration.integration_count === 1
        ? `마이데이터를 통해 ${selectedInstitutions.length}개 금융기관 연동 완료`
        : `마이데이터 자산 정보 최신화 완료 (${selectedInstitutions.length}개 기관)`;
    addActivity(actionText);

    // 모달 닫기
    closeMydataModal();

    // 성공 메시지
    const message = data.mydata_integration.integration_count === 1
        ? '✅ 자산 연동이 완료되었습니다! 이제 마을 관리 페이지에서 자산을 확인하세요.'
        : '✅ 자산 정보가 최신화되었습니다!';
    showToast(message);

    // 통계 업데이트
    updateStatistics(data);

    // 자산 연동 상태 UI 업데이트
    updateIntegrationStatus();

    // 선택 초기화
    selectedInstitutions = [];
}

// ========== 투자 성향 진단 ==========

// 투자 성향 유형 정의
const investmentTypes = {
    conservative: {
        name: '안정형',
        icon: '🛡️',
        description: '안정적인 수익을 추구하며 원금 보존을 최우선으로 생각합니다. 위험을 최소화하고 예측 가능한 투자를 선호합니다.',
        characteristics: [
            '원금 손실을 극도로 회피',
            '안정적이고 예측 가능한 수익 추구',
            '장기적 관점의 보수적 투자',
            '높은 유동성과 안정성 중시'
        ],
        portfolios: ['배당마을', '채권 마을']
    },
    moderateConservative: {
        name: '안정추구형',
        icon: '🌱',
        description: '안정성을 중시하되, 적절한 수익을 위해 제한적인 위험을 감수할 수 있습니다.',
        characteristics: [
            '안정성을 우선하되 수익도 추구',
            '제한적인 위험 감수 가능',
            '분산 투자를 통한 리스크 관리',
            '중장기 투자 선호'
        ],
        portfolios: ['배당마을', '글로벌ETF마을', '채권 마을']
    },
    moderate: {
        name: '위험중립형',
        icon: '⚖️',
        description: '안정성과 수익성의 균형을 추구하며, 적절한 위험 관리 하에 다양한 투자를 고려합니다.',
        characteristics: [
            '안정성과 수익성의 균형 추구',
            '중간 수준의 위험 감수',
            '다양한 자산군에 분산 투자',
            '시장 상황에 따른 유연한 대응'
        ],
        portfolios: ['글로벌ETF마을', '반도체마을', '국장마을', '신흥국 마을']
    },
    moderateAggressive: {
        name: '적극투자형',
        icon: '🚀',
        description: '높은 수익을 추구하며 상당한 위험을 감수할 수 있습니다. 시장 변동성을 투자 기회로 활용합니다.',
        characteristics: [
            '높은 수익률 목표',
            '상당한 위험 감수 가능',
            '성장 가능성이 높은 자산 선호',
            '시장 타이밍 활용'
        ],
        portfolios: ['미장마을', '반도체마을', '레버리지마을', '신흥국 마을']
    },
    aggressive: {
        name: '공격투자형',
        icon: '⚡',
        description: '최고 수익을 위해 높은 위험을 기꺼이 감수하며, 공격적인 투자 전략을 추구합니다.',
        characteristics: [
            '최대 수익률 추구',
            '높은 위험 적극 감수',
            '레버리지 및 고위험 상품 활용',
            '단기 시장 변동 적극 활용'
        ],
        portfolios: ['레버리지마을', '미장마을', '반도체마을', '원자재 마을']
    }
};

// 투자 성향 진단 질문 (25개)
const investmentQuestions = [
    {
        question: '투자의 주요 목적은 무엇인가요?',
        answers: [
            { text: '원금 보존이 최우선입니다', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '안정적인 소득 창출입니다', weights: { conservative: 3, moderateConservative: 4, moderate: 1 } },
            { text: '자산의 꾸준한 성장입니다', weights: { moderateConservative: 2, moderate: 4, moderateAggressive: 2 } },
            { text: '공격적인 자산 증식입니다', weights: { moderate: 1, moderateAggressive: 4, aggressive: 3 } },
            { text: '단기 고수익 실현입니다', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 예상 기간은 얼마나 되나요?',
        answers: [
            { text: '1년 미만', weights: { aggressive: 4, moderateAggressive: 2 } },
            { text: '1~3년', weights: { moderateAggressive: 3, moderate: 3 } },
            { text: '3~5년', weights: { moderate: 4, moderateConservative: 2 } },
            { text: '5~10년', weights: { moderateConservative: 4, conservative: 2 } },
            { text: '10년 이상', weights: { conservative: 5, moderateConservative: 2 } }
        ]
    },
    {
        question: '투자 원금이 10% 손실되면 어떻게 하시겠습니까?',
        answers: [
            { text: '즉시 전액 손절합니다', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '일부만 손절하고 관망합니다', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '그대로 보유하며 회복을 기다립니다', weights: { moderate: 5 } },
            { text: '추가 매수를 고려합니다', weights: { moderateAggressive: 4, aggressive: 2 } },
            { text: '대폭 추가 매수합니다', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '1년 후 기대하는 수익률은?',
        answers: [
            { text: '원금만 보존되면 만족', weights: { conservative: 5 } },
            { text: '3% 미만', weights: { conservative: 3, moderateConservative: 3 } },
            { text: '3~7%', weights: { moderateConservative: 4, moderate: 3 } },
            { text: '7~15%', weights: { moderate: 3, moderateAggressive: 4 } },
            { text: '15% 이상', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 경험은 얼마나 되시나요?',
        answers: [
            { text: '전혀 없음', weights: { conservative: 4, moderateConservative: 2 } },
            { text: '1년 미만', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '1~3년', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '3~5년', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '5년 이상', weights: { moderateAggressive: 3, aggressive: 3 } }
        ]
    },
    {
        question: '투자 자금이 전체 자산에서 차지하는 비중은?',
        answers: [
            { text: '10% 미만', weights: { conservative: 5 } },
            { text: '10~30%', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '30~50%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '50~70%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '70% 이상', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 상품 선택 시 가장 중요한 기준은?',
        answers: [
            { text: '안정성과 원금 보장', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '낮은 변동성', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '적절한 수익과 위험 균형', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '높은 수익 잠재력', weights: { moderate: 2, moderateAggressive: 4, aggressive: 2 } },
            { text: '최대 수익률', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '시장이 급락할 때의 대응 방식은?',
        answers: [
            { text: '공포를 느끼고 전량 매도', weights: { conservative: 5 } },
            { text: '불안하지만 일부만 매도', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '차분하게 상황 관망', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '기회로 보고 매수 검토', weights: { moderate: 2, moderateAggressive: 5 } },
            { text: '큰 기회로 보고 적극 매수', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '레버리지(차입) 투자에 대한 생각은?',
        answers: [
            { text: '절대 하지 않음', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '위험해서 피하고 싶음', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '상황에 따라 소량 고려 가능', weights: { moderate: 4, moderateAggressive: 2 } },
            { text: '수익 극대화를 위해 활용', weights: { moderateAggressive: 4, aggressive: 3 } },
            { text: '적극적으로 활용', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '포트폴리오 변동성을 어느 정도 받아들일 수 있나요?',
        answers: [
            { text: '연 5% 미만', weights: { conservative: 5 } },
            { text: '연 5~10%', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '연 10~20%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '연 20~30%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '30% 이상도 괜찮음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 정보는 주로 어디서 얻나요?',
        answers: [
            { text: '전문가 추천만 따름', weights: { conservative: 4, moderateConservative: 3 } },
            { text: '뉴스와 리포트', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '다양한 채널 종합', weights: { moderate: 5 } },
            { text: '직접 분석과 연구', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '본인만의 독자적 분석', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '투자 결정은 얼마나 신속하게 하시나요?',
        answers: [
            { text: '며칠~몇 주 고민', weights: { conservative: 5 } },
            { text: '하루 이틀 숙고', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '당일 분석 후 결정', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '몇 시간 내 결정', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '즉시 결정', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '배당수익과 시세차익 중 어느 것을 선호하시나요?',
        answers: [
            { text: '배당수익만 중요', weights: { conservative: 5 } },
            { text: '배당수익 위주', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '둘 다 비슷하게', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '시세차익 위주', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '시세차익만 중요', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '새로운 투자 상품이나 시장에 대한 태도는?',
        answers: [
            { text: '절대 투자하지 않음', weights: { conservative: 5 } },
            { text: '충분히 검증된 후에만', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '신중하게 일부 투자', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '적극적으로 탐색', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '선도적으로 투자', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 손실이 발생했을 때 심리 상태는?',
        answers: [
            { text: '극심한 스트레스와 불안', weights: { conservative: 5 } },
            { text: '상당한 걱정과 불편함', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '약간 불편하지만 감내 가능', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '크게 동요하지 않음', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '전혀 개의치 않음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '포트폴리오 리밸런싱 주기는?',
        answers: [
            { text: '거의 하지 않음', weights: { conservative: 4, moderateConservative: 2 } },
            { text: '연 1회', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '분기별', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '월별', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '수시로', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 자산 중 해외 자산 비중은?',
        answers: [
            { text: '0% (국내만)', weights: { conservative: 4 } },
            { text: '1~20%', weights: { conservative: 2, moderateConservative: 3 } },
            { text: '20~40%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '40~60%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '60% 이상', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '투자 시 참고하는 기간은?',
        answers: [
            { text: '10년 이상 장기', weights: { conservative: 5 } },
            { text: '5~10년', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '1~5년', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '수개월~1년', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '일~주 단위', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '손절매 기준은 어떻게 설정하시나요?',
        answers: [
            { text: '-3% 이내', weights: { conservative: 5 } },
            { text: '-5% 이내', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '-10% 이내', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '-20% 이내', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '설정하지 않음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '파생상품(옵션, 선물 등) 투자 경험은?',
        answers: [
            { text: '전혀 없고 관심 없음', weights: { conservative: 5 } },
            { text: '없지만 알아보는 중', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '소액으로 경험해봄', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '정기적으로 투자', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '주력 투자 수단', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 실패 경험에 대한 태도는?',
        answers: [
            { text: '다시는 투자하지 않을 것', weights: { conservative: 5 } },
            { text: '매우 신중해짐', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '교훈으로 삼고 개선', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '당연한 과정으로 수용', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '학습 기회로 적극 활용', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '시장 전망이 불확실할 때의 대응은?',
        answers: [
            { text: '전액 현금 보유', weights: { conservative: 5 } },
            { text: '대부분 현금화', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '기존 포지션 유지', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '저점 매수 기회 모색', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '변동성을 적극 활용', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 관련 학습에 투자하는 시간은?',
        answers: [
            { text: '거의 없음', weights: { conservative: 4 } },
            { text: '주 1시간 미만', weights: { conservative: 2, moderateConservative: 3 } },
            { text: '주 1~3시간', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '주 3~7시간', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '주 7시간 이상', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '나의 투자 스타일은?',
        answers: [
            { text: '매우 보수적', weights: { conservative: 5 } },
            { text: '다소 보수적', weights: { conservative: 2, moderateConservative: 5 } },
            { text: '중립적', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '다소 공격적', weights: { moderate: 2, moderateAggressive: 5 } },
            { text: '매우 공격적', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 수익에 대한 만족도 기준은?',
        answers: [
            { text: '손실만 없으면 만족', weights: { conservative: 5 } },
            { text: '예금 이자보다 조금 높으면 만족', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '시장 평균 수익률이면 만족', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '시장 평균을 상회해야 만족', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '최상위 수익률을 목표', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    }
];

// 현재 진단 상태
let currentQuestionIndex = 0;
let userAnswers = [];
let testChart = null;

// 투자 성향 진단 시작
function startInvestmentTest() {
    const data = loadData();

    // 이미 진단한 적이 있으면 다시 하기 확인
    if (data.investment_test && data.investment_test.completed) {
        showConfirmModal({
            title: '투자 성향 진단',
            message: '이전 진단 결과가 있습니다. 다시 진단하시겠습니까?',
            icon: '🎯',
            confirmText: '다시 진단',
            cancelText: '취소',
            confirmType: 'primary',
            onConfirm: () => {
                beginInvestmentTest();
            }
        });
    } else {
        beginInvestmentTest();
    }
}

// 투자 진단 시작 (실제 로직)
function beginInvestmentTest() {
    currentQuestionIndex = 0;
    userAnswers = [];

    document.getElementById('investmentTestModal').classList.add('active');
    document.getElementById('testQuestionsSection').style.display = 'block';
    document.getElementById('testResultSection').style.display = 'none';

    renderQuestion();
}

// 질문 렌더링
function renderQuestion() {
    const question = investmentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / investmentQuestions.length) * 100;

    document.getElementById('testQuestion').textContent = `Q${currentQuestionIndex + 1}. ${question.question}`;
    document.getElementById('testProgressFill').style.width = progress + '%';
    document.getElementById('testProgressText').textContent = `${currentQuestionIndex + 1} / ${investmentQuestions.length}`;

    const answersContainer = document.getElementById('testAnswers');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'test-answer-button';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(index);

        // 이미 선택한 답변이 있으면 표시
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }

        answersContainer.appendChild(button);
    });

    // 이전/다음 버튼 상태 업데이트
    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = userAnswers[currentQuestionIndex] === undefined;
    document.getElementById('nextButton').textContent = currentQuestionIndex === investmentQuestions.length - 1 ? '결과 보기' : '다음';
}

// 답변 선택
function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;

    // 버튼 스타일 업데이트
    const buttons = document.querySelectorAll('.test-answer-button');
    buttons.forEach((btn, idx) => {
        if (idx === answerIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    document.getElementById('nextButton').disabled = false;
}

// 이전 질문
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// 다음 질문 또는 결과 보기
function nextQuestion() {
    if (currentQuestionIndex < investmentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // 모든 질문에 답변했으면 결과 계산
        calculateResult();
    }
}

// 결과 계산
function calculateResult() {
    const scores = {
        conservative: 0,
        moderateConservative: 0,
        moderate: 0,
        moderateAggressive: 0,
        aggressive: 0
    };

    // 각 답변의 가중치를 합산
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = investmentQuestions[questionIndex];
        const answer = question.answers[answerIndex];

        Object.keys(answer.weights).forEach(type => {
            scores[type] += answer.weights[type];
        });
    });

    // 총점 계산
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    // 비율 계산
    const percentages = {};
    Object.keys(scores).forEach(type => {
        percentages[type] = ((scores[type] / totalScore) * 100).toFixed(1);
    });

    // 주 성향 찾기
    const mainType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // 결과 저장
    const data = loadData();
    data.investment_test = {
        completed: true,
        date: new Date().toISOString(),
        answers: userAnswers,
        scores: scores,
        percentages: percentages,
        mainType: mainType
    };
    saveData(data);

    // 결과 표시
    showResult(mainType, percentages, scores);
}

// 결과 표시
function showResult(mainType, percentages, scores) {
    document.getElementById('testQuestionsSection').style.display = 'none';
    document.getElementById('testResultSection').style.display = 'block';

    const typeInfo = investmentTypes[mainType];

    // 주 성향 표시
    document.getElementById('resultMainType').innerHTML = `
        <div class="main-type-icon">${typeInfo.icon}</div>
        <h3 class="main-type-name">${typeInfo.name}</h3>
        <p class="main-type-desc">${typeInfo.description}</p>
    `;

    // 차트 생성
    renderResultChart(percentages);

    // 성향 설명
    document.getElementById('resultDescription').innerHTML = `
        <h4 style="color: var(--primary); margin-bottom: 15px;">💡 ${typeInfo.name}의 특징</h4>
        <ul class="characteristics-list">
            ${typeInfo.characteristics.map(char => `<li>${char}</li>`).join('')}
        </ul>
    `;

    // 포트폴리오 추천
    document.getElementById('resultPortfolio').innerHTML = `
        <h4 style="color: var(--primary); margin-bottom: 15px;">🏘️ 추천 포트폴리오</h4>
        <p style="margin-bottom: 15px;">당신의 투자 성향에 맞는 마을을 추천합니다:</p>
        <div class="recommended-villages">
            ${typeInfo.portfolios.map(village => `
                <div class="recommended-village-tag">${village}</div>
            `).join('')}
        </div>
        <p style="margin-top: 15px; font-size: 14px; color: var(--text-light);">
            💡 이 마을들을 중심으로 포트폴리오를 구성해보세요.
        </p>
    `;

    // 활동 기록
    addActivity(`투자 성향 진단 완료: ${typeInfo.name}`);

    // 마이페이지 요약 업데이트
    updateTestSummary(typeInfo);
}

// 결과 차트 렌더링
function renderResultChart(percentages) {
    const canvas = document.getElementById('resultChart');

    if (testChart) {
        testChart.destroy();
    }

    const labels = Object.keys(percentages).map(key => investmentTypes[key].name);
    const data = Object.values(percentages).map(p => parseFloat(p));
    const colors = [
        'rgba(78, 205, 196, 0.8)',   // 안정형
        'rgba(129, 207, 224, 0.8)',  // 안정추구형
        'rgba(255, 210, 63, 0.8)',   // 위험중립형
        'rgba(247, 147, 30, 0.8)',   // 적극투자형
        'rgba(255, 107, 53, 0.8)'    // 공격투자형
    ];

    const ctx = canvas.getContext('2d');
    testChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 13 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// 마이페이지 진단 요약 업데이트
function updateTestSummary(typeInfo) {
    const summary = document.getElementById('testResultSummary');
    summary.style.display = 'block';
    summary.innerHTML = `
        <div style="padding: 20px; background: linear-gradient(135deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%); border-radius: 15px;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <span style="font-size: 36px;">${typeInfo.icon}</span>
                <div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--dark);">당신의 투자 성향</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${typeInfo.name}</div>
                </div>
            </div>
            <p style="font-size: 14px; color: var(--text); margin-top: 10px;">${typeInfo.description}</p>
        </div>
    `;

    document.getElementById('testButtonText').textContent = '다시 진단하기';
}

// 다시 진단하기
function retakeTest() {
    showConfirmModal({
        title: '다시 진단하기',
        message: '현재 진단 결과를 삭제하고 처음부터 다시 진단하시겠습니까?',
        icon: '🔄',
        confirmText: '다시 시작',
        cancelText: '취소',
        confirmType: 'primary',
        onConfirm: () => {
            currentQuestionIndex = 0;
            userAnswers = [];
            document.getElementById('testQuestionsSection').style.display = 'block';
            document.getElementById('testResultSection').style.display = 'none';
            renderQuestion();
        }
    });
}

// 진단 모달 닫기
function closeInvestmentTest() {
    document.getElementById('investmentTestModal').classList.remove('active');

    // 마이페이지에 있으면 요약 업데이트
    const data = loadData();
    if (data.investment_test && data.investment_test.completed) {
        const typeInfo = investmentTypes[data.investment_test.mainType];
        updateTestSummary(typeInfo);
    }
}

// 자산 연동 상태 UI 업데이트
function updateIntegrationStatus() {
    const data = loadData();
    const integrationButton = document.getElementById('integrationButton');
    const integrationButtonText = document.getElementById('integrationButtonText');
    const integrationIcon = document.getElementById('integrationIcon');
    const integrationDescription = document.getElementById('integrationDescription');

    if (!integrationButton || !integrationButtonText || !integrationIcon || !integrationDescription) {
        return;
    }

    if (data.mydata_integration && data.mydata_integration.is_integrated) {
        // 이미 연동된 경우
        const lastDate = new Date(data.mydata_integration.last_integration_date);
        const dateString = lastDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const institutionCount = data.mydata_integration.integrated_institutions.length;
        const institutionNames = data.mydata_integration.integrated_institutions
            .map(inst => inst.name)
            .join(', ');

        integrationDescription.innerHTML = `
            <div style="padding: 15px; background: linear-gradient(135deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%); border-radius: 12px; margin-bottom: 10px;">
                <p style="font-weight: 600; color: var(--success); margin-bottom: 8px;">
                    ✅ 연동 완료 (${institutionCount}개 금융기관)
                </p>
                <p style="font-size: 14px; color: var(--text); margin-bottom: 5px;">
                    ${institutionNames}
                </p>
                <p style="font-size: 12px; color: var(--text-light);">
                    마지막 연동: ${dateString}
                </p>
            </div>
            <p style="font-size: 14px; color: var(--text-light);">
                자산 정보를 최신 상태로 유지하려면 주기적으로 최신화하세요.
            </p>
        `;

        integrationButtonText.textContent = '자산 정보 최신화하기';
        integrationIcon.textContent = '🔄';
        integrationButton.style.background = 'linear-gradient(135deg, var(--success), #3db8af)';
    } else {
        // 아직 연동하지 않은 경우
        integrationDescription.innerHTML = `
            <p>마이데이터를 통해 보유 중인 자산을 자동으로 연동하고 최신 정보를 받아보세요.</p>
            <p style="font-size: 14px; color: var(--text-light); margin-top: 8px;">
                📱 증권사, 은행 계좌 정보를 안전하게 가져올 수 있습니다.
            </p>
        `;

        integrationButtonText.textContent = '자산 연동 시작하기';
        integrationIcon.textContent = '🔄';
        integrationButton.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }
}
