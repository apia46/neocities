MODULE_ID = "CryptModule";

const MESSAGES = [
    "SCROOGE KNEW HE WAS DEAD",
    "OF COURSE HE DID",
    "HOW COULD IT BE OTHERWISE",
    "SCROOGE AND HE WERE PARTNERS FOR I DONT KNOW HOW MANY YEARS",
    "SCROOGE WAS HIS SOLE EXECUTOR HIS SOLE ADMINISTRATOR HIS SOLE ASSIGN HIS SOLE RESIDUARY LEGATEE HIS SOLE FRIEND AND SOLE MOURNER",
    "THE MENTION OF MARLEYS FUNERAL BRINGS ME BACK TO THE POINT I STARTED FROM",
    "THERE IS NO DOUBT THAT MARLEY WAS DEAD",
    "THIS MUST BE DISTINCTLY UNDERSTOOD OR NOTHING WONDERFUL CAN COME OF THE STORY I AM GOING TO RELATE",

    "SCROOGE NEVER PAINTED OUT OLD MARLEYS NAME",
    "THERE IT STOOD YEARS AFTERWARDS ABOVE THE WAREHOUSE DOOR SCROOGE AND MARLEY",
    "THE FIRM WAS KNOWN AS SCROOGE AND MARLEY",
    "SOMETIMES PEOPLE NEW TO THE BUSINESS CALLED SCROOGE SCROOGE AND SOMETIMES MARLEY BUT HE ANSWERED TO BOTH NAMES",
    "IT WAS ALL THE SAME TO HIM",

    "BUT HE WAS A TIGHTFISTED HAND AT THE GRINDSTONE SCROOGE",
    "A SQUEEZING WRENCHING GRASPING SCRAPING CLUTCHING COVETOUS OLD SINNER",
    "HARD AND SHARP AS FLINT FROM WHICH NO STEEL HAD EVER STRUCK OUT GENEROUS FIRE",
    "SECRET AND SELFCONTAINED AND SOLITARY AS AN OYSTER",
    "THE COLD WITHIN HIM FROZE HIS OLD FEATURES NIPPED HIS POINTED NOSE SHRIVELLED HIS CHEEK STIFFENED HIS GAIT",
    "MADE HIS EYES RED HIS THIN LIPS BLUE AND SPOKE OUT SHREWEDLY IN HIS GRATING VOICE",
    "A FROSTY RIME WAS ON HIS HEAD AND ON HIS EYEBROWS AND HIS WIRY CHIN",
    "HE CARRIED HIS OWN LOW TEMPERATURE ALWAYS ABOUT HIM",
    "HE ICED HIS OFFICE IN THE DOGDAYS",
    "AND DIDNT THAW IT ONE DEGREE AT CHRISTMAS",

    "EXTERNAL HEAT AND COLD HAD LITTLE INFLUENCE ON SCROOGE",
    "NO WARMTH COULD WARM NO WINTRY WEATHER CHILL HIM",
    "NO WIND THAT BLEW WAS BITTERER THAN HE NO FALLING SNOW WAS MORE INTENT UPON ITS PURPOSE NO PELTING RAIN LESS OPEN TO ENTREATY",
    "FOUL WEATHER DIDNT KNOW WHERE TO HAVE HIM",
    "THE HEAVIEST RAIN AND SNOW AND HAIL AND SLEET COULD BOAST OF THE ADVANTAGE OVER HIM IN ONLY ONE RESPECT",
    "THEY OFTEN CAME DOWN HANDSOMELY AND SCROOGE NEVER DID",
    "NOBODY EVER STOPPED HIM IN THE STREET TO SAY WITH GLADSOME LOOKS MY DEAR SCROOGE HOW ARE YOU",
    "WHEN WILL YOU COME TO SEE ME",
    "EVEN THE BLIND MENS DOGS APPEARED TO KNOW HIM",
    "AND WHEN THEY SAW HIM COMING ON WOULD TUG THEIR OWNERS INTO DOORWAYS AND UP COURTS",
    "AND THEN WOULD WAG THEIR TAILS AS THOUGH THEY SAID NO EYE AT ALL IS BETTER THAN AN EVIL EYE DARK MASTER",

    "BUT WHAT DID SCROOGE CARE",
    "IT WAS THE VERY THING HE LIKED",
    "TO EDGE HIS WAY ALONG THE CROWDED PATHS OF LIFE WARNING ALL HUMAN SYMPATHY TO KEEP ITS DISTANCE WAS WHAT THE KNOWING ONES CALL NUTS TO SCROOGE",
];
REPLACE_AHEAD = true;
STRIKE_TIME = 4000;
PENALTY_TIME = 1000;

let practicePool;

let message;
let substitution;
let ordering;
let colors;
let firsts;
let workingMessage;
let index;

let nextFirstIndex;
let nextFirst;

DISPLAY_INPUT = false;
let displayInputAdditions;
let displayInputIndex;

let messageIndex;
let result;

let progressStart;
let pauseStart;
let pausedTime;
let focused;

function moduleSetup() {
    console.log("CryptModule: loading new");

    practicePool = new PracticePool("phrases", [...Array(MESSAGES.length).keys()], "Cryptography/assets", "png");
    practicePool.setup();

    pauseStart = Date.now();

    newInstance();
}

function newInstance() {
    messageIndex = practicePool.query();
    message = MESSAGES[messageIndex];
    console.log(`CryptModule: ${message}`);

    substitution = derangement("ABCDFGHIJKLMNOPQRSTUVWXYZ".split(""));
    console.log(`CryptModule: ${substitution.join("")}`);
    substitution.splice(4,0,"E");
    ordering = [];
    colors = [];
    firsts = [];

    index = 0;
    workingMessage = "";
    message.split(" ").forEach(word=>{
        let color = "yellow";
        if (word.includes("Q")) color = "purple";
        else if ((word.match(/T/g)||[]).length >= 2) color = "green";
        else if ((word.match(/[AEIOU]/g)||[]).length == 1) color = "red";

        word.split("").forEach(char=>{
            workingMessage += substitution[char.charCodeAt(0) - 65];
            colors.push(color);
            if (!ordering.includes(char)) {
                ordering.push(char);
                firsts.push(index);
            }
            index++;
        });
        index++;
        colors.push("white");
        workingMessage += " ";
    })
    colors.push("white");
    workingMessage += "↵"

    index = 0;
    nextFirstIndex = 0;
    nextFirst = 0;

    displayInputIndex = 0;
    displayInputAdditions = {};

    result = true;
    progressStart = Date.now();
    pausedTime = 0;

    keyboardSetup();
    updateTexts();
}

function moduleSettings() {
    if (typeof(localStorage.ktane_settings_CryptModule_replaceAhead) == "undefined") localStorage.ktane_settings_CryptModule_replaceAhead = false;
    if (typeof(localStorage.ktane_settings_CryptModule_displayInput) == "undefined") localStorage.ktane_settings_CryptModule_displayInput = false;
    if (typeof(localStorage.ktane_settings_CryptModule_strikeTime) == "undefined") localStorage.ktane_settings_CryptModule_strikeTime = 2;
    if (typeof(localStorage.ktane_settings_CryptModule_penaltyTime) == "undefined") localStorage.ktane_settings_CryptModule_penaltyTime = 0;
    
    return `
    <tr><th colspan="100%" class="section">Cryptography</th></tr>
    <tr>
        <th><u title="Replaces all future occurences of decrypted characters with their plaintext versions. This is information you technically have access to, but perhaps a little unrealistic to do at a reasonable speed.">Replace Ahead</u></th>
        <td><input id="replace-ahead" type="checkbox" ${localStorage.ktane_settings_CryptModule_replaceAhead=="true"?"checked":""}></td>
        <th><u title="Alters display to better reflect your input. Helps to make sure you dont lose your place if you're inputting an altered version of the text.">Display Input</u></th>
        <td><input id="display-input" type="checkbox" ${localStorage.ktane_settings_CryptModule_displayInput=="true"?"checked":""}></td>
    </tr>
    <tr>
        <th><u title="The time you are allowed per character until the module strikes">Strike Time</u></th>
        <td><span style="--after-width: 48px">0.5s <input id="strike-time" type="range" min="-1" max="4.333333333" step="0.333333333" value="${localStorage.ktane_settings_CryptModule_strikeTime}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value>4.1?'∞':(2**this.value).toPrecision(2).slice(0,3)}s'\`)"> 16s/∞s</span></td>
        <th><u title="The time penalty given for inputting incorrect characters.">Penalty Time</u></th>
        <td><span style="--after-width: 48px">0s/0.1s <input id="penalty-time" type="range" min="-3.5" max="4" step="0.5" value="${localStorage.ktane_settings_CryptModule_penaltyTime}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value<-3.1?'0':(2**this.value).toPrecision(2).slice(0,3)}s'\`)"> 16s</span></td>
    </tr>
    `
}

function moduleOnload() {
    let input = document.querySelector("#display input")
    input.value = '';
    input.addEventListener('keydown', event=>{
        if (event.key == "Enter") {
            if (typeof(nextFirst) == "undefined") solve();
        }
    });
    
    let replaceAheadSwitch = document.querySelector("#replace-ahead");
    REPLACE_AHEAD = replaceAheadSwitch.checked;
    replaceAheadSwitch.onchange = ()=>{
        localStorage.ktane_settings_CryptModule_replaceAhead = replaceAheadSwitch.checked;
        REPLACE_AHEAD = replaceAheadSwitch.checked;
    }
    let displayInputSwitch = document.querySelector("#display-input");
    DISPLAY_INPUT = displayInputSwitch.checked;
    displayInputSwitch.onchange = ()=>{
        localStorage.ktane_settings_CryptModule_displayInput = displayInputSwitch.checked;
        DISPLAY_INPUT = displayInputSwitch.checked;
    }

    let strikeTimeSlider = document.querySelector("#strike-time");
    strikeTimeSlider.parentElement.style.setProperty('--value', `'${strikeTimeSlider.value>4?'∞':(2**strikeTimeSlider.value).toPrecision(2).slice(0,3)}s'`);
    STRIKE_TIME = strikeTimeSlider.value>4.1?-1:2**parseFloat(strikeTimeSlider.value) * 1000;
    strikeTimeSlider.onchange = ()=>{
        localStorage.ktane_settings_CryptModule_strikeTime = parseFloat(strikeTimeSlider.value);
        STRIKE_TIME = strikeTimeSlider.value>4.1?-1:2**parseFloat(strikeTimeSlider.value) * 1000;
    }

    let penaltyTimeSlider = document.querySelector("#penalty-time");
    penaltyTimeSlider.parentElement.style.setProperty('--value', `'${penaltyTimeSlider.value==-3?'0':(2**penaltyTimeSlider.value).toPrecision(2).slice(0,3)}s'`);
    PENALTY_TIME = penaltyTimeSlider.value<-3.1?0:2**parseFloat(penaltyTimeSlider.value) * 1000;
    penaltyTimeSlider.onchange = ()=>{
        localStorage.ktane_settings_CryptModule_penaltyTime = parseFloat(penaltyTimeSlider.value);
        PENALTY_TIME = penaltyTimeSlider.value<-3.1?0:2**parseFloat(penaltyTimeSlider.value) * 1000;
    }

    let displayTimer = document.querySelector("#display-timer");
    setInterval(()=>{
        if (focused && result) {
            let progress = STRIKE_TIME == -1 ? 0 : Math.min((Date.now() - pausedTime - progressStart)/STRIKE_TIME, 1);
            displayTimer.style.setProperty('--progress', progress);
            if (progress == 1) {
                result = false;
                strike();
            }
        }
    }, 0);

    practicePoolsOnload();
}

function updateTexts() {
    document.querySelector("#text").innerHTML = "<span>" + workingMessage.split('').map( (char, thisIndex) =>
        char==" "? /* fuck this code man why does displayinput have to exist */
                `${displayInputAdditions[thisIndex]?`<span>${displayInputAdditions[thisIndex].replaceAll(" ", "</span></span> <span><span>")}</span>`:""
            }</span>${
            colors[thisIndex]=="hidden"?"":" "
            }<span>${
                displayInputAdditions[thisIndex+1]?`<span>${displayInputAdditions[thisIndex+1].slice(displayInputAdditions[thisIndex+1].lastIndexOf(" ")+1)}</span>`:""}`
        :`${displayInputAdditions[thisIndex] && (thisIndex == 0 || workingMessage[thisIndex-1] !=" ")?`<span>${displayInputAdditions[thisIndex].replaceAll(" ", "</span></span> <span><span>")}</span>`:""
        }<span
            class="
                ${colors[thisIndex]}
                ${thisIndex > index && (typeof(nextFirst) == "undefined" || thisIndex <= nextFirst) ? "selected" : ""}
                ${char == " " ? "space" : ""}
            "
            ${thisIndex == index ? 'id="pointer"' : ""}
            >${char
        }</span>`
    ).join('') + "</span>";

    let selected = document.querySelector("#pointer");
    let input = document.querySelector("#display input");
    input.style.setProperty('--width', selected.offsetWidth);
    input.style.setProperty('--x', selected.offsetLeft);
    input.style.setProperty('--y', selected.offsetTop);
    input.setAttribute("placeholder", selected.textContent);
    input.className = selected.className;
}
window.onload = ()=>{updateTexts()}

function handleInput() {
    let input = document.querySelector("#display input");
    inputCharacter(input.value.toUpperCase());
    input.value = "";
}
function keyboardInput(char) {
    if (char == "Enter") {
        if (typeof(nextFirst) == "undefined") solve();
    } else inputCharacter(char);
}

function solve() {
    practicePool.result(result, messageIndex);
    newInstance();
}

function inputCharacter(char) {
    if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char)) {
        if (DISPLAY_INPUT) {
            if (!displayInputAdditions[displayInputIndex]) displayInputAdditions[displayInputIndex] = "";
            displayInputAdditions[displayInputIndex] += char;
            updateTexts();
        }
        return;
    }

    let button;
    button = document.querySelector(`#keyboard-${char}`);
    button.classList.add("press");
    setTimeout(()=>{button.classList.remove("press")}, 20);

    let workingRange = message.slice(index, typeof(nextFirst) == "undefined"? nextFirst : nextFirst+1);
    if ((foundIndex = workingRange.indexOf(char)) != -1) {
        button.setAttribute("greyed", "true");
        progressStart = Date.now();
        pausedTime = 0;
        let newWorkingMessage = workingMessage.slice(0, index);
        for (let i = index; i < index+foundIndex+1; i++) {
            newWorkingMessage += message[i].toLowerCase();
            colors[i] = DISPLAY_INPUT && i < index+foundIndex ? "hidden" : "white"; // probably make this actually modify the message but idk if thats a good idea
        }
        if (DISPLAY_INPUT && workingMessage[index-1] == " ") colors[index-1] = "hidden";
        newWorkingMessage += workingMessage.slice(index+foundIndex+1);
        workingMessage = newWorkingMessage;
        if (REPLACE_AHEAD) {
            workingMessage.split("").forEach((thisChar,index)=>{
                if (thisChar == substitution[char.charCodeAt(0) - 65]) colors[index] = "white";
            });
            workingMessage = workingMessage.replaceAll(substitution[char.charCodeAt(0) - 65], char.toLowerCase());
        }
        index += foundIndex + 1;
        displayInputIndex = index;
        if (workingMessage[index] == " ") index++; // but not display input index
        nextFirstIndex = firsts.findIndex(checkIndex=>checkIndex >= index);
        nextFirst = firsts[nextFirstIndex];
        updateTexts();
    } else {
        if ((nextFirstIndex==-1?[]:ordering.slice(nextFirstIndex+1)).includes(char)) {
            bip();
        }
        else if (DISPLAY_INPUT) {
            if (!displayInputAdditions[displayInputIndex]) displayInputAdditions[displayInputIndex] = "";
            displayInputAdditions[displayInputIndex] += char;
            updateTexts();
        }
    }
}

function bip() {
    progressStart -= PENALTY_TIME;
    let displayTimer = document.querySelector("#display-timer");
    bipSound.play();
    displayTimer.classList.add("flash");
    setTimeout(()=>{displayTimer.classList.remove("flash")}, 50);
}

function keyboardFocus() {focusInput()}
function keyboardUnfocus() {unfocusInput()}

function focusInput() {
    pausedTime += Date.now() - pauseStart;
    focused = true;
}
function unfocusInput() {
    pauseStart = Date.now();
    focused = false;
}
