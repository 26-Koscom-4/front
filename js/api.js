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

