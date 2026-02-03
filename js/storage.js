function loadData() {
    // 로컬스토리지에서 마을 데이터 로드
    const villages = localStorage.getItem('userVillages');
    const data = { ...sampleData };
    if (villages) {
        data.villages = JSON.parse(villages);
    }
    return data;
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
