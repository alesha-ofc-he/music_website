class Song {
    constructor(id, title, artist, duration, audioSrc) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.isLiked = false;
        this.audioSrc = audioSrc;
    }

    toggleLike() {
        this.isLiked = !this.isLiked;
    }
}

const hotTracks = [
    new Song(1, "Master of None", "Beach House", "3:19", "songs/Beach House Master Of None.mp3"),
    new Song(2, "Johanna", "Suki Waterhouse", "2:35", "songs/Suki Waterhouse Johanna.mp3"),
    new Song(3, "The End.", "My Chemical Romance", "1:52", "songs/My Chemical Romance The End..mp3"),
    new Song(4, "Failed at Math(s)", "Panchiko", "2:40", "songs/failed_at_maths.mp3"),
    new Song(5, "Inference (1)",    "Fog Lake", "2:14", "songs/inference.mp3"),
    new Song(6, "Rain Intermission", "Strawberry Guy", "3:56", "songs/rain_intermission.mp3"),
    new Song(7, "Myth", "Beach House", "4:18", "songs/myth.mp3"),
    new Song(8, "Every Day's A Lesson In Humility", "Suki Waterhouse, Belle and Sebastian", "3:36", "songs/every_days_a_lesson.mp3"),
    new Song(9, "Falling Apart", "Slow Pulp", "2:46", "songs/falling_apart.mp3"),
    new Song(10, "All They Wanted", "Panchiko", "2:07", "songs/all_they_wanted.mp3")
];

let likedSongs = [];
let currentPlaylist = [];
let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;
let isShuffled = false;

function displaySongList(songs, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <span class="song-number">${index + 1}</span>
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
            const songId = parseInt(e.currentTarget.dataset.id);
            const song = songs.find(s => s.id === songId);
            if (song) {
                playSong(song, songs);
            }
        });
    });

    container.querySelectorAll('.song-like').forEach(likeBtn => {
        likeBtn.addEventListener('click', (e) => {
            const songId = parseInt(e.currentTarget.dataset.id);
            const song = hotTracks.find(s => s.id === songId);
            if (song) {
                song.toggleLike();
                updateLikedSongs();
                displaySongList(hotTracks, 'songList');
                displaySongList(likedSongs, 'likedSongsList');
            }
        });
    });
}

function updateLikedSongs() {
    likedSongs = hotTracks.filter(song => song.isLiked);
}

function playSong(song, playlist) {
    currentPlaylist = playlist;
    currentSongIndex = currentPlaylist.indexOf(song);
    audio.src = song.audioSrc;
    audio.play();
    isPlaying = true;
    animateSongChange();
    updatePlayPauseButton();
}

function updatePlayerInfo(song) {
    document.getElementById('playerSongTitle').textContent = song.title;
    document.getElementById('playerSongArtist').textContent = song.artist;
    document.getElementById('playerCover').src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(song.title)}`;
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.className = isPlaying ? 'bi bi-pause-circle-fill fs-1' : 'bi bi-play-circle-fill fs-1';
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    animateSongChange();
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    animateSongChange();
    playSong(currentPlaylist[currentSongIndex], currentPlaylist);
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    document.getElementById('shuffleBtn').classList.toggle('text-primary', isShuffled);
    if (isShuffled) {
        currentPlaylist = [...currentPlaylist].sort(() => Math.random() - 0.5);
    } else {
        currentPlaylist = hotTracks;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const hotTracksCard = document.getElementById('hotTracks');
    const songListContainer = document.getElementById('songListContainer');
    const likedSongsCard = document.getElementById('likedSongs');
    const likedSongsContainer = document.getElementById('likedSongsContainer');
    const player = document.getElementById('player');
    const recentlyPlayed = document.getElementById('recentlyPlayed');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const seekBar = document.getElementById('seekBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const playerSongInfo = document.querySelector('.player-song-info');

    hotTracksCard.addEventListener('click', () => {
        songListContainer.classList.toggle('d-none');
        likedSongsContainer.classList.add('d-none');
        displaySongList(hotTracks, 'songList');
        currentPlaylist = hotTracks;
    });

    likedSongsCard.addEventListener('click', () => {
        likedSongsContainer.classList.toggle('d-none');
        songListContainer.classList.add('d-none');
        displaySongList(likedSongs, 'likedSongsList');
        currentPlaylist = likedSongs;
    });

    recentlyPlayed.addEventListener('click', function() {
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'block';
            player.style.opacity = '0';
            player.style.transform = 'translateY(20px)';
            setTimeout(() => {
                player.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                player.style.opacity = '1';
                player.style.transform = 'translateY(0)';
            }, 10);
        } else {
            player.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
            player.style.opacity = '0';
            player.style.transform = 'translateY(20px)';
            setTimeout(() => {
                player.style.display = 'none';
            }, 300);
        }
    });

    function animateSongChange() {
        playerSongInfo.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        playerSongInfo.style.opacity = '0';
        playerSongInfo.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            updatePlayerInfo(currentPlaylist[currentSongIndex]);
            playerSongInfo.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
            playerSongInfo.style.opacity = '1';
            playerSongInfo.style.transform = 'translateY(0)';
        }, 300);
    }

    function animateProgressBar() {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBar.querySelector('.progress-bar').style.transition = 'width 0.1s linear';
        seekBar.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    playPauseBtn.addEventListener('click', () => {
        playPauseBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            playPauseBtn.style.transform = 'scale(1)';
        }, 200);
        togglePlayPause();
    });

    nextBtn.addEventListener('click', () => {
        nextBtn.style.transform = 'translateX(5px)';
        setTimeout(() => {
            nextBtn.style.transform = 'translateX(0)';
        }, 200);
        playNext();
    });

    prevBtn.addEventListener('click', () => {
        prevBtn.style.transform = 'translateX(-5px)';
        setTimeout(() => {
            prevBtn.style.transform = 'translateX(0)';
        }, 200);
        playPrevious();
    });

    shuffleBtn.addEventListener('click', () => {
        shuffleBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            shuffleBtn.style.transform = 'rotate(0deg)';
        }, 300);
        toggleShuffle();
    });

    seekBar.addEventListener('click', (e) => {
        const seekPosition = (e.offsetX / seekBar.offsetWidth) * audio.duration;
        audio.currentTime = seekPosition;
    });

    audio.addEventListener('timeupdate', () => {
        animateProgressBar();
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', playNext);

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    player.addEventListener('mousedown', startDragging);
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            player.style.display = player.style.display === 'none' ? 'block' : 'none';
        }
    });

    displaySongList(hotTracks, 'songList');
    displaySongList(likedSongs, 'likedSongsList');
});