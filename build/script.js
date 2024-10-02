import { WORDS} from "./words.js";

const no_of_guesses =  6;
let guesses_remaining = no_of_guesses;
let current_guess = [];
let next_letter = 0;
let answer = WORDS[Math.floor(Math.random()*WORDS.length)];
console.log(answer);

function board(){
    let board = document.getElementById("gameboard");
    for (let i = 0; i < no_of_guesses; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 5; j++){
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function shadeKeyboard(letter, colour){
    for(const elem of document.getElementsByClassName("keyboard-button")){
        if (elem.textContent.toLowerCase() === letter.toLowerCase()){
            let oldColour = elem.style.backgroundColor;
            console.log(oldColour);
            if (oldColour == 'rgb(148, 219, 132)') {
                return;
            }
            if (oldColour == 'rgb(250, 240, 137)' && colour !== 'rgb(148, 219, 132)'){
                return;
            }
            elem.style.backgroundColor = colour;
            break;  
        }
    } 
}

function insertLetter(pressedKey){
    if (next_letter === 5){
        return;
    }
    pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guesses_remaining];
    let box = row.children[next_letter];
    box.textContent = pressedKey;
    box.classList.add('filled-box');
    current_guess.push(pressedKey);
    next_letter += 1;
}

function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[6 - guesses_remaining];
    let box = row.children[next_letter - 1];
    box.textContent = "";
    current_guess.pop();
    next_letter -= 1;
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guesses_remaining];
    let guessString =  "";
    let rightGuess = Array.from(answer);

    for (const val of current_guess){
        guessString += val;
    }

    if (guessString.length != 5) {
        alert("Not enough letters!");
        return;
    }
    if (!WORDS.includes(guessString)){
        alert("Word not in dictionary");
        return;
    }

    for (let i = 0; i < 5; i++){
        let letterColour = "";
        let box = row.children[i];
        let letter = current_guess[i];
        let letterPosition = rightGuess.indexOf(current_guess[i]);

        if (letterPosition === -1){
            letterColour = 'rgb(143, 145, 148)';
        } else {
            if (current_guess[i] === rightGuess[i]){
                letterColour = 'rgb(148, 219, 132)';
            } else {
                letterColour = 'rgb(250, 240, 137)';
            }
            rightGuess[letterPosition] = "#";
        }
        let delay = 250 * i;

        setTimeout(()=> {
            box.style.backgroundColor = letterColour;
            shadeKeyboard(letter, letterColour);
        }, delay);
    }
    if (guessString === answer){
        guesses_remaining = 0;
        alert("Correct, you win!");
        return;
    } else {
        guesses_remaining -=1;
        current_guess = [];
        next_letter = 0;
    }  
    if (guesses_remaining === 0){
        alert("You've run out of guesses. Game Over");
        alert(`"The right answer was ${answer}"`);
    }   
}

document.addEventListener("keyup", (e) => {
    if(guesses_remaining === 0){
        return;
    }
    let pressedKey = String(e.key);

    if (pressedKey === "Backspace" && next_letter !== 0){
        deleteLetter();
        return;
    }
    if (pressedKey === "Enter"){
        checkGuess();
        return;
    }
    let found = pressedKey.match(/[a-z]/gi);

    if (!found || found.length > 1){
        return;
    }else {
        insertLetter(pressedKey);
    }
});

document.getElementById("keyboard-container").addEventListener("click", (e)=>{
    const target = e.target;
    if(!target.classList.contains("keyboard-button")){
        return;
    }
    let key = target.textContent;
    if (key === "DELETE"){
        key = "Backspace";
    }
    if (key === "ENTER"){
        key = "Enter";
    }
    document.dispatchEvent(new KeyboardEvent("keyup", {key: key}));
});

board();