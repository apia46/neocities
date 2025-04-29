function rInt(possibilities) {
    return Math.floor(Math.random() * possibilities);
}

let timeStarted;
let timeElapsed;

// variable
let strikes;
let lastStrike;

function generateBomb() {
    console.log("general: loading new");

    timeStarted = Date.now();
    strikes = 0;

    this.edgeworkSetup?.();
    this.moduleSetup?.();
    setStrikesText();
}

function generalSettings() {
    if (typeof(localStorage.ktane_settings_general_volume) == "undefined") localStorage.ktane_settings_general_volume = 5;
    return `
    <tr><th colspan="100%" class="section">General</th></tr>
    <tr>
        <th>Volume</th>
        <td><span>0 <input id="volume" type="range" min="0" max="10" value="${localStorage.ktane_settings_general_volume}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value}'\`)"> 10</span></td>
    </tr>
    `;
}

function load() {
    document.querySelector("#general").innerHTML = `
        <div id="timer">
            <div id="strikes">...</div>
            <div id="time">00:12</div>
        </div>
        <button onclick="generateBomb()">New Bomb</button>`

    generateBomb();

    let timeDisplay = document.querySelector("#time");
    setInterval(()=>{
        timeElapsed = (Date.now() - timeStarted) / 1000;
        timeDisplay.textContent = displayTime(timeElapsed);
    }, 0);

    /* settings */
    document.querySelector('#settings').innerHTML = `
    <tbody>
        ${generalSettings()}
        ${this.edgeworkSettings?.()||""}
        ${this.practicePoolSettings?.()||""}
        ${this.moduleSettings?.()||""}
    </tbody>`;

    let volumeSlider = document.querySelector("#volume");
    volumeSlider.parentElement.style.setProperty('--value', `'${volumeSlider.value}'`);
    strikeSound.volume = parseInt(volumeSlider.value)/10;
    bipSound.volume = parseInt(volumeSlider.value)/10;
    volumeSlider.onchange = ()=>{
        localStorage.ktane_settings_general_volume = parseInt(volumeSlider.value);
        strikeSound.volume = parseInt(volumeSlider.value)/10;
        bipSound.volume = parseInt(volumeSlider.value)/10;
        strikeSound.play();
    }

    /* call */
    this.edgeworkOnload?.();
    this.moduleOnload?.();
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

function setStrikesText() {
    document.querySelector("#strikes").innerHTML = strikes<10?"X".repeat(strikes).padEnd(3, "."):strikes+"X"
}

const strikeSound = new Audio('https://github.com/apia46/neocities/raw/refs/heads/main/assets/strike.wav');
function strike() {
    strikes++;
    strikeSound.play();
    document.body.classList.add("strike");
    lastStrike = timeElapsed;
    setTimeout(()=>{document.body.classList.remove("strike");}, 200);
    setStrikesText();
}
const bipSound = new Audio('https://github.com/apia46/neocities/raw/refs/heads/main/assets/bip.wav');

function resetStrikes() {
    strikes = 0;
    setStrikesText();
}

function derangement(s) { // Randomly shuffles the array until it is a derangement. Could be better https://codegolf.stackexchange.com/questions/103536/generate-a-random-derangement
    return ShuffleFisherYates((r=[...s])).some((e,i)=>s[i]==e)?derangement(s):r;
}

function ShuffleFisherYates(array)
{
    var i = array.length;
    while (i > 1)
    {
        var index = Math.floor(Math.random() * i);
        i--;
        var value = array[index];
        array[index] = array[i];
        array[i] = value;
    }
    return array;
}
