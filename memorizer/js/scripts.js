const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function isWord(word) {
  return word && word.length &&  word.match(/[a-z]/i)
}

function next(event) {
  if (event.type === 'keypress' && event.code !== 'Space') return
  event.preventDefault()

  const word = $('.word.blank')

  if (word) show(word)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    [array[i], array[j]] = [array[j], array[i]];
  }
}

function reset() {
  const words = Array.from($$('.word'))
  const level = Number( $('#level').value )

  shuffle(words)

  for (let i = 0; i<words.length; i++) {
    const isHide = i % 5 < level
    const word = words[i]

    isHide ? hide(word) : show(word)
  }
}

function show(word) {
  word.innerText = word.dataset.original
  word.classList.remove('blank')
}

function hide(word) {
  word.innerText = word.dataset.hidden
  word.classList.add('blank')
}

function save() {
  $('#form').style.display = "none"
  const text = $('#input').value

  localStorage.setItem('text', text)

  generate(text)

  reset()
}

function generate(text) {
  const div = $('#main')

  text.split(/\n/).forEach(sentence => {
    sentence.split(/\b/).forEach(word => {
      const newSpan = document.createElement('span')

      if (isWord(word)) {
        newSpan.classList.add('word')

        newSpan.dataset.original = word

        newSpan.dataset.hidden = word.substr(0, 1) +
           word.substr(1).replaceAll(/./g, '_')
      }

      newSpan.append(word)

      div.appendChild(newSpan);
    })

    div.appendChild(document.createElement('br'))
  })

  document.addEventListener('keypress', next)
  div.addEventListener('mousedown', next)
  //document.addEventListener('touchstart', listener)
}

function levelChange(num) {
  const el = $('#level')
  const value = Number(el.value)
  const newVal = Math.min( Math.max( value + num, 0 ), 5 )

  el.value = newVal

  if (value !== newVal) reset()
}

function main() {
  $('#input').value = localStorage.getItem('text')
}

main()
