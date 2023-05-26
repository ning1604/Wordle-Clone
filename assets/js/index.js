let currTile = 0;
let prevTile = 0;
let word = '';
let wordOfDay = '';

// Define the URL for the word of the day API
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

// Async function to fetch the word of the day
async function getWord() {
    try {
        // Send a GET request to the word of the day API and wait for the response
        const promise = await fetch(WORD_URL);
        // Parse the response as JSON and store it in the 'wordOfDay' variable
        const response = await promise.json();
        wordOfDay = response.word
        console.log(response.word);
    } catch (err) {
        alert(err);
    }
};

// Invoke the 'getWord' function to start fetching the word of the day
getWord();

// Handle wrong keystroke, checks if keystroke is letter
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
    }, 100);
};

// Handle the guess's correct letter in the correct space (the green squares)
function greenLetter(word) {
    for (let i = 0; i < 5; i++) {
        if (word[i] === wordOfDay[i]) {
            let greenTile = currTile - (5 - i)
            document.getElementById('letter-' + greenTile).classList.add('green');
        }
    }
};

// Handle the yellow letters (correct letters but wrong space)
function yellowLetter(word) {
    let yellowLetters = [];

    for (let i = 0; i < 5; i++) {
        // yellowTile gives position of tile to be changed to yellow
        let yellowTile = currTile - (5 - word.indexOf(word[i]));

        if (wordOfDay.includes(word[i]) && !yellowLetters.includes(`${word[i]}:${yellowTile}`)) {
            yellowLetters.push(`${word[i]}:${yellowTile}`)
            ifGreenTile(word[i])
            addTileColor(yellowTile, word[i])
        };
    };
    console.log(yellowLetters);
};

// Handle color of tile
function addTileColor(tileIndex, letter) {
    let elementOne = document.getElementById('letter-' + tileIndex).classList;
    if (elementOne.contains('green') || ifGreenTile(letter)) {
        return
    } else {
        elementOne.add('yellow');
    }
};

// Checks if current word already has green tile, if so return true
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
        }
    }
}

// Handle keystroke
document.addEventListener('keydown', (event) => {
    if (isLetter(event.key) && word.length < 5) {
        // Set pressed key as the content of the current tile
        document.getElementById('letter-' + currTile).innerHTML = event.key;
        word += event.key;
        currTile += 1;
    } else if (event.key === 'Backspace' && currTile > 0 && currTile > prevTile) {
        // Remove the content of the previous tile if backspace is pressed
        currTile -= 1;
        document.getElementById('letter-' + currTile).innerHTML = '';
        word = word.slice(0, -1);
    } else if (event.key === 'Enter' && word.length === 5) {
        greenLetter(word);
        yellowLetter(word);
        greyLetter();
        checkWord(word, wordOfDay);
        // Move to the next word if Enter is pressed and word length is 5
        prevTile += 5;
        word = '';
    }
    console.log(word + ' : ' + currTile);
});