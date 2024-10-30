// Spotify API credentials
const clientId = 'ffe17080164240a787074bc62ec53fa6';
const clientSecret = '9277436b283d492f990ed82d3044f8ae';

// Song class definition
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

// Function to get Spotify access token
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

// Function to search songs using Spotify API
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

// Function to get hot tracks from Spotify API
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

// Function to display search results
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

// Function to display song list
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
                song.isLiked = !song.isLiked; // Toggle the like status
                updateLikeButtons(song);
                if (containerId === 'recentlyPlayedList') {
                    const recentlyPlayedSong = recentlyPlayedSongs.find(s => s.id === song.id);
                    if (recentlyPlayedSong) {
                        recentlyPlayedSong.isLiked = song.isLiked;
                        saveRecentlyPlayedToLocalStorage();
                    }
                }
                if (song.isLiked) {
                    if (!likedSongs.some(s => s.id === song.id)) {
                        likedSongs.unshift(song);
                    }
                } else {
                    likedSongs = likedSongs.filter(s => s.id !== song.id);
                }
                updateLikedSongs();
                e.currentTarget.querySelector('i').className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
            }
        });
    });
}

// Function to toggle like status of a song
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

// Function to update like buttons across all views
function updateLikeButtons(song) {
    // Update in search results
    const searchLikeBtn = document.querySelector(`.search-result-like[data-id="${song.id}"] i`);
    if (searchLikeBtn) {
        searchLikeBtn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    }

    // Update in song lists
    const songListLikeBtns = document.querySelectorAll(`.song-like[data-id="${song.id}"] i`);
    songListLikeBtns.forEach(btn => {
        btn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    });

    // Update in player
    const playerLikeBtn = document.getElementById('playerLikeBtn').querySelector('i');
    if (currentPlaylist[currentSongIndex] && currentPlaylist[currentSongIndex].id === song.id) {
        playerLikeBtn.className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
    }
}

// Function to update liked songs
function updateLikedSongs() {
    displaySongList(likedSongs, 'likedSongsList');
    saveLikedSongsToLocalStorage();
}

// Function to play a song
function playSong(song, playlist) {
    currentPlaylist = playlist;
    currentSongIndex = currentPlaylist.indexOf(song);
    let audioSrc = song.audioSrc;
    if (!audioSrc && song.title) {
        // For playlist of the day, construct the audio source based on the song title
        audioSrc = `songs/${song.title.replace(/ /g, '_')}.mp3`;
    }
    audio.src = audioSrc;
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // Handle the error (e.g., show a message to the user)
    });
    isPlaying = true;
    updatePlayerInfo(song);
    updatePlayPauseButton();
    addToRecentlyPlayed(song);
    showPlayer();
}

// Function to update player information
function updatePlayerInfo(song) {
    document.getElementById('playerSongTitle').textContent = song.title;
    document.getElementById('playerSongArtist').textContent = song.artist;
    document.getElementById('playerCover').src = song.imageUrl || 'images/meremad.png';
    document.getElementById('playerLikeBtn').querySelector('i').className = song.isLiked ? 'bi bi-heart-fill liked' : 'bi bi-heart';
}

// Function to update play/pause button
function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.className = isPlaying ? 'bi bi-pause-circle-fill fs-1' : 'bi bi-play-circle-fill fs-1';
}

// Function to toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Handle the error (e.g., show a message to the user)
        });
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

// Function to play next song
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

// Function to play previous song
function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

// Function to toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    document.getElementById('shuffleBtn').classList.toggle('text-primary', isShuffled);
    if (isShuffled) {
        currentPlaylist = [...currentPlaylist].sort(() => Math.random() - 0.5);
    } else {
        currentPlaylist = [...currentPlaylist].sort((a, b) => a.id.localeCompare(b.id));
    }
}

// Function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to show player
function showPlayer() {
    const player = document.getElementById('player');
    player.style.display = 'block';
    setTimeout(() => player.classList.add('show'), 10);
}

// Function to hide player
function hidePlayer() {
    const player = document.getElementById('player');
    player.classList.remove('show');
    setTimeout(() => player.style.display = 'none', 300);
}

// Function to add song to recently played
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

// Function to save liked songs to local storage
function saveLikedSongsToLocalStorage() {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
}

// Function to load liked songs from local storage
function loadLikedSongsFromLocalStorage() {
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
        likedSongs = JSON.parse(savedLikedSongs);
        displaySongList(likedSongs, 'likedSongsList');
    }
}

// Function to save recently played songs to local storage
function saveRecentlyPlayedToLocalStorage() {
    localStorage.setItem('recentlyPlayedSongs', JSON.stringify(recentlyPlayedSongs));
}

// Function to load recently played songs from local storage
function loadRecentlyPlayedFromLocalStorage() {
    const savedRecentlyPlayed = localStorage.getItem('recentlyPlayedSongs');
    if (savedRecentlyPlayed) {
        recentlyPlayedSongs = JSON.parse(savedRecentlyPlayed);
        displaySongList(recentlyPlayedSongs, 'recentlyPlayedList');
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun-fill text-white"></i>' : '<i class="bi bi-moon-fill text-white"></i>';
}

function isUserRegistered() {
    return !!localStorage.getItem('userData');
}

// Event listeners
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
    const playerMoveBtn = document.getElementById('playerMoveBtn');
    const playerCloseBtn = document.getElementById('playerCloseBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const accountBtn = document.getElementById('accountBtn');
    const authModal = document.getElementById('authModal');
    const closeBtn = authModal.querySelector('.close');
    const authForm = document.getElementById('authForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const accountIcon = document.querySelector('.bi-person-circle').parentElement;

    function showAuthModal() {
        authModal.style.display = 'flex';
    }

    function hideAuthModal() {
        authModal.style.display = 'none';
        clearErrors();
        authForm.reset();
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8 && /\d/.test(password);
    }

    accountIcon.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default navigation
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            window.location.href = 'account.html'; // Redirect to account page if registered
        } else {
            showAuthModal(); // Show registration modal if not registered
        }
    });
    cancelBtn.addEventListener('click', hideAuthModal);

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const age = document.getElementById('age').value;

        let hasErrors = false;

        if (!name) {
            document.getElementById('nameError').textContent = 'Name is required';
            hasErrors = true;
        }

        if (!surname) {
            document.getElementById('surnameError').textContent = 'Surname is required';
            hasErrors = true;
        }

        if (!validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Invalid email format';
            hasErrors = true;
        }

        if (!validatePassword(password)) {
            document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long and contain at least 1 number';
            hasErrors = true;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            hasErrors = true;
        }

        if (!age || isNaN(Number(age))) {
            document.getElementById('ageError').textContent = 'Please enter a valid age';
            hasErrors = true;
        }

        if (!hasErrors) {
            const userData = { name, surname, email, password, age };
            localStorage.setItem('userData', JSON.stringify(userData));
            hideAuthModal();
            window.location.href = 'account.html'; // Redirect to account page
        }
    });

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            const songs = await searchSongs(query);
            displaySearchResults(songs);
        } else {
            searchResults.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    hotTracksCard.addEventListener('click', async () => {
        songListContainer.classList.toggle('d-none');
        likedSongsContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
        if (hotTracks.length === 0) {
            hotTracks = await getHotTracks();
        }
        displaySongList(hotTracks, 'songList');
    });

    likedSongsCard.addEventListener('click', () => {
        likedSongsContainer.classList.toggle('d-none');
        songListContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
        displaySongList(likedSongs, 'likedSongsList');
    });

    recentlyPlayedCard.addEventListener('click', () => {
        recentlyPlayedContainer.classList.toggle('d-none');
        songListContainer.classList.add('d-none');
        likedSongsContainer.classList.add('d-none');
        playlistOfTheDayContainer.classList.add('d-none');
        displaySongList(recentlyPlayedSongs, 'recentlyPlayedList');
    });

    playlistOfTheDayCard.addEventListener('click', () => {
        playlistOfTheDayContainer.classList.toggle('d-none');
        songListContainer.classList.add('d-none');
        likedSongsContainer.classList.add('d-none');
        recentlyPlayedContainer.classList.add('d-none');
        displaySongList(playlistOfTheDay, 'playlistOfTheDayList');
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
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', playNext);

    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        volumeControl.classList.toggle('show');
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    playerLikeBtn.addEventListener('click', () => {
        const currentSong = currentPlaylist[currentSongIndex];
        if (currentSong) {
            toggleLikeSong(currentSong);
        }
    });

    playerCloseBtn.addEventListener('click', hidePlayer);

    // Make player draggable
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    playerMoveBtn.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = player.offsetLeft;
        startTop = player.offsetTop;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        let newLeft = startLeft + e.clientX - startX;
        let newTop = startTop + e.clientY - startY;
        
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - player.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - player.offsetHeight));
        
        player.style.left = newLeft + 'px';
        player.style.top = newTop + 'px';
        player.style.right = 'auto';
        player.style.bottom = 'auto';
    }

    function stopDragging() {
        isDragging = false;
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'arrowright':
            case 'l':
                playNext();
                break;
            case 'arrowleft':
            case 'j':
                playPrevious();
                break;
            case 'k':
                togglePlayPause();
                break;
            case 'h':
                player.classList.toggle('show');
                break;
            case 'm':
                audio.muted = !audio.muted;
                break;
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill text-white"></i>';
    }

    // Load data from local storage
    loadLikedSongsFromLocalStorage();
    loadRecentlyPlayedFromLocalStorage();

    // Initialize playlist of the day
    playlistOfTheDay = [
        new Song(1, "Master of None", "Beach House", "3:19", "Suki Waterhouse Johanna.mp3", "images/meremad.png"),
        new Song(2, "Johanna", "Suki Waterhouse", "2:35", "songs/Johanna.mp3", "images/meremad.png"),
        new Song(3, "The End.", "My Chemical Romance", "1:52", "songs/The_End..mp3", "images/meremad.png"),
        new Song(4, "Failed at Math(s)", "Panchiko", "2:40", "songs/Failed_at_Math(s).mp3", "images/meremad.png"),
        new Song(5, "Inference (1)", "Fog Lake", "2:14", "songs/Inference_(1).mp3", "images/meremad.png"),
        new Song(6, "Rain Intermission", "Strawberry Guy", "3:56", "songs/Rain_Intermission.mp3", "images/meremad.png"),
        new Song(7, "Myth", "Beach House", "4:18", "songs/Myth.mp3", "images/meremad.png"),
        new Song(8, "Every Day's A Lesson In Humility", "Suki Waterhouse, Belle and Sebastian", "3:36", "songs/Every_Day's_A_Lesson_In_Humility.mp3", "images/meremad.png"),
        new Song(9, "Falling Apart", "Slow Pulp", "2:46", "songs/Falling_Apart.mp3", "images/meremad.png"),
        new Song(10, "All They Wanted", "Panchiko", "2:07", "songs/All_They_Wanted.mp3", "images/meremad.png")
    ];

    displaySongList(playlistOfTheDay, 'playlistOfTheDayList');

    // Check if user data exists in local storage
    if (isUserRegistered()) {
        accountBtn.href = 'account.html';
    } else {
        accountBtn.href = '#';
    }
});

// Save player state before unloading the page
window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify({
        currentSongIndex: currentSongIndex,
        currentTime: audio.currentTime,
        isPlaying: isPlaying,
        volume: audio.volume,
        isShuffled: isShuffled,
        isVisible: player.classList.contains('show')
    }));
});

// Load player state when the page loads
window.addEventListener('load', () => {
    const savedState = JSON.parse(localStorage.getItem('playerState'));
    if (savedState) {
        currentSongIndex = savedState.currentSongIndex;
        audio.currentTime = savedState.currentTime;
        isPlaying = savedState.isPlaying;
        audio.volume = savedState.volume;
        isShuffled = savedState.isShuffled;

        if (savedState.isVisible) {
            showPlayer();
        }

        if (currentSongIndex < currentPlaylist.length) {
            updatePlayerInfo(currentPlaylist[currentSongIndex]);
            audio.src = currentPlaylist[currentSongIndex].audioSrc;
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    // Handle the error (e.g., show a message to the user)
                });
            }
            updatePlayPauseButton();
        }
    }
});