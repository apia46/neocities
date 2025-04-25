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

let message;
let encryptedMessage;
let substitution;
let ordering;

function moduleSetup() {
    keyboardSetup();

    newInstance();
}

function newInstance() {
    console.log("New Cryptography");

    message = MESSAGES[rInt(MESSAGES.length)];
    encryptedMessage = "";

    substitution = derangement("ABCDFGHIJKLMNOPQRSTUVWXYZ".split(""));
    substitution.splice(4,0,"E");

    ordering = [];

    message.split(" ").forEach(word=>{
        console.log('word');
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

    updateTexts();
}

function updateTexts() {
    document.querySelector("#display").innerHTML = encryptedMessage;
}

function moduleOnload() {
    keyboardOnload();
}

function derangement(s) { // Randomly shuffles the array until it is a derangement. Could be better https://codegolf.stackexchange.com/questions/103536/generate-a-random-derangement
    return (r=[...s]).sort(_=>Math.random()-.5).some((e,i)=>s[i]==e)?derangement(s):r;
}
