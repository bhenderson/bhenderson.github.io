export default {
    template:
    /*html*/
    `
    <div>
        <audio controls v-bind:src="url"></audio>
    </div>
    `,
    data() {
        return {
        }
    },
    computed: {
        url() {
            return `https://audio.esv.org/hw/${this.verse}.mp3`
        },
    },
    props: {
        verse: null,
    }
}