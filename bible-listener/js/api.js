import fakeResponse from './fakeResponse.js'

const TOKEN = getToken();

export function passageSearch(search) {
    // return Promise.resolve(fakeResponse)

    search = encodeURIComponent(search)

    return fetch(`https://api.esv.org/v3/passage/text/?q=${search}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${TOKEN}`,
        }
    }).then(resp => resp.json())
}

export function audioURL(ref) {
    return `https://audio.esv.org/hw/${ref}.mp3`
}

function getToken() {
    const key = 'ESV_API_TOKEN'
    const token = localStorage.getItem(key) || prompt('ESV API Token:')
    localStorage.setItem(key, token)

    return token
}

export default passageSearch