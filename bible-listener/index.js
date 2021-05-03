import passageSearch from './js/api.js'
import Player from './js/player.js'
import store from './js/store.js'
import VerseAudio from './js/verseAudio.js'

const { mapFields } = window['vuex-map-fields']

const App = {
    template: `
        <div class="container-fluid">
            <div class="row m-5">
                <div class="col">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="searchInput">
                        <button class="btn btn-outline-secondary" @click="submitForm">Enter</button>
                    </div>
                </div>
            </div>

            <div class="row m-5">
                <div class="col-lg col-sm-12">
                    <div class="input-group">
                        <span class="input-group-text">Rate</span>
                        <input type="number" max=16 min=.25 step=.25 class="form-control" id="rate" v-model="rate">
                    </div>
                </div>
                <div class="col-lg col-sm-12">
                    <button class="btn w-100 btn-outline-secondary" @click="playPause">{{ playPauseStatus }}</button>
                </div>
                <div class="col-lg col-sm-12">
                    <button class="btn w-100 btn-outline-secondary" @click="stop">Stop</button>
                </div>
                <div class="col-lg col-sm-12">
                    <button class="btn w-100" :class="repeatClass" @click="toggleRepeat">Repeat</button>
                </div>
            </div>

            <verse-audio v-for="(verse, idx) in verses" :verse="verse" @audio="player.add(idx, $event)"></verse-audio>

            <div v-if="passages">
                <pre style="white-space: break-spaces" v-for="passage of passages">{{ passage }}</pre>
            </div>
        </div>
    `,
    components: {
        'verse-audio': VerseAudio,
    },
    data() {
        return {
            passages: null,
            verses: [],
            playing: false,
        }
    },
    mounted() {
        this.player = new Player()

        this.player.setPlaybackRate(this.rate)
        this.player.setRepeat(this.repeat)

        this.player.on('play', () => { this.playing = true })
        this.player.on('pause', () => { this.playing = false })
    },
    computed: {
        ...mapFields([
            'searchInput',
            'repeat',
            'rate',
        ]),
        playPauseStatus() {
            return this.playing ? 'Pause' : 'Play';
        },
        repeatClass() {
            return {
                'btn-outline-secondary': !this.repeat,
                'btn-secondary': this.repeat,
            }
        },
    },
    watch: {
        rate(val) {
            this.player.setPlaybackRate(val)
        },
        repeat(val) {
            this.player.setRepeat(val)
        }
    },
    methods: {
        async submitForm() {
            const result = await passageSearch(this.searchInput)

            this.verses = []
            this.passages = result.passages

            for (const parsed of result.parsed) {
                for (let verse = parsed[0]; verse <= parsed[1]; verse++) {
                    this.verses.push(verse)
                }
            }
            console.log(result)
        },

        playPause() {
            this.player.playPause()
        },

        stop() {
            this.player.stop()
        },

        toggleRepeat() {
            this.repeat = !this.repeat
        }
    }
}

window.addEventListener('load', () => {
    Vue.createApp(App)
        .use(store)
        .mount('#app')
})