const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,    
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
       {
        name: 'Nevada',
        singer: 'Vicetone',
        path: './assets/music/song1.mp3',
        image: './assets/img/song1.jpg'
       },
       {
        name: 'SummerTime',
        singer: 'K-391',
        path: './assets/music/song2.mp3',
        image: './assets/img/song2.jpg'
       },
    //    {
    //     name: 'Move Your Body',
    //     singer: 'Sia',
    //     path: './assets/music/song3.mp3',
    //     image: './assets/img/song3.jpg'
    //    },
    //    {
    //     name: 'Alone',
    //     singer: 'Alan Walker',
    //     path: './assets/music/song3.mp3',
    //     image: './assets/img/song1.jpg'
    //    },
    //    {
    //     name: 'Monody',
    //     singer: 'TheFatRat',
    //     path: './assets/music/song3.mp3',
    //     image: './assets/img/song1.jpg'
    //    },
    //    {
    //     name: 'Monody',
    //     singer: 'TheFatRat',
    //     path: './assets/music/song3.mp3',
    //     image: './assets/img/song1.jpg'
    //    }
        {
        name: 'Nevada',
        singer: 'Vicetone',
        path: './assets/music/song1.mp3',
        image: './assets/img/song1.jpg'
       },
       {
        name: 'SummerTime',
        singer: 'K-391',
        path: './assets/music/song2.mp3',
        image: './assets/img/song2.jpg'
       },
       {
        name: 'Nevada',
        singer: 'Vicetone',
        path: './assets/music/song1.mp3',
        image: './assets/img/song1.jpg'
       },
       {
        name: 'SummerTime',
        singer: 'K-391',
        path: './assets/music/song2.mp3',
        image: './assets/img/song2.jpg'
       },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                 </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // xu ly CD quay va dung
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg'}],{
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();
                
        //phong to thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {               
                audio.pause();              
            } else {               
                audio.play();               
            } 
                   
        }
        // khi song dc play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        // khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // xu ly khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }           
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }
        // khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()


        }
        // khi random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // xu ly lap lai 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        // xu ly next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }
        // lang nghe click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active')
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function() {      
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path      
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex <0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // gan cau hinh tu config vao ung dung
        this.loadConfig()
        // dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // lang nghe / xu ly cac su kien ( DOM event)
        this.handleEvents()
        // tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        // Render playlist
        this.render()
        // hien thi trang thai ban dau cua button repeat va radom
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)

    }
}
app.start()