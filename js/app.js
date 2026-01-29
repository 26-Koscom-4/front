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
            assets: ["AAPL", "TSLA", "NVDA", "MSFT"],
            type: "growth",
            goal: "long-term",
            totalValue: 15000000,
            returnRate: 12.5,
            allocation: 45
        },
        {
            id: "v2",
            name: "배당마을",
            icon: "💰",
            assets: ["O", "SCHD", "VYM"],
            type: "dividend",
            goal: "passive-income",
            totalValue: 8000000,
            returnRate: 8.3,
            allocation: 25
        },
        {
            id: "v3",
            name: "레버리지마을",
            icon: "🚀",
            assets: ["TQQQ", "UPRO", "SOXL"],
            type: "leverage",
            goal: "high-risk",
            totalValue: 5000000,
            returnRate: -5.2,
            allocation: 15
        },
        {
            id: "v4",
            name: "국장마을",
            icon: "🇰🇷",
            assets: ["삼성전자", "SK하이닉스", "NAVER"],
            type: "domestic",
            goal: "balanced",
            totalValue: 5000000,
            returnRate: 6.8,
            allocation: 15
        }
    ],
    settings: {
        briefing_time: "08:00",
        voice_speed: 1.0
    }
};

// LocalStorage 초기화
if (!localStorage.getItem('antVillageData')) {
    localStorage.setItem('antVillageData', JSON.stringify(sampleData));
}

// 데이터 로드
function loadData() {
    const data = localStorage.getItem('antVillageData');
    return data ? JSON.parse(data) : sampleData;
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
                ${village.assets.map(asset => `<span class="asset-tag">${asset}</span>`).join('')}
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
                    ${village.assets.map(asset => `<span class="asset-tag">${asset}</span>`).join('')}
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

// 초기 로드
window.onload = () => {
    renderVillages();
};

// 모달 외부 클릭 시 닫기
window.onclick = (event) => {
    const modal = document.getElementById('villageModal');
    if (event.target === modal) {
        closeModal();
    }
};
