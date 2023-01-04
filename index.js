/*
  1. Render song
  2. Scroll song
  3. Play / pause / seek
  4. CD rotate
  5. Next / prev
  6. Random
  7. Next / Repeat when ended
  8. Active song
  9. Scroll active song into view
  10. Play song when click
*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
  currentIndex: 0,
  isPLaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "My Love",
      singer: "Westlife",
      path: './assets/musics/song1.mp3',
      image: './assets/img/mylove.jpg'
    },
    {
      name: "Lemon Tree",
      singer: "Various artist",
      path: './assets/musics/song2.mp3',
      image: './assets/img/lemontree.jfif'
    },
    {
      name: "Reality",
      singer: "Lost Frequencies",
      path: './assets/musics/song3.mp3',
      image: './assets/img/reality.jpg'
    },
    {
      name: "Never Be Alone",
      singer: "TheFatRat",
      path: './assets/musics/song4.mp3',
      image: './assets/img/neverbealone.jpg'
    },
    {
      name: "Summertime",
      singer: "K-391",
      path: './assets/musics/song5.mp3',
      image: './assets/img/summertime.jpg'
    },
    {
      name: "Nothing Stopping Me",
      singer: "Vicetone",
      path: './assets/musics/song6.mp3',
      image: './assets/img/vicetone.jfif'
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
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
    playList.innerHTML = htmls.join('')
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth

    //Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000, //10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()
    //Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPLaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    //Khi song được play
    audio.onplay = function () {
      _this.isPLaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    //Khi song bị pause
    audio.onpause = function () {
      _this.isPLaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    //Khi song được thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    //Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }

    //Khi next song 
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.prevSong()
      }
      audio.play()
      _this.render()
    }

    //Xử lý random bật / tắt random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active', _this.isRandom)
    }

    //Xử lý repeat song khi audio ended
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }

    //Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }

    //Lắng nghe hành vi click vào play list
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      const songOptionNode = !e.target.closest('.option')

      if (songNode || !songOptionNode) {
        //Xử lý khi xử lý vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }
        //Xử lý khi click vào song option
      }
    }
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 300)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function () {
    //Định nghĩa các thuộc tính cho obj
    this.defineProperties()

    //Lắng nghe xử lý các sự kiện (DOM EVENTs)
    this.handleEvents()

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong()

    //Render playlist
    this.render()
  }
}
app.start()