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
        // Move to the next word if Enter is pressed and word length is 5
        prevTile += 5;
        word = '';
    }
    console.log(word + ' : ' + currTile);
});