document.addEventListener('DOMContentLoaded', () => {
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    const signOutBtn = document.getElementById('signOutBtn');
    const signOutModal = document.getElementById('signOutModal');
    const confirmSignOut = document.getElementById('confirmSignOut');
    const cancelSignOut = document.getElementById('cancelSignOut');

    // 메뉴 열기 (요소가 있을 때만 실행)
    if (menuOpenBtn && sideMenu && overlay) {
        menuOpenBtn.addEventListener('click', () => {
            sideMenu.classList.add('active');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        // 메뉴 닫기 (배경 클릭 시)
        overlay.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    // Sign Out 팝업 제어
    if (signOutBtn && signOutModal) {
        signOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signOutModal.classList.remove('hidden');
        });
    }

    if (confirmSignOut) {
        confirmSignOut.addEventListener('click', () => {
            window.location.href = 'https://www.mypcbbank.com/';
        });
    }

    if (cancelSignOut) {
        cancelSignOut.addEventListener('click', () => {
            signOutModal.classList.add('hidden');
        });
    }
});