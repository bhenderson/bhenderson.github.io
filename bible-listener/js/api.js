import fakeResponse from './fakeResponse.js'

const TOKEN = '';

function Api(search) {
    search = encodeURIComponent(search)

    return Promise.resolve(fakeResponse)

    return fetch(`https://api.esv.org/v3/passage/text/?q=${search}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${TOKEN}`,
        }
    }).then(resp => resp.json())
}

export default Api