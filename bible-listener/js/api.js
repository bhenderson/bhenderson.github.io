import fakeResponse from './fakeResponse.js'

window.fakeResponse = fakeResponse;

const options = {
    'include-passage-references': true,
    'include-verse-numbers': true,
    'include-first-verse-numbers': true,
    'include-footnotes': true,
    'include-footnote-body': true,
    'include-headings': true,
    'include-short-copyright': true,
    'include-copyright': false,
    'include-passage-horizontal-lines': false,
    'include-heading-horizontal-lines': false,
    'horizontal-line-length': 55,
    'include-selahs': true,
    'indent-using': 'space',
    'indent-paragraphs': 2,
    'indent-poetry': true,
    'indent-poetry-lines': 4,
    'indent-declares': 40,
    'indent-psalm-doxology': 30,
    'line-length': 0,
}

export function passageSearch(search) {
    // return Promise.resolve(fakeResponse)

    const params = new URLSearchParams({
        q: search,
        'include-short-copyright': false,
        'include-footnotes': false,
        'include-passage-references': false,
        'include-headings': false,
        'indent-paragraphs': 0,
    })

    const token = getToken()

    return fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
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