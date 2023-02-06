const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
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


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
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

    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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
        $('.playlist').innerHTML = htmls.join('')
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
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg'}
        ],{
            duration : 10000, // 10s
            interation: Infinity,
        })
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
        }
        // khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            
            audio.play();
        }
        // khi random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
    },
    loadCurrentSong: function() {      
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path      
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
        // dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // lang nghe / xu ly cac su kien ( DOM event)
        this.handleEvents()
        // tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        // Render playlist
        this.render()
    }
}
app.start()