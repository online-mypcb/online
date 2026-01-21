document.addEventListener('DOMContentLoaded', () => {
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    const signOutBtn = document.getElementById('signOutBtn');
    const signOutModal = document.getElementById('signOutModal');
    const confirmSignOut = document.getElementById('confirmSignOut');
    const cancelSignOut = document.getElementById('cancelSignOut');
	
	const tabContainer = document.getElementById('tabContainer');
    const btnNext = document.getElementById('nextTab');
    const btnPrev = document.getElementById('prevTab');
	
	// 1. Last login 시간 설정 (현재 시간 2026-01-21 11:08 기준 5분 전)
    const lastLoginElement = document.querySelector('.last-login');
    if (lastLoginElement) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - 5); // 5분 전

        // 날짜 형식: 01/21/2026 11:03 AM
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0시는 12시로 표시
        const strTime = String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;

        lastLoginElement.textContent = `Last login: ${month}/${day}/${year} ${strTime} PST`;
    }

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
	
	
    if (btnNext && btnPrev && tabContainer) {
        btnNext.addEventListener('click', () => {
            // 전체 길이를 계산하여 끝까지 이동
            const containerWidth = tabContainer.parentElement.offsetWidth;
            const scrollWidth = tabContainer.scrollWidth;
            const maxScroll = scrollWidth - containerWidth;

            // 마지막 글자까지 보이도록 계산된 최대치만큼 이동
            tabContainer.style.transform = `translateX(-${maxScroll}px)`;
            
            btnNext.style.visibility = 'hidden';
            btnPrev.style.visibility = 'visible';
        });

        btnPrev.addEventListener('click', () => {
            // 다시 처음 위치(0)로 복구
            tabContainer.style.transform = `translateX(0px)`;
            
            btnPrev.style.visibility = 'hidden';
            btnNext.style.visibility = 'visible';
        });
    }
	
	// 2. Accounts 메뉴 클릭 이벤트 (토글 방식)
    const accountsLi = document.querySelector('.menu-list li:first-child');
    if (accountsLi) {
        // 하위 메뉴 구조 삽입 (기본적으로 숨김 상태)
        const subMenuHtml = `
			<ul class="sub-menu">
				<li><a href="dashboard.html">Overview</a></li>
				<li><a href="account-detail.html">Detail</a></li>
				<li><a href="documents.html">Documents</a></li>
				<li><a href="download_list.html">Reports</a></li>
			</ul>
		`;
        accountsLi.insertAdjacentHTML('beforeend', subMenuHtml);

        const subMenu = accountsLi.querySelector('.sub-menu');

        // Accounts 항목 클릭 시 동작
        accountsLi.addEventListener('click', (e) => {
            // 하위 메뉴 자체를 클릭했을 때는 닫히지 않도록 방지
            if (e.target.closest('.sub-menu')) return;

            const isActive = accountsLi.classList.toggle('active');
            
            if (isActive) {
                subMenu.style.maxHeight = subMenu.scrollHeight + "px"; // 부드럽게 열기
            } else {
                subMenu.style.maxHeight = "0"; // 부드럽게 닫기
            }
        });
    }
});