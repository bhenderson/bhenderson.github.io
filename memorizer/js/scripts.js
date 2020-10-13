function isWord(word) {
  return word && word.length &&  word.match(/[a-z]/i)
}

function next() {
  const words = Array.from(document.querySelectorAll('.word'))

  return (event) => {
    if (event.type === 'keypress' && event.code !== 'Space') return
    event.preventDefault()

    const word = words.shift()

    word.innerText = word.dataset.original
  }
}

function save() {
  document.getElementById('form').style.display = "none"
  const text = document.getElementById('input').value

  localStorage.setItem('text', text)

  generate(text)
}

function generate(text) {
  const div = document.getElementById('main')

  text.split(/\n/).forEach(sentence => {
    sentence.split(/\b/).forEach(word => {
      const newSpan = document.createElement('span')

      if (isWord(word)) {
        newSpan.classList.add('word')

        newSpan.dataset.original = word

        word = word.substr(0, 1) +
           word.substr(1).replaceAll(/./g, '_')
      }

      newSpan.append(word)

      div.appendChild(newSpan);
    })

    div.appendChild(document.createElement('br'))
  })

  const listener = next()
  document.addEventListener('keypress', listener)
  document.addEventListener('mousedown', listener)
  //document.addEventListener('touchstart', listener)
}

function main() {
  document.getElementById('input').value = localStorage.getItem('text')
}

main()
