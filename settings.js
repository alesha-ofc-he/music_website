const translations = {
    rus: {
        collections: "Коллекции",
        podcasts: "Подкасты",
        audiobooks: "Аудиокниги",
        settings: "Настройки",
        volume: "Громкость",
        playbackQuality: "Качество Воспроизведения",
        low: "Низкое",
        mid: "Среднее",
        high: "Высокое",
        darkMode: "Темный Режим",
        language: "Язык",
        showCurrentTime: "Показать текущее время",
        footer: "Страница создана Мерекиевым Мертаем ИТ-2307",
        date: "Дата:",
    },
    kaz: {
        collections: "Жинақтар",
        podcasts: "Подкасттар",
        audiobooks: "Аудиокітаптар",
        settings: "Баптаулар",
        volume: "Дыбыс деңгейі",
        playbackQuality: "Ойнату сапасы",
        low: "Төмен",
        mid: "Орташа",
        high: "Жоғары",
        darkMode: "Қараңғы Режим",
        language: "Тіл",
        showCurrentTime: "Ағымдағы уақытты көрсету",
        footer: "Бетті Мерекеев Мертай IT-2307 жасады",
        date: "Күні:",
    },
    eng: {
        collections: "Collections",
        podcasts: "Podcasts",
        audiobooks: "Audiobooks",
        settings: "Settings",
        volume: "Volume",
        playbackQuality: "Playback Quality",
        low: "Low",
        mid: "Mid",
        high: "High",
        darkMode: "Dark Mode",
        language: "Language",
        showCurrentTime: "Show Current Time",
        footer: "Page created by Merekeyev Mertay IT-2307",
        date: "Date:",
    }
};

function changeLanguage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    localStorage.setItem('language', language);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeToggle();
    updateDarkModeSwitch(isDarkMode);
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
}

function updateDarkModeSwitch(isDarkMode) {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.checked = isDarkMode;
}

document.addEventListener('DOMContentLoaded', function() {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') || 'eng';
    changeLanguage(savedLanguage);

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();
    updateDarkModeSwitch(savedDarkMode);

    // Event listeners
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            changeLanguage(language);
        });
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('darkModeSwitch').addEventListener('change', toggleTheme);
    document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);


    document.querySelector('.show-time-btn').addEventListener('click', function() {
        const timeDisplay = document.getElementById('timeDisplay');
        const currentTime = new Date().toLocaleTimeString();
        timeDisplay.textContent = `${translations[savedLanguage].showCurrentTime}: ${currentTime}`;
    });
});