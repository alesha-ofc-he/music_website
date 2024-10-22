// Показать текущее время при нажатии на кнопку
document.querySelector('.show-time-btn').addEventListener('click', function() {
    const timeDisplay = document.querySelector('.time-display');
    const currentTime = new Date().toLocaleTimeString();
    timeDisplay.textContent = `Current Time: ${currentTime}`;
    timeDisplay.classList.add('show-animation'); // Анимация для показа времени
    
    // Удаляем анимацию, чтобы ее можно было повторить
    setTimeout(() => {
        timeDisplay.classList.remove('show-animation');
    }, 1000);
});

// Переключение языков с помощью кнопок
document.querySelectorAll('.btn-group button').forEach(button => {
    button.addEventListener('click', function() {
        const selectedLanguage = this.textContent;
        switch (selectedLanguage) {
            case 'Rus':
                document.body.innerHTML = "Вы выбрали русский язык";
                break;
            case 'Kaz':
                document.body.innerHTML = "Сіз қазақ тілін таңдадыңыз";
                break;
            case 'Eng':
                document.body.innerHTML = "You selected English";
                break;
            default:
                document.body.innerHTML = "Language not supported";
        }
    });
});

// Навигация через стрелки клавиатуры
document.addEventListener('keydown', function(event) {
    const navItems = document.querySelectorAll('.nav-item');
    let index = Array.from(navItems).findIndex(item => document.activeElement === item);

    if (event.key === 'ArrowRight' && index < navItems.length - 1) {
        navItems[index + 1].focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
        navItems[index - 1].focus();
    }
});

// Анимация увеличения кнопки при нажатии
document.querySelector('.animate-btn').addEventListener('click', function() {
    this.style.transform = 'scale(1.3)';
    
    // Возвращаемся к исходному состоянию через 300ms
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 300);
});
