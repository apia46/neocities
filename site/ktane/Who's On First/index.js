const MODULE_ID = "WhosOnFirst";
const LOOKS = {
    "YES": 2,   "FIRST": 1,     "DISPLAY": 5,   "OKAY": 1,      "SAYS": 5,      "NOTHING": 2,
    "empty": 4, "BLANK": 3,     "NO": 5,        "LED": 2,       "LEAD": 5,      "READ": 3,
    "RED": 3,   "REED": 4,      "LEED": 4,      "HOLD ON": 5,   "YOU": 3,       "YOU ARE": 5,
    "YOUR": 3,  "YOU’RE": 3,    "UR": 0,        "THERE": 5,     "THEY’RE": 4,   "THEIR": 3,
                "THEY ARE": 2,  "SEE": 5,       "C": 1,         "CEE": 5
}
const LOOK_LOCATIONS = ["↖", "↗", "←", "→", "↙", "↘"]

const WORDS = {
    "READY":      ["YES", "OKAY", "WHAT", "MIDDLE", "LEFT", "PRESS", "RIGHT", "BLANK", 'READY', "NO", "FIRST", "UHHH", "NOTHING", "WAIT"],
    "FIRST":      ["LEFT", "OKAY", "YES", "MIDDLE", "NO", "RIGHT", "NOTHING", "UHHH", 'WAIT', "READY", "BLANK", "WHAT", "PRESS", "FIRST"],
    "NO":         ["BLANK", "UHHH", "WAIT", "FIRST", "WHAT", "READY", "RIGHT", "YES", 'NOTHING', "LEFT", "PRESS", "OKAY", "NO", "MIDDLE"],
    "BLANK":      ["WAIT", "RIGHT", "OKAY", "MIDDLE", 'BLANK', "PRESS", "READY", "NOTHING", "NO", "WHAT", "LEFT", "UHHH", "YES", "FIRST"],
    "NOTHING":    ["UHHH", "RIGHT", "OKAY", "MIDDLE", "YES", "BLANK", "NO", "PRESS", 'LEFT', "WHAT", "WAIT", "FIRST", "NOTHING", "READY"],
    "YES":        ["OKAY", "RIGHT", "UHHH", "MIDDLE", "FIRST", "WHAT", "PRESS", "READY", 'NOTHING', "YES", "LEFT", "BLANK", "NO", "WAIT"],
    "WHAT":       ["UHHH", 'WHAT', "LEFT", "NOTHING", "READY", "BLANK", "MIDDLE", "NO", "OKAY", "FIRST", "WAIT", "YES", "PRESS", "RIGHT"],
    "UHHH":       ["READY", "NOTHING", "LEFT", "WHAT", "OKAY", "YES", "RIGHT", "NO", 'PRESS', "BLANK", "UHHH", "MIDDLE", "WAIT", "FIRST"],
    "LEFT":       ["RIGHT", 'LEFT', "FIRST", "NO", "MIDDLE", "YES", "BLANK", "WHAT", "UHHH", "WAIT", "PRESS", "READY", "OKAY", "NOTHING"],
    "RIGHT":      ["YES", "NOTHING", "READY", "PRESS", "NO", "WAIT", "WHAT", 'RIGHT', "MIDDLE", "LEFT", "UHHH", "BLANK", "OKAY", "FIRST"],
    "MIDDLE":     ["BLANK", "READY", "OKAY", "WHAT", "NOTHING", "PRESS", "NO", "WAIT", 'LEFT', "MIDDLE", "RIGHT", "FIRST", "UHHH", "YES"],
    "OKAY":       ["MIDDLE", "NO", "FIRST", "YES", "UHHH", "NOTHING", "WAIT", 'OKAY', "LEFT", "READY", "BLANK", "PRESS", "WHAT", "RIGHT"],
    "WAIT":       ["UHHH", "NO", "BLANK", "OKAY", "YES", "LEFT", "FIRST", "PRESS", 'WHAT', "WAIT", "NOTHING", "READY", "RIGHT", "MIDDLE"],
    "PRESS":      ["RIGHT", "MIDDLE", "YES", "READY", 'PRESS', "OKAY", "NOTHING", "UHHH", "BLANK", "LEFT", "FIRST", "WHAT", "NO", "WAIT"],

    "YOU":        ["SURE", "YOU ARE", "YOUR", "YOU’RE", "NEXT", "UH HUH", "UR", "HOLD", 'WHATQ', "YOU", "UH UH", "LIKE", "DONE", "U"],
    "YOU ARE":    ["YOUR", "NEXT", "LIKE", "UH HUH", "WHATQ", "DONE", "UH UH", "HOLD", 'YOU', "U", "YOU’RE", "SURE", "UR", "YOU ARE"],
    "YOUR":       ["UH UH", "YOU ARE", "UH HUH", 'YOUR', "NEXT", "UR", "SURE", "U", "YOU’RE", "YOU", "WHATQ", "HOLD", "LIKE", "DONE"],
    "YOU’RE":     ["YOU", 'YOU’RE', "UR", "NEXT", "UH UH", "YOU ARE", "U", "YOUR", "WHATQ", "UH HUH", "SURE", "DONE", "LIKE", "HOLD"],
    "UR":         ["DONE", "U", 'UR', "UH HUH", "WHATQ", "SURE", "YOUR", "HOLD", "YOU’RE", "LIKE", "NEXT", "UH UH", "YOU ARE", "YOU"],
    "U":          ["UH HUH", "SURE", "NEXT", "WHATQ", "YOU’RE", "UR", "UH UH", "DONE", 'U', "YOU", "LIKE", "HOLD", "YOU ARE", "YOUR"],
    "UH HUH":     ['UH HUH', "YOUR", "YOU ARE", "YOU", "DONE", "HOLD", "UH UH", "NEXT", "SURE", "LIKE", "YOU’RE", "UR", "U", "WHATQ"],
    "UH UH":      ["UR", "U", "YOU ARE", "YOU’RE", "NEXT", 'UH UH', "DONE", "YOU", "UH HUH", "LIKE", "YOUR", "SURE", "HOLD", "WHATQ"],
    "WHATQ":      ["YOU", "HOLD", "YOU’RE", "YOUR", "U", "DONE", "UH UH", "LIKE", 'YOU ARE', "UH HUH", "UR", "NEXT", "WHATQ", "SURE"],
    "DONE":       ["SURE", "UH HUH", "NEXT", "WHATQ", "YOUR", "UR", "YOU’RE", "HOLD", 'LIKE', "YOU", "U", "YOU ARE", "UH UH", "DONE"],
    "NEXT":       ["WHATQ", "UH HUH", "UH UH", "YOUR", "HOLD", "SURE", 'NEXT', "LIKE", "DONE", "YOU ARE", "UR", "YOU’RE", "U", "YOU"],
    "HOLD":       ["YOU ARE", "U", "DONE", "UH UH", "YOU", "UR", "SURE", "WHATQ", 'YOU’RE', "NEXT", "HOLD", "UH HUH", "YOUR", "LIKE"],
    "SURE":       ["YOU ARE", "DONE", "LIKE", "YOU’RE", "YOU", "HOLD", "UH HUH", "UR", 'SURE', "U", "WHATQ", "NEXT", "YOUR", "UH UH"],
    "LIKE":       ["YOU’RE", "NEXT", "U", "UR", "HOLD", "DONE", "UH UH", "WHATQ", 'UH HUH', "YOU", "LIKE", "SURE", "YOU ARE", "YOUR"],
}

let looksPool;
let wordsPool;

let look;
let lookLocation;

let word;
let words;
let correctButton;
let result;
let iterationIndex;
let stoppingPoint;

let looking;
let wording;
let bothing;

function moduleSetup() {
    console.log("WhosOnFirst: loading new");

    looksPool = new PracticePool("looks", Object.keys(LOOKS), "Who's On First/assets/looks", "png", 96, 22);
    wordsPool = new PracticePool("words", Object.keys(WORDS), "Who's On First/assets/words", "png", 56.5, 30);
    looksPool.setup();
    wordsPool.setup();
    selectPracticePool("looks");

    newInstance();
}

function moduleOnload() {
    practicePoolsOnload();
}

function newInstance() {
    looking = document.querySelector("#mode-look").checked;
    wording = document.querySelector("#mode-word").checked;
    bothing = document.querySelector("#mode-both").checked;
    
    result = true;

    // display
    if (looking || bothing) {
        look = looksPool.query();
        lookLocation = LOOKS[look];
    } else {
        lookLocation = rInt(6);
        look = LOOK_LOCATIONS[lookLocation];
    }
    document.querySelector("#display").textContent = look == "empty" ? "" : look;
    console.log(`WhosOnFirst: display says ${look}, looking at ${lookLocation}`);

    // buttons
    if (looking) {
        correctButton = lookLocation;
        document.querySelectorAll("#buttons button").forEach(element=>{
            element.innerHTML = `<svg width="71.5px" height="40px" xmlns="http://www.w3.org/2000/svg">
                <path
                    style="fill:var(--background);fill-opacity:0;stroke:var(--background);stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
                    d="m 3,20 c 0,0 9.3,-17 32.75,-17 23.44,0 32.75,17 32.75,17 0,0 -9.189,17 -32.75,17 -23.56,0 -32.75,-17 -32.75,-17 z"/>
                <ellipse
                    style="fill:var(--background);fill-opacity:1;stroke-opacity:0"
                    cx="35.75" cy="20" rx="9.5" ry="9.5"/>
            </svg>`
        });
    } else {
        word = wordsPool.query();
        words = WORDS[word].slice();
        iterationIndex = 0;
        stoppingPoint = Math.min(words.indexOf(word) + 1, 9);
    }

    // lights
    document.querySelector("#lights").innerHTML = '';
    if (wording || bothing) {
        document.querySelector("#lights").innerHTML = "<div class='light'></div>".repeat(stoppingPoint);
    }

    if (wording || bothing) newWordIteration();
}

function newWordIteration() {
    iterationIndex++;
    if (words[0] == word) correctButton = lookLocation;
    else correctButton = spliced([0,1,2,3,4,5], lookLocation, 1)[rInt(5)];
    console.log(`WhosOnFirst: looking at ${word}, ${15 - words.length}th word iteration, press ${correctButton} (${words[0]})`);
    
    let allowedButtons = words.slice(1);
    if (allowedButtons.length > 5) allowedButtons.splice(allowedButtons.indexOf(word), 1);
    
    document.querySelectorAll("#buttons button").forEach((element,index)=>{
        let thisButton;
        if (index == lookLocation) thisButton = word;
        else if (index == correctButton) thisButton = words[0];
        else {
            thisButton = allowedButtons.splice(rInt(allowedButtons.length),1)[0];
        }
        if (thisButton == "WHATQ") thisButton = "WHAT?";
        element.textContent = thisButton;
    });
    words.splice(0, 1);
}

function buttonPress(position) {
    if (position == correctButton) {
        document.querySelectorAll("#buttons button").forEach((element, index) => {
            if (looking || iterationIndex >= stoppingPoint || index != lookLocation) {
                setTimeout(()=>{element.classList.add("down")}, 30*index);
                setTimeout(()=>{element.classList.remove("down")}, 500 + 30*index);
            }
        });

        if (wording || bothing) {
            if (iterationIndex >= stoppingPoint) {
                if (bothing) looksPool.result(result, look);
                wordsPool.result(result, word);
                newInstance();
            }
            else {
                document.querySelectorAll("#lights .light")[stoppingPoint - iterationIndex].classList.add("on");
                newWordIteration();
            }
        }
        else {
            looksPool.result(result, look);
            newInstance();
        }
    } else {
        result = false;
        strike();
    }
}
