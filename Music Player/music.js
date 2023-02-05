const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');

const app = {
    currentIndex: 0,
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
       {
        name: 'Move Your Body',
        singer: 'Sia',
        path: './assets/music/song3.mp3',
        image: './assets/img/song3.jpg'
       },
       {
        name: 'Alone',
        singer: 'Alan Walker',
        path: './assets/music/song3.mp3',
        image: './assets/img/song1.jpg'
       },
       {
        name: 'Monody',
        singer: 'TheFatRat',
        path: './assets/music/song3.mp3',
        image: './assets/img/song1.jpg'
       },
       {
        name: 'Monody',
        singer: 'TheFatRat',
        path: './assets/music/song3.mp3',
        image: './assets/img/song1.jpg'
       }


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
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
    },
    loadCurrenSong: function() {
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        console.log(heading, cdThumb, audio)
    },
    start: function() {
        // dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // lang nghe / xu ly cac su kien ( DOM event)
        this.handleEvents()
        // tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrenSong()
        // Render playlist
        this.render()
    }
}
app.start()