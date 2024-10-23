// Form Validation
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    if (password && password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    alert('Profile updated successfully!');
    this.reset();
});

// Accordion for FAQs
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});

// Popup Subscription or Contact Form
const popup = document.getElementById('contactPopup');
const showPopupBtn = document.getElementById('showPopupBtn');
const closePopup = document.querySelector('.close-popup');

showPopupBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// Change Background Color
const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
const colors = ['#3B8BA5', '#4A5899', '#6A5ACD', '#8B4513', '#2F4F4F'];
let currentColorIndex = 0;

changeBackgroundBtn.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[currentColorIndex];
});