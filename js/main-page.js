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
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 18,
                        font: {
                            size: 16,
                            family: "'Pretendard', sans-serif"
                        },
                        color: '#333',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10
                    }
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

