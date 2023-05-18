let currentTileCount = 0;
let submitted = true;


document.addEventListener('keydown', (event) => {
    let regEx = /^[A-Za-z]+$/;
    const rows = [5, 10, 15, 20, 25];

    // if current row is incomplete, allow user to type in letters or use backspace to delete last letter.
    if (submitted || event.key.toLowerCase() === 'backspace') {
        if (event.key.toLowerCase() === 'backspace' && currentTileCount !== 0) {
            currentTileCount -= 1;
            document.getElementById('letter-' + currentTileCount).innerHTML = '';
        } else if (event.key.match(regEx) && event.key.length == 1) {
            document.getElementById('letter-' + currentTileCount).innerHTML = event.key;
            currentTileCount += 1;
        }
        console.log(currentTileCount)
    } else {
        console.log(currentTileCount)
    }

    // if current row is finished, disable user from typing in next row.
    if (rows.includes(currentTileCount)) {
        submitted = false;
    } else {
        submitted = true;
    }


    // lets user submit input and type in next row.
    if (event.key.toLowerCase() === 'enter' && !submitted) {
        submitted = true;
    }

    // once a row is submitted user cannot go back to that row

});