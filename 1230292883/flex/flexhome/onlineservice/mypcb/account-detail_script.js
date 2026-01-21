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

    // 페이지 시작
    initPage();
});