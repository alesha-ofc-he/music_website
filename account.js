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

//popupContactUSWindow

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
showPopupBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    resetForm();
});
window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
        resetForm();
    }
});
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
        // Simulating form submission
        setTimeout(() => {
            this.style.display = 'none';
            successMessage.style.display = 'block';
            setTimeout(() => {
                popup.style.display = 'none';
                resetForm();
            }, 3000);
        }, 1000);
    }
});
function validateForm() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return false;
    }
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    return true;
}
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMessage.style.display = 'none';
}