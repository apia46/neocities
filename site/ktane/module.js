const CHARACTERS = "ABCDEEFGHIJKLMNPQRSTUVWXZ0123456789";
const LETTERS = "ABCDEEFGHIJKLMNPQRSTUVWXZ";
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

function generateBomb() {
    console.log("New bomb")
    timeStarted = Date.now();
    timeAtTwo = Date.now();
    
    serial = CHARACTERS[rInt(35)] + CHARACTERS[rInt(35)] + DIGITS[rInt(10)] + LETTERS[rInt(25)] + LETTERS[rInt(25)] + DIGITS[rInt(10)];
    batteries = 0;
    holders = 0;
    indicators = [];
    unlits = 0;
    lits = 0;
    plates = [];
    ports = [];

    strikes = 0;

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

    moduleSetup(); 

    setStrikesText();
}

window.onload = () => {
    let timeDisplay = document.querySelector("#time");
    setInterval(()=>{
        timeElapsed = (Date.now() - timeStarted) / 1000;
        timeDisplay.innerText = displayTime(timeElapsed);
    }, 0);

    onload();
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

function strike() {
    strikes++;
    strikeSound.play();
    document.body.classList.add("strike");
    setTimeout(()=>{document.body.classList.remove("strike");}, 200);
    setStrikesText();
}