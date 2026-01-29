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
            allocation: 32.3
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
            allocation: 17.2
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
            allocation: 10.8
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
            allocation: 10.8
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
            allocation: 16.1
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
            allocation: 12.9
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
        'neighbors': 'neighborsPage'
    };

    document.getElementById(pageMap[pageName]).classList.add('active');

    // 페이지별 초기화
    if (pageName === 'villages') {
        renderVillages();
    } else if (pageName === 'main') {
        renderAssetChart();
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
        card.onclick = () => showPage('daily');

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

        content.innerHTML = `
            <h2 style="color: var(--primary); margin-bottom: 20px;">${village.icon} ${village.name}</h2>
            <div style="margin: 20px 0;">
                <h3>보유 자산</h3>
                <div class="assets-list" style="margin-top: 15px;">
                    ${village.assets.map(asset => `<span class="asset-tag">${typeof asset === 'string' ? asset : asset.name}</span>`).join('')}
                </div>
            </div>
            <div style="margin: 20px 0;">
                <h3>투자 목표: ${village.goal}</h3>
                <p>유형: ${village.type}</p>
            </div>
            <button class="audio-button" onclick="closeModal()">닫기</button>
        `;

        modal.classList.add('active');
    }
}

function closeModal() {
    document.getElementById('villageModal').classList.remove('active');
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

// 초기 로드
window.onload = () => {
    renderVillages();
    renderAssetChart();
};

// 모달 외부 클릭 시 닫기
window.onclick = (event) => {
    const modal = document.getElementById('villageModal');
    if (event.target === modal) {
        closeModal();
    }
};
