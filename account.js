// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('accountInfo').innerHTML = `
            <div class="d-flex align-items-center mb-4">
                <img class="account-photo me-3" src="images/accountmertay.jpg" alt="User Photo">
                <div>
                    <h2 class="account-name mb-0">${userData.name} ${userData.surname}</h2>
                    <p class="account-email mb-0">${userData.email}</p>
                    <p class="mb-0">Age: ${userData.age}</p>
                </div>
            </div>
        `;
        document.getElementById('name').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('age').value = userData.age;
    } else {
        window.location.href = 'home.html'; // Redirect to home if not logged in
    }
}

// Update profile form
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !age) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
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

    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.name = name;
    userData.email = email;
    userData.age = age;
    if (password) {
        userData.password = password;
    }
    localStorage.setItem('userData', JSON.stringify(userData));

    alert('Profile updated successfully!');
    loadUserData(); // Reload user data to reflect changes
});

// Accordion for FAQs
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});

// Contact Support Popup
const popup = document.getElementById('contactPopup');
const showPopupBtn = document.getElementById('showPopupBtn');
const closePopup = document.querySelector('.close-popup');
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

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill text-white"></i>';
}

// Load user data when the page loads
document.addEventListener('DOMContentLoaded', loadUserData);