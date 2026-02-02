function loadData() {
    console.warn('loadData()는 더 이상 사용되지 않습니다. API를 사용하세요.');
    const data = localStorage.getItem('antVillageData');
    return data ? JSON.parse(data) : sampleData;
}

// 데이터 초기화 함수 (디버깅용)
function resetData() {
    localStorage.setItem('antVillageData', JSON.stringify(sampleData));
    console.log('데이터가 초기화되었습니다.');
    location.reload();
}

// [DEPRECATED] 레거시 함수 - API 기반으로 변경되었습니다
function saveData(data) {
    console.warn('saveData()는 더 이상 사용되지 않습니다. API를 사용하세요.');
    localStorage.setItem('antVillageData', JSON.stringify(data));
}
