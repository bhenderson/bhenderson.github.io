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
    },
    mounted() {
        this.$emit('audio', this.$refs.audio)
    }
}