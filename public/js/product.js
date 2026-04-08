function myFunction(imgs) {
  // Get the expanded image
  var expandImg = document.getElementById("expandedImg");
  // Get the image text
  var imgText = document.getElementById("imgtext");
  // Use the same src in the expanded image as the image being clicked on from the grid
  expandImg.src = imgs.src;
  // Use the value of the alt attribute of the clickable image as text inside the expanded image
  imgText.innerHTML = imgs.alt;
  // Show the container element (hidden with CSS)
  expandImg.parentElement.style.display = "block";
}


window.addEventListener('load', function () {
  // Lấy danh sách các ảnh
  var images = document.querySelectorAll('.column img');

  // Lấy thẻ img mục tiêu
  var expandedImg = document.getElementById('expandedImg');

  // Kiểm tra xem có ảnh trong danh sách không
  if (images.length > 0) {
      // Gọi hàm myFunction với ảnh đầu tiên để hiển thị nó
      myFunction(images[0]);
  }
});

// Hàm này sẽ được gọi khi người dùng click vào một ảnh
function myFunction(img) {
  var expandedImg = document.getElementById('expandedImg');
  expandedImg.src = img.src;
  var imgText = document.getElementById('imgtext');
  imgText.innerHTML = img.alt;
  expandedImg.parentElement.style.display = 'block';
}