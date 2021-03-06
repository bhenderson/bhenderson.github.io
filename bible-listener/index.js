import passageSearch from './js/api.js'
import Player from './js/player.js'
import store from './js/store.js'
import VerseAudio from './js/verseAudio.js'

const { mapFields } = window['vuex-map-fields']

const App = {
    template: `
        <div class="container">
            <div class="row my-5">
                <div class="col input-group">
                    <button class="btn btn-outline-secondary" @click="navigateTo('prev_chapter')">
                        <i class="bi bi-chevron-double-left"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="navigateTo('prev_verse')">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="navigateTo('chapter_start')">
                        Chapter
                    </button>

                    <input type="text" class="form-control" v-model="searchInput" @blur="submitForm()">

                    <button class="btn btn-outline-secondary" @click="navigateTo('next_verse')">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="navigateTo('next_chapter')">
                        <i class="bi bi-chevron-double-right"></i>
                    </button>
                </div>
            </div>

            <div class="row my-5">
                <div class="col-lg col-12">
                    <div class="input-group">
                        <span class="input-group-text">Rate</span>
                        <input type="number" max=16 min=.25 step=.25 class="form-control" id="rate" v-model="rate">
                    </div>
                </div>
                <div class="col-lg col-12">
                    <button class="btn w-100 btn-outline-secondary" @click="playPause">{{ playPauseStatus }}</button>
                </div>
                <div class="col-lg col-12">
                    <button class="btn w-100 btn-outline-secondary" @click="stop">Stop</button>
                </div>
                <div class="col-lg col-12">
                    <button class="btn w-100 btn-outline-secondary" :class="{active: repeat}" @click="toggleRepeat">Repeat</button>
                </div>
                <div class="col-lg col-12">
                    <button class="btn w-100 btn-outline-secondary" :class="{active: firstLetters}" @click="toggleFirstLetters">First Letters</button>
                </div>
            </div>

            <div v-for="(verse, idx) in verses" class="row my-3">
                <verse-audio :verse="verse" :firstLetters="firstLetters" @audio="player.add(idx, $event)"></verse-audio>
            </div>

            <div v-if="passages">
                <pre style="white-space: break-spaces" v-for="passage of passages">{{ passage }}</pre>
            </div>

            <footer>
            Scripture quotations are from the ESV® Bible (The Holy Bible,
            English Standard Version®), copyright © 2001 by Crossway, a
            publishing ministry of Good News Publishers.  Used by permission.
            All rights reserved.  You may not copy or download more than 500
            consecutive verses of the ESV Bible or more than one half of any
            book of the ESV Bible.
            </footer>
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

        if (this.searchInput) this.submitForm()
    },
    computed: {
        ...mapFields([
            'searchInput',
            'repeat',
            'rate',
            'firstLetters',
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
        async submitForm(search) {
            this.result = await passageSearch(search || this.searchInput)

            this.verses = []
            this.searchInput = this.result.canonical
            const passages = this.result
                .passages
                .join('')
                .split(/(?=\[\d+])/)
                .map(s => s
                    .trim()
                    .replace(/\s+/sg, ' ')
                )

            for (const parsed of this.result.parsed) {
                for (let ref = parsed[0]; ref <= parsed[1]; ref++) {
                    const text = passages.shift()
                    const firstLetters = this.makeFirstLetters(text)
                    this.verses.push({ref, text, firstLetters})
                }
            }
        },

        playPause() {
            this.player.playPause()
        },

        stop() {
            this.player.stop()
        },

        toggleRepeat() {
            this.repeat = !this.repeat
        },

        toggleFirstLetters() {
            this.firstLetters = !this.firstLetters
        },

        makeFirstLetters(text) {
            return text.replace(/(?!\b)[a-zA-Z]/g, '_')
        },

        navigateTo(section) {
            let search = this.result?.passage_meta?.[0]?.[section]

            if (!search) {
                return
            }

            if (Array.isArray(search)) {
                search = search.join('-')
            }

            this.submitForm(search)
        }
    }
}

window.addEventListener('load', () => {
    Vue.createApp(App)
        .use(store)
        .mount('#app')
})