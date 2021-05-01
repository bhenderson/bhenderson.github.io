import { EventEmitter } from "./eventEmitter.js"

class Player extends EventEmitter {
    /** @type {Track[]} */
    tracks = []
    currentTrack = null
    repeatAll = false
    // isPlaying = false

    get isPlaying() {
        for (const track of this.tracks) {
            if (track.playing) {
                return true
            }
        }
    }

    add(idx, el) {
        const track = this.tracks[idx] = new Track(el, idx)

        track.on('play', t => {
            this.currentTrack = t
            this.emit('play', t)
        })

        track.on('pause', t => {
            this.emit('pause', t)
        })

        track.on('ended', () => {
            this.playNext() || this.reset()
        })

        return track
    }

    play() {
        if (!this.currentTrack) this.reset()

        this.pause()

        return this.currentTrack.play()
    }

    pause() {
        for (const t of this.tracks) {
            t.pause()
        }
    }

    stop() {
        this.pause()

        this.reset()
    }

    playPause() {
        this.isPlaying ? this.pause() : this.play()
    }

    playNext() {
        this.currentTrack = this.nextTrack()
        
        !this.currentTrack && this.repeatAll && this.reset()

        if (!this.currentTrack) return

        return this.play()
    }

    nextTrack() {
        const currentIdx = this.tracks.indexOf(this.currentTrack)

        // loop over indexes for sparse arrays
        for (const idx in this.tracks) {
            if (currentIdx < idx) {
                return this.tracks[idx]
            }
        }
    }

    reset() {
        const isPlaying = this.isPlaying

        this.currentTrack = this.tracks[0]

        for (const t of this.tracks) {
            t.currentTime = 0
        }

        isPlaying && this.play()
    }

    toggleRepeat() {
        return this.repeatAll = !this.repeatAll
    }
}

class Track extends EventEmitter {
    /** @param {Player} player */
    constructor(elem, index) {
        super()

        /** @type {HTMLMediaElement} */
        this.elem = elem
        this.index = index

        this.init()
    }

    init() {
        console.log('track initialized', this.elem)

        this.listen('play')
        this.listen('pause')
        this.listen('ended')
    }

    play() {
        return this.elem.play()
    }

    pause() {
        this.elem.pause()
    }

    get paused() {
        return this.elem.paused
    }

    get ended() {
        return this.elem.ended
    }

    get readyState() {
        return this.elem.readyState
    }

    get playing() {
        return !this.paused && !this.ended && this.elem.readyState > this.elem.HAVE_CURRENT_DATA
    }

    get currentTime() {
        return this.elem.currentTime
    }

    set currentTime(t) {
        this.elem.currentTime = t
    }

    listen(type) {
        this.elem.addEventListener(type, this.handleEvent.bind(this, type))
    }

    handleEvent(type) {
        this.emit(type, this)
    }
}

export default Player