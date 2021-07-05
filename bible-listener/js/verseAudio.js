import { audioURL } from './api.js'

export default {
    template: `
        <div class="verse-text">
            <audio :src="url" ref="audio"></audio>
            <span class="verse-text">
                {{verseText}}
            </span>
            <div class="progress" style="height: 5px">
                <div class="progress-bar" role="progressbar" :style="{width: progress + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    `,
    data() {
        return {
            progress: 0,
        }
    },
    computed: {
        url() {
            return audioURL(this.verse.ref);
        },

        verseText() {
            return this.firstLetters ? this.verse.firstLetters : this.verse.text
        },
    },
    props: {
        verse: null,
        firstLetters: false,
        player: null,
        index: null,
    },
    mounted() {
        // this.$emit('audio', this.$refs.audio)
        this.player.add(this.verse.ref, this.$refs.audio)
        this.listen('timeupdate', $e => this.updateProgress($e))
        this.listen('ended', $e => this.revertProgress($e))
    },
    unmounted() {
        this.player.remove(this.verse.ref, this.$refs.audio)
    },
    methods: {
        listen(type, listener) {
            this.$refs.audio.addEventListener(type, listener)
        },

        updateProgress($event) {
            const time = $event.target.currentTime
            const duration = $event.target.duration

            this.progress = time / duration * 100 * 1.2
        },

        revertProgress($event) {
            this.progress = 0;
        },
    },
}