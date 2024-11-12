const translations = {
    rus: {
        collections: "Коллекции",
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
        currentTime: "Текущее время:"
    },
    kaz: {
        collections: "Жинақтар",
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
        currentTime: "Қазіргі уақыт:"
    },
    eng: {
        collections: "Collections",
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
        currentTime: "Current time:"
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
    saveUserPreferences('language', language);
    updateLanguageButtons(language);
}

function updateLanguageButtons(activeLanguage) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === activeLanguage);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    saveUserPreferences('darkMode', isDarkMode);
    updateThemeToggle();
    updateDarkModeSwitch(isDarkMode);
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
}

function updateDarkModeSwitch(isDarkMode) {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.checked = isDarkMode;
}

function saveUserPreferences(key, value) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loggedInUser[key] = value;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
    localStorage.setItem(key, JSON.stringify(value));
}

function loadUserPreferences() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        return {
            language: loggedInUser.language || 'eng',
            darkMode: loggedInUser.darkMode || false
        };
    }
    return {
        language: JSON.parse(localStorage.getItem('language')) || 'eng',
        darkMode: JSON.parse(localStorage.getItem('darkMode')) || false
    };
}

function showCurrentTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    const currentTime = new Date().toLocaleTimeString();
    const currentLanguage = loadUserPreferences().language;
    timeDisplay.textContent = `${translations[currentLanguage].currentTime} ${currentTime}`;
}

function checkUserLogin() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'home.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();

    const preferences = loadUserPreferences();
    changeLanguage(preferences.language);

    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();
    updateDarkModeSwitch(preferences.darkMode);

    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            changeLanguage(language);
        });
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('darkModeSwitch').addEventListener('change', toggleTheme);

    document.querySelector('.show-time-btn').addEventListener('click', showCurrentTime);

    // Set current date
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString();
});