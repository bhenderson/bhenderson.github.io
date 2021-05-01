import { audioURL } from './api.js'

export default {
    template: `
        <div>
            <audio controls :src="url" ref="audio"></audio>
        </div>
    `,
    data() {
        return {}
    },
    computed: {
        url() {
            return audioURL(this.verse);
        },
    },
    props: {
        verse: null,
        player: null,
        index: null,
    },
    mounted() {
        if (this.player) this.player.add(this.index, this.$refs.audio)
    }
}