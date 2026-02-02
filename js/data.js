// ========== 목업 데이터 (Mock Data) ==========
// 실제 서버 없이 동작하도록 사용되는 샘플 데이터
const sampleData = {
    userProfile: {
        name: "김직장",
        theme: "light"
    },
    recommendation: {
        hasNewRecommendation: true,
        lastCheckedDate: null,
        recommendedVillages: ['원자재 마을', '신흥국 마을', '채권 마을']
    },
    villages: [
        {
            id: "v1",
            name: "미장마을",
            icon: "🇺🇸",
            assets: [
                { name: "AAPL", type: "기술주", value: 4000000, ticker: "AAPL", previousOpen: 225.50, previousClose: 228.75, dailyReturn: 1.44 },
                { name: "TSLA", type: "성장주", value: 3500000, ticker: "TSLA", previousOpen: 412.30, previousClose: 405.80, dailyReturn: -1.58 },
                { name: "NVDA", type: "AI주", value: 4500000, ticker: "NVDA", previousOpen: 875.20, previousClose: 892.60, dailyReturn: 1.99 },
                { name: "MSFT", type: "기술주", value: 3000000, ticker: "MSFT", previousOpen: 421.85, previousClose: 425.30, dailyReturn: 0.82 }
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
                { name: "O", type: "배당ETF", value: 3000000, ticker: "O", previousOpen: 56.80, previousClose: 57.25, dailyReturn: 0.79 },
                { name: "SCHD", type: "배당ETF", value: 3000000, ticker: "SCHD", previousOpen: 78.50, previousClose: 78.95, dailyReturn: 0.57 },
                { name: "VYM", type: "배당ETF", value: 2000000, ticker: "VYM", previousOpen: 112.30, previousClose: 113.10, dailyReturn: 0.71 }
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
                { name: "TQQQ", type: "레버리지ETF", value: 2000000, ticker: "TQQQ", previousOpen: 68.50, previousClose: 66.80, dailyReturn: -2.48 },
                { name: "UPRO", type: "레버리지ETF", value: 1500000, ticker: "UPRO", previousOpen: 62.30, previousClose: 61.10, dailyReturn: -1.93 },
                { name: "SOXL", type: "레버리지ETF", value: 1500000, ticker: "SOXL", previousOpen: 28.90, previousClose: 29.70, dailyReturn: 2.77 }
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
                { name: "삼성전자", type: "한국주식", value: 2000000, ticker: "005930", previousOpen: 72500, previousClose: 73200, dailyReturn: 0.97 },
                { name: "SK하이닉스", type: "한국주식", value: 1500000, ticker: "000660", previousOpen: 198000, previousClose: 201500, dailyReturn: 1.77 },
                { name: "NAVER", type: "한국주식", value: 1500000, ticker: "035420", previousOpen: 186500, previousClose: 184000, dailyReturn: -1.34 }
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
                { name: "VTI", type: "성장ETF", value: 3000000, ticker: "VTI", previousOpen: 298.50, previousClose: 301.20, dailyReturn: 0.90 },
                { name: "QQQ", type: "성장ETF", value: 2500000, ticker: "QQQ", previousOpen: 522.80, previousClose: 527.30, dailyReturn: 0.86 },
                { name: "SPY", type: "성장ETF", value: 2000000, ticker: "SPY", previousOpen: 588.20, previousClose: 591.80, dailyReturn: 0.61 }
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
                { name: "TSM", type: "기술주", value: 2500000, ticker: "TSM", previousOpen: 195.30, previousClose: 199.80, dailyReturn: 2.30 },
                { name: "ASML", type: "기술주", value: 2000000, ticker: "ASML", previousOpen: 832.50, previousClose: 845.20, dailyReturn: 1.53 },
                { name: "AMD", type: "AI주", value: 1500000, ticker: "AMD", previousOpen: 128.40, previousClose: 131.90, dailyReturn: 2.73 }
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
