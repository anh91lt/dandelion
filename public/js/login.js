
// Lấy các phần tử cần sử dụng
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const container = document.getElementById('login');

// Thêm sự kiện click cho nút đăng ký
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

// Thêm sự kiện click cho nút đăng nhập
signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});


