document.addEventListener('DOMContentLoaded', () => {

const signInBtn = document.getElementById('signInBtn');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const passwordToggle = document.querySelector('.password-toggle');
const eyeIcon = document.querySelector('.eye-icon');

signInBtn.addEventListener('click', () => {
    const passwordValue = passwordInput.value;

    // 12345667 입력 시 대시보드로 이동
    if (passwordValue === "12345667") {
        window.location.href = 'dashboard.html';
    } 
    // 그 외의 경우 (비어있거나 틀린 경우) 에러 표시
    else {
        passwordInput.classList.add('error-border');
        passwordError.style.display = 'block';
        passwordInput.focus();
    }
});

// 다시 입력하기 시작하면 에러 스타일 제거
passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('error-border');
    passwordError.style.display = 'none';
});

passwordToggle.addEventListener('click', () => {
    // 현재 타입을 확인하여 토글
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // 아이콘 이미지 변경 (이미지가 두 종류인 경우)
    // eyeIcon.src = type === 'password' ? 'images/eye-off.png' : 'images/eye-on.png';
    
    // 아이콘 투명도로 시각적 효과 주기
    eyeIcon.style.opacity = type === 'password' ? '0.5' : '1';
});

});