import { EventEmitter } from "./eventEmitter.js"

class Player extends EventEmitter {
    /** @type {Track[]} */
    tracks = []
    currentTrack = null
    repeatAll = false
    playbackRate = 1
    // isPlaying = false

    get isPlaying() {
        return !!this.find(t => t.playing)
    }

    set(prop, value) {
        this.find(t => {
            if (typeof t[prop] === 'function') {
                t[prop]()
            } else {
                t[prop] = value
            }
        })
    }

    find(cb) {
        // loop over indexes for sparse arrays
        for (const idx in this.tracks) {
            const t = this.tracks[idx]
            if (cb(t)) {
                return t
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

        track.playbackRate = this.playbackRate

        return track
    }

    remove(idx, el) {
        delete this.tracks[idx]
        console.log(this.tracks)
    }

    play() {
        if (!this.currentTrack) this.reset()

        this.pause()

        return this.currentTrack.play()
    }

    pause() {
        this.set('pause')
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
        const currentIdx = this.currentTrack.index

        return this.find(t => currentIdx < t.index && t)
    }

    reset() {
        const isPlaying = this.isPlaying

        this.currentTrack = this.find(t => t)

        this.set('currentTime', 0)

        isPlaying && this.play()
    }

    setRepeat(val) {
        return this.repeatAll = val
    }

    setPlaybackRate(rate) {
        this.playbackRate = rate

        this.set('playbackRate', rate)
    }
}

class Track extends EventEmitter {
    constructor(elem, index) {
        super()

        /** @type {HTMLMediaElement} */
        this.elem = elem
        this.index = index

        this.init()
    }

    init() {
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

    get playbackRate() {
        return this.elem.playbackRate
    }

    set playbackRate(r) {
        this.elem.playbackRate = r
    }

    listen(type) {
        this.elem.addEventListener(type, this.handleEvent.bind(this, type))
    }

    handleEvent(type) {
        this.emit(type, this)
    }
}

export default Player