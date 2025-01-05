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

const saveNameButton = document.getElementById("saveNameButton");

const saveAddressButton = document.getElementById("saveAddressButton");

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

saveNameButton.addEventListener('click', async() => {
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();

    if (!first_name || !last_name){
        alert('First Name or Last Name is missing');
        return;
    }

    try{
        const response = await fetch('/profile/change-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name: first_name, last_name: last_name}),
        });

        if (response.ok){
            const data = await response.json();
            alert(data.message);
            location.reload();
        }

        else{
            const error = await response.json();
            alert(`Error: ${error.error}`)
        }
    }

    catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
})

saveAddressButton.addEventListener('click', async() => {
    const first_name = document.getElementById("firstNameAddress").value.trim();
    const last_name = document.getElementById("lastNameAddress").value.trim();
    const company = document.getElementById("companyAddress").value.trim();
    const address = document.getElementById("address").value.trim();
    const apartment = document.getElementById("apartment").value.trim();
    const phone = document.getElementById("phone").value.trim();
    
    if (!first_name || !last_name || !address || !phone){
        alert('First Name, Last Name, Address or Phone Number is missing');
        return;
    }

    try{
        const response = await fetch('/profile/change-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name: first_name, last_name: last_name, company: company, address: address, apartment: apartment, phone: phone}),
        });

        if (response.ok){
            const data = await response.json();
            alert(data.message);
            location.reload();
        }

        else{
            const error = await response.json();
            alert(`Error: ${error.error}`)
        }
    }

    catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
})

const updateAddressButton = document.getElementById("updateAddressButton");

updateAddressButton.addEventListener('click', async () => {
    const first_name = document.getElementById("firstNameAddressEdit").value.trim();
    const last_name = document.getElementById("lastNameAddressEdit").value.trim();
    const company = document.getElementById("companyAddressEdit").value.trim();
    const address = document.getElementById("addressEdit").value.trim();
    const apartment = document.getElementById("apartmentEdit").value.trim();
    const phone = document.getElementById("phoneEdit").value.trim();

    if (!first_name || !last_name || !address || !phone) {
        alert('First Name, Last Name, Address or Phone Number is missing');
        return;
    }

    try {
        const response = await fetch('/profile/change-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name, last_name, company, address, apartment, phone }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
});

// Avatar Upload Handling
const avatarInput = document.getElementById('avatar');
const uploadForm = document.querySelector('form[action="/profile/upload-avatar"]');

avatarInput.addEventListener('change', async () => {
    const formData = new FormData(uploadForm);

    try {
        const response = await fetch('/profile/upload-avatar', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            document.querySelector('.userSet .icon').src = `/assets/images/avatars/${data.avatar}`;
        } else {
        }
    } catch (err) {
        console.error('Error:', err);
        // Consider logging the error to the console for debugging purposes
    }
});

// Delete Avatar Handling
const deleteAvatarButton = document.querySelector('.delete-avatar-button');

deleteAvatarButton.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) {
        return;
    }

    try {
        const response = await fetch('/profile/delete-avatar', {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            document.querySelector('.userSet .icon').src = '/assets/images/avatars/default_avatar.png';
        } else {
        }
    } catch (err) {
        console.error('Error:', err);
        // Consider logging the error to the console for debugging purposes
    }
});
