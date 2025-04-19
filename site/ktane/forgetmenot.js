const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const INDICATORS = ["SND", "CLR", "CAR", "IND", "FRQ", "SIG", "NSA", "MSA", "TRN", "BOB", "FRK"];
const PORTS = [["Serial", "Parallel"], ["DVI-D", "RJ-45", "PS/2", "Stereo RCA"]];
const PORTS_SHORTEN = {
    "Serial": "se",
    "Parallel": "pa",
    "DVI-D": "DV",
    "RJ-45": "RJ",
    "PS/2": "PS",
    "Stereo RCA": "RC"
};

function rInt(possibilities) {
    return Math.floor(Math.random() * possibilities);
}

let timeStarted;
let timeElapsed;
let timeAtTwo;

// always
let serial;
let batteries;
let holders;
let indicators;
let unlits;
let lits;
let plates;
let ports;
// variable
let strikes;

let digits;
let digitsSinceStrike;
let lastStrike;
// specific boss
let largestDigit;
let smallestOddDigit;

function generateBomb() {
    console.log("New bomb")
    timeStarted = Date.now();
    timeAtTwo = Date.now();
    
    serial = CHARACTERS[rInt(36)] + CHARACTERS[rInt(36)] + DIGITS[rInt(10)] + LETTERS[rInt(26)] + LETTERS[rInt(26)] + DIGITS[rInt(10)];
    batteries = 0;
    holders = 0;
    indicators = [];
    unlits = 0;
    lits = 0;
    plates = [];
    ports = [];

    strikes = 0;

    digits = 0;
    digitsSinceStrike = 0;
    lastStrike = 0;

    largestDigit = 0;
    smallestOddDigit = 9;

    serial.split('').forEach(char=>{
        let digit = parseInt(char);
        if (digit) {
            largestDigit = Math.max(largestDigit, digit);
            if (digit % 2 == 1) smallestOddDigit = Math.min(smallestOddDigit, digit);
        }
    })

    let availableIndicators = INDICATORS.slice();
    for (let i = 0; i < 5; i++) {
        switch (rInt(3)) {
            case 0:
                batteries += rInt(2) + 1;
                holders += 1;
                break;
            case 1:
                let indInd = rInt(availableIndicators.length);
                let thisIndicator = availableIndicators[indInd];
                if (rInt(5) < 2) {
                    thisIndicator = thisIndicator.toLowerCase();
                    unlits += 1;
                } else {
                    lits += 1;
                }
                indicators.push(thisIndicator);
                availableIndicators.splice(indInd, 1);
                break;
            case 2:
                let thisPlate = [];
                PORTS[rInt(2)].forEach((port)=>{
                    if (rInt(2)) {
                        thisPlate.push(port);
                        if (!ports.includes(port)) ports.push(port);
                    }
                });
                plates.push(thisPlate);
                break;
        }
    }

    document.querySelector("#edgework").innerHTML = `
    <tbody>
        <tr>
            <th>Serial</th>
            ${batteries?'<th><u title="battery count / holder count">Batteries</u></th>':''}
            ${indicators.length?`<th colspan="${indicators.length}"><u title="upper: lit; lower: unlit">Indicators</u></th>`:''}
            ${plates.length?`<th colspan="${plates.length}"><u title="[] contains a port plate; ports abbreviated to first two letters">Port Plates</u></th>`:''}
        </tr>
        <tr>
            <td>${serial}</td>
            ${batteries?`<td>${batteries}/${holders}</td>`:''}
            ${indicators.map(indicator=>`<td>${indicator}</td>`).join("")}
            ${plates.map(plate=>`<td>[${plate.map(port=>PORTS_SHORTEN[port]).join(" ")}]</td>`).join("")}
        </tr>
    </tbody>`;
    
    received = "";
    answer = "";
    calculated = "";
    for (let i = 0; i < LOOKAHEADVISIBLE + 1; i++) generateForgetMeNotDigit();

    revealedStrikeIndex = -1;

    setStrikesText();
    updateTexts();
}

const LOOKAHEADVISIBLE = 7; // remember to set this in css too!
const LOOKBEHINDVISIBLE = 7; // remember to set this in css too!
CHECKBEHIND = -2;

let received = "";
let answer = "";
let calculated = "";

function updateTexts() {
    if (revealedStrikeIndex >= calculated.length) revealedStrikeIndex = -1;

    document.querySelector("#received .text").innerHTML = `${received.substring(calculated.length-LOOKBEHINDVISIBLE,calculated.length)}<span class="current">${received[calculated.length]}</span>${received.substring(calculated.length+1, calculated.length+LOOKAHEADVISIBLE+1)}`;
    
    if (revealedStrikeIndex == -1) document.querySelector("#calculated .text").innerHTML = calculated.substring(calculated.length-LOOKBEHINDVISIBLE);
    else document.querySelector("#calculated .text").innerHTML = `${calculated.substring(calculated.length-LOOKBEHINDVISIBLE, revealedStrikeIndex)}<span class="struck">${calculated[revealedStrikeIndex]}</span>${calculated.substring(revealedStrikeIndex+1)}`;
}

function generateForgetMeNotDigit() {
    let thisReceived = rInt(10);
    received += thisReceived
    let chartNumber;
    if (received.length == 1) {
        if (indicators.includes("car")) chartNumber = 2;
        else if (unlits > lits) chartNumber = 7;
        else if (!unlits) chartNumber = lits;
        else chartNumber = parseInt(serial[5]);
    } else if (received.length == 2) {
        if (ports.includes("Serial") && serial.split('').filter(char=>DIGITS.includes(char)).length >= 3) chartNumber = 3;
        else if (parseInt(answer[0]) % 2 == 0) chartNumber = parseInt(answer[0]) + 1;
        else chartNumber = parseInt(answer[0]) - 1;
    } else {
        if (answer[received.length-3] == "0" || answer[received.length-2] == "0") chartNumber = largestDigit;
        else if (parseInt(answer[received.length-3]) % 2 == 0 && parseInt(answer[received.length-2]) % 2 == 0) chartNumber = smallestOddDigit;
        else chartNumber = parseInt(String(parseInt(answer[received.length-3]) + parseInt(answer[received.length-2]))[0]);
    }
    console.log(`${thisReceived} + ${chartNumber} = ${(thisReceived + chartNumber) % 10}`);
    answer += (thisReceived + chartNumber) % 10;
}

let revealedStrikeIndex = -1;

const strikeSound = new Audio('https://github.com/apia46/neocities/raw/refs/heads/main/assets/strike.wav');
function handleInput() {
    let input = document.querySelector("#calculated input");
    input.value = (input.value)[input.value.length - 1] || "";
    if (!input.value) return;

    let checkValue = CHECKBEHIND?parseInt(calculated[calculated.length + CHECKBEHIND]):parseInt(input.value);
    if (calculated.length < -CHECKBEHIND || checkValue == answer[calculated.length + CHECKBEHIND]) {
        digitsSinceStrike++;
        if (digits == 2) timeAfterTwo = Date.now();
    } else if (revealedStrikeIndex == -1) {
        revealedStrikeIndex = calculated.length + CHECKBEHIND;
        strikes++;
        digitsSinceStrike = 0;
        lastStrike = timeElapsed;

        strikeSound.play();
        document.body.classList.add("strike");
        setTimeout(()=>{document.body.classList.remove("strike");}, 200);
        setStrikesText();
    }
    if (revealedStrikeIndex == -1) {
        calculated += input.value;
        input.value = '';
        digits++;
    }
    if (answer.length - calculated.length <= LOOKAHEADVISIBLE) generateForgetMeNotDigit();
    updateTexts();
}

function setStrikesText() {
    document.querySelector("#strikes").innerHTML = strikes<10?"X".repeat(strikes).padEnd(3, "."):strikes+"X"
}

window.onload = () => {
    let strikeDelaySlider = document.querySelector("#strike-delay");
    let volumeSlider = document.querySelector("#volume");
    strikeDelaySlider.parentElement.style.setProperty('--value', `'${-strikeDelaySlider.value}'`);
    volumeSlider.parentElement.style.setProperty('--value', `'${volumeSlider.value}'`);
    CHECKBEHIND = parseInt(strikeDelaySlider.value);
    strikeSound.volume = parseInt(volumeSlider.value)/100;
    strikeDelaySlider.onchange = ()=>{
        CHECKBEHIND = parseInt(strikeDelaySlider.value);
    }
    volumeSlider.onchange = ()=>{
        strikeSound.volume = parseInt(volumeSlider.value)/10;
        strikeSound.play();
    }

    let input = document.querySelector("#calculated input")
    input.value = '';
    input.addEventListener('keydown', event=>{
        if (event.key === "Backspace" || event.key === "Delete") {
            if (calculated.length == 0) return;
            if (input.value) return;
            calculated = calculated.slice(0, -1);
            updateTexts();
            digits--;
            digitsSinceStrike = Math.max(digitsSinceStrike - 1, 0);
        }
    });

    let timeDisplay = document.querySelector("#time");

    let digitsDisplay = document.querySelector("#stats .digits");
    let digitsPerStrikeDisplay = document.querySelector("#stats .digits-per-strike");
    let digitsSinceStrikeDisplay = document.querySelector("#stats .digits-since-strike");
    let timeSinceStrikeDisplay = document.querySelector("#stats .time-since-strike");
    let digitsperMinuteWithDisplay = document.querySelector("#stats .digits-per-minute-with");
    let digitsperMinuteWithoutDisplay = document.querySelector("#stats .digits-per-minute-without");

    setInterval(()=>{
        timeElapsed = (Date.now() - timeStarted) / 1000;
        timeDisplay.innerText = displayTime(timeElapsed)

        digitsDisplay.innerText = digits;
        digitsPerStrikeDisplay.innerText = (digits/strikes).toFixed(1);
        digitsSinceStrikeDisplay.innerText = digitsSinceStrike;
        timeSinceStrikeDisplay.innerText = displayTime(timeElapsed - lastStrike);
        digitsperMinuteWithDisplay.innerText = (digits/timeElapsed * 60).toFixed(1);
        digitsperMinuteWithoutDisplay.innerText = (digits/(Date.now() - timeAtTwo) * 60000).toFixed(1);
    }, 0);
}

function displayTime(value) {
    if (value < 60) {
        return value.toFixed(2);
    } else {
        let minutes = Math.floor(value / 60);
        let seconds = Math.floor(value % 60);
        return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    }
}
