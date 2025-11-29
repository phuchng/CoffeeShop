let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelector('.slide_box');
  const totalSlides = document.querySelectorAll('.slide').length;

  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }

  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Tự động chuyển slide mỗi 5 giây (tùy chọn)
setInterval(() => {
  nextSlide();
}, 15000);

// chat box
function toggleChatbox() {
    const chatbox = document.getElementById('langchain-chatbox');
    const icon = document.getElementById('chat-icon-container');
    
    // Đảo ngược trạng thái hiển thị của chatbox
    chatbox.classList.toggle('hidden');
    
    // Thêm/Xóa class 'open' cho icon để có hiệu ứng khác biệt
    icon.classList.toggle('open', !chatbox.classList.contains('hidden'));
}

// Class CSS để ẩn/hiện chatbox
// Bạn cần thêm đoạn CSS này:
/* .hidden { display: none !important; } */