// Spotify API credentials
const clientId = 'ffe17080164240a787074bc62ec53fa6';
const clientSecret = '9277436b283d492f990ed82d3044f8ae';

const translations = {
    rus: {
        title: "Tolkyn - Музыкальный стриминг",
        collections: "Коллекции",
        searchPlaceholder: "Поиск...",
        search: "Искать",
        home: "Главная",
        recentlyPlayed: "Недавно прослушанные",
        likedSongs: "Понравившиеся песни",
        hotTracks: "Горячие треки месяца",
        playlistOfTheDay: "Плейлист дня",
        hotTracksTitle: "Горячие треки месяца",
        likedSongsTitle: "Понравившиеся песни",
        recentlyPlayedTitle: "Недавно прослушанные",
        playlistOfTheDayTitle: "Плейлист дня",
        videoClipsTime: "Время видеоклипов!",
        watchNewClips: "Смотрите все новые клипы в Tolkyn",
        footerCredit: "Страница создана Алиханом Касымбековым ИТ-2307",
        date: "Дата:",
    },
    kaz: {
        title: "Tolkyn - Музыка ағыны",
        collections: "Жинақтар",
        searchPlaceholder: "Іздеу...",
        search: "Іздеу",
        home: "Басты бет",
        recentlyPlayed: "Жақында ойнатылған",
        likedSongs: "Ұнаған әндер",
        hotTracks: "Айдың ыстық әндері",
        playlistOfTheDay: "Күннің ойнату тізімі",
        hotTracksTitle: "Айдың ыстық әндері",
        likedSongsTitle: "Ұнаған әндер",
        recentlyPlayedTitle: "Жақында ойнатылған",
        playlistOfTheDayTitle: "Күннің ойнату тізімі",
        videoClipsTime: "Бейнеклиптер уақыты!",
        watchNewClips: "Tolkyn-да барлық жаңа клиптерді көріңіз",
        footerCredit: "Бетті Әлихан Қасымбеков ИТ-2307 жасады",
        date: "Күні:",
    },
    eng: {
        title: "Tolkyn - Music Streaming",
        collections: "Collections",
        searchPlaceholder: "Search...",
        search: "Search",
        home: "Home",
        recentlyPlayed: "Recently Played",
        likedSongs: "Liked Songs",
        hotTracks: "Hot tracks of the month",
        playlistOfTheDay: "Playlist of the day",
        hotTracksTitle: "Hot Tracks of the Month",
        likedSongsTitle: "Liked Songs",
        recentlyPlayedTitle: "Recently Played",
        playlistOfTheDayTitle: "Playlist of the Day",
        videoClipsTime: "Video clips time!",
        watchNewClips: "Watch all new clips in Tolkyn",
        footerCredit: "Page created by AliKhan Kassymbekov IT-2307",
        date: "Date:",
    }
};

function applyLanguage(language) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[language][key];
            } else {
                element.textContent = translations[language][key];
            }
        }
    });
    document.documentElement.lang = language;
    document.title = translations[language].title;
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
        language: localStorage.getItem('language') || 'eng',
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

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeToggle();
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
}

class Song {
    constructor(id, title, artist, duration, audioSrc, imageUrl) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.isLiked = false;
        this.audioSrc = audioSrc;
        this.imageUrl = imageUrl;
    }

    toggleLike() {
        this.isLiked = !this.isLiked;
    }
}

// Global variables
let currentPlaylist = [];
let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;
let isShuffled = false;
let likedSongs = [];
let recentlyPlayedSongs = [];
let hotTracks = [];
let playlistOfTheDay = [];

// Spotify API functions
async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

async function searchSongs(query) {
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=15`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data.tracks.items.map(track => new Song(
        track.id,
        track.name,
        track.artists[0].name,
        formatTime(track.duration_ms / 1000),
        track.preview_url,
        track.album.images[0].url
    ));
}

async function getHotTracks() {
    const token = await getSpotifyToken();
    const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=10', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data.items.map(item => new Song(
        item.track.id,
        item.track.name,
        item.track.artists[0].name,
        formatTime(item.track.duration_ms / 1000),
        item.track.preview_url,
        item.track.album.images[0].url
    ));
}

function displaySearchResults(songs) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    songs.forEach(song => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${song.imageUrl}" alt="${song.title}" class="search-result-image">
            <div class="search-result-info">
                <div class="search-result-title">${song.title}</div>
                <div class="search-result-artist">${song.artist}</div>
            </div>
            <div class="search-result-duration">${song.duration}</div>
            <div class="search-result-controls">
                <span class="search-result-play" data-id="${song.id}"><i class="bi bi-play-fill"></i></span>
                <span class="search-result-like" data-id="${song.id}"><i class="bi bi-heart"></i></span>
            </div>
        `;
        searchResults.appendChild(resultItem);
    });
    searchResults.style.display = 'block';

    // Add event listeners for play and like buttons
    searchResults.querySelectorAll('.search-result-play').forEach(playBtn => {
        playBtn.addEventListener('click', (e) => {
            const songId = e.currentTarget.dataset.id;
            const song = songs.find(s => s.id === songId);
            if (song) {
                playSong(song, songs);
            }
        });
    });

    searchResults.querySelectorAll('.search-result-like').forEach(likeBtn => {
        likeBtn.addEventListener('click', (e) => {
            const songId = e.currentTarget.dataset.id;
            const song = songs.find(s => s.id === songId);
            if (song) {
                toggleLikeSong(song);
            }
        });
    });
}

function displaySongList(songs, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <img src="${containerId === 'playlistOfTheDayList' ? 'images/meremad.png' : (song.imageUrl || 'images/meremad.png')}" alt="${song.title}" class="search-result-image">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">${song.duration}</span>
            <span class="song-play" data-id="${song.id}">
                <i class="bi bi-play-fill"></i>
            </span>
            <span class="song-like" data-id="${song.id}">
                <i class="bi ${song.isLiked ? 'bi-heart-fill liked' : 'bi-heart'}"></i>
            </span>
        `;
        container.appendChild(songItem);
    });

    container.querySelectorAll('.song-play').forEach(playBtn => {
        playBtn.addEventListener('click', (e) => {
            const songId = e.currentTarget.dataset.id;
            const song = songs.find(s => s.id === songId);
            if (song) {
                playSong(song, songs);
            }
        });
    });

    container.querySelectorAll('.song-like').forEach(likeBtn => {
        likeBtn.addEventListener('click', (e) => {
            const songId = e.currentTarget.dataset.id;
            const song = songs.find(s => s.id === songId);
            if (song) {
                toggleLikeSong(song);
            }
        });
    });
}

function playSong(song, playlist) {
    currentPlaylist = playlist;
    currentSongIndex = currentPlaylist.indexOf(song);
    let audioSrc = song.audioSrc;
    if (!audioSrc && song.title) {
        audioSrc = `songs/${song.title.replace(/ /g, '_')}.mp3`;
    }
    audio.src = audioSrc;
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
    isPlaying = true;
    updatePlayerInfo(song);
    updatePlayPauseButton();
    addToRecentlyPlayed(song);
    showPlayer();
}

function updatePlayerInfo(song) {
    document.getElementById('playerSongTitle').textContent = song.title;
    document.getElementById('playerSongArtist').textContent = song.artist;
    document.getElementById('playerCover').src = song.imageUrl || 'images/meremad.png';
    document.getElementById('playerLikeBtn').querySelector('i').className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.className = isPlaying ? 'bi bi-pause-circle-fill fs-1' : 'bi bi-play-circle-fill fs-1';
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    document.getElementById('shuffleBtn').classList.toggle('text-primary', isShuffled);
    if (isShuffled) {
        currentPlaylist = [...currentPlaylist].sort(() => Math.random() - 0.5);
    } else {
        currentPlaylist = [...currentPlaylist].sort((a, b) => a.id.localeCompare(b.id));
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showPlayer() {
    const player = document.getElementById('player');
    player.style.display = 'block';
    setTimeout(() => player.classList.add('show'), 10);
}

function hidePlayer() {
    const player = document.getElementById('player');
    player.classList.remove('show');
    setTimeout(() => player.style.display = 'none', 300);
}

function toggleLikeSong(song) {
    song.toggleLike();
    if (song.isLiked) {
        if (!likedSongs.some(s => s.id === song.id)) {
            likedSongs.unshift(song);
        }
    } else {
        likedSongs = likedSongs.filter(s => s.id !== song.id);
    }
    updateLikedSongs();
    updateLikeButtons(song);
}

function updateLikeButtons(song) {
    const searchLikeBtn = document.querySelector(`.search-result-like[data-id="${song.id}"] i`);
    if (searchLikeBtn) {
        searchLikeBtn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    }

    const songListLikeBtns = document.querySelectorAll(`.song-like[data-id="${song.id}"] i`);
    songListLikeBtns.forEach(btn => {
        btn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    });

    const playerLikeBtn = document.getElementById('playerLikeBtn').querySelector('i');
    if (currentPlaylist[currentSongIndex] && currentPlaylist[currentSongIndex].id === song.id) {
        playerLikeBtn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    }
}

function updateLikedSongs() {
    displaySongList(likedSongs, 'likedSongsList');
    saveLikedSongsToLocalStorage();
}

function addToRecentlyPlayed(song) {
    const index = recentlyPlayedSongs.findIndex(s => s.id === song.id);
    if (index !== -1) {
        recentlyPlayedSongs.splice(index, 1);
    }
    recentlyPlayedSongs.unshift({...song, isLiked: likedSongs.some(s => s.id === song.id)});
    if (recentlyPlayedSongs.length > 15) {
        recentlyPlayedSongs.pop();
    }
    saveRecentlyPlayedToLocalStorage();
    displaySongList(recentlyPlayedSongs, 'recentlyPlayedList');
}

function saveLikedSongsToLocalStorage() {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
}

function loadLikedSongsFromLocalStorage() {
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
        likedSongs = JSON.parse(savedLikedSongs);
        displaySongList(likedSongs, 'likedSongsList');
    }
}

function saveRecentlyPlayedToLocalStorage() {
    localStorage.setItem('recentlyPlayedSongs', JSON.stringify(recentlyPlayedSongs));
}

function loadRecentlyPlayedFromLocalStorage() {
    const savedRecentlyPlayed = localStorage.getItem('recentlyPlayedSongs');
    if (savedRecentlyPlayed) {
        recentlyPlayedSongs = JSON.parse(savedRecentlyPlayed);
        displaySongList(recentlyPlayedSongs, 'recentlyPlayedList');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
}
function showSearchResults() {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<p>Search results will appear here...</p>';
    searchResults.style.display = 'block';
}

function showAccountPage(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'account.html';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';

    if (!email) {
        document.getElementById('loginEmailError').textContent = 'Email is required';
        return;
    }
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        showAccountPage(storedUser);
    } else {
        document.getElementById('loginEmailError').textContent = 'Invalid email or password';
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const surname = document.getElementById('signupSurname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const age = document.getElementById('signupAge').value;

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let isValid = true;
    if (name.length < 2) {
        document.getElementById('signupNameError').textContent = 'Name must be at least 2 characters long';
        isValid = false;
    }
    if (surname.length < 2) {
        document.getElementById('signupSurnameError').textContent = 'Surname must be at least 2 characters long';
        isValid = false;
    }
    if (!email.includes('@')) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    if (password.length < 8) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById('signupConfirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }
    if (age < 13) {
        document.getElementById('signupAgeError').textContent = 'You must be at least 13 years old';
        isValid = false;
    }

    if (isValid) {
        const userData = { name, surname, email, password, age };
        localStorage.setItem('userData', JSON.stringify(userData));
        showAccountPage(userData);
    }
}

function changeLanguage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[language][key];
            } else {
                element.textContent = translations[language][key];
            }
        }
    });
    document.documentElement.lang = language;
    document.title = translations[language].title;
    saveUserPreferences('language', language);
    updateDate(language);
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
    document.getElementById('currentDate').textContent = today.toLocaleDateString(locale, options);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const hotTracksCard = document.getElementById('hotTracks');
    const songListContainer = document.getElementById('songListContainer');
    const likedSongsCard = document.getElementById('likedSongs');
    const likedSongsContainer = document.getElementById('likedSongsContainer');
    const recentlyPlayedCard = document.getElementById('recentlyPlayed');
    const recentlyPlayedContainer = document.getElementById('recentlyPlayedContainer');
    const playlistOfTheDayCard = document.getElementById('playlistOfTheDay');
    const playlistOfTheDayContainer = document.getElementById('playlistOfTheDayContainer');
    const player = document.getElementById('player');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const seekBar = document.getElementById('seekBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeControl = document.querySelector('.volume-control');
    const playerLikeBtn = document.getElementById('playerLikeBtn');
    const playerCloseBtn = document.getElementById('playerCloseBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const accountBtn = document.getElementById('accountBtn');
    const authModal = document.getElementById('authModal');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loadLikedSongsFromLocalStorage();
    loadRecentlyPlayedFromLocalStorage();

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill text-white"></i>';
    }

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const songs = await searchSongs(query);
            displaySearchResults(songs);
        } else {
            searchResults.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    hotTracksCard.addEventListener('click', async () => {
        hotTracks = await getHotTracks();
        displaySongList(hotTracks, 'songList');
        songListContainer.classList.remove('d-none');
        likedSongsContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
    });

    likedSongsCard.addEventListener('click', () => {
        displaySongList(likedSongs, 'likedSongsList');
        likedSongsContainer.classList.remove('d-none');
        songListContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
    });

    recentlyPlayedCard.addEventListener('click', () => {
        displaySongList(recentlyPlayedSongs, 'recentlyPlayedList');
        recentlyPlayedContainer.classList.remove('d-none');
        songListContainer.classList.add('d-none');
        likedSongsContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
    });

    playlistOfTheDayCard.addEventListener('click', () => {
        playlistOfTheDay = [
            new Song('1', 'Meremad', 'Ninety One', '3:30'),
            new Song('2', 'Bayau', 'Ninety One', '3:15'),
            new Song('3', 'Aiyptama', 'Ninety One', '3:45'),
            new Song('4', 'Kalay Karaisyn', 'Ninety One', '3:20'),
            new Song('5', 'Ah!Yah!Mah!', 'Ninety One', '3:10')
        ];
        displaySongList(playlistOfTheDay, 'playlistOfTheDayList');
        playlistOfTheDayContainer.classList.remove('d-none');
        songListContainer.classList.add('d-none');
        likedSongsContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrevious);
    shuffleBtn.addEventListener('click', toggleShuffle);

    seekBar.addEventListener('click', (e) => {
        const seekPosition = (e.offsetX / seekBar.offsetWidth) * audio.duration;
        audio.currentTime = seekPosition;
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBar.querySelector('.progress-bar').style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    });

    volumeBtn.addEventListener('click', () => {
        volumeControl.classList.toggle('show');
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    document.addEventListener('click', (e) => {
        if (!volumeBtn.contains(e.target) && !volumeControl.contains(e.target)) {
            volumeControl.classList.remove('show');
        }
    });

    playerLikeBtn.addEventListener('click', () => {
        const currentSong = currentPlaylist[currentSongIndex];
        if (currentSong) {
            toggleLikeSong(currentSong);
        }
    });

    playerCloseBtn.addEventListener('click', hidePlayer);

    darkModeToggle.addEventListener('click', toggleDarkMode);

    const playerMoveBtn = document.getElementById('playerMoveBtn');
    let isDragging = false;
    let startX, startY, startLeft, startBottom;

    playerMoveBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = player.offsetLeft;
        startBottom = parseInt(getComputedStyle(player).bottom);
        player.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = startY - e.clientY;
            player.style.left = `${startLeft + deltaX}px`;
            player.style.bottom = `${startBottom + deltaY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        player.style.transition = '';
    });

    accountBtn.addEventListener('click', () => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            window.location.href = 'account.html';
        } else {
            authModal.style.display = 'flex';
        }
    });

    loginTab.addEventListener('click', () => switchForm('login'));
    signupTab.addEventListener('click', () => switchForm('signup'));

    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);


    const savedLanguage = localStorage.getItem('language') || 'eng';
    changeLanguage(savedLanguage);

    const isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();

    const searchButton = document.querySelector('.search-button');
    searchButton.style.transform = 'scale(1.5)';
    searchButton.style.padding = '10px 20px';

    searchButton.addEventListener('click', showSearchResults);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    const preferences = loadUserPreferences();
    changeLanguage(preferences.language);

    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            changeLanguage(language);
        });
    });

    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString(preferences.language === 'eng' ?
        'en-US' : (preferences.language === 'rus' ? 'ru-RU' : 'kk-KZ'));

    // Add event listeners for language buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            changeLanguage(language);
        });
    });
});

function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}