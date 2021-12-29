import * as api from './js/api.js'
import Player from './js/player.js'
import store from './js/store.js'
import VerseAudio from './js/verseAudio.js'

const { mapFields } = window['vuex-map-fields']

const App = {
    template: `
        <div class="container mb-3">
            <div class="row my-5">
                <div class="col input-group">
                    <button class="btn btn-outline-secondary d-none d-lg-block" @click="navigateTo('prev_chapter')">
                        <i class="bi bi-chevron-double-left"></i>
                    </button>
                    <button class="btn btn-outline-secondary d-none d-lg-block" @click="navigateTo('prev_verse')">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="btn btn-outline-secondary d-none d-lg-block" @click="navigateTo('chapter_start')">
                        Chapter
                    </button>

                    <input type="text" class="form-control" v-model="searchInput" @blur="submitForm()">

                    <button class="btn btn-outline-secondary d-none d-lg-block" @click="navigateTo('next_verse')">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="btn btn-outline-secondary d-none d-lg-block" @click="navigateTo('next_chapter')">
                        <i class="bi bi-chevron-double-right"></i>
                    </button>
                    <button class="btn btn-outline-secondary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sm-menu">
                        <i class="bi bi-list"></i>
                    </button>
                </div>
            </div>

            <div class="offcanvas offcanvas-bottom" id="sm-menu">
                <div class="offcanvas-body">
                    <div class="row">
                        <div class="col input-group">
                            <input type="number" max=16 min=.25 step=.25 class="form-control" id="rate" v-model="rate">
                            <button class="btn btn-outline-secondary" @click="playPause"><i :class="playPauseIconClass"/></button>
                            <button class="btn btn-outline-secondary" @click="stop"><i class="bi bi-stop"/></button>
                            <button class="btn btn-outline-secondary" :class="{active: repeat}" @click="toggleRepeat"><i class="bi bi-arrow-repeat"/></button>
                            <button class="btn btn-outline-secondary" :class="{active: firstLetters}" @click="toggleFirstLetters">_</button>
                        </div>
                    </div>

                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                <verse-audio :verse="verse" :firstLetters="firstLetters" :player="player" :index="idx"></verse-audio>
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

            <a href="#" role="button" @click="addApiToken(true)">reset api token</a>
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
    beforeMount() {
        this.addApiToken()
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
            'apiToken',
        ]),
        playPauseStatus() {
            return this.playing ? 'Pause' : 'Play';
        },
        playPauseIconClass() {
            return {
                bi: true,
                "bi-play": !this.playing,
                "bi-pause": this.playing,
            }
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
            this.result = await api.passageSearch(search || this.searchInput)

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
        },
        addApiToken(force=false) {
            if (force || !this.apiToken) {
                // cancel shouldn't reset the token.
                this.apiToken = window.prompt('Enter API Token:', this.apiToken) || this.apiToken
            }

            api.setToken(this.apiToken)
            return false;
        },
    }
}

window.addEventListener('load', () => {
    Vue.createApp(App)
        .use(store)
        .mount('#app')
})