// ========== Toast 알림 시스템 ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== 확인 모달 시스템 ==========
function showConfirmModal(options) {
    const {
        title = '확인',
        message = '정말로 진행하시겠습니까?',
        icon = '❓',
        confirmText = '확인',
        cancelText = '취소',
        confirmType = 'danger', // 'danger' or 'primary'
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    const modal = document.getElementById('confirmModal');
    const confirmIcon = document.getElementById('confirmIcon');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmConfirmBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    // 내용 설정
    confirmIcon.textContent = icon;
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    // 버튼 타입 설정
    confirmBtn.className = `confirm-button confirm ${confirmType}`;

    // 모달 표시
    modal.classList.add('active');

    // 이벤트 핸들러
    const handleConfirm = () => {
        modal.classList.remove('active');
        onConfirm();
        cleanup();
    };

    const handleCancel = () => {
        modal.classList.remove('active');
        onCancel();
        cleanup();
    };

    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // 오버레이 클릭으로 닫기
    modal.onclick = (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    };
}

