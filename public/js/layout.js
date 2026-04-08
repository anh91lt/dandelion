// Nhúng nội dung header vào trang
function includeHeader() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../header.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('header-container').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

// Nhúng nội dung footer vào trang
function includeFooter() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../footer.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('footer-container').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

// Gọi hàm includeHeader và includeFooter để nhúng nội dung
includeHeader();
includeFooter();

// Mở modal khi bấm nút đăng nhập và đóng modal khi bấm nút close
window.addEventListener("load", function() {
    // Lấy các phần tử DOM
    const signInButton = document.getElementById('sign-in');
    const modal = document.getElementById('login-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseButton = document.querySelector('.modal-close');

    // Khi người dùng nhấn nút đăng nhập
    signInButton.addEventListener('click', (event) => {
        event.preventDefault(); // Ngăn chặn tải lại trang
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';
    });

    // Khi người dùng nhấn nút đóng modal
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
    });
});
