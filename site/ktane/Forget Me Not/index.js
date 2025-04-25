const LOOKAHEADVISIBLE = 7; // remember to set this in css too!
const LOOKBEHINDVISIBLE = 7; // remember to set this in css too!
CHECKBEHIND = -2;

let largestDigit;
let smallestOddDigit;

let received;
let answer;
let calculated;

let digits;
let digitsSinceStrike;

let timeAtTwo;

function moduleSetup() {
    console.log("New Forget Me Not");

    timeAtTwo = Date.now();

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
    });
    received = "";
    answer = "";
    calculated = "";
    for (let i = 0; i < LOOKAHEADVISIBLE + 1; i++) generateForgetMeNotDigit();

    revealedStrikeIndex = -1;

    updateTexts();
}

function moduleSettings() {
    if (typeof(localStorage.ktane_settings_MemoryV2_strikeDelay) == "undefined") localStorage.ktane_settings_MemoryV2_strikeDelay = -1;
    return `
    <tr><th colspan="2" class="section">Forget Me Not</th></tr>
    <tr>
        <th><u title="Number of extra digits calculated before an incorrect one is revealed">Strike delay</u></th>
        <td><span>5 <input id="strike-delay" type="range" min="-5" max="0" value="${localStorage.ktane_settings_MemoryV2_strikeDelay}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${-this.value}'\`)"> 0</span></td>
    </tr>
    `;
}

function moduleOnload() {
    let input = document.querySelector("#calculated input");
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

    /* stats */
    let digitsDisplay = document.querySelector("#stats .digits");
    let digitsPerStrikeDisplay = document.querySelector("#stats .digits-per-strike");
    let digitsSinceStrikeDisplay = document.querySelector("#stats .digits-since-strike");
    let timeSinceStrikeDisplay = document.querySelector("#stats .time-since-strike");
    let digitsperMinuteWithDisplay = document.querySelector("#stats .digits-per-minute-with");
    let digitsperMinuteWithoutDisplay = document.querySelector("#stats .digits-per-minute-without");

    setInterval(()=>{
        digitsDisplay.innerText = digits;
        digitsPerStrikeDisplay.innerText = (digits/strikes).toFixed(1);
        digitsSinceStrikeDisplay.innerText = digitsSinceStrike;
        timeSinceStrikeDisplay.innerText = displayTime(timeElapsed - lastStrike);
        digitsperMinuteWithDisplay.innerText = (digits/timeElapsed * 60).toFixed(1);
        digitsperMinuteWithoutDisplay.innerText = ((Math.max(digits - 2, 0))/(Date.now() - timeAtTwo) * 60000).toFixed(1);
    }, 0);
    
    /* settings */
    let strikeDelaySlider = document.querySelector("#strike-delay");
    strikeDelaySlider.parentElement.style.setProperty('--value', `'${-strikeDelaySlider.value}'`);
    CHECKBEHIND = parseInt(strikeDelaySlider.value);
    strikeDelaySlider.onchange = ()=>{
        localStorage.ktane_settings_MemoryV2_strikeDelay = parseInt(strikeDelaySlider.value);
        CHECKBEHIND = parseInt(strikeDelaySlider.value);
    }

}

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
        strike();
        digitsSinceStrike = 0;
    }
    if (revealedStrikeIndex == -1) {
        calculated += input.value;
        input.value = '';
        digits++;
    }
    if (answer.length - calculated.length <= LOOKAHEADVISIBLE) generateForgetMeNotDigit();
    updateTexts();
}
