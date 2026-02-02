// 현재 필터 상태 저장
let currentFilter = 'all';

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
        } else if (filterType === 'goal') {
            renderVillagesByGoal(data.villages, grid);
        } else if (filterType === 'custom') {
            renderVillageCards(data.villages, grid);
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
                                 village.name.includes('미국') || village.name.includes('미장') || village.icon.includes('🇺🇸') ||
                                 village.name.includes('글로벌') || village.icon.includes('🌍');
        return !isCountryVillage;
    });

    renderVillageCards(typeVillages, grid);
}

// 투자 성향별 필터링 (배당, 레버리지, 장투, 단타만)
function renderVillagesByGoal(villages, grid) {
    const goalVillages = villages.filter(village => {
        return village.name.includes('배당') ||
               village.name.includes('레버리지') ||
               village.name.includes('장투') ||
               village.name.includes('단타');
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

    // 체크박스 초기화
    document.querySelectorAll('input[name="villageAssets"]').forEach(cb => cb.checked = false);

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

    // 선택된 종목 가져오기 (선택사항)
    const selectedAssets = Array.from(document.querySelectorAll('input[name="villageAssets"]:checked'))
        .map(cb => cb.value);

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
            totalValue: 0,
            returnRate: 0,
            allocation: 0,
            notes: notes,
            lastBriefingRead: null
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

