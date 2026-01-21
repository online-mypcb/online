document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 요소 선택 ---
    const searchFilter = document.getElementById('searchFilter');
    const searchSubmitBtn = document.getElementById('searchSubmitBtn');
    const searchCancelBtn = document.getElementById('searchCancelBtn');
    const searchToggleBtn = document.getElementById('searchToggleBtn'); // 돋보기 아이콘
    
    const searchedByBox = document.getElementById('searchedByBox');
    const transactionList = document.getElementById('transactionList');
    const items = document.querySelectorAll('.transaction-item');
    const noResults = document.getElementById('noResults');

    const timeSelect = document.getElementById('timeSelect');
    const typeSelect = document.getElementById('typeSelect');
    const transSelect = document.getElementById('transSelect');

    const summaryBtn = document.getElementById('toggleSummaryBtn');
    const summaryContent = document.getElementById('accountSummary');
    const asOfElement = document.getElementById('asOfDate');
	
	const menuOpenBtn = document.getElementById('menuOpenBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
	
	const signOutBtn = document.getElementById('signOutBtn'); // 사이드메뉴 내 버튼
    const signOutModal = document.getElementById('signOutModal');
    const confirmSignOut = document.getElementById('confirmSignOut');
    const cancelSignOut = document.getElementById('cancelSignOut');
	
	const eyeIcon = document.getElementById('eyeIcon');
    const infoPopup = document.getElementById('accountInfoPopup');
	
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

    // --- 2. 초기 로딩 설정 ---
    function initPage() {
        // 내일 날짜 설정 (MM/DD/YYYY)
        if (asOfElement) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const formattedDate = (tomorrow.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                                  tomorrow.getDate().toString().padStart(2, '0') + '/' + 
                                  tomorrow.getFullYear();
            asOfElement.textContent = formattedDate;
        }

        // 초기 리스트 노출 (data-default="true"인 항목만 보이기)
        resetToDefault();
    }

    // 초기화 함수: 첫 로딩 상태와 Clear 클릭 시 사용
    function resetToDefault() {
        items.forEach(item => {
            if (item.getAttribute('data-default') === 'true') {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        transactionList.classList.remove('hidden');
        searchedByBox.classList.add('hidden');
        searchFilter.classList.add('hidden');
        if (noResults) noResults.classList.add('hidden');
    }

    // --- 3. Account Summary 토글 (Show/Hide) ---
    if (summaryBtn && summaryContent) {
        summaryBtn.addEventListener('click', () => {
            const isHidden = summaryContent.classList.contains('hidden');
            if (isHidden) {
                summaryContent.classList.remove('hidden');
                summaryBtn.textContent = 'Hide Account Summary';
            } else {
                summaryContent.classList.add('hidden');
                summaryBtn.textContent = 'Show Account Summary';
            }
        });
    }

    // --- 4. 검색(Search) 로직 ---
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', () => {
            const timeFilter = timeSelect.value;
            const typeFilter = typeSelect.value;
            const transFilter = transSelect.value;

            let matchCount = 0;
			const noRecordsMessage = document.getElementById('noRecordsMessage'); // 문구 요소

            items.forEach(item => {
                const itemTime = item.getAttribute('data-time');
                const itemType = item.getAttribute('data-type');
                const itemTrans = item.getAttribute('data-trans');

                const timeMatch = (timeFilter === itemTime);
                const typeMatch = (typeFilter === 'All' || typeFilter === itemType);
                const transMatch = (transFilter === 'All' || transFilter === itemTrans);

                if (timeMatch && typeMatch && transMatch) {
                    item.style.setProperty('display', 'flex', 'important');
                    matchCount++;
                } else {
                    item.style.setProperty('display', 'none', 'important');
                }
            });

            // Searched By 박스 업데이트 및 노출
            document.getElementById('resTime').textContent = timeFilter;
            document.getElementById('resType').textContent = typeFilter;
            document.getElementById('resTrans').textContent = transFilter;
            document.getElementById('resCount').textContent = matchCount;
			
			if (matchCount === 0) {
                transactionList.classList.add('hidden');    // 리스트 영역 숨김
                noRecordsMessage.classList.remove('hidden'); // "No Records Available" 표시
            } else {
                transactionList.classList.remove('hidden'); // 리스트 영역 표시
                noRecordsMessage.classList.add('hidden');    // 문구 숨김
            }

            searchedByBox.classList.remove('hidden');
            searchFilter.classList.add('hidden');
        });
    }

    // --- 5. 필터 인터랙션 (Modify, Clear, Toggle) ---

    // 돋보기 버튼: 필터 창 토글
    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', () => {
            searchFilter.classList.toggle('hidden');
        });
    }

    // Modify: 검색창 다시 열기 (선택 값 유지됨)
    document.getElementById('modifyBtn').addEventListener('click', () => {
        searchFilter.classList.remove('hidden');
    });

    // Clear: 초기 상태로 복구
    document.getElementById('clearBtn').addEventListener('click', () => {
        const noRecordsMessage = document.getElementById('noRecordsMessage');
        if (noRecordsMessage) noRecordsMessage.classList.add('hidden');
        resetToDefault();
    });

    // Cancel: 필터 창 닫기
    if (searchCancelBtn) {
        searchCancelBtn.addEventListener('click', () => {
            searchFilter.classList.add('hidden');
        });
    }
	
	
	// 메뉴 열기
    menuOpenBtn.addEventListener('click', () => {
        sideMenu.classList.add('active');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 본문 스크롤 방지
    });

    // 메뉴 닫기 (배경 클릭 시)
    overlay.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        overlay.classList.add('hidden');
        document.body.style.overflow = ''; // 스크롤 복구
    });

	// 1. 사이드메뉴의 Sign Out 클릭 시 팝업 열기
    if (signOutBtn) {
        signOutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 동작 방지
            signOutModal.classList.remove('hidden');
        });
    }

    // 2. 팝업에서 Ok 클릭 시 index.html로 이동
    if (confirmSignOut) {
        confirmSignOut.addEventListener('click', () => {
            window.location.href = 'https://www.mypcbbank.com/';
        });
    }

    // 3. 팝업에서 Cancel 클릭 시 팝업만 닫기 (메뉴는 유지)
    if (cancelSignOut) {
        cancelSignOut.addEventListener('click', () => {
            signOutModal.classList.add('hidden');
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
	
	if (eyeIcon && infoPopup) {
        eyeIcon.addEventListener('click', () => {
            // 팝업 숨김 여부 확인
            const isHidden = infoPopup.classList.contains('hidden');

            if (isHidden) {
                // 팝업 열기
                infoPopup.classList.remove('hidden');
                eyeIcon.src = 'images/eye-off2.png'; // 팝업 떴을 때 이미지
            } else {
                // 팝업 닫기
                infoPopup.classList.add('hidden');
                eyeIcon.src = 'images/eye-on.png'; // 팝업 닫혔을 때 이미지
            }
        });
    }

    // (선택 사항) 바탕을 클릭하면 팝업 닫기 기능
    document.addEventListener('click', (e) => {
        if (!eyeIcon.contains(e.target) && !infoPopup.contains(e.target)) {
            infoPopup.classList.add('hidden');
            eyeIcon.src = 'images/eye-on.png';
        }
    });

    // 페이지 시작
    initPage();
});