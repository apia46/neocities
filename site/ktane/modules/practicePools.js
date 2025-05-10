CONCURRENT_UNLEARNTS = 3;
STREAK_REQUIRED = 3;

let singularPool;

function practicePoolsSettings() {
    if (typeof(localStorage.ktane_settings_practicePool_concurrentUnlearnts) == "undefined") localStorage.ktane_settings_practicePool_concurrentUnlearnts = 3;
    if (typeof(localStorage.ktane_settings_practicePool_streakRequired) == "undefined") localStorage.ktane_settings_practicePool_streakRequired = 3;
    return `
    <tr><th colspan="100%" class="section">Practice Pool</th></tr>
    <tr>
        <th><u title="The number of symbols that can be in the unlearnt pool (yellow) at the same time. Set this to zero to prevent new symbols from being added to the unlearnt pool.">Concurrent Unlearnts</u></th>
        <td><span>0 <input id="concurrent-unlearnts" type="range" min="0" max="10" value="${localStorage.ktane_settings_practicePool_concurrentUnlearnts}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value}'\`)"> 10</span></td>
        <th><u title="The number of consecutive correct queries of a symbol required to count as learnt (green)">Streak Required</u></th>
        <td><span>1 <input id="streak-required" type="range" min="1" max="10" value="${localStorage.ktane_settings_practicePool_streakRequired}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value}'\`)"> 10</span></td>
    </tr>
    `
}

function practicePoolsOnload() {
    let concurrentUnlearntsSlider = document.querySelector("#concurrent-unlearnts");
    concurrentUnlearntsSlider.parentElement.style.setProperty('--value', `'${concurrentUnlearntsSlider.value}'`);
    CONCURRENT_UNLEARNTS = parseInt(concurrentUnlearntsSlider.value);
    concurrentUnlearntsSlider.onchange = ()=>{
        localStorage.ktane_settings_practicePool_concurrentUnlearnts = parseInt(concurrentUnlearntsSlider.value);;
        CONCURRENT_UNLEARNTS = parseInt(concurrentUnlearntsSlider.value);
    }

    let streakRequiredSlider = document.querySelector("#streak-required");
    streakRequiredSlider.parentElement.style.setProperty('--value', `'${streakRequiredSlider.value}'`);
    STREAK_REQUIRED = parseInt(streakRequiredSlider.value);
    streakRequiredSlider.onchange = ()=>{
        localStorage.ktane_settings_practicePool_streakRequired = parseInt(streakRequiredSlider.value);
        STREAK_REQUIRED = parseInt(streakRequiredSlider.value);
    }
}

function selectPracticePool(id) {
    document.querySelectorAll(".practice-pool").forEach(element=>{element.classList.add("hidden")});
    document.querySelector(`#${id}`).classList.remove("hidden");
    document.querySelector(`#pool-${id}`).checked = true;
}

const PracticePool = class {
    SYMBOLS;
    ID;
    IMAGE_DIRECTORY;
    IMAGE_FILETYPE;

    unlearntPool;
    learntPool;
    unlearntBag;
    learntBag;
    consistency;

    columns;
    previousQuery;

    cellWidth;
    cellHeight;
    
    constructor(ID, SYMBOLS, IMAGE_DIRECTORY, IMAGE_FILETYPE, cellWidth, cellHeight) {
        this.ID = ID;
        this.SYMBOLS = SYMBOLS;
        this.IMAGE_DIRECTORY = IMAGE_DIRECTORY;
        this.IMAGE_FILETYPE = IMAGE_FILETYPE;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }

    setup() {
        this.unlearntBag = [];
        this.learntBag = [];
        this.consistency = {};
        
        if (localStorage[`ktane_practicePool_${MODULE_ID}_${this.ID}`]) {
            this.log("loading from localStorage");
    
            let retrieved = JSON.parse(localStorage[`ktane_practicePool_${MODULE_ID}_${this.ID}`]);
            this.unlearntPool = retrieved.unlearnt;
            this.learntPool = retrieved.learnt;
        } else {
            this.log("loading new");
    
            this.unlearntPool = [];
            this.learntPool = [];
    
            for (let i = 0; i < Math.max(CONCURRENT_UNLEARNTS, 1); i++) this.newUnlearnt();
        }
        document.querySelector(`#${this.ID}`).innerHTML = `
            <div class="practice-pool-wrapper" ${this.cellWidth?`style="--cell-width:${this.cellWidth}px; --cell-height:${this.cellHeight}px"`:""}><div class="symbols lines"></div></div>
            <button class="reset">Reset</button>
            <input type="checkbox" id="manual-edit-${this.ID}" class="toggle-button"><label for="manual-edit-${this.ID}">Manual Edit</label>
            <div class="practice-pool-display">
                <span class="title">Display</span>
                <div class="dimensions">
                    <input class="practice-pool-columns" type="number" min="3" value="10" pattern="[0-9]">
                    <span class="height"></span>
                </div>
                <div class="select">
                    <select>
                        ${this.cellWidth?`
                            <option value="lines">Lines</option>
                            <option value="square-tiling">Rectangle Tiling</option>
                        `:`
                            <option value="lines">Lines</option>
                            <option value="square-tiling">Square Tiling</option>
                            <option value="hexagon-tiling">Hexagonal Tiling</option>
                        `}
                    </select>
                </div>
            </div>
        `;
        document.querySelector(`#${this.ID} .reset`).onclick = ()=>{this.reset()};
        document.querySelector(`#${this.ID} .practice-pool-columns`).oninput = ()=>{this.changeDimensions()};
        document.querySelector(`#${this.ID} .practice-pool-display select`).oninput = event=>{this.switchDisplay(event.target.value)};

        document.querySelector(`#${this.ID} .symbols`).innerHTML = this.SYMBOLS.map(symbol=>`
            <div class="symbol" value="${symbol}">
                <img src="../${this.IMAGE_DIRECTORY}/${symbol}.${this.IMAGE_FILETYPE}">
                <div class="overlay"></div>
            </div>`
        ).join("");
        document.querySelectorAll(`#${this.ID} .symbols .symbol`).forEach((element, index)=>{element.onclick = ()=>{this.symbolClicked(this.SYMBOLS[index])}});
    
        this.columns = 10;

        if (document.querySelector("#practice-pool-selector")) {
            document.querySelector("#practice-pool-selector").innerHTML += `<input
                type="radio" name="selected-pool" id="pool-${this.ID}" onclick="selectPracticePool('${this.ID}')"><label for="pool-${this.ID}">${this.ID.toUpperCase()}</label
            >`;
        }
        
        this.updateLocalStorage();
        this.updateGridSizing();
        this.updateText();
    }
    switchDisplay() {
        document.querySelector(`#${this.ID} .practice-pool-wrapper`).setAttribute("value", document.querySelector(`#${this.ID} .practice-pool-display select`).value);
        this.updateGridSizing();
    }
    changeDimensions() {
        let value = document.querySelector(`#${this.ID} .practice-pool-columns`).value;
        if (!value || value < 3) document.querySelector(`#${this.ID} .practice-pool-columns`).value = 10;
        document.querySelector(`#${this.ID} .practice-pool-columns`).setAttribute("value", Math.floor(document.querySelector(`#${this.ID} .practice-pool-columns`).value));
        this.columns = document.querySelector(`#${this.ID} .practice-pool-columns`).value;
        this.updateGridSizing();
    }
    updateGridSizing() {
        let rows;
        switch (document.querySelector(`#${this.ID} .practice-pool-wrapper`).value) {
            case "hexagon-tiling": rows = 1 + Math.floor(this.SYMBOLS.length / this.columns) + (this.SYMBOLS.length % this.columns > Math.floor(this.columns/2) ? 0.5 : 0);
            break;
            default: rows = Math.ceil(this.SYMBOLS.length / this.columns);
        }
        document.querySelector(`#${this.ID} .practice-pool-wrapper`).style.setProperty('--columns', this.columns);
        document.querySelector(`#${this.ID} .practice-pool-wrapper`).style.setProperty('--rows', rows);
        document.querySelector(`#${this.ID} .practice-pool-display .height`).textContent = `× ${Math.ceil(rows)}`;
    }    

    updateText() {
        this.SYMBOLS.forEach(symbol=>{
            let symbolElement = document.querySelector(`#${this.ID} .symbol[value="${symbol}"]`);
            symbolElement.setAttribute("state", this.unlearntPool.includes(symbol)?"unlearnt":this.learntPool.includes(symbol)?"learnt":"out-of-pool");
            symbolElement.querySelector(`#${this.ID} .overlay`).textContent = `${this.consistency[symbol]?.length&&this.consistency[symbol].reduce((acc,x)=>x?acc+1:acc)+0||0}/${this.consistency[symbol]?.length||0}`;
        });
    }

    unlearn(symbol) {
        this.learntPool.splice(this.learntPool.indexOf(symbol),1);
        this.unlearntPool.push(symbol);
    }

    learn(symbol) {
        this.unlearntPool.splice(this.unlearntPool.indexOf(symbol),1);
        this.learntPool.push(symbol);
    }

    newUnlearnt() {
        this.log("new unlearnt");
        this.unlearntPool.push(this.SYMBOLS.find(symbol=>!this.learntPool.includes(symbol) && !this.unlearntPool.includes(symbol)));
    }

    query(rerolled) {
        if (rerolled) this.log("rerolling!");
        if (this.unlearntPool.length < CONCURRENT_UNLEARNTS && this.SYMBOLS.length > this.unlearntPool.length + this.learntPool.length) this.newUnlearnt();
        let toReturn;
        if (this.unlearntPool.length > 0 && (this.learntPool.length < 3 || rInt(2))) {
            // unlearnt
            this.log("pulling from unlearnt bag")
            if (!this.unlearntBag.length) [].push.apply(this.unlearntBag, ShuffleFisherYates(this.unlearntPool.slice()));
            toReturn = this.unlearntBag.shift();
        } else {
            // learnt
            this.log("pulling from learnt bag")
            if (!this.learntBag.length) [].push.apply(this.learntBag, ShuffleFisherYates(this.learntPool.slice()));
            toReturn = this.learntBag.shift();
        }
        // hopefully make identical consecutive queries a bit less likely 
        if (!rerolled && toReturn == this.previousQuery && rInt(2)) this.query(true);
        this.updateText();
        this.previousQuery = toReturn;
        return toReturn;
    }

    result(result, symbol) {
        if (!this.consistency[symbol]) this.consistency[symbol] = [];
        this.consistency[symbol].push(result);
        if (this.consistency[symbol].length > STREAK_REQUIRED) this.consistency[symbol].shift();
        if (!result && this.learntPool.includes(symbol)) this.unlearn(symbol);
        if (this.unlearntPool.includes(symbol) && this.consistency[symbol].length == STREAK_REQUIRED && this.consistency[symbol].reduce((acc,x)=>acc&&x)) this.learn(symbol);
        let symbolElement = document.querySelector(`#${this.ID} .symbol[value="${symbol}"]`);
        if (result) {
            symbolElement.classList.add("flash-good");
            setTimeout(()=>{symbolElement.classList.remove("flash-good")}, 250);
        } else {
            symbolElement.classList.add("flash-bad");
            setTimeout(()=>{symbolElement.classList.remove("flash-bad")}, 250);
        }
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage[`ktane_practicePool_${MODULE_ID}_${this.ID}`] = JSON.stringify({
            learnt: this.learntPool,
            unlearnt: this.unlearntPool
        });
    }

    reset() {
        this.log(`resetting`);
        localStorage.removeItem(`ktane_practicePool_${MODULE_ID}_${this.ID}`);
        generateBomb();
    }

    symbolClicked(symbol) {
        if (document.querySelector(`#manual-edit-${this.ID}`).checked) {
            switch (document.querySelector(`#${this.ID} .symbol[value="${symbol}"]`).getAttribute('state')) {
                case "out-of-pool":
                    this.unlearntPool.push(symbol);
                break;
                case "unlearnt":
                    this.unlearntPool.splice(this.unlearntPool.indexOf(symbol),1);
                    this.learntPool.push(symbol);
                break;
                case "learnt":
                    this.learntPool.splice(this.learntPool.indexOf(symbol),1);
                break;
            }
        }
        this.updateLocalStorage();
        this.updateText();
    }

    log(text) {
        console.log(`practicePool_${this.ID}: ${text}`);
    }
}
