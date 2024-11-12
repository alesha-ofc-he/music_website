document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        rus: {
            collections: "Коллекции",
            searchPlaceholder: "Поиск...",
            search: "Искать",
            topHits: "Топ хиты",
            topHitsDesc: "Самые горячие треки прямо сейчас",
            chillVibes: "Расслабляющие вибрации",
            chillVibesDesc: "Расслабьтесь и отдохните с этими мелодиями",
            workoutMix: "Микс для тренировок",
            workoutMixDesc: "Зарядитесь энергией с этими треками",
            "90sNostalgia": "Ностальгия 90-х",
            "90sNostalgiaDesc": "Совершите путешествие в прошлое",
            acousticGems: "Акустические жемчужины",
            acousticGemsDesc: "Акустические версии ваших любимых песен",
            electronicBeats: "Электронные биты",
            electronicBeatsDesc: "Передовая электронная музыка",
            playAll: "Воспроизвести все",
            featuredArtists: "Популярные исполнители",
            artistName1: "Джон Доу",
            artistName2: "Джейн Смит",
            artistName3: "Майк Джонсон",
            artistName4: "Эмили Браун",
            artistName5: "Дэвид Ли",
            artistName6: "Сара Уилсон",
            footerCredit: "Страница создана Алиханом Касымбековым ИТ-2307",
            date: "Дата:"
        },
        kaz: {
            collections: "Жинақтар",
            searchPlaceholder: "Іздеу...",
            search: "Іздеу",
            topHits: "Үздік хиттер",
            topHitsDesc: "Қазіргі ең танымал әндер",
            chillVibes: "Демалыс әуендері",
            chillVibesDesc: "Осы әуендермен демалыңыз",
            workoutMix: "Жаттығу миксі",
            workoutMixDesc: "Осы энергиялық трекпен күш жинаңыз",
            "90sNostalgia": "90-шы жылдардың ностальгиясы",
            "90sNostalgiaDesc": "Өткенге саяхат жасаңыз",
            acousticGems: "Акустикалық әсемдіктер",
            acousticGemsDesc: "Сүйікті әндеріңіздің акустикалық нұсқалары",
            electronicBeats: "Электронды ырғақтар",
            electronicBeatsDesc: "Заманауи электронды музыка",
            playAll: "Барлығын ойнату",
            featuredArtists: "Танымал орындаушылар",
            artistName1: "Джон Доу",
            artistName2: "Джейн Смит",
            artistName3: "Майк Джонсон",
            artistName4: "Эмили Браун",
            artistName5: "Дэвид Ли",
            artistName6: "Сара Уилсон",
            footerCredit: "Бетті Әлихан Қасымбеков ИТ-2307 жасады",
            date: "Күні:"
        },
        eng: {
            collections: "Collections",
            searchPlaceholder: "Search...",
            search: "Search",
            topHits: "Top Hits",
            topHitsDesc: "The hottest tracks right now",
            chillVibes: "Chill Vibes",
            chillVibesDesc: "Relax and unwind with these tunes",
            workoutMix: "Workout Mix",
            workoutMixDesc: "Get pumped with these energetic tracks",
            "90sNostalgia": "90s Nostalgia",
            "90sNostalgiaDesc": "Take a trip down memory lane",
            acousticGems: "Acoustic Gems",
            acousticGemsDesc: "Stripped-down versions of your favorites",
            electronicBeats: "Electronic Beats",
            electronicBeatsDesc: "Cutting-edge electronic music",
            playAll: "Play All",
            featuredArtists: "Featured Artists",
            artistName1: "John Doe",
            artistName2: "Jane Smith",
            artistName3: "Mike Johnson",
            artistName4: "Emily Brown",
            artistName5: "David Lee",
            artistName6: "Sarah Wilson",
            footerCredit: "Page created by AliKhan Kassymbekov IT-2307",
            date: "Date:"
        }
    };

    function changeLanguage(language) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[language][key];
                } else {
                    element.textContent = translations[language][key];
                }
            }
        });
        document.documentElement.lang = language;
        document.title = `Tolkyn - ${translations[language].collections}`;
        updateDate(language);
        saveUserPreferences('language', language);
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

    function saveUserPreferences(key, value) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            loggedInUser[key] = value;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
        localStorage.setItem(key, JSON.stringify(value));
    }

    function updateDate(language) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let locale;
        switch(language) {
            case 'rus':
                locale = 'ru-RU';
                break;
            case 'kaz':
                locale = 'kk-KZ';
                break;
            default:
                locale = 'en-US';
        }
        document.getElementById('currentDate').textContent = `${translations[language].date} ${today.toLocaleDateString(locale, options)}`;
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        saveUserPreferences('darkMode', isDarkMode);
        updateThemeToggle();
    }

    function updateThemeToggle() {
        const themeToggle = document.getElementById('darkModeToggle');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
    }

    // Initialize page
    const preferences = loadUserPreferences();
    changeLanguage(preferences.language);
    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();
    updateDate(preferences.language);

    // Event listeners
    document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);

    // Language switcher
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
});