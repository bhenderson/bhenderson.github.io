import Api from './js/api.js'
import VerseAudio from './js/verseAudio.js'

const App = {
    components: {
        'verse-audio': VerseAudio,
    },
    data() {
        return {
            searchInput: '',
            passages: null,
            verses: [],
        }
    },
    methods: {
        async submitForm() {
            const result = await Api(this.searchInput)

            this.passages = result.passages

            for (const parsed of result.parsed) {
                for (let verse = parsed[0]; verse <= parsed[1]; verse++) {
                    this.verses.push(verse)
                }
            }
            console.log(result)
        }
    }
}

window.addEventListener('load', () => {
    Vue.createApp(App).mount('#app')
})