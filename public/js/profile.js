// Lấy các phần tử cần thiết
const modal = document.querySelector('.modal');
const boxEditName = document.querySelector('.boxEditName');
const boxAddAddress = document.querySelector('.boxAddAddress');
const boxEditAddress = document.querySelector('.boxEditAddress');
const editButton = document.querySelector('.editName');
const addAddressButton = document.querySelector('.addAddress');
const editAddressButton = document.querySelector('.editAddress');
const closeModalButton = document.querySelector('.closeModal');
const closeModalAddAddressButton = document.querySelector('.closeModalAddAddress');
const closeModalEditAddressButton = document.querySelector('.closeModalEditAddress');
const cancelModalButton = document.querySelector('.cancelModal');
const cancelModalAddAddressButton = document.querySelector('.cancelModalAddAddress');
const cancelModalEditAddressButton = document.querySelector('.cancelModalEditAddress');

// Hiển thị modal và boxEditName khi nhấn vào Edit Name
editButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    boxEditName.style.display = 'block';
    boxAddAddress.style.display = 'none';
    boxEditAddress.style.display = 'none';
});

// Hiển thị modal và boxAddAddress khi nhấn vào Add Address
addAddressButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    boxEditName.style.display = 'none';
    boxAddAddress.style.display = 'block';
    boxEditAddress.style.display = 'none';
});
// Hiển thị modal và boxEditAddress khi nhấn vào Edit Address
editAddressButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    boxEditName.style.display = 'none';
    boxAddAddress.style.display = 'none';
    boxEditAddress.style.display = 'block';
});
// Đóng modal khi nhấn vào nút Close trong boxEditName
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Đóng modal khi nhấn vào nút Close trong boxAddAddress
closeModalAddAddressButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Đóng modal khi nhấn vào nút Close trong boxEditAddress
closeModalEditAddressButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Đóng modal khi nhấn vào nút Cancel trong boxEditName
cancelModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Đóng modal khi nhấn vào nút Cancel trong boxAddAddress
cancelModalAddAddressButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Đóng modal khi nhấn vào nút Cancel trong boxEditAddress
cancelModalEditAddressButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Đóng modal khi nhấn vào overlay
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
