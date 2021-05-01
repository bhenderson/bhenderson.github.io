import { EventEmitter } from "./eventEmitter.js"

class Player extends EventEmitter {
    tracks = []
    currentTrack = null
    repeatAll = false
    isPlaying = false

    // get isPlaying() {
    //     if (!this.currentTrack) {
    //         return false;
    //     }

    //     console.log('yooooooooo isPlaying', this.currentTrack, this.currentTrack.playing)
    //     return this.currentTrack.playing
    // }

    add(idx, el) {
        const track = this.tracks[idx] = new Track(idx, el, this)

        // first
        if (!this.currentTrack) this.currentTrack = track

        track.on('play', t => {
            this.currentTrack = t
            this.isPlaying = true
            this.emit('play', t)
        })

        track.on('pause', t => {
            this.isPlaying = false
            this.emit('pause', t)
        })

        track.on('ended', () => {
            this.playNext() || this.reset()
        })

        return track
    }

    play() {
        if (!this.currentTrack) return

        this.currentTrack.play()
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

        if (!this.currentTrack) return

        this.play()
    }

    nextTrack() {
        const track = this.currentTrack

        for (const idx of Object.keys(this.tracks)) {
            if (track.index < idx) {
                return this.tracks[idx]
            }
        }
    }

    reset() {
        const isPlaying = this.isPlaying

        this.currentTrack = this.tracks[0]

        isPlaying && this.play()
    }
}

class Track extends EventEmitter {
    /** @param {Player} player */
    constructor(idx, elem, player) {
        super()

        this.index = idx
        /** @type {HTMLMediaElement} */
        this.elem = elem
        /** @type {Player} */
        this.player = player

        this.init(elem)
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
        return this.elem.pause()
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

    listen(type) {
        this.elem.addEventListener(type, this.handleEvent.bind(this, type))
    }

    handleEvent(type) {
        this.emit(type, this)
    }
}

export default Player