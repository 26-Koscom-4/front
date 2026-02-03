// 현재 필터 상태 저장
let currentFilter = 'all';
let currentBriefingFilter = 'all';
let cachedBriefingVillages = [];

async function renderVillages(filterType = 'all') {
    currentFilter = filterType;
    const grid = document.getElementById('villageGrid');
    grid.innerHTML = '<div style="text-align: center; padding: 40px;">로딩 중...</div>';

    try {
        const data = await fetchAPI('/villages');
        grid.innerHTML = '';

        if (!data.villages || data.villages.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">마을이 없습니다.</div>';
            return;
        }

        // 필터링 및 그룹화
        if (filterType === 'all') {
            renderVillageCards(data.villages, grid);
        } else if (filterType === 'country') {
            renderVillagesByCountry(data.villages, grid);
        } else if (filterType === 'type') {
            renderVillagesByType(data.villages, grid);
        } else if (filterType === 'custom') {
            renderVillagesByCustom(data.villages, grid);
        }
    } catch (error) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--danger);">마을 목록을 불러오는데 실패했습니다.</div>';
    }
}

// 마을 카드 렌더링 함수
function renderVillageCards(villages, grid) {
    villages.forEach(village => {
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
}

// 국가별 필터링 (국가 관련 마을만)
function renderVillagesByCountry(villages, grid) {
    const countryVillages = villages.filter(village => {
        return village.name.includes('한국') || village.name.includes('국장') || village.icon.includes('🇰🇷') ||
               village.name.includes('미국') || village.name.includes('미장') || village.icon.includes('🇺🇸') ||
               village.name.includes('글로벌') || village.name.includes('ETF') || village.icon.includes('🌍');
    });

    renderVillageCards(countryVillages, grid);
}

// 유형별 필터링 (국가 관련 마을 제외)
function renderVillagesByType(villages, grid) {
    const typeVillages = villages.filter(village => {
        // 국가 관련 마을 제외
        const isCountryVillage = village.name.includes('한국') || village.name.includes('국장') || village.icon.includes('🇰🇷') ||
                                 village.name.includes('레버리지') || village.name.includes('미장') || village.icon.includes('🇺🇸') ||
                                 village.name.includes('글로벌') || village.icon.includes('단기') ||
                                 village.name.includes('장기') || village.icon.includes('단타') ||
                                 village.name.includes('장투') || village.isCustom === true;
                                 
        return !isCountryVillage;
    });

    renderVillageCards(typeVillages, grid);
}

// 사용자 지정 마을 필터링
function renderVillagesByCustom(villages, grid) {
    const goalVillages = villages.filter(village => {
        return village.isCustom === true;
    });

    renderVillageCards(goalVillages, grid);
}

// 필터 변경 함수
function filterVillages(filterType) {
    // 탭 활성화 상태 변경
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // 마을 재렌더링
    renderVillages(filterType);
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
                    <strong style="color: var(--dark);">AI 한 줄 요약:</strong>
                    <span style="color: var(--text);">${getVillageTypeText(village.comment)}</span>
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

// 마을 분석 차트 변수
let villageReturnChart = null;

// 현재 선택된 마을 저장
let currentAnalysisVillage = null;

// 마을로 이동 (마을 분석 페이지)
function goToVillage(villageName) {
    const data = loadData();
    const village = data.villages.find(v => v.name === villageName);

    if (village) {
        // 현재 선택된 마을 저장
        currentAnalysisVillage = village;

        // 브리핑 읽음 처리
        markBriefingAsRead(villageName);

        // 마을 분석 페이지로 이동 (renderDaily에서 내용 렌더링)
        showPage('daily');
    } else {
        showToast('해당 마을을 찾을 수 없습니다.', 'error');
    }
}

// 마을 수익률 차트 렌더링
function renderVillageReturnChart(village) {
    const canvas = document.getElementById('villageReturnChart');
    if (!canvas) return;

    // 기존 차트 삭제
    if (villageReturnChart) {
        villageReturnChart.destroy();
        villageReturnChart = null;
    }

    // 데이터: 최근 12개월 수익률
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 사용자가 만든 마을인 경우 빈 차트 표시
    if (village.isCustom && village.id !== 'v3') {
        const ctx = canvas.getContext('2d');
        villageReturnChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: '월별 수익률 (%)',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(200, 200, 200, 0.3)',
                    borderColor: 'rgba(200, 200, 200, 0.5)',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 14, family: "'Pretendard', sans-serif" },
                            color: '#999'
                        }
                    },
                    tooltip: { enabled: false },
                    // 차트 중앙에 메시지 표시
                    annotation: {
                        annotations: {}
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            color: '#999'
                        }
                    },
                    x: {
                        ticks: { color: '#999' }
                    }
                }
            },
            plugins: [{
                id: 'noDataMessage',
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const width = chart.width;
                    const height = chart.height;

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = "16px 'Pretendard', sans-serif";
                    ctx.fillStyle = '#999';
                    ctx.fillText('아직 수익률 데이터가 없습니다', width / 2, height / 2);
                    ctx.restore();
                }
            }]
        });
        return;
    }

    // 마을 유형에 따라 다른 패턴의 데이터 생성
    let returnData;
    if (village.type === 'growth') {
        returnData = [2.3, 3.1, -1.2, 4.5, 2.8, 5.2, 3.7, -0.8, 6.1, 4.2, 3.9, 5.5];
    } else if (village.type === 'dividend') {
        returnData = [1.5, 1.8, 1.2, 2.1, 1.9, 2.3, 1.7, 2.0, 1.8, 2.2, 1.9, 2.5];
    } else if (village.type === 'leverage') {
        returnData = [5.2, -3.8, 8.1, -2.5, 7.3, 4.9, -4.2, 9.1, -1.8, 6.5, 3.2, -2.1];
    } else if (village.type === 'domestic') {
        returnData = [1.8, 2.5, -0.8, 3.2, 2.1, 1.9, 2.8, 1.5, 3.5, 2.7, 2.3, 3.1];
    } else {
        returnData = [2.1, 2.8, 1.5, 3.2, 2.5, 3.8, 2.9, 1.8, 4.2, 3.1, 2.7, 3.9];
    }

    // 색상 설정 (양수: 초록, 음수: 빨강)
    const backgroundColors = returnData.map(value =>
        value >= 0 ? 'rgba(78, 205, 196, 0.8)' : 'rgba(255, 107, 107, 0.8)'
    );

    const ctx = canvas.getContext('2d');
    villageReturnChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: '월별 수익률 (%)',
                data: returnData,
                backgroundColor: backgroundColors,
                borderColor: returnData.map(value =>
                    value >= 0 ? 'rgba(78, 205, 196, 1)' : 'rgba(255, 107, 107, 1)'
                ),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Pretendard', sans-serif"
                        },
                        color: '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `수익률: ${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 13,
                            family: "'Pretendard', sans-serif"
                        },
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 13,
                            family: "'Pretendard', sans-serif"
                        },
                        color: '#666'
                    }
                }
            }
        }
    });
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
        'growth': '<strong>레버리지 노출 완화</strong>' +
            '<br>TQQQ·UPRO 등 레버리지 ETF 비중이 있어 변동성이 확대될 수있습니다.</li>' +
            '<br>단기 변동 구간에서는 비중을 점검하세요.<br>' +
            '<strong> 단일 종목 집중 관리</strong> ' +
            '<br>NVDA와 TSLA 비중이 높아 특정 종목 리스크가 커질 수 있습니다. ' +
            '<br>상위 종목 비중을 점검하세요.<br>' +
            '<strong> 현금흐름 보완</strong> ' +
            '<br>배당 성격의 SCHD 비중이 상대적으로 낮습니다. ' +
            '<br>변동성 완화를 위해 배당/방어형 비중을 늘리는 방안을 고려해보세요.',
        'dividend': '배당주는 꾸준한 현금 흐름을 제공합니다. 배당락일을 체크하세요.',
        'leverage': '⚠️ 레버리지 상품은 높은 변동성을 가집니다. 리스크 관리에 주의하세요.',
        'domestic': '국내 시장 뉴스와 정책 변화를 주시하세요.',
        'etf': '글로벌 분산 투자로 리스크를 낮추고 있습니다. 좋은 전략입니다!',
        'semiconductor': '반도체 업황과 글로벌 수요 동향을 주목하세요.'
    };
    return adviceMap[village.type] || '꾸준한 모니터링과 리밸런싱을 권장합니다.';
}

// 브리핑 마을 필터링 로직
function filterBriefingVillageList(villages, filterType) {

    if (filterType === 'all') return villages;
    if (filterType === 'country') {
        return villages.filter(v =>
            v.name.includes('한국') || v.name.includes('국장') || v.icon.includes('🇰🇷') ||
            v.name.includes('미국') || v.name.includes('미장') || v.icon.includes('🇺🇸') ||
            v.name.includes('글로벌') || v.name.includes('ETF'));
    }
    if (filterType === 'type') {
        return villages.filter(v => {
            const isCountry = v.name.includes('한국') || v.name.includes('국장') || v.icon.includes('🇰🇷') ||
                v.name.includes('미국') || v.name.includes('미장') || v.icon.includes('🇺🇸') ||
                v.name.includes('글로벌') || v.icon.includes('🌍') || v.isCustom === true;
            return !isCountry;
        });
    }
    if (filterType === 'custom') {

        return villages.filter(v => v.isCustom === true );
    }

    return villages;
}

// 브리핑 필터 탭 변경
function filterBriefingVillages(filterType) {
    currentBriefingFilter = filterType;

    document.querySelectorAll('.briefing-filter-tabs .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    const grid = document.getElementById('villageSelectorGrid');
    grid.innerHTML = '';

    const filtered = filterBriefingVillageList(cachedBriefingVillages, filterType);

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">해당 필터에 맞는 마을이 없습니다.</div>';
        return;
    }

    filtered.forEach(village => {
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

        cachedBriefingVillages = data.villages;
        console.log(`[DEBUG] ${data.villages.length}개의 마을 렌더링 중...`);

        const filtered = filterBriefingVillageList(data.villages, currentBriefingFilter);

        filtered.forEach(village => {
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

// 마을 type별 뉴스 데이터
const villageNewsMap = {
    'growth': [
        { title: 'AI 관련주 급등세 지속', summary: 'OpenAI 신규 모델 발표 이후 AI 관련 기술주 강세가 이어지고 있습니다.', time: '2시간 전' },
        { title: '빅테크 실적 시즌 개막', summary: '이번 주부터 주요 빅테크 기업들의 분기 실적 발표가 시작됩니다.', time: '4시간 전' },
        { title: '나스닥 사상 최고치 경신', summary: '기술주 랠리에 힘입어 나스닥 지수가 신고가를 기록했습니다.', time: '6시간 전' }
    ],
    'dividend': [
        { title: '고배당 ETF 자금 유입 증가', summary: '금리 인하 기대감에 고배당 ETF로의 자금 유입이 크게 증가하고 있습니다.', time: '1시간 전' },
        { title: '배당 시즌 앞두고 배당주 관심 증가', summary: '연말 배당 시즌이 다가오면서 배당 수익률이 높은 종목에 관심이 집중됩니다.', time: '3시간 전' },
        { title: '리츠(REITs) 시장 회복 조짐', summary: '금리 인하 전망이 부동산 리츠 시장의 회복을 견인하고 있습니다.', time: '5시간 전' }
    ],
    'leverage': [
        { title: '하루만에 -60% \'대참사\'', summary: '개미 지난달 미래에셋 레버리지 ETN 1조 넘게 순매', time: '11시간 전' },
        { title: 'ETF 거래대금, 코스닥과 어깨 나란히', summary: '지난달 ETF 일평균 거래대금 14조원 넘기며 사상 최대 코스닥과 비슷한 수준…', time: '11시간 전' },
        { title: '변동성 장세 ‘손실 폭탄’', summary: '이달 들어 국내 증시 변동성이 커진 가운데 레버리지 상장지수펀드(ETF)의 구조적 위험성이 재조명되고 있다.', time: '10시간 전' }
    ],
    'domestic': [
        { title: '코스피 외국인 순매수 전환', summary: '외국인 투자자가 3거래일 연속 코스피 순매수를 기록했습니다.', time: '1시간 전' },
        { title: '정부 경기부양책 발표 예정', summary: '이번 주 중 정부의 추가 경기부양 정책이 발표될 예정입니다.', time: '3시간 전' },
        { title: '원/달러 환율 하락세 지속', summary: '달러 약세 흐름 속 원/달러 환율이 하락세를 이어가고 있습니다.', time: '5시간 전' }
    ],
    'etf': [
        { title: '글로벌 ETF 시장 사상 최대 규모', summary: '전 세계 ETF 운용 자산이 사상 최대치를 경신했습니다.', time: '2시간 전' },
        { title: '신흥국 ETF 자금 유입 확대', summary: '인도, 베트남 등 신흥국 ETF에 대한 투자자 관심이 높아지고 있습니다.', time: '4시간 전' },
        { title: '액티브 ETF 출시 러시', summary: '올해 액티브 ETF 신규 상장이 급증하며 투자 선택지가 넓어지고 있습니다.', time: '6시간 전' }
    ],
    'semiconductor': [
        { title: 'HBM 수요 폭발적 증가', summary: 'AI 서버 수요 증가로 HBM 반도체 주문이 사상 최대를 기록했습니다.', time: '1시간 전' },
        { title: 'TSMC 실적 어닝 서프라이즈', summary: 'TSMC의 분기 실적이 시장 예상치를 크게 상회했습니다.', time: '3시간 전' },
        { title: '반도체 장비주 수주 호조', summary: '글로벌 반도체 장비 업체들의 수주 잔고가 크게 늘어나고 있습니다.', time: '5시간 전' }
    ]
};

// holdings 배열에서 종목 데이터 찾기
function findHoldingByName(name) {
    const holdings = sampleData.holdings || [];
    return holdings.find(h => h.name === name);
}

// 마을별 브리핑 내용 생성
function generateVillageBriefingContent(village) {
    if (!village) return '<p>마을 데이터를 불러올 수 없습니다.</p>';

    const totalValue = village.totalValue ?? 0;
    const returnRate = village.returnRate ?? 0;
    const assets = village.assets ?? [];

    const returnClass = returnRate >= 0 ? 'positive' : 'negative';
    const returnSign = returnRate >= 0 ? '+' : '';

    // 섹션 1: 마을 총 수익률 + 평가손익
    const profitLoss = Math.round(totalValue * returnRate / (100 + returnRate));
    const profitLossClass = profitLoss >= 0 ? 'positive' : 'negative';
    const profitLossSign = profitLoss >= 0 ? '+' : '';

    // 섹션 2: 전일대비 등락 수익률 (holdings에서 가중평균)
    let villageDailyReturn = 0;
    let dailyCount = 0;
    let totalWeight = 0;

    assets.forEach(asset => {
        const assetName = typeof asset === 'string' ? asset : (asset.name ?? null);
        if (assetName) {
            const holding = findHoldingByName(assetName);
            if (holding && holding.dailyReturn != null) {
                const weight = holding.value || 1;
                villageDailyReturn += holding.dailyReturn * weight;
                totalWeight += weight;
                dailyCount++;
            }
        }
    });

    if (totalWeight > 0) {
        villageDailyReturn = parseFloat((villageDailyReturn / totalWeight).toFixed(2));
    } else if (dailyCount === 0) {
        villageDailyReturn = 0;
    }
    const dailyClass = villageDailyReturn >= 0 ? 'positive' : 'negative';
    const dailySign = villageDailyReturn >= 0 ? '+' : '';

    // 섹션 3: 보유 종목별 총 수익률 (holdings에서 조회)
    const assetTotalReturnHtml = assets.map(asset => {
        const name = typeof asset === 'string' ? asset : (asset.name ?? '알 수 없음');
        const holding = findHoldingByName(name);
        const totalReturn = holding ? (holding.totalReturn ?? 0) : 0;
        const cls = totalReturn >= 0 ? 'positive' : 'negative';
        const sign = totalReturn >= 0 ? '+' : '';
        return `<p style="margin: 6px 0; display: flex; justify-content: space-between;">
            <strong>${name}</strong>
            <span class="stat-value ${cls}">${sign}${totalReturn}%</span>
        </p>`;
    }).join('');

    // 섹션 4: 보유 종목별 전일대비 등락 (holdings에서 조회)
    const assetDailyReturnHtml = assets.map(asset => {
        const name = typeof asset === 'string' ? asset : (asset.name ?? '알 수 없음');
        const holding = findHoldingByName(name);
        const dr = holding ? (holding.dailyReturn ?? 0) : 0;
        const cls = dr >= 0 ? 'positive' : 'negative';
        const sign = dr >= 0 ? '+' : '';
        return `<p style="margin: 6px 0; display: flex; justify-content: space-between;">
            <strong>${name}</strong>
            <span class="stat-value ${cls}">${sign}${dr}%</span>
        </p>`;
    }).join('');

    // 섹션 5: 마을별 최신 뉴스
    const news = villageNewsMap[village.type] || villageNewsMap['growth'];
    const newsHtml = news.map(n => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--light);">
            <p style="font-weight: 700; margin-bottom: 4px;">${n.title}</p>
            <p style="color: var(--text-light); font-size: 14px; margin-bottom: 4px;">${n.summary}</p>
            <p style="color: var(--text-light); font-size: 12px;">🕐 ${n.time}</p>
        </div>
    `).join('');

    // 섹션 6: 오늘의 AI 조언
    const villageAdvice = getVillageAdvice(village);
    const marketAdvice = getMarketAdvice(village);

    return `
        <div class="briefing-section">
            <h3>📊 마을 총 수익률</h3>
            <p><strong>총 수익률:</strong> <span class="stat-value ${returnClass}">${returnSign}${returnRate}%</span></p>
            <p><strong>평가손익:</strong> <span class="stat-value ${profitLossClass}">${profitLossSign}${profitLoss.toLocaleString()}원</span></p>
            <p><strong>총 자산:</strong> ${totalValue.toLocaleString()}원</p>
        </div>

        <div class="briefing-section">
            <h3>📈 전일대비 등락</h3>
            <p><strong>마을 전일대비:</strong> <span class="stat-value ${dailyClass}">${dailySign}${villageDailyReturn}%</span></p>
        </div>

        <div class="briefing-section">
            <h3>💼 보유 종목별 총 수익률</h3>
            ${assetTotalReturnHtml || '<p>보유 자산이 없습니다.</p>'}
        </div>

        <div class="briefing-section">
            <h3>📉 보유 종목별 전일대비 등락</h3>
            ${assetDailyReturnHtml || '<p>보유 자산이 없습니다.</p>'}
        </div>

        <div class="briefing-section">
            <h3>📰 마을 최신 뉴스</h3>
            ${village.isCustom && village.id !== 'v3' ? '<p>AI가 다음 장전/장중 브리핑을 준비 중입니다.</p>' : newsHtml}
        </div>

        <div class="briefing-section">
            <h3>🤖 오늘의 AI 조언</h3>
            ${village.isCustom && village.id !== 'v3' ? '<p>사용자 정의 마을은 AI 조언이 제공되지 않습니다. 직접 포트폴리오를 관리하세요!</p>' : `<p>${villageAdvice}</p>${marketAdvice}`}
        </div>
    `;
}

// 마을 유형별 시장 조언
function getMarketAdvice(village) {
    const adviceMap = {
        'growth': '<p style="margin-top: 10px;">📈 기술주 중심 포트폴리오입니다. 실적 발표 시즌을 주목하세요.</p>',
        'dividend': '<p style="margin-top: 10px;">💰 배당락일 3일 전입니다. 배당 수익 예상액을 확인하세요.</p>',
        'leverage': '<p style="margin-top: 15px;">⬇️ 하락세 주의하세요.</p>' +
            '<p style="margin-top: 10px;">👀 변동성 증가에 유의하세요.</p>' +
            '<p style="margin-top: 10px;">😊 122630.KS, 15.62% 상승. KODEX ETF 성과 긍정적.</p>' +
            '<p style="margin-top: 10px;">🚨 TQQQ, 3.54% 하락. 시장 하락 리스크 확대.</p>',
        'domestic': '<p style="margin-top: 10px;">🇰🇷 오늘 국내 증시는 외국인 수급에 주목하세요.</p>',
        'etf': '<p style="margin-top: 10px;">🌍 글로벌 시장이 안정세를 보이고 있습니다.</p>',
        'semiconductor': '<p style="margin-top: 10px;">🔬 반도체 업황 지표와 수주 동향을 체크하세요.</p>'
    };
    return adviceMap[village.type] || '';
}

// AI 포트폴리오 리밸런싱 내용 생성
function generateRebalancingContent(village) {
    const totalAllocation = village.assets.length > 0 ? 100 : 0;
    const idealAllocation = village.assets.length > 0 ? Math.round(100 / village.assets.length) : 0;

    const rebalancingMap = {
        'growth': { suggestion: '성장주 비중이 높습니다. 방어주나 채권 ETF를 일부 편입하여 변동성을 줄이는 것을 권장합니다.', action: '성장주 비중 축소 → 가치주/채권 편입' },
        'dividend': { suggestion: '배당주 포트폴리오가 안정적입니다. 배당 성장률이 높은 종목으로 일부 교체를 고려하세요.', action: '저배당 종목 매도 → 고배당 성장주 매수' },
        'leverage': { suggestion: '레버리지 상품은 장기 보유 시 손실이 커질 수 있습니다. 정기적인 리밸런싱이 필수입니다.', action: '레버리지 비중 조절 → 인버스 헷지 검토' },
        'domestic': { suggestion: '국내 주식 편중도가 높습니다. 해외 자산을 추가하여 지역 분산을 고려하세요.', action: '국내 비중 축소 → 해외 ETF 편입' },
        'etf': { suggestion: 'ETF 포트폴리오가 잘 분산되어 있습니다. 섹터별 비중을 점검하세요.', action: '섹터 비중 재조정 → 저평가 섹터 확대' },
        'semiconductor': { suggestion: '반도체 섹터 집중도가 높습니다. 다른 기술 섹터로 분산을 권장합니다.', action: '반도체 비중 축소 → AI/소프트웨어 편입' }
    };

    const info = rebalancingMap[village.type] || { suggestion: '현재 포트폴리오의 자산 비중을 점검하고 목표 비중과의 차이를 확인하세요.', action: '목표 비중 대비 괴리 종목 조정' };

    let assetBalanceHtml = village.assets.map(asset => {
        const assetName = typeof asset === 'string' ? asset : asset.name;
        const currentWeight = Math.round(asset.value / village.totalValue * 100,1);
        const diff = Math.round(currentWeight - idealAllocation);
        const diffSign = diff >= 0 ? '+' : '';
        const diffColor = Math.abs(diff) > 5 ? 'var(--danger)' : 'var(--success)';
        return `<p style="margin: 6px 0;">• <strong>${assetName}</strong>: 현재 ${currentWeight}% → 목표 ${idealAllocation}% <span style="color: ${diffColor}; font-weight: 600;">(${diffSign}${diff}%)</span></p>`;
    }).join('');

    return `
        <div style="background: linear-gradient(135deg, rgba(255,107,53,0.05), rgba(255,210,63,0.05)); border-radius: 12px; padding: 18px; margin-bottom: 15px;">
            <p style="font-weight: 600; color: var(--primary); margin-bottom: 8px;">💡 리밸런싱 제안</p>
            <p>${info.suggestion}</p>
            <p style="margin-top: 10px; color: var(--text-light);"><strong>추천 액션:</strong> ${info.action}</p>
        </div>
        <div>
            <p style="font-weight: 600; margin-bottom: 10px;">📊 종목별 비중 분석</p>
            ${assetBalanceHtml}
        </div>
    `;
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
        // 현재 선택된 마을이 있으면 해당 마을 데이터 사용
        if (currentAnalysisVillage) {
            renderVillageAnalysisContent(currentAnalysisVillage);
            return;
        }

        // 선택된 마을이 없으면 첫 번째 마을 표시
        const data = loadData();
        if (data.villages && data.villages.length > 0) {
            currentAnalysisVillage = data.villages[0];
            renderVillageAnalysisContent(currentAnalysisVillage);
        }
    } catch (error) {
        console.error('데일리 브리핑 로드 오류:', error);
    }
}

// 마을 분석 페이지 내용 렌더링
function renderVillageAnalysisContent(village) {
    if (!village) return;

    // 마을 이름 및 아이콘 업데이트
    document.getElementById('dailyVillageName').textContent = village.name;
    const avatar = document.querySelector('#dailyBriefingPage .ant-avatar');
    if (avatar) {
        avatar.textContent = village.icon;
    }

    // 마을 요약 정보 업데이트
    const totalValue = village.totalValue || 0;
    const returnRate = village.returnRate || 0;
    const assetsCount = village.assets ? village.assets.length : 0;

    document.getElementById('villageAnalysisTotalValue').textContent = totalValue.toLocaleString() + '원';
    const returnRateElement = document.getElementById('villageAnalysisReturnRate');
    returnRateElement.textContent = (returnRate >= 0 ? '+' : '') + returnRate + '%';
    returnRateElement.style.color = returnRate >= 0 ? 'var(--success)' : 'var(--danger)';
    document.getElementById('villageAnalysisAssetCount').textContent = assetsCount + '개';

    // 수익률 차트 렌더링
    renderVillageReturnChart(village);

    // 보유 자산 목록
    const assetsContainer = document.getElementById('villageAnalysisAssets');
    if (village.assets && village.assets.length > 0) {
        assetsContainer.innerHTML = village.assets.map(asset => {
            const assetName = typeof asset === 'string' ? asset : asset.name;
            const assetType = typeof asset === 'string' ? '' : ` (${asset.type})`;
            const assetValue = typeof asset === 'string' ? '' : ` - ${asset.value ? asset.value.toLocaleString() + '원' : ''}`;
            return `<p style="margin: 8px 0;">• <strong>${assetName}</strong>${assetType}${assetValue}</p>`;
        }).join('');
    } else {
        assetsContainer.innerHTML = '<p style="margin: 8px 0; color: var(--text-light);">보유 자산이 없습니다.</p>';
    }

    // AI 포트폴리오 분석
    document.getElementById('villageAnalysisAdvice').innerHTML = `
        <p>${getVillageAdvice(village)}</p>
        ${getMarketAdvice(village)}
    `;

    // AI 포트폴리오 리밸런싱
    document.getElementById('villageAnalysisRebalancing').innerHTML = generateRebalancingContent(village);
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

// 마을 추가 (이웃 개미 페이지용)
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

// 마을 추가 모달 열기
function openAddVillageModal() {
    const modal = document.getElementById('addVillageModal');
    modal.classList.add('active');

    // 폼 초기화
    document.getElementById('newVillageName').value = '';
    document.getElementById('newVillageType').value = '';
    document.getElementById('newVillageGoal').value = '';
    document.getElementById('newVillageIcon').value = '🏘️';

    // holdings 데이터에서 종목 체크박스 목록 생성
    const assetCheckboxList = document.getElementById('assetCheckboxList');
    const holdings = sampleData.holdings || [];

    // 중복 제거 (name 기준)
    const uniqueHoldings = holdings.filter((holding, index, self) =>
        index === self.findIndex(h => h.name === holding.name)
    );

    assetCheckboxList.innerHTML = uniqueHoldings.map(holding => `
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" name="villageAssets" value="${holding.name}" data-type="${holding.type}" style="width: 18px; height: 18px; cursor: pointer;">
            <span>${holding.name} (${holding.type})</span>
        </label>
    `).join('');

    // 아이콘 선택 초기화
    document.querySelectorAll('.icon-select-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector('.icon-select-btn[data-icon="🏘️"]').classList.add('selected');

    // 노트 초기화 (첫 번째 항목만 남기기)
    const notesList = document.getElementById('villageNotesList');
    notesList.innerHTML = `
        <div class="note-item" style="display: flex; gap: 8px;">
            <input type="text" class="input-field village-note" placeholder="예: 기술주 위주 포트폴리오" style="flex: 1;">
            <button type="button" class="note-remove-btn" onclick="removeNoteItem(this)" style="background: var(--danger); color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 16px;">×</button>
        </div>
    `;
}

// 아이콘 선택
function selectVillageIcon(icon) {
    document.getElementById('newVillageIcon').value = icon;
    document.querySelectorAll('.icon-select-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`.icon-select-btn[data-icon="${icon}"]`).classList.add('selected');
}

// 노트 항목 추가
function addNoteItem() {
    const notesList = document.getElementById('villageNotesList');
    const newItem = document.createElement('div');
    newItem.className = 'note-item';
    newItem.style.display = 'flex';
    newItem.style.gap = '8px';
    newItem.innerHTML = `
        <input type="text" class="input-field village-note" placeholder="투자 전략 또는 특이사항 입력" style="flex: 1;">
        <button type="button" class="note-remove-btn" onclick="removeNoteItem(this)" style="background: var(--danger); color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 16px;">×</button>
    `;
    notesList.appendChild(newItem);
}

// 노트 항목 제거
function removeNoteItem(button) {
    const notesList = document.getElementById('villageNotesList');
    if (notesList.children.length > 1) {
        button.parentElement.remove();
    } else {
        showToast('최소 1개의 항목은 필요합니다.', 'error');
    }
}

// 마을 추가 모달 닫기
function closeAddVillageModal() {
    const modal = document.getElementById('addVillageModal');
    modal.classList.remove('active');
}

// 새 마을 추가 제출
async function submitNewVillage(event) {
    event.preventDefault();

    const villageName = document.getElementById('newVillageName').value.trim();
    const villageType = document.getElementById('newVillageType').value;
    const villageGoal = document.getElementById('newVillageGoal').value;
    const villageIcon = document.getElementById('newVillageIcon').value || '🏘️';

    // 선택된 종목 이름 가져오기
    const selectedAssetNames = Array.from(document.querySelectorAll('input[name="villageAssets"]:checked'))
        .map(cb => cb.value);

    // holdings에서 선택된 종목의 전체 데이터 가져오기
    const holdings = sampleData.holdings || [];
    const selectedAssets = selectedAssetNames.map(name => {
        const holding = holdings.find(h => h.name === name);
        if (holding) {
            return { ...holding }; // 전체 데이터 복사
        }
        return { name: name, type: '기타', value: 0 };
    });

    // 총 자산 계산
    const totalValue = selectedAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);

    // 포트폴리오 비중 계산 (미장마을, 국장마을의 총 자산 대비)
    const data = loadData();
    const baseVillages = data.villages.filter(v => v.name === '미장마을' || v.name === '국장마을');
    const baseTotalAssets = baseVillages.reduce((sum, v) => sum + (v.totalValue || 0), 0);
    const allocation = baseTotalAssets > 0 ? parseFloat(((totalValue / baseTotalAssets) * 100).toFixed(1)) : 0;

    // 노트 수집
    const notes = Array.from(document.querySelectorAll('.village-note'))
        .map(input => input.value.trim())
        .filter(note => note.length > 0);

    try {
        const newVillage = {
            id: 'v' + Date.now(),
            name: villageName,
            icon: villageIcon,
            assets: selectedAssets,
            type: villageType,
            goal: villageGoal,
            totalValue: totalValue,
            returnRate: 0,
            allocation: allocation,
            notes: notes,
            lastBriefingRead: null,
            comment: 'AI가 요약을 생성중입니다.',
            isCustom: true  // 사용자가 만든 마을 표시
        };

        const result = await fetchAPI('/villages', {
            method: 'POST',
            body: JSON.stringify(newVillage)
        });

        showToast(`"${villageName}" 마을이 추가되었습니다! 🎉`, 'success');

        // 모달 닫기
        closeAddVillageModal();

        // 마을 목록 새로고침
        await renderVillages(currentFilter);
    } catch (error) {
        console.error('마을 추가 오류:', error);
        showToast('마을 추가에 실패했습니다.', 'error');
    }
}

