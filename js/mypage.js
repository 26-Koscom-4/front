
// 마이페이지 로드
async function loadMypage() {
    try {
        const data = await fetchAPI('/mypage');
        const asset_data = fetchAPI('/portfolio/summary?user_id=1');

        // 프로필 정보 로드
        document.getElementById('userName').value = data.userProfile?.name || '김직장';
        document.getElementById('userTheme').value = data.userProfile?.theme || 'light';

        // 설정 정보 로드
        document.getElementById('briefingTime').value = data.settings?.briefing_time || '08:00';
        document.getElementById('voiceSpeed').value = data.settings?.voice_speed || 1.0;
        document.getElementById('voiceSpeedValue').textContent = (data.settings?.voice_speed || 1.0) + 'x';
        document.getElementById('fontSize').value = data.settings?.font_size || 16;
        document.getElementById('fontSizeValue').textContent = (data.settings?.font_size || 16) + 'px';

        // 음성 속도 슬라이더 이벤트
        document.getElementById('voiceSpeed').addEventListener('input', function() {
            document.getElementById('voiceSpeedValue').textContent = this.value + 'x';
        });

        // 글씨 크기 슬라이더 이벤트
        document.getElementById('fontSize').addEventListener('input', function() {
            document.getElementById('fontSizeValue').textContent = this.value + 'px';
        });

        // 글씨 크기 적용
        applyFontSize(data.settings?.font_size || 16);

        // 통계 정보 계산 및 표시
        updateStatistics(data);

        // 자산 연동 상태 업데이트
        updateIntegrationStatus(asset_data);

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
    // const totalAssets = data.villages.reduce((sum, v) => sum + (v.totalValue || 0), 0);
    const totalAssets = data.summary.total_assets_value;
    document.getElementById('statTotalAssets').textContent = totalAssets.toLocaleString() + '원';

    // 마을 수
    document.getElementById('statVillageCount').textContent = data.summary.village_count + '개';

    // 평균 수익률
    const avgReturn = data.summary.total_profit_rate;
    // const avgReturnFormatted = avgReturn >= 0 ? '+' + avgReturn.toFixed(1) : avgReturn.toFixed(1);
    document.getElementById('statAvgReturn').textContent = avgReturn + '%';
    document.getElementById('statAvgReturn').style.color = avgReturn >= 0 ? 'var(--success)' : 'var(--danger)';

    // 보유 자산 수
    let totalAssetCount = data.summary.owned_asset_count;
    /*
    data.villages.forEach(village => {
        totalAssetCount += village.assets ? village.assets.length : 0;
    });
    */
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
    data.settings.font_size = parseInt(document.getElementById('fontSize').value);

    saveData(data);

    // 글씨 크기 적용
    applyFontSize(data.settings.font_size);

    // 성공 메시지
    showToast('설정이 저장되었습니다! ✅');

    // 활동 기록 추가
    addActivity('설정을 변경했습니다.');
}

// 글씨 크기 적용 함수
function applyFontSize(size) {
    document.documentElement.style.fontSize = size + 'px';
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

