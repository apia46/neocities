function rInt(possibilities) {
    return Math.floor(Math.random() * possibilities);
}

let timeStarted;
let timeElapsed;

// variable
let strikes;
let lastStrike;

function generateBomb() {
    console.log("New bomb");

    timeStarted = Date.now();
    strikes = 0;

    this.edgeworkSetup?.();
    this.moduleSetup?.();
    setStrikesText();
}

function settings() {
    if (!localStorage.ktane_settings_general_volume) localStorage.ktane_settings_general_volume = 5;
    return `
    <tr><th colspan="2" class="section">General</th></tr>
    <tr>
        <th>Volume</th>
        <td><span>0 <input id="volume" type="range" min="0" max="10" value="${localStorage.ktane_settings_general_volume}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value}'\`)"> 10</span></td>
    </tr>
    `;
}

window.onload = () => {
    let timeDisplay = document.querySelector("#time");
    setInterval(()=>{
        timeElapsed = (Date.now() - timeStarted) / 1000;
        timeDisplay.innerText = displayTime(timeElapsed);
    }, 0);

    /* settings */
    document.querySelector('#settings').innerHTML = `
    <tbody>
        ${settings()}
        ${this.settingsEdgework?.()||""}
        ${this.settingsModule?.()||""}
    </tbody>`;

    let volumeSlider = document.querySelector("#volume");
    volumeSlider.parentElement.style.setProperty('--value', `'${volumeSlider.value}'`);
    strikeSound.volume = parseInt(volumeSlider.value)/100;
    volumeSlider.onchange = ()=>{
        localStorage.ktane_settings_general_volume = parseInt(volumeSlider.value);
        strikeSound.volume = parseInt(volumeSlider.value)/10;
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
