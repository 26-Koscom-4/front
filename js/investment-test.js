// ========== 투자 성향 진단 ==========

// 투자 성향 유형 정의
const investmentTypes = {
    conservative: {
        name: '안정형',
        icon: '🛡️',
        description: '안정적인 수익을 추구하며 원금 보존을 최우선으로 생각합니다. 위험을 최소화하고 예측 가능한 투자를 선호합니다.',
        characteristics: [
            '원금 손실을 극도로 회피',
            '안정적이고 예측 가능한 수익 추구',
            '장기적 관점의 보수적 투자',
            '높은 유동성과 안정성 중시'
        ],
        portfolios: ['배당마을', '채권 마을']
    },
    moderateConservative: {
        name: '안정추구형',
        icon: '🌱',
        description: '안정성을 중시하되, 적절한 수익을 위해 제한적인 위험을 감수할 수 있습니다.',
        characteristics: [
            '안정성을 우선하되 수익도 추구',
            '제한적인 위험 감수 가능',
            '분산 투자를 통한 리스크 관리',
            '중장기 투자 선호'
        ],
        portfolios: ['배당마을', '글로벌ETF마을', '채권 마을']
    },
    moderate: {
        name: '위험중립형',
        icon: '⚖️',
        description: '안정성과 수익성의 균형을 추구하며, 적절한 위험 관리 하에 다양한 투자를 고려합니다.',
        characteristics: [
            '안정성과 수익성의 균형 추구',
            '중간 수준의 위험 감수',
            '다양한 자산군에 분산 투자',
            '시장 상황에 따른 유연한 대응'
        ],
        portfolios: ['글로벌ETF마을', '반도체마을', '국장마을', '신흥국 마을']
    },
    moderateAggressive: {
        name: '적극투자형',
        icon: '🚀',
        description: '높은 수익을 추구하며 상당한 위험을 감수할 수 있습니다. 시장 변동성을 투자 기회로 활용합니다.',
        characteristics: [
            '높은 수익률 목표',
            '상당한 위험 감수 가능',
            '성장 가능성이 높은 자산 선호',
            '시장 타이밍 활용'
        ],
        portfolios: ['미장마을', '반도체마을', '레버리지마을', '신흥국 마을']
    },
    aggressive: {
        name: '공격투자형',
        icon: '⚡',
        description: '최고 수익을 위해 높은 위험을 기꺼이 감수하며, 공격적인 투자 전략을 추구합니다.',
        characteristics: [
            '최대 수익률 추구',
            '높은 위험 적극 감수',
            '레버리지 및 고위험 상품 활용',
            '단기 시장 변동 적극 활용'
        ],
        portfolios: ['레버리지마을', '미장마을', '반도체마을', '원자재 마을']
    }
};

// 투자 성향 진단 질문 (25개)
const investmentQuestions = [
    {
        question: '투자의 주요 목적은 무엇인가요?',
        answers: [
            { text: '원금 보존이 최우선입니다', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '안정적인 소득 창출입니다', weights: { conservative: 3, moderateConservative: 4, moderate: 1 } },
            { text: '자산의 꾸준한 성장입니다', weights: { moderateConservative: 2, moderate: 4, moderateAggressive: 2 } },
            { text: '공격적인 자산 증식입니다', weights: { moderate: 1, moderateAggressive: 4, aggressive: 3 } },
            { text: '단기 고수익 실현입니다', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 예상 기간은 얼마나 되나요?',
        answers: [
            { text: '1년 미만', weights: { aggressive: 4, moderateAggressive: 2 } },
            { text: '1~3년', weights: { moderateAggressive: 3, moderate: 3 } },
            { text: '3~5년', weights: { moderate: 4, moderateConservative: 2 } },
            { text: '5~10년', weights: { moderateConservative: 4, conservative: 2 } },
            { text: '10년 이상', weights: { conservative: 5, moderateConservative: 2 } }
        ]
    },
    {
        question: '투자 원금이 10% 손실되면 어떻게 하시겠습니까?',
        answers: [
            { text: '즉시 전액 손절합니다', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '일부만 손절하고 관망합니다', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '그대로 보유하며 회복을 기다립니다', weights: { moderate: 5 } },
            { text: '추가 매수를 고려합니다', weights: { moderateAggressive: 4, aggressive: 2 } },
            { text: '대폭 추가 매수합니다', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '1년 후 기대하는 수익률은?',
        answers: [
            { text: '원금만 보존되면 만족', weights: { conservative: 5 } },
            { text: '3% 미만', weights: { conservative: 3, moderateConservative: 3 } },
            { text: '3~7%', weights: { moderateConservative: 4, moderate: 3 } },
            { text: '7~15%', weights: { moderate: 3, moderateAggressive: 4 } },
            { text: '15% 이상', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 경험은 얼마나 되시나요?',
        answers: [
            { text: '전혀 없음', weights: { conservative: 4, moderateConservative: 2 } },
            { text: '1년 미만', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '1~3년', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '3~5년', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '5년 이상', weights: { moderateAggressive: 3, aggressive: 3 } }
        ]
    },
    {
        question: '투자 자금이 전체 자산에서 차지하는 비중은?',
        answers: [
            { text: '10% 미만', weights: { conservative: 5 } },
            { text: '10~30%', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '30~50%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '50~70%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '70% 이상', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 상품 선택 시 가장 중요한 기준은?',
        answers: [
            { text: '안정성과 원금 보장', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '낮은 변동성', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '적절한 수익과 위험 균형', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '높은 수익 잠재력', weights: { moderate: 2, moderateAggressive: 4, aggressive: 2 } },
            { text: '최대 수익률', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '시장이 급락할 때의 대응 방식은?',
        answers: [
            { text: '공포를 느끼고 전량 매도', weights: { conservative: 5 } },
            { text: '불안하지만 일부만 매도', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '차분하게 상황 관망', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '기회로 보고 매수 검토', weights: { moderate: 2, moderateAggressive: 5 } },
            { text: '큰 기회로 보고 적극 매수', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '레버리지(차입) 투자에 대한 생각은?',
        answers: [
            { text: '절대 하지 않음', weights: { conservative: 5, moderateConservative: 2 } },
            { text: '위험해서 피하고 싶음', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '상황에 따라 소량 고려 가능', weights: { moderate: 4, moderateAggressive: 2 } },
            { text: '수익 극대화를 위해 활용', weights: { moderateAggressive: 4, aggressive: 3 } },
            { text: '적극적으로 활용', weights: { aggressive: 5 } }
        ]
    },
    {
        question: '포트폴리오 변동성을 어느 정도 받아들일 수 있나요?',
        answers: [
            { text: '연 5% 미만', weights: { conservative: 5 } },
            { text: '연 5~10%', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '연 10~20%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '연 20~30%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '30% 이상도 괜찮음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 정보는 주로 어디서 얻나요?',
        answers: [
            { text: '전문가 추천만 따름', weights: { conservative: 4, moderateConservative: 3 } },
            { text: '뉴스와 리포트', weights: { moderateConservative: 4, moderate: 2 } },
            { text: '다양한 채널 종합', weights: { moderate: 5 } },
            { text: '직접 분석과 연구', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '본인만의 독자적 분석', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '투자 결정은 얼마나 신속하게 하시나요?',
        answers: [
            { text: '며칠~몇 주 고민', weights: { conservative: 5 } },
            { text: '하루 이틀 숙고', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '당일 분석 후 결정', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '몇 시간 내 결정', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '즉시 결정', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '배당수익과 시세차익 중 어느 것을 선호하시나요?',
        answers: [
            { text: '배당수익만 중요', weights: { conservative: 5 } },
            { text: '배당수익 위주', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '둘 다 비슷하게', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '시세차익 위주', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '시세차익만 중요', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '새로운 투자 상품이나 시장에 대한 태도는?',
        answers: [
            { text: '절대 투자하지 않음', weights: { conservative: 5 } },
            { text: '충분히 검증된 후에만', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '신중하게 일부 투자', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '적극적으로 탐색', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '선도적으로 투자', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 손실이 발생했을 때 심리 상태는?',
        answers: [
            { text: '극심한 스트레스와 불안', weights: { conservative: 5 } },
            { text: '상당한 걱정과 불편함', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '약간 불편하지만 감내 가능', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '크게 동요하지 않음', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '전혀 개의치 않음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '포트폴리오 리밸런싱 주기는?',
        answers: [
            { text: '거의 하지 않음', weights: { conservative: 4, moderateConservative: 2 } },
            { text: '연 1회', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '분기별', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '월별', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '수시로', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 자산 중 해외 자산 비중은?',
        answers: [
            { text: '0% (국내만)', weights: { conservative: 4 } },
            { text: '1~20%', weights: { conservative: 2, moderateConservative: 3 } },
            { text: '20~40%', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '40~60%', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '60% 이상', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '투자 시 참고하는 기간은?',
        answers: [
            { text: '10년 이상 장기', weights: { conservative: 5 } },
            { text: '5~10년', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '1~5년', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '수개월~1년', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '일~주 단위', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '손절매 기준은 어떻게 설정하시나요?',
        answers: [
            { text: '-3% 이내', weights: { conservative: 5 } },
            { text: '-5% 이내', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '-10% 이내', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '-20% 이내', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '설정하지 않음', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '파생상품(옵션, 선물 등) 투자 경험은?',
        answers: [
            { text: '전혀 없고 관심 없음', weights: { conservative: 5 } },
            { text: '없지만 알아보는 중', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '소액으로 경험해봄', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '정기적으로 투자', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '주력 투자 수단', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 실패 경험에 대한 태도는?',
        answers: [
            { text: '다시는 투자하지 않을 것', weights: { conservative: 5 } },
            { text: '매우 신중해짐', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '교훈으로 삼고 개선', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '당연한 과정으로 수용', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '학습 기회로 적극 활용', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '시장 전망이 불확실할 때의 대응은?',
        answers: [
            { text: '전액 현금 보유', weights: { conservative: 5 } },
            { text: '대부분 현금화', weights: { conservative: 3, moderateConservative: 4 } },
            { text: '기존 포지션 유지', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '저점 매수 기회 모색', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '변동성을 적극 활용', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 관련 학습에 투자하는 시간은?',
        answers: [
            { text: '거의 없음', weights: { conservative: 4 } },
            { text: '주 1시간 미만', weights: { conservative: 2, moderateConservative: 3 } },
            { text: '주 1~3시간', weights: { moderateConservative: 2, moderate: 4 } },
            { text: '주 3~7시간', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '주 7시간 이상', weights: { moderateAggressive: 2, aggressive: 4 } }
        ]
    },
    {
        question: '나의 투자 스타일은?',
        answers: [
            { text: '매우 보수적', weights: { conservative: 5 } },
            { text: '다소 보수적', weights: { conservative: 2, moderateConservative: 5 } },
            { text: '중립적', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '다소 공격적', weights: { moderate: 2, moderateAggressive: 5 } },
            { text: '매우 공격적', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    },
    {
        question: '투자 수익에 대한 만족도 기준은?',
        answers: [
            { text: '손실만 없으면 만족', weights: { conservative: 5 } },
            { text: '예금 이자보다 조금 높으면 만족', weights: { conservative: 2, moderateConservative: 4 } },
            { text: '시장 평균 수익률이면 만족', weights: { moderateConservative: 2, moderate: 5 } },
            { text: '시장 평균을 상회해야 만족', weights: { moderate: 2, moderateAggressive: 4 } },
            { text: '최상위 수익률을 목표', weights: { moderateAggressive: 2, aggressive: 5 } }
        ]
    }
];

// 현재 진단 상태
let currentQuestionIndex = 0;
let userAnswers = [];
let testChart = null;

// 투자 성향 진단 시작
function startInvestmentTest() {
    const data = loadData();

    // 이미 진단한 적이 있으면 다시 하기 확인
    if (data.investment_test && data.investment_test.completed) {
        showConfirmModal({
            title: '투자 성향 진단',
            message: '이전 진단 결과가 있습니다. 다시 진단하시겠습니까?',
            icon: '🎯',
            confirmText: '다시 진단',
            cancelText: '취소',
            confirmType: 'primary',
            onConfirm: () => {
                beginInvestmentTest();
            }
        });
    } else {
        beginInvestmentTest();
    }
}

// 투자 진단 시작 (실제 로직)
function beginInvestmentTest() {
    currentQuestionIndex = 0;
    userAnswers = [];

    document.getElementById('investmentTestModal').classList.add('active');
    document.getElementById('testQuestionsSection').style.display = 'block';
    document.getElementById('testResultSection').style.display = 'none';

    renderQuestion();
}

// 질문 렌더링
function renderQuestion() {
    const question = investmentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / investmentQuestions.length) * 100;

    document.getElementById('testQuestion').textContent = `Q${currentQuestionIndex + 1}. ${question.question}`;
    document.getElementById('testProgressFill').style.width = progress + '%';
    document.getElementById('testProgressText').textContent = `${currentQuestionIndex + 1} / ${investmentQuestions.length}`;

    const answersContainer = document.getElementById('testAnswers');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'test-answer-button';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(index);

        // 이미 선택한 답변이 있으면 표시
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }

        answersContainer.appendChild(button);
    });

    // 이전/다음 버튼 상태 업데이트
    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = userAnswers[currentQuestionIndex] === undefined;
    document.getElementById('nextButton').textContent = currentQuestionIndex === investmentQuestions.length - 1 ? '결과 보기' : '다음';
}

// 답변 선택
function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;

    // 버튼 스타일 업데이트
    const buttons = document.querySelectorAll('.test-answer-button');
    buttons.forEach((btn, idx) => {
        if (idx === answerIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    document.getElementById('nextButton').disabled = false;
}

// 이전 질문
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// 다음 질문 또는 결과 보기
function nextQuestion() {
    if (currentQuestionIndex < investmentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // 모든 질문에 답변했으면 결과 계산
        calculateResult();
    }
}

// 결과 계산
function calculateResult() {
    const scores = {
        conservative: 0,
        moderateConservative: 0,
        moderate: 0,
        moderateAggressive: 0,
        aggressive: 0
    };

    // 각 답변의 가중치를 합산
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = investmentQuestions[questionIndex];
        const answer = question.answers[answerIndex];

        Object.keys(answer.weights).forEach(type => {
            scores[type] += answer.weights[type];
        });
    });

    // 총점 계산
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    // 비율 계산
    const percentages = {};
    Object.keys(scores).forEach(type => {
        percentages[type] = ((scores[type] / totalScore) * 100).toFixed(1);
    });

    // 주 성향 찾기
    const mainType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // 결과 저장
    const data = loadData();
    data.investment_test = {
        completed: true,
        date: new Date().toISOString(),
        answers: userAnswers,
        scores: scores,
        percentages: percentages,
        mainType: mainType
    };
    saveData(data);

    // 결과 표시
    showResult(mainType, percentages, scores);
}

// 결과 표시
function showResult(mainType, percentages, scores) {
    document.getElementById('testQuestionsSection').style.display = 'none';
    document.getElementById('testResultSection').style.display = 'block';

    const typeInfo = investmentTypes[mainType];

    // 주 성향 표시
    document.getElementById('resultMainType').innerHTML = `
        <div class="main-type-icon">${typeInfo.icon}</div>
        <h3 class="main-type-name">${typeInfo.name}</h3>
        <p class="main-type-desc">${typeInfo.description}</p>
    `;

    // 차트 생성
    renderResultChart(percentages);

    // 성향 설명
    document.getElementById('resultDescription').innerHTML = `
        <h4 style="color: var(--primary); margin-bottom: 15px;">💡 ${typeInfo.name}의 특징</h4>
        <ul class="characteristics-list">
            ${typeInfo.characteristics.map(char => `<li>${char}</li>`).join('')}
        </ul>
    `;

    // 포트폴리오 추천
    document.getElementById('resultPortfolio').innerHTML = `
        <h4 style="color: var(--primary); margin-bottom: 15px;">🏘️ 추천 포트폴리오</h4>
        <p style="margin-bottom: 15px;">당신의 투자 성향에 맞는 마을을 추천합니다:</p>
        <div class="recommended-villages">
            ${typeInfo.portfolios.map(village => `
                <div class="recommended-village-tag">${village}</div>
            `).join('')}
        </div>
        <p style="margin-top: 15px; font-size: 14px; color: var(--text-light);">
            💡 이 마을들을 중심으로 포트폴리오를 구성해보세요.
        </p>
    `;

    // 활동 기록
    addActivity(`투자 성향 진단 완료: ${typeInfo.name}`);

    // 마이페이지 요약 업데이트
    updateTestSummary(typeInfo);
}

// 결과 차트 렌더링
function renderResultChart(percentages) {
    const canvas = document.getElementById('resultChart');

    if (testChart) {
        testChart.destroy();
    }

    const labels = Object.keys(percentages).map(key => investmentTypes[key].name);
    const data = Object.values(percentages).map(p => parseFloat(p));
    const colors = [
        'rgba(78, 205, 196, 0.8)',   // 안정형
        'rgba(129, 207, 224, 0.8)',  // 안정추구형
        'rgba(255, 210, 63, 0.8)',   // 위험중립형
        'rgba(247, 147, 30, 0.8)',   // 적극투자형
        'rgba(255, 107, 53, 0.8)'    // 공격투자형
    ];

    const ctx = canvas.getContext('2d');
    testChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 13 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// 마이페이지 진단 요약 업데이트
function updateTestSummary(typeInfo) {
    const summary = document.getElementById('testResultSummary');
    summary.style.display = 'block';
    summary.innerHTML = `
        <div style="padding: 20px; background: linear-gradient(135deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%); border-radius: 15px;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <span style="font-size: 36px;">${typeInfo.icon}</span>
                <div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--dark);">당신의 투자 성향</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${typeInfo.name}</div>
                </div>
            </div>
            <p style="font-size: 14px; color: var(--text); margin-top: 10px;">${typeInfo.description}</p>
        </div>
    `;

    document.getElementById('testButtonText').textContent = '다시 진단하기';
}

// 다시 진단하기
function retakeTest() {
    showConfirmModal({
        title: '다시 진단하기',
        message: '현재 진단 결과를 삭제하고 처음부터 다시 진단하시겠습니까?',
        icon: '🔄',
        confirmText: '다시 시작',
        cancelText: '취소',
        confirmType: 'primary',
        onConfirm: () => {
            currentQuestionIndex = 0;
            userAnswers = [];
            document.getElementById('testQuestionsSection').style.display = 'block';
            document.getElementById('testResultSection').style.display = 'none';
            renderQuestion();
        }
    });
}

// 진단 모달 닫기
function closeInvestmentTest() {
    document.getElementById('investmentTestModal').classList.remove('active');

    // 마이페이지에 있으면 요약 업데이트
    const data = loadData();
    if (data.investment_test && data.investment_test.completed) {
        const typeInfo = investmentTypes[data.investment_test.mainType];
        updateTestSummary(typeInfo);
    }
}

// 자산 연동 상태 UI 업데이트
function updateIntegrationStatus() {
    const data = loadData();
    const integrationButton = document.getElementById('integrationButton');
    const integrationButtonText = document.getElementById('integrationButtonText');
    const integrationIcon = document.getElementById('integrationIcon');
    const integrationDescription = document.getElementById('integrationDescription');

    if (!integrationButton || !integrationButtonText || !integrationIcon || !integrationDescription) {
        return;
    }

    if (data.mydata_integration && data.mydata_integration.is_integrated) {
        // 이미 연동된 경우
        const lastDate = new Date(data.mydata_integration.last_integration_date);
        const dateString = lastDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const institutionCount = data.mydata_integration.integrated_institutions.length;
        const institutionNames = data.mydata_integration.integrated_institutions
            .map(inst => inst.name)
            .join(', ');

        integrationDescription.innerHTML = `
            <div style="padding: 15px; background: linear-gradient(135deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%); border-radius: 12px; margin-bottom: 10px;">
                <p style="font-weight: 600; color: var(--success); margin-bottom: 8px;">
                    ✅ 연동 완료 (${institutionCount}개 금융기관)
                </p>
                <p style="font-size: 14px; color: var(--text); margin-bottom: 5px;">
                    ${institutionNames}
                </p>
                <p style="font-size: 12px; color: var(--text-light);">
                    마지막 연동: ${dateString}
                </p>
            </div>
            <p style="font-size: 14px; color: var(--text-light);">
                자산 정보를 최신 상태로 유지하려면 주기적으로 최신화하세요.
            </p>
        `;

        integrationButtonText.textContent = '자산 정보 최신화하기';
        integrationIcon.textContent = '🔄';
        integrationButton.style.background = 'linear-gradient(135deg, var(--success), #3db8af)';
    } else {
        // 아직 연동하지 않은 경우
        integrationDescription.innerHTML = `
            <p>마이데이터를 통해 보유 중인 자산을 자동으로 연동하고 최신 정보를 받아보세요.</p>
            <p style="font-size: 14px; color: var(--text-light); margin-top: 8px;">
                📱 증권사, 은행 계좌 정보를 안전하게 가져올 수 있습니다.
            </p>
        `;

        integrationButtonText.textContent = '자산 연동 시작하기';
        integrationIcon.textContent = '🔄';
        integrationButton.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }
}
