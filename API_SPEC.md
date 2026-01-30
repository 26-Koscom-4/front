# K-AMIs API 명세서

## 개요

K-AMIs (개미 마을) 백엔드 API 명세서입니다. RESTful API 설계 원칙을 따릅니다.

### Base URL
```
https://api.k-amis.com/v1
```

### 인증
Bearer Token 방식을 사용합니다.
```
Authorization: Bearer {access_token}
```

### 공통 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

### HTTP 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

---

## 📑 목차

1. [인증 (Authentication)](#1-인증-authentication)
2. [사용자 (User)](#2-사용자-user)
3. [마을 (Village/Portfolio)](#3-마을-villageportfolio)
4. [자산 (Asset)](#4-자산-asset)
5. [브리핑 (Briefing)](#5-브리핑-briefing)
6. [투자 성향 진단 (Investment Test)](#6-투자-성향-진단-investment-test)
7. [추천 (Recommendation)](#7-추천-recommendation)
8. [마이데이터 (MyData)](#8-마이데이터-mydata)
9. [활동 내역 (Activity)](#9-활동-내역-activity)
10. [통계 (Statistics)](#10-통계-statistics)

---

## 1. 인증 (Authentication)

### 1.1 로그인

**POST** `/auth/login`

#### Request
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "user-123",
      "username": "user@example.com",
      "name": "김직장",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 1.2 로그아웃

**POST** `/auth/logout`

#### Request Headers
```
Authorization: Bearer {access_token}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

### 1.3 토큰 갱신

**POST** `/auth/refresh`

#### Request
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

## 2. 사용자 (User)

### 2.1 프로필 조회

**GET** `/users/me`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "user@example.com",
    "name": "김직장",
    "theme": "light",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2.2 프로필 수정

**PATCH** `/users/me`

#### Request
```json
{
  "name": "김투자",
  "theme": "dark"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "김투자",
    "theme": "dark",
    "updated_at": "2024-01-20T14:20:00Z"
  },
  "message": "프로필이 수정되었습니다."
}
```

### 2.3 설정 조회

**GET** `/users/me/settings`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "briefing_time": "08:00",
    "voice_speed": 1.0,
    "notifications_enabled": true,
    "language": "ko"
  }
}
```

### 2.4 설정 수정

**PATCH** `/users/me/settings`

#### Request
```json
{
  "briefing_time": "09:00",
  "voice_speed": 1.2
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "briefing_time": "09:00",
    "voice_speed": 1.2,
    "updated_at": "2024-01-20T15:00:00Z"
  },
  "message": "설정이 저장되었습니다."
}
```

---

## 3. 마을 (Village/Portfolio)

### 3.1 마을 목록 조회

**GET** `/villages`

#### Query Parameters
- `sort` (optional): 정렬 기준 (`created_at`, `name`, `return_rate`, `total_value`)
- `order` (optional): 정렬 순서 (`asc`, `desc`)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "villages": [
      {
        "id": "v1",
        "name": "미장마을",
        "icon": "🇺🇸",
        "type": "growth",
        "goal": "long-term",
        "total_value": 15000000,
        "return_rate": 12.5,
        "allocation": 32.3,
        "asset_count": 4,
        "last_briefing_read": "2024-01-19",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-20T10:00:00Z"
      },
      {
        "id": "v2",
        "name": "배당마을",
        "icon": "💰",
        "type": "dividend",
        "goal": "passive-income",
        "total_value": 8000000,
        "return_rate": 8.3,
        "allocation": 17.2,
        "asset_count": 3,
        "last_briefing_read": null,
        "created_at": "2024-01-05T00:00:00Z",
        "updated_at": "2024-01-19T15:30:00Z"
      }
    ],
    "total_count": 6,
    "total_value": 46500000
  }
}
```

### 3.2 마을 상세 조회

**GET** `/villages/{village_id}`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "v1",
    "name": "미장마을",
    "icon": "🇺🇸",
    "type": "growth",
    "goal": "long-term",
    "total_value": 15000000,
    "return_rate": 12.5,
    "allocation": 32.3,
    "assets": [
      {
        "id": "a1",
        "name": "AAPL",
        "type": "기술주",
        "ticker": "AAPL",
        "quantity": 100,
        "average_price": 150.00,
        "current_price": 175.50,
        "value": 4000000,
        "return_rate": 17.0,
        "added_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "a2",
        "name": "TSLA",
        "type": "성장주",
        "ticker": "TSLA",
        "quantity": 50,
        "average_price": 200.00,
        "current_price": 245.00,
        "value": 3500000,
        "return_rate": 22.5,
        "added_at": "2024-01-03T00:00:00Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

### 3.3 마을 생성

**POST** `/villages`

#### Request
```json
{
  "name": "원자재 마을",
  "icon": "🏆",
  "type": "commodity",
  "goal": "diversification"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "v7",
    "name": "원자재 마을",
    "icon": "🏆",
    "type": "commodity",
    "goal": "diversification",
    "total_value": 0,
    "return_rate": 0,
    "allocation": 0,
    "created_at": "2024-01-20T16:00:00Z"
  },
  "message": "마을이 생성되었습니다."
}
```

### 3.4 마을 수정

**PATCH** `/villages/{village_id}`

#### Request
```json
{
  "name": "미국 주식 마을",
  "icon": "🗽"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "v1",
    "name": "미국 주식 마을",
    "icon": "🗽",
    "updated_at": "2024-01-20T16:30:00Z"
  },
  "message": "마을이 수정되었습니다."
}
```

### 3.5 마을 삭제

**DELETE** `/villages/{village_id}`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "마을이 삭제되었습니다."
}
```

---

## 4. 자산 (Asset)

### 4.1 자산 추가

**POST** `/villages/{village_id}/assets`

#### Request
```json
{
  "ticker": "NVDA",
  "name": "NVIDIA",
  "type": "AI주",
  "quantity": 50,
  "average_price": 450.00
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "a5",
    "ticker": "NVDA",
    "name": "NVIDIA",
    "type": "AI주",
    "quantity": 50,
    "average_price": 450.00,
    "current_price": 485.00,
    "value": 6500000,
    "return_rate": 7.8,
    "added_at": "2024-01-20T17:00:00Z"
  },
  "message": "자산이 추가되었습니다."
}
```

### 4.2 자산 수정

**PATCH** `/villages/{village_id}/assets/{asset_id}`

#### Request
```json
{
  "quantity": 75,
  "average_price": 460.00
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "a5",
    "quantity": 75,
    "average_price": 460.00,
    "value": 8450000,
    "updated_at": "2024-01-20T17:30:00Z"
  },
  "message": "자산이 수정되었습니다."
}
```

### 4.3 자산 삭제

**DELETE** `/villages/{village_id}/assets/{asset_id}`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "자산이 삭제되었습니다."
}
```

### 4.4 실시간 가격 조회

**GET** `/assets/price/{ticker}`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "current_price": 175.50,
    "change": 2.30,
    "change_percent": 1.33,
    "volume": 58234567,
    "market_cap": 2750000000000,
    "updated_at": "2024-01-20T18:00:00Z"
  }
}
```

---

## 5. 브리핑 (Briefing)

### 5.1 마을 브리핑 조회

**GET** `/villages/{village_id}/briefing`

#### Query Parameters
- `date` (optional): 브리핑 날짜 (YYYY-MM-DD), 기본값: 오늘

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "village_id": "v1",
    "village_name": "미장마을",
    "date": "2024-01-20",
    "sections": [
      {
        "title": "마을 현황",
        "icon": "🏘️",
        "content": "주인님, 좋은 아침입니다! 미장마을의 현재 상황을 알려드립니다.\n총 자산: 15,000,000원\n수익률: +12.5%\n포트폴리오 비중: 32.3%"
      },
      {
        "title": "보유 자산 분석",
        "icon": "💼",
        "content": "• AAPL (기술주) - 안정적으로 운영 중입니다.\n• TSLA (성장주) - 안정적으로 운영 중입니다."
      },
      {
        "title": "투자 전략",
        "icon": "📊",
        "content": "투자 유형: 성장형\n투자 목표: 장기 투자"
      },
      {
        "title": "오늘의 조언",
        "icon": "💡",
        "content": "성장주는 장기적인 관점에서 접근하세요. 단기 변동성에 흔들리지 마세요.\n기술주 중심 포트폴리오입니다. 실적 발표 시즌을 주목하세요."
      }
    ],
    "is_read": false,
    "created_at": "2024-01-20T06:00:00Z"
  }
}
```

### 5.2 브리핑 읽음 처리

**POST** `/villages/{village_id}/briefing/read`

#### Request
```json
{
  "date": "2024-01-20"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "village_id": "v1",
    "date": "2024-01-20",
    "read_at": "2024-01-20T08:30:00Z"
  },
  "message": "브리핑을 읽음 처리했습니다."
}
```

### 5.3 TTS 음성 생성

**POST** `/briefing/tts`

#### Request
```json
{
  "text": "주인님, 좋은 아침입니다. 미장마을의 현재 상황을 알려드립니다...",
  "voice_speed": 1.0,
  "language": "ko-KR"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "audio_url": "https://cdn.k-amis.com/audio/briefing-20240120-v1.mp3",
    "duration": 45.3,
    "format": "mp3",
    "expires_at": "2024-01-21T00:00:00Z"
  }
}
```

---

## 6. 투자 성향 진단 (Investment Test)

### 6.1 질문 목록 조회

**GET** `/investment-test/questions`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "q1",
        "order": 1,
        "question": "투자의 주요 목적은 무엇인가요?",
        "answers": [
          {
            "id": "a1",
            "text": "원금 보존이 최우선입니다",
            "weights": {
              "conservative": 5,
              "moderateConservative": 2
            }
          },
          {
            "id": "a2",
            "text": "안정적인 소득 창출입니다",
            "weights": {
              "conservative": 3,
              "moderateConservative": 4,
              "moderate": 1
            }
          }
        ]
      }
    ],
    "total_count": 25
  }
}
```

### 6.2 진단 결과 제출

**POST** `/investment-test/submit`

#### Request
```json
{
  "answers": [
    { "question_id": "q1", "answer_id": "a2" },
    { "question_id": "q2", "answer_id": "a3" },
    { "question_id": "q3", "answer_id": "a4" }
    // ... 총 25개
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "test_id": "test-456",
    "main_type": "moderate",
    "scores": {
      "conservative": 15,
      "moderateConservative": 28,
      "moderate": 45,
      "moderateAggressive": 22,
      "aggressive": 10
    },
    "percentages": {
      "conservative": 12.5,
      "moderateConservative": 23.3,
      "moderate": 37.5,
      "moderateAggressive": 18.3,
      "aggressive": 8.3
    },
    "type_info": {
      "name": "위험중립형",
      "icon": "⚖️",
      "description": "안정성과 수익성의 균형을 추구하며...",
      "characteristics": [
        "안정성과 수익성의 균형 추구",
        "중간 수준의 위험 감수",
        "다양한 자산군에 분산 투자",
        "시장 상황에 따른 유연한 대응"
      ],
      "recommended_villages": [
        "글로벌ETF마을",
        "반도체마을",
        "국장마을",
        "신흥국 마을"
      ]
    },
    "completed_at": "2024-01-20T20:00:00Z"
  },
  "message": "투자 성향 진단이 완료되었습니다."
}
```

### 6.3 진단 결과 조회

**GET** `/investment-test/result`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "test_id": "test-456",
    "main_type": "moderate",
    "percentages": { ... },
    "type_info": { ... },
    "completed_at": "2024-01-20T20:00:00Z"
  }
}
```

---

## 7. 추천 (Recommendation)

### 7.1 추천 마을 조회

**GET** `/recommendations`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "rec-1",
        "village_name": "원자재 마을",
        "icon": "🏆",
        "type": "commodity",
        "description": "현재 포트폴리오가 기술주에 집중되어 있습니다. 원자재는 인플레이션 헷지와 포트폴리오 다각화에 효과적입니다.",
        "recommended_assets": [
          { "ticker": "GLD", "name": "금 ETF" },
          { "ticker": "SLV", "name": "은 ETF" },
          { "ticker": "USO", "name": "원유 ETF" }
        ],
        "correlation": -0.23,
        "reason": "낮은 상관관계로 분산 효과 우수",
        "priority": 1,
        "created_at": "2024-01-20T00:00:00Z"
      },
      {
        "id": "rec-2",
        "village_name": "신흥국 마을",
        "icon": "🌏",
        "type": "emerging",
        "description": "미국 시장 편중도가 높습니다. 신흥국은 높은 성장 잠재력과 지리적 다각화를 제공합니다.",
        "recommended_assets": [
          { "ticker": "EPI", "name": "인도 ETF" },
          { "ticker": "VNM", "name": "베트남 ETF" },
          { "ticker": "EWZ", "name": "브라질 ETF" }
        ],
        "correlation": -0.15,
        "reason": "지리적 분산 효과",
        "priority": 2,
        "created_at": "2024-01-20T00:00:00Z"
      }
    ],
    "has_new": true,
    "last_checked_at": "2024-01-19T10:00:00Z"
  }
}
```

### 7.2 추천 확인 처리

**POST** `/recommendations/check`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "checked_at": "2024-01-20T21:00:00Z"
  },
  "message": "추천을 확인했습니다."
}
```

---

## 8. 마이데이터 (MyData)

### 8.1 금융기관 목록 조회

**GET** `/mydata/institutions`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "institutions": [
      {
        "id": "kb",
        "name": "KB증권",
        "icon": "🏦",
        "type": "securities",
        "description": "보유 주식 3종목",
        "is_connected": false
      },
      {
        "id": "samsung",
        "name": "삼성증권",
        "icon": "💼",
        "type": "securities",
        "description": "보유 주식 5종목",
        "is_connected": true
      }
    ]
  }
}
```

### 8.2 연동 시작

**POST** `/mydata/integrate`

#### Request
```json
{
  "institution_ids": ["kb", "samsung", "mirae"]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "integration_id": "int-789",
    "status": "processing",
    "institutions": [
      { "id": "kb", "status": "connecting" },
      { "id": "samsung", "status": "connecting" },
      { "id": "mirae", "status": "connecting" }
    ],
    "created_at": "2024-01-20T22:00:00Z"
  },
  "message": "연동을 시작했습니다."
}
```

### 8.3 연동 상태 조회

**GET** `/mydata/integrate/{integration_id}/status`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "integration_id": "int-789",
    "status": "completed",
    "progress": 100,
    "institutions": [
      {
        "id": "kb",
        "name": "KB증권",
        "status": "completed",
        "assets_count": 3,
        "total_value": 5000000
      },
      {
        "id": "samsung",
        "name": "삼성증권",
        "status": "completed",
        "assets_count": 5,
        "total_value": 8500000
      }
    ],
    "completed_at": "2024-01-20T22:05:00Z"
  }
}
```

### 8.4 연동 이력 조회

**GET** `/mydata/history`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "is_integrated": true,
    "last_integration_date": "2024-01-20T22:05:00Z",
    "integration_count": 3,
    "integrated_institutions": [
      { "id": "kb", "name": "KB증권", "icon": "🏦" },
      { "id": "samsung", "name": "삼성증권", "icon": "💼" }
    ]
  }
}
```

---

## 9. 활동 내역 (Activity)

### 9.1 활동 목록 조회

**GET** `/activities`

#### Query Parameters
- `limit` (optional): 조회 개수 (기본값: 10, 최대: 50)
- `offset` (optional): 오프셋 (기본값: 0)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "act-1",
        "type": "village_created",
        "title": "원자재 마을을 추가했습니다",
        "icon": "✨",
        "metadata": {
          "village_id": "v7",
          "village_name": "원자재 마을"
        },
        "created_at": "2024-01-20T16:00:00Z"
      },
      {
        "id": "act-2",
        "type": "investment_test_completed",
        "title": "투자 성향 진단 완료: 위험중립형",
        "icon": "🎯",
        "metadata": {
          "test_id": "test-456",
          "main_type": "moderate"
        },
        "created_at": "2024-01-20T20:00:00Z"
      }
    ],
    "total_count": 15,
    "has_more": true
  }
}
```

### 9.2 활동 추가

**POST** `/activities`

#### Request
```json
{
  "type": "profile_updated",
  "title": "프로필 정보를 업데이트했습니다",
  "metadata": {
    "fields": ["name", "theme"]
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "act-16",
    "type": "profile_updated",
    "title": "프로필 정보를 업데이트했습니다",
    "icon": "✨",
    "created_at": "2024-01-20T23:00:00Z"
  },
  "message": "활동이 기록되었습니다."
}
```

---

## 10. 통계 (Statistics)

### 10.1 자산 분포 조회

**GET** `/statistics/asset-distribution`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "total_value": 46500000,
    "by_type": [
      {
        "type": "기술주",
        "icon": "💻",
        "value": 15000000,
        "percentage": 32.3,
        "count": 8
      },
      {
        "type": "배당ETF",
        "icon": "💰",
        "value": 8000000,
        "percentage": 17.2,
        "count": 5
      },
      {
        "type": "레버리지ETF",
        "icon": "⚡",
        "value": 5000000,
        "percentage": 10.8,
        "count": 3
      }
    ],
    "by_village": [
      {
        "village_id": "v1",
        "village_name": "미장마을",
        "value": 15000000,
        "percentage": 32.3
      },
      {
        "village_id": "v2",
        "village_name": "배당마을",
        "value": 8000000,
        "percentage": 17.2
      }
    ],
    "updated_at": "2024-01-20T23:30:00Z"
  }
}
```

### 10.2 포트폴리오 성과 조회

**GET** `/statistics/performance`

#### Query Parameters
- `period` (optional): 기간 (`1d`, `1w`, `1m`, `3m`, `6m`, `1y`, `ytd`, `all`)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "period": "1m",
    "total_value": 46500000,
    "total_return": 5650000,
    "total_return_rate": 13.8,
    "villages": [
      {
        "village_id": "v1",
        "village_name": "미장마을",
        "return": 2250000,
        "return_rate": 12.5
      },
      {
        "village_id": "v2",
        "village_name": "배당마을",
        "return": 850000,
        "return_rate": 8.3
      }
    ],
    "daily_values": [
      { "date": "2024-01-01", "value": 40850000 },
      { "date": "2024-01-02", "value": 41200000 },
      { "date": "2024-01-03", "value": 41500000 }
      // ... 30일치
    ],
    "best_performer": {
      "asset_id": "a3",
      "name": "NVDA",
      "return_rate": 22.5
    },
    "worst_performer": {
      "asset_id": "a8",
      "name": "TQQQ",
      "return_rate": -5.2
    }
  }
}
```

---

## 📌 에러 코드

### 인증 관련
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid token
- `AUTH_004`: Unauthorized access

### 사용자 관련
- `USER_001`: User not found
- `USER_002`: Invalid user data

### 마을 관련
- `VILLAGE_001`: Village not found
- `VILLAGE_002`: Village already exists
- `VILLAGE_003`: Cannot delete village with assets

### 자산 관련
- `ASSET_001`: Asset not found
- `ASSET_002`: Invalid ticker symbol
- `ASSET_003`: Asset already exists in village

### 브리핑 관련
- `BRIEFING_001`: Briefing not available
- `BRIEFING_002`: TTS generation failed

### 투자 진단 관련
- `TEST_001`: Invalid test answers
- `TEST_002`: Test not completed

### 마이데이터 관련
- `MYDATA_001`: Institution not found
- `MYDATA_002`: Integration failed
- `MYDATA_003`: No consent provided

---

## 🔐 보안 고려사항

### 1. 인증 토큰
- JWT 기반 인증
- Access Token: 1시간 유효
- Refresh Token: 7일 유효
- HTTPS 필수

### 2. Rate Limiting
- 인증된 사용자: 100 requests/minute
- 미인증 사용자: 10 requests/minute

### 3. 데이터 암호화
- 민감 정보 AES-256 암호화
- 비밀번호 bcrypt 해싱
- HTTPS/TLS 1.3 이상

### 4. CORS 정책
```
Access-Control-Allow-Origin: https://k-amis.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## 📊 응답 예시 모음

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 유효하지 않습니다.",
    "details": {
      "fields": {
        "email": ["올바른 이메일 형식이 아닙니다."],
        "password": ["비밀번호는 8자 이상이어야 합니다."]
      }
    }
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "토큰이 만료되었습니다.",
    "details": {
      "expired_at": "2024-01-20T23:00:00Z"
    }
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "code": "VILLAGE_001",
    "message": "마을을 찾을 수 없습니다.",
    "details": {
      "village_id": "v99"
    }
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "서버 오류가 발생했습니다.",
    "details": {
      "request_id": "req-abc123"
    }
  }
}
```

---

## 🚀 버전 관리

### v1 (Current)
- 초기 API 버전
- 기본 CRUD 기능
- 인증 및 권한 관리

### v2 (Planned)
- WebSocket 실시간 가격 업데이트
- GraphQL 지원
- 고급 포트폴리오 분석

---

## 📝 변경 이력

### 2024-01-20
- 초기 API 명세서 작성
- 10개 주요 엔드포인트 그룹 정의
- 요청/응답 예시 추가

---

**문의**: api@k-amis.com

**License**: Private API - Authorized Use Only
