
// Tìm kiếm search
const productList = [
    { id: 1, name: 'Sản phẩm A', link: '/san-pham-a.html' },
    { id: 2, name: 'Sản phẩm B', link: '/san-pham-b.html' },
    { id: 3, name: 'Sản phẩm C', link: '/san-pham-c.html' },
];

// Hàm thực hiện tìm kiếm
function doSearch(keyword) {
    const searchResults = productList.filter(product => {
        return product.name.toLowerCase().includes(keyword.toLowerCase());
    });
    return searchResults;
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
    const searchResultsContainer = document.querySelector('.search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        document.querySelector('.search-results').style.display = 'none';
        return;
    }

    const resultList = document.createElement('ul');
    results.forEach(result => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = result.link;
        link.textContent = result.name;
        item.appendChild(link);
        resultList.appendChild(item);
    });

    searchResultsContainer.appendChild(resultList);
}

// Xử lý sự kiện khi submit form
window.addEventListener("load", function() {
    const searchForm = document.getElementById('search-form-id');
    const searchInput = document.getElementById("searchInput");
    
    searchForm.addEventListener('submit', function (event) {
        
    });

    const clearButton = document.getElementById('search-form__clear-id');
    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        displaySearchResults([]);
    });
});

window.addEventListener('input', function(event) {
    const searchForm = document.getElementById('search-form-id');
    const searchInput = document.getElementById("searchInput");

    event.preventDefault();
    const keyword = searchInput.value.trim();

    if (keyword !== '') {
        document.querySelector('.search-results').style.display = 'block';
        const searchItems = doSearch(keyword);
        displaySearchResults(searchItems);
    } else {
        document.querySelector('.search-results').style.display = 'none';
        displaySearchResults([]);
    }

});

// JavaScript để bắt sự kiện cuộn trang và hiển thị mũi tên khi đã cuộn xuống dưới 1 đoạn
window.addEventListener('scroll', function() {
    const scrollHeight = window.scrollY;
    const scrollThreshold = 100; // Ngưỡng cuộn xuống dưới 1 đoạn (100px)

    const body = document.querySelector('body');
    if (scrollHeight > scrollThreshold) {
    body.classList.add('scrolled');
    } else {
    body.classList.remove('scrolled');
    }
});