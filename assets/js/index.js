const buttons = document.querySelectorAll('.btn');
const deleteBtn = document.querySelector('.btn-del');
const enterBtn = document.querySelector('.btn-enter');
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
let currTile = 0;
let prevTile = 0;
let word = '';
let wordOfDay = '';

// Handle letter input using on-screen keyboard
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        letterInput(btn.innerText.toLowerCase());
    })
})

// Handle 'backspace' when using on-screen keyboard
deleteBtn.addEventListener('click', () => {
    let input = 'Backspace';
    letterInput(input);
})

// Handle 'enter' when using on-screen keyboard
enterBtn.addEventListener('click', () => {
    let input = 'Enter';
    letterInput(input);
})

// Handle keystroke
document.addEventListener('keydown', (e) => {
    let letter = e.key;
    letterInput(letter)
})

// Async function to fetch the word of the day
async function getWord() {
    try {
        // Send a GET request to the word of the day API and wait for the response
        const promise = await fetch(WORD_URL);
        // Parse the response as JSON and store it in the 'wordOfDay' variable
        const response = await promise.json();
        wordOfDay = response.word
    } catch (err) {
        alert(err);
    }
};

// Invoke the 'getWord' function to start fetching the word of the day
getWord();

// fetch call to check if user inputted word is valid
async function validateWord(input) {
    try {
        toggleSpinner()
        const response = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: input
            })
        });
        const data = await response.json();
        toggleSpinner()
        const result = data.validWord;
        if (result === false) {
            invalidWord()
        }
        return result;
    } catch (err) {
        alert(err);
    };
};

// If invalid word, add the class 'wrong' indicating to user word is invalid
function invalidWord() {
    for (let i = currTile - 5; i < currTile; i++) {
        document.getElementById('letter-' + i).classList.add('wrong');
        setTimeout(() => {
            document.getElementById('letter-' + i).classList.remove('wrong');
        }, 500)
    }
}

// Toggle spinner visibility
function toggleSpinner() {
    document.getElementById('spinner').classList.toggle('active');
}

// Handle wrong keystroke, checks if keystroke is single letter
function isLetter(letter) {
    return /^[A-Za-z]$/.test(letter);
};

// Compares user input to word of the day, and handles win/lose conditions
function checkWord(word1, word2) {
    setTimeout(function () {
        if (word1 === word2) {
            return alert('you win! :)');
        } else if (currTile === 30) {
            return alert('you lose, the word was ' + word2 + '.');
        };
    }, 200);
};

// Handle the guess's correct letter in the correct space (the green squares)
function greenLetter(word) {
    for (let i = 0; i < 5; i++) {
        if (word[i] === wordOfDay[i]) {
            let greenTile = currTile - (5 - i)
            document.getElementById('letter-' + greenTile).classList.add('green');
            document.getElementById('key-' + word[i]).classList.add('green');
        }
    }
};

// Handle the yellow letters (correct letters but wrong space)
function yellowLetter(word) {
    let yellowLetters = [];

    for (let i = 0; i < 5; i++) {
        // YellowTile gives position of tile to be changed to yellow
        let yellowTile = currTile - (5 - word.indexOf(word[i]));

        if (wordOfDay.includes(word[i]) && !yellowLetters.includes(`${word[i]}:${yellowTile}`)) {
            yellowLetters.push(`${word[i]}:${yellowTile}`)
            ifGreenTile(word[i])
            addTileColor(yellowTile, word[i])
        }
    }
};

// Handle tile color change to yellow
function addTileColor(tileIndex, letter) {
    let elementOne = document.getElementById('letter-' + tileIndex).classList;
    let keyElement = document.getElementById('key-' + letter).classList;
    if (elementOne.contains('green') || ifGreenTile(letter) || keyElement.contains('green')) {
        return
    } else {
        elementOne.add('yellow');
        keyElement.add('yellow');
    }
};

// Checks if current word already has the same letter with green tile, if so return true
function ifGreenTile(letter) {
    let result = false;
    for (let j = 0; j < 5; j++) {
        let elementTwo = document.getElementById('letter-' + (currTile - (5 - j)));

        if (elementTwo.classList.contains('green') && elementTwo.innerHTML == letter) {
            result = true;
            break;
        }
    }
    return result;
}

// Changes tile color to grey if letter is not in word
function greyLetter() {
    for (let k = 0; k < 5; k++) {
        let greyTile = document.getElementById('letter-' + (currTile - (5 - k)));

        if (!greyTile.classList.contains('green') && !greyTile.classList.contains('yellow')) {
            greyTile.classList.add('grey');
            document.getElementById('key-' + greyTile.innerHTML).classList.add('grey');
        }
    }
}

// Handle letter input
async function letterInput(event) {
    if (isLetter(event) && word.length < 5) {
        // Set pressed key as the content of the current tile, add letter to word variable and update current tile variable
        document.getElementById('letter-' + currTile).innerHTML = event;
        word += event;
        currTile += 1;
    } else if (event === 'Backspace' && currTile > 0 && currTile > prevTile) {
        // Remove the content of the previous tile if backspace is pressed
        currTile -= 1;
        document.getElementById('letter-' + currTile).innerHTML = '';
        word = word.slice(0, -1);
    } else if (event === 'Enter' && word.length === 5 && await validateWord(word)) {
        greenLetter(word);
        yellowLetter(word);
        greyLetter();
        checkWord(word, wordOfDay);
        // Move to the next word if Enter is pressed and word length is 5
        prevTile += 5;
        word = '';
    }
};