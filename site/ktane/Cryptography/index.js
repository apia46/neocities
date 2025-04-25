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
REPLACE_LETTERS = true;

let message;
let encryptedMessage;
let substitution;
let ordering;
let index;

const PRACTICE_POOL_IMAGE_DIRECTORY = "Cryptography/assets";
const PRACTICE_POOL_IMAGE_FILETYPE = "png";
const PRACTICE_POOL_SYMBOLS = [...Array(MESSAGES.length).keys()];

function moduleSetup() {
    newInstance();
}

function newInstance() {
    console.log("New Cryptography");

    message = MESSAGES[rInt(MESSAGES.length)];
    console.log(message);
    encryptedMessage = "";

    substitution = derangement("ABCDFGHIJKLMNOPQRSTUVWXYZ".split(""));
    console.log(substitution.join(""));
    substitution.splice(4,0,"E");
    ordering = [];
    index = 0;

    message.split(" ").forEach(word=>{
        let color = "yellow";
        if (word.includes("Q")) color = "purple";
        else if ((word.match(/T/g)||[]).length >= 2) color = "green";
        else if ((word.match(/[AEIOU]/g)||[]).length == 1) color = "red";

        encryptedMessage += `<span class="${color}">`
        word.split("").forEach(char=>{
            let substituted = substitution[char.charCodeAt(0) - 65];
            if (!ordering.includes(char)) {
                ordering.push(char);
                encryptedMessage += `<span class="first">${substituted}</span>`
            } else {
                encryptedMessage += substituted;
            }
        })
        encryptedMessage += "</span> ";
    })
    encryptedMessage += "<span class='white first'>↵</span>";

    keyboardSetup();
    updateTexts();
}

function moduleSettings() {
    if (typeof(localStorage.ktane_settings_CryptModule_replaceLetters) == "undefined") localStorage.ktane_settings_CryptModule_replaceLetters = true;
    return `
    <tr><th colspan="2" class="section">Cryptography</th></tr>
    <tr>
        <th>Replace Letters</th>
        <td><input id="replace-letters" type="checkbox" ${localStorage.ktane_settings_CryptModule_replaceLetters=="true"?"checked":""}></td>
    </tr>
    `
}

function moduleOnload() {
    let input = document.querySelector("#display input")
    input.value = '';
    input.addEventListener('keydown', event=>{
        if (event.key == "Enter") {
            if (index == ordering.length) newInstance();
        }
    });
    
    let replaceLettersSwitch = document.querySelector("#replace-letters");
    REPLACE_LETTERS = replaceLettersSwitch.checked;
    replaceLettersSwitch.onchange = ()=>{
        localStorage.ktane_settings_CryptModule_replaceLetters = replaceLettersSwitch.checked;
        REPLACE_LETTERS = replaceLettersSwitch.checked;
    }

    practicePoolOnload();
}

function updateTexts() {
    document.querySelector("#display #text").innerHTML = encryptedMessage;
    let selected = document.querySelectorAll("#display .first")[index];
    let input = document.querySelector("#display input");
    input.style.setProperty('--width', selected.offsetWidth);
    input.style.setProperty('--x', selected.offsetLeft);
    input.style.setProperty('--y', selected.offsetTop);
    input.setAttribute("placeholder", selected.innerText);
    input.className = selected.parentElement.className;
}

function handleInput() {
    let input = document.querySelector("#display input");
    inputCharacter(input.value.toUpperCase());
    input.value = "";
}
function keyboardInput(char) {
    if (char == "ENTER") {
        if (index == ordering.length) newInstance();
    } else inputCharacter(char);
}

function inputCharacter(char) {
    let button;
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char)) {
        button = document.querySelector(`#keyboard-${char}`);
        button.classList.add("press");
        setTimeout(()=>{button.classList.remove("press")}, 20);
    }
    if (!ordering.slice(index).includes(char)) { return }
    if (char == ordering[index]) {
        index++;
        button.setAttribute("disabled", "true");
        encryptedMessage = encryptedMessage.replaceAll(substitution[char.charCodeAt(0) - 65], `<span class="white">${(REPLACE_LETTERS?char:substitution[char.charCodeAt(0) - 65]).toLowerCase()}</span>`);
        updateTexts();
    } else {
        strike();
    }
}

function derangement(s) { // Randomly shuffles the array until it is a derangement. Could be better https://codegolf.stackexchange.com/questions/103536/generate-a-random-derangement
    return (r=[...s]).sort(_=>Math.random()-.5).some((e,i)=>s[i]==e)?derangement(s):r;
}
