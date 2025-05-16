const LOOK_LOCATIONS = ["↖", "↗", "←", "→", "↙", "↘"];

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

    looksPool = new PracticePool("looks", Object.keys(LOOKS), `${DIRECTORY}/assets/looks`, "png", 96, 22);
    wordsPool = new PracticePool("words", Object.keys(WORDS), `${DIRECTORY}/assets/words`, "png", 56.5, 30);
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
        if (thisButton == "empty") thisButton = "";
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
