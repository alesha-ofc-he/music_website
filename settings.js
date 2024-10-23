// Показать текущее время при нажатии на кнопку
document.querySelector('.show-time-btn').addEventListener('click', function() {
    const timeDisplay = document.getElementById('timeDisplay');
    const currentTime = new Date().toLocaleTimeString();
    timeDisplay.textContent = `Current Time: ${currentTime}`;
});

// Переключение языков
const translations = {
    rus: {
        volume: "Громкость",
        playbackQuality: "Качество Воспроизведения",
        darkMode: "Темный Режим",
        brightMode: "Светлый Режим",
        language: "Язык",
        settings: "Настройки",
        footer: "Страница создана Мерекиевым Мертаем ИТ-2307",
        date: "Дата: 09.09.2024",
    },
    kaz: {
        volume: "Дыбыс деңгейі",
        playbackQuality: "Ойнату сапасы",
        darkMode: "Қараңғы Режим",
        brightMode: "Жарқын Режим",
        language: "Тіл",
        settings: "Баптаулар",
        footer: "Бетті Мерекеев Мертай IT-2307 жасады",
        date: "Күні: 09.09.2024",
    },
    eng: {
        volume: "Volume",
        playbackQuality: "Playback Quality",
        darkMode: "Dark Mode",
        brightMode: "Bright Mode",
        language: "Language",
        settings: "Settings",
        footer: "Page created by Merekeyev Mertay IT-2307",
        date: "Date: 09.09.2024",
    }
};

function changeLanguage(language) {
    const langData = translations[language];

    // Изменяем текст на основе выбранного языка
    document.querySelector('label[for="volumeRange"]').textContent = langData.volume;
    document.querySelector('.playback-quality-label').textContent = langData.playbackQuality;
    document.querySelector('.form-check-label[for="darkModeSwitch"]').textContent = langData.darkMode;
    document.querySelector('.form-check-label[for="brightModeSwitch"]').textContent = langData.brightMode; // для светлого режима
    document.querySelector('.language-label').textContent = langData.language;
    document.querySelector('.settings-label').textContent = langData.settings; // для настроек
    document.querySelector('.footer-text').textContent = langData.footer; // обновлено для футера
    document.getElementById('currentDate').textContent = langData.date;
}

// Обработчик на кнопки языка
document.querySelectorAll('.lang-btn').forEach(button => {
    button.addEventListener('click', function() {
        const language = this.textContent.toLowerCase();
        changeLanguage(language);
    });
});

// Переключение темного режима
document.getElementById('darkModeSwitch').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});
