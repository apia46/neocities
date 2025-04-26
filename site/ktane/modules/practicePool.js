CONCURRENT_UNLEARNTS = 3;
STREAK_REQUIRED = 3;

let unlearntPool;
let learntPool;
let unlearntBag;
let learntBag;
let practicePoolSymbolIndex;
let practicePoolQueryIndex;
let consistency;

function practicePoolSetup() {
    unlearntBag = [];
    learntBag = [];
    practicePoolQueryIndex = 0;
    consistency = {};
    
    if (string = localStorage[`ktane_practicePool_${MODULE_ID}`]) {
        console.log("practicePool: loading from localStorage");

        let retrieved = JSON.parse(string);
        unlearntPool = retrieved.unlearnt;
        learntPool = retrieved.learnt;
        practicePoolSymbolIndex = unlearntPool.length + learntPool.length - 1;
    } else {
        console.log("practicePool: loading new");

        unlearntPool = [];
        learntPool = [];
        practicePoolSymbolIndex = 0;

        for (let i = 0; i < CONCURRENT_UNLEARNTS; i++) newUnlearnt();
        practicePoolUpdateText();
    }
    document.querySelector("#practice-pool").innerHTML = `
        <div class="symbols"></div>
        <br>
        <button onclick="practicePoolReset()">Reset</button>
    `;
    document.querySelector("#practice-pool .symbols").innerHTML = PRACTICE_POOL_SYMBOLS.map(symbol=>`
        <div class="symbol" id="practice-pool-${symbol}">
            <img src="../${PRACTICE_POOL_IMAGE_DIRECTORY}/${symbol}.${PRACTICE_POOL_IMAGE_FILETYPE}">
            <div class="overlay"></div>
        </div>`
    ).join("");
}

function practicePoolSettings() {
    if (typeof(localStorage.ktane_settings_practicePool_concurrentUnlearnts) == "undefined") localStorage.ktane_settings_practicePool_concurrentUnlearnts = 3;
    if (typeof(localStorage.ktane_settings_practicePool_streakRequired) == "undefined") localStorage.ktane_settings_practicePool_streakRequired = 3;
    return `
    <tr><th colspan="100%" class="section">Practice Pool</th></tr>
    <tr>
        <th><u title="The number of symbols that can be in the unlearnt pool (yellow) at the same time">Concurrent Unlearnts</u></th>
        <td><span>1 <input id="concurrent-unlearnts" type="range" min="1" max="10" value="${localStorage.ktane_settings_practicePool_concurrentUnlearnts}" class="slider" oninput="this.parentElement.style.setProperty('--value', \`'\${this.value}'\`)"> 10</span></td>
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
        localStorage.ktane_settings_practicePool_streakRequired = parseInt(streakRequiredSlider.value);;
        STREAK_REQUIRED = parseInt(streakRequiredSlider.value);
    }
}

function practicePoolUpdateText() {
    PRACTICE_POOL_SYMBOLS.forEach(symbol=>{
        let symbolElement = document.querySelector(`#practice-pool-${symbol}`);
        symbolElement.setAttribute("state", unlearntPool.includes(symbol)?"unlearnt":learntPool.includes(symbol)?"learnt":"out-of-pool");
        symbolElement.querySelector(".overlay").innerText = `${consistency[symbol]?.length&&consistency[symbol].reduce((acc,x)=>x?acc+1:acc)+0||0}/${consistency[symbol]?.length||0}`;
    });
}

function unlearn(symbol) {
    learntPool.splice(learntPool.indexOf(symbol),1);
    unlearntPool.push(symbol);
}

function learn(symbol) {
    unlearntPool.splice(unlearntPool.indexOf(symbol),1);
    learntPool.push(symbol);
}

function newUnlearnt() {
    unlearntPool.push(PRACTICE_POOL_SYMBOLS[practicePoolSymbolIndex]);
    practicePoolSymbolIndex++;
}

function practicePoolQuery() {
    if (unlearntPool.length < CONCURRENT_UNLEARNTS && PRACTICE_POOL_SYMBOLS.length >= unlearntPool.length) newUnlearnt();
    let toReturn;
    if (unlearntPool.length < PRACTICE_POOL_SYMBOLS.length && (practicePoolQueryIndex % (Math.max(Math.floor(learntBag.length / 4), 2)) == 0 || !learntPool.length)) {
        // unlearnt
        console.log("practicePool: pulling from unlearnt bag")
        if (!unlearntBag.length) [].push.apply(unlearntBag, ShuffleFisherYates(unlearntPool.slice()));
        toReturn = unlearntBag.shift();
    } else {
        // learnt
        console.log("practicePool: pulling from learnt bag")
        if (!learntBag.length) [].push.apply(learntBag, ShuffleFisherYates(learntPool.slice()));
        toReturn = learntBag.shift();
    }
    practicePoolQueryIndex++;
    practicePoolUpdateText();
    return toReturn;
}

function practicePoolResult(result, symbol) {
    if (!consistency[symbol]) consistency[symbol] = [];
    consistency[symbol].push(result);
    if (consistency[symbol].length > STREAK_REQUIRED) consistency[symbol].shift();
    if (!result && learntPool.includes(symbol)) unlearn(symbol);
    if (unlearntPool.includes(symbol) && consistency[symbol].length == STREAK_REQUIRED && consistency[symbol].reduce((acc,x)=>acc&&x)) learn(symbol);
    let symbolElement = document.querySelector(`#practice-pool-${symbol}`);
    if (result) {
        symbolElement.classList.add("flash-good");
        setTimeout(()=>{symbolElement.classList.remove("flash-good")}, 250);
    } else {
        symbolElement.classList.add("flash-bad");
        setTimeout(()=>{symbolElement.classList.remove("flash-bad")}, 250);
    }
    localStorage[`ktane_practicePool_${MODULE_ID}`] = JSON.stringify({
        learnt: learntPool,
        unlearnt: unlearntPool
    });
}

function practicePoolReset() {
    localStorage.removeItem(`ktane_practicePool_${MODULE_ID}`);
    generateBomb();
    practicePoolUpdateText();
}
