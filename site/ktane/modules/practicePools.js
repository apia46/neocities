CONCURRENT_UNLEARNTS = 3;
STREAK_REQUIRED = 3;

function practicePoolSettings() {
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

function practicePoolOnload() {
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

    columns
    
    constructor(ID, SYMBOLS, IMAGE_DIRECTORY, IMAGE_FILETYPE) {
        this.ID = ID;
        this.SYMBOLS = SYMBOLS;
        this.IMAGE_DIRECTORY = IMAGE_DIRECTORY;
        this.IMAGE_FILETYPE = IMAGE_FILETYPE;
    }

    setup() {
        this.unlearntBag = [];
        this.learntBag = [];
        this.consistency = {};
        
        if (localStorage[`ktane_practicePool_${MODULE_ID}`]) {
            console.log("practicePool: loading from localStorage");
    
            let retrieved = JSON.parse(localStorage[`ktane_practicePool_${MODULE_ID}`]);
            this.unlearntPool = retrieved.unlearnt;
            this.learntPool = retrieved.learnt;
        } else {
            console.log("practicePool: loading new");
    
            this.unlearntPool = [];
            this.learntPool = [];
    
            for (let i = 0; i < CONCURRENT_UNLEARNTS; i++) this.newUnlearnt();
        }
        document.querySelector("#practice-pool").innerHTML = `
            <div id="practice-pool-wrapper"><div class="symbols lines"></div></div>
            <button class="reset">Reset</button>
            <input type="checkbox" id="manual-edit" class="toggle-button"><label for="manual-edit">Manual Edit</label>
            <div id="practice-pool-display">
                <span class="title">Display</span>
                <div class="dimensions">
                    <input id="practice-pool-columns" type="number" min="3" value="10" pattern="[0-9]">
                    <span class="height"></span>
                </div>
                <div class="select">
                    <select>
                        <option value="lines">Lines</option>
                        <option value="square-tiling">Square Tiling</option>
                        <option value="hexagon-tiling">Hexagonal Tiling</option>
                    </select>
                </div>
            </div>
        `;
        document.querySelector("#practice-pool .reset").onclick = this.reset;
        document.querySelector("#practice-pool-columns").oninput = this.changeDimensions;
        document.querySelector("#practice-pool-display select").oninput = event=>this.switchDisplay(event.target.value);

        document.querySelector("#practice-pool .symbols").innerHTML = this.SYMBOLS.map(symbol=>`
            <div class="symbol" id="practice-pool-${symbol}">
                <img src="../${this.IMAGE_DIRECTORY}/${symbol}.${this.IMAGE_FILETYPE}">
                <div class="overlay"></div>
            </div>`
        ).join("");
        document.querySelectorAll("#practice-pool .symbols .symbol").forEach((element, index)=>{element.onclick = ()=>this.symbolClicked(this.SYMBOLS[index])});
    
        this.columns = 10;
        
        this.updateGridSizing();
        this.updateText();
    }
    switchDisplay() {
        document.querySelector("#practice-pool-wrapper").className = document.querySelector('#practice-pool-display select').value;
        this.updateGridSizing();
    }
    changeDimensions() {
        let value = document.querySelector('#practice-pool-columns').value;
        if (!value || value < 3) document.querySelector('#practice-pool-columns').value = 10;
        document.querySelector('#practice-pool-columns').value = Math.floor(document.querySelector('#practice-pool-columns').value);
        this.columns = document.querySelector('#practice-pool-columns').value;
        this.updateGridSizing();
    }
    updateGridSizing() {
        let rows;
        switch (document.querySelector("#practice-pool-wrapper").className) {
            case "hexagon-tiling": rows = 1 + Math.floor(this.SYMBOLS.length / this.columns) + (this.SYMBOLS.length % this.columns > Math.floor(this.columns/2) ? 0.5 : 0);
            break;
            default: rows = Math.ceil(this.SYMBOLS.length / this.columns);
        }
        document.querySelector('#practice-pool-wrapper').style.setProperty('--columns', this.columns);
        document.querySelector('#practice-pool-wrapper').style.setProperty('--rows', rows);
        document.querySelector('#practice-pool-display .height').textContent = `× ${Math.ceil(rows)}`;
    }    

    updateText() {
        this.SYMBOLS.forEach(symbol=>{
            let symbolElement = document.querySelector(`#practice-pool-${symbol}`);
            symbolElement.setAttribute("state", this.unlearntPool.includes(symbol)?"unlearnt":this.learntPool.includes(symbol)?"learnt":"out-of-pool");
            symbolElement.querySelector(".overlay").textContent = `${this.consistency[symbol]?.length&&this.consistency[symbol].reduce((acc,x)=>x?acc+1:acc)+0||0}/${this.consistency[symbol]?.length||0}`;
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
        this.unlearntPool.push(this.SYMBOLS.find(symbol=>!this.learntPool.includes(symbol) && !this.unlearntPool.includes(symbol)));
    }

    query() {
        if (this.unlearntPool.length < CONCURRENT_UNLEARNTS && this.SYMBOLS.length > this.unlearntPool.length + this.learntPool.length) this.newUnlearnt();
        let toReturn;
        if (this.unlearntPool.length > 0 && (rInt(2) || !this.learntPool.length)) {
            // unlearnt
            console.log("practicePool: pulling from unlearnt bag")
            if (!this.unlearntBag.length) [].push.apply(this.unlearntBag, ShuffleFisherYates(this.unlearntPool.slice()));
            toReturn = this.unlearntBag.shift();
        } else {
            // learnt
            console.log("practicePool: pulling from learnt bag")
            if (!this.learntBag.length) [].push.apply(this.learntBag, ShuffleFisherYates(this.learntPool.slice()));
            toReturn = this.learntBag.shift();
        }
        this.updateText();
        return toReturn;
    }

    result(result, symbol) {
        if (!this.consistency[symbol]) this.consistency[symbol] = [];
        this.consistency[symbol].push(result);
        if (this.consistency[symbol].length > STREAK_REQUIRED) this.consistency[symbol].shift();
        if (!result && this.learntPool.includes(symbol)) this.unlearn(symbol);
        if (this.unlearntPool.includes(symbol) && this.consistency[symbol].length == STREAK_REQUIRED && this.consistency[symbol].reduce((acc,x)=>acc&&x)) this.learn(symbol);
        let symbolElement = document.querySelector(`#practice-pool-${symbol}`);
        if (result) {
            symbolElement.classList.add("flash-good");
            setTimeout(()=>{symbolElement.classList.remove("flash-good")}, 250);
        } else {
            symbolElement.classList.add("flash-bad");
            setTimeout(()=>{symbolElement.classList.remove("flash-bad")}, 250);
        }
        localStorage[`ktane_practicePool_${MODULE_ID}`] = JSON.stringify({
            learnt: this.learntPool,
            unlearnt: this.unlearntPool
        });
    }

    reset() {
        localStorage.removeItem(`ktane_practicePool_${MODULE_ID}`);
        generateBomb();
        this.updateText();
    }

    symbolClicked(symbol) {
        if (document.querySelector("#manual-edit").checked) {
            switch (document.querySelector(`#practice-pool-${symbol}`).getAttribute('state')) {
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
        this.updateText();
    }
}
