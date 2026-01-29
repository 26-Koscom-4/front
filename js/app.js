// 샘플 데이터 초기화
const sampleData = {
    user_profile: {
        name: "김직장",
        theme: "light"
    },
    villages: [
        {
            id: "v1",
            name: "미장마을",
            icon: "🇺🇸",
            assets: [
                { name: "AAPL", type: "기술주", value: 4000000 },
                { name: "TSLA", type: "성장주", value: 3500000 },
                { name: "NVDA", type: "AI주", value: 4500000 },
                { name: "MSFT", type: "기술주", value: 3000000 }
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
                { name: "O", type: "배당ETF", value: 3000000 },
                { name: "SCHD", type: "배당ETF", value: 3000000 },
                { name: "VYM", type: "배당ETF", value: 2000000 }
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
                { name: "TQQQ", type: "레버리지ETF", value: 2000000 },
                { name: "UPRO", type: "레버리지ETF", value: 1500000 },
                { name: "SOXL", type: "레버리지ETF", value: 1500000 }
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
                { name: "삼성전자", type: "한국주식", value: 2000000 },
                { name: "SK하이닉스", type: "한국주식", value: 1500000 },
                { name: "NAVER", type: "한국주식", value: 1500000 }
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
                { name: "VTI", type: "성장ETF", value: 3000000 },
                { name: "QQQ", type: "성장ETF", value: 2500000 },
                { name: "SPY", type: "성장ETF", value: 2000000 }
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
                { name: "TSM", type: "기술주", value: 2500000 },
                { name: "ASML", type: "기술주", value: 2000000 },
                { name: "AMD", type: "AI주", value: 1500000 }
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

// LocalStorage 초기화 및 데이터 검증
function initializeData() {
    const storedData = localStorage.getItem('antVillageData');

    if (!storedData) {
        // 데이터가 없으면 샘플 데이터로 초기화
        console.log('LocalStorage 초기화: 샘플 데이터 로드');
        localStorage.setItem('antVillageData', JSON.stringify(sampleData));
        return;
    }

    try {
        const data = JSON.parse(storedData);
        // 데이터 구조 검증
        if (!data.villages || !Array.isArray(data.villages) || data.villages.length === 0) {
            console.log('데이터 구조 오류: 샘플 데이터로 재설정');
            localStorage.setItem('antVillageData', JSON.stringify(sampleData));
        }
    } catch (e) {
        console.error('LocalStorage 데이터 파싱 오류:', e);
        localStorage.setItem('antVillageData', JSON.stringify(sampleData));
    }
}

// 페이지 로드 시 데이터 초기화
initializeData();

// 데이터 로드
function loadData() {
    const data = localStorage.getItem('antVillageData');
    return data ? JSON.parse(data) : sampleData;
}

// 데이터 초기화 함수 (디버깅용)
function resetData() {
    localStorage.setItem('antVillageData', JSON.stringify(sampleData));
    console.log('데이터가 초기화되었습니다.');
    location.reload();
}

// 데이터 저장
function saveData(data) {
    localStorage.setItem('antVillageData', JSON.stringify(data));
}

// 페이지 전환
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageMap = {
        'main': 'mainPage',
        'villages': 'villagesPage',
        'briefing': 'briefingPage',
        'daily': 'dailyBriefingPage',
        'neighbors': 'neighborsPage',
        'mypage': 'mypagePage'
    };

    document.getElementById(pageMap[pageName]).classList.add('active');

    // 페이지별 초기화
    if (pageName === 'villages') {
        renderVillages();
    } else if (pageName === 'main') {
        renderAssetChart();
        renderMapBadges();
    } else if (pageName === 'mypage') {
        loadMypage();
    }
}

// 마을 카드 렌더링
function renderVillages() {
    const data = loadData();
    const grid = document.getElementById('villageGrid');
    grid.innerHTML = '';

    data.villages.forEach(village => {
        const card = document.createElement('div');
        card.className = 'village-card fade-in';
        card.onclick = () => showVillageDetail(village.name);

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
}

// 마을 상세 정보 모달
function showVillageDetail(villageName) {
    const data = loadData();
    const village = data.villages.find(v => v.name === villageName);

    if (village) {
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
    } else {
        alert('해당 마을을 찾을 수 없습니다.');
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
        alert('해당 마을을 찾을 수 없습니다.');
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
function renderMapBadges() {
    const data = loadData();

    // 마을 이름과 뱃지 ID 매핑
    const villageBadgeMap = {
        '국장마을': 'badge-국장마을',
        '미장마을': 'badge-미장마을',
        '배당마을': 'badge-배당마을',
        '글로벌ETF마을': 'badge-글로벌ETF마을'
    };

    // 각 마을의 읽음 상태 확인
    data.villages.forEach(village => {
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
function addVillage(villageName) {
    alert(`"${villageName}"이(가) 내 포트폴리오에 추가되었습니다! 🎉`);

    const data = loadData();
    const newVillage = {
        id: `v${data.villages.length + 1}`,
        name: villageName,
        icon: villageName.includes('원자재') ? '🏆' : (villageName.includes('신흥국') ? '🌏' : '🏦'),
        assets: [],
        type: "new",
        goal: "diversification",
        totalValue: 0,
        returnRate: 0,
        allocation: 0
    };

    data.villages.push(newVillage);
    saveData(data);

    // 마을 관리 페이지로 이동
    setTimeout(() => {
        showPage('villages');
    }, 1500);
}

// 자산 차트 생성
let assetChart = null;

function renderAssetChart() {
    const data = loadData();
    const canvas = document.getElementById('assetPieChart');

    if (!canvas) return;

    // 기존 차트가 있으면 제거
    if (assetChart) {
        assetChart.destroy();
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
                }
            },
            cutout: '60%'
        }
    });
}

// 마이페이지 로드
function loadMypage() {
    const data = loadData();

    // 프로필 정보 로드
    document.getElementById('userName').value = data.user_profile.name || '';
    document.getElementById('userTheme').value = data.user_profile.theme || 'light';

    // 설정 정보 로드
    document.getElementById('briefingTime').value = data.settings.briefing_time || '08:00';
    document.getElementById('voiceSpeed').value = data.settings.voice_speed || 1.0;
    document.getElementById('voiceSpeedValue').textContent = (data.settings.voice_speed || 1.0) + 'x';

    // 음성 속도 슬라이더 이벤트
    document.getElementById('voiceSpeed').addEventListener('input', function() {
        document.getElementById('voiceSpeedValue').textContent = this.value + 'x';
    });

    // 통계 정보 계산 및 표시
    updateStatistics(data);
}

// 통계 정보 업데이트
function updateStatistics(data) {
    // 총 자산
    const totalAssets = data.villages.reduce((sum, v) => sum + v.totalValue, 0);
    document.getElementById('statTotalAssets').textContent = totalAssets.toLocaleString() + '원';

    // 마을 수
    document.getElementById('statVillageCount').textContent = data.villages.length + '개';

    // 평균 수익률
    const avgReturn = data.villages.reduce((sum, v) => sum + v.returnRate, 0) / data.villages.length;
    const avgReturnFormatted = avgReturn >= 0 ? '+' + avgReturn.toFixed(1) : avgReturn.toFixed(1);
    document.getElementById('statAvgReturn').textContent = avgReturnFormatted + '%';
    document.getElementById('statAvgReturn').style.color = avgReturn >= 0 ? 'var(--success)' : 'var(--danger)';

    // 보유 자산 수
    let totalAssetCount = 0;
    data.villages.forEach(village => {
        totalAssetCount += village.assets.length;
    });
    document.getElementById('statAssetCount').textContent = totalAssetCount + '개';
}

// 프로필 저장
function saveProfile() {
    const data = loadData();

    data.user_profile.name = document.getElementById('userName').value;
    data.user_profile.theme = document.getElementById('userTheme').value;

    saveData(data);

    // 테마 적용
    applyTheme(data.user_profile.theme);

    // 성공 메시지
    alert('프로필이 저장되었습니다! ✅');

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
    alert('설정이 저장되었습니다! ✅');

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

// 초기 로드
window.onload = () => {
    // 저장된 테마 적용
    const data = loadData();
    applyTheme(data.user_profile.theme || 'light');

    renderVillages();
    renderAssetChart();
    renderMapBadges();
};

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
    // 모달 열기
    document.getElementById('mydataModal').classList.add('active');

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
        alert('연동할 금융기관을 최소 1개 이상 선택해주세요.');
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
    // 활동 기록 추가
    addActivity(`마이데이터를 통해 ${selectedInstitutions.length}개 금융기관 연동 완료`);

    // 모달 닫기
    closeMydataModal();

    // 성공 메시지
    alert('✅ 자산 연동이 완료되었습니다! 이제 마을 관리 페이지에서 자산을 확인하세요.');

    // 통계 업데이트
    const data = loadData();
    updateStatistics(data);

    // 선택 초기화
    selectedInstitutions = [];
}
