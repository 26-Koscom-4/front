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

