// ========== 포트폴리오 분석 페이지 ==========

let villagePerformanceChart = null;
let assetTypeChart = null;

// 로딩 상태 관리
function showAnalysisLoading() {
    const loadingOverlay = document.getElementById('analysisLoading');
    const progressBar = document.getElementById('analysisLoadingProgress');
    const statusText = document.getElementById('analysisLoadingStatus');

    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        if (progressBar) progressBar.style.width = '0%';
        if (statusText) statusText.textContent = '데이터를 불러오고 있습니다';
    }
}

function updateAnalysisLoading(percent, status) {
    const progressBar = document.getElementById('analysisLoadingProgress');
    const statusText = document.getElementById('analysisLoadingStatus');

    if (progressBar) progressBar.style.width = percent + '%';
    if (statusText) statusText.textContent = status;
}

function hideAnalysisLoading() {
    const loadingOverlay = document.getElementById('analysisLoading');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// 딜레이 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 포트폴리오 분석 페이지 렌더링
async function renderAnalysis() {
    try {
        // 로딩 시작
        showAnalysisLoading();
        updateAnalysisLoading(10, '서버에 연결 중...');
        await delay(150);

        const data = await fetchAPI('/analysis');
        updateAnalysisLoading(30, '데이터 처리 중...');
        await delay(150);

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

        // 투자 성향
        const investStyle = getInvestmentStyle();
        document.getElementById('analysisRiskLevel').textContent = investStyle.level;
        document.getElementById('analysisRiskDesc').textContent = investStyle.desc;

        updateAnalysisLoading(50, '차트 생성 중...');
        await delay(200);

        // 차트 렌더링
        renderVillagePerformanceChart(data.villages);
        renderAssetTypeChart(data.villages);

        updateAnalysisLoading(70, '성과 분석 중...');
        await delay(150);

        // 상위/하위 종목 렌더링
        renderTopPerformers(data.villages);
        renderBottomPerformers(data.villages);

        updateAnalysisLoading(85, '리밸런싱 추천 생성 중...');
        await delay(150);

        // 리밸런싱 추천
        renderRebalancingRecommendations(data);

        // 로딩 완료
        updateAnalysisLoading(100, '완료!');
        await delay(100);
        hideAnalysisLoading();

    } catch (error) {
        console.error('포트폴리오 분석 로드 오류:', error);
        hideAnalysisLoading();
    }
}

// 투자 성향 조회
function getInvestmentStyle() {
    const data = loadData();
    if (data.investment_test && data.investment_test.completed && data.investment_test.mainType) {
        const typeInfo = investmentTypes[data.investment_test.mainType];
        if (typeInfo) {
            return { level: typeInfo.name, desc: typeInfo.description.slice(0, 20) + '...' };
        }
    }
    return { level: '적극투자형', desc: '고위험 고수익 투자 전략을 따릅니다.' };
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
