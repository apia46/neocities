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
    console.log("New practice pool");

    unlearntPool = [];
    learntPool = [];
    unlearntBag = [];
    learntBag = [];
    practicePoolSymbolIndex = 0;
    practicePoolQueryIndex = 0;
    consistency = {};

    for (let i = 0; i < CONCURRENT_UNLEARNTS; i++) newUnlearnt();

    document.querySelector("#practice-pool").innerHTML = `
        <div class="symbols"></div>
        <br>
        <button>Reset</button>
    `;
    document.querySelector("#practice-pool .symbols").innerHTML = PRACTICE_POOL_SYMBOLS.map(symbol=>`
        <div class="symbol" id="practice-pool-${symbol}">
            <img src="../${PRACTICE_POOL_IMAGE_DIRECTORY}/${symbol}.${PRACTICE_POOL_IMAGE_FILETYPE}">
            <div class="overlay"></div>
        </div>`
    ).join("");
}

function practicePoolOnload() {
    practicePoolUpdateText();
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
    console.log(unlearntPool)
    unlearntPool.splice(unlearntPool.indexOf(symbol),1);
    console.log(unlearntPool)
    learntPool.push(symbol);
}

function newUnlearnt() {
    unlearntPool.push(PRACTICE_POOL_SYMBOLS[practicePoolSymbolIndex]);
    practicePoolSymbolIndex++;
}

function practicePoolQuery() {
    if (unlearntPool.length < CONCURRENT_UNLEARNTS) newUnlearnt();
    let toReturn;
    if (practicePoolQueryIndex % 2 == 0 || !learntPool.length) {
        // unlearnt
        if (!unlearntBag.length) [].push.apply(unlearntBag, ShuffleFisherYates(unlearntPool.slice()));
        toReturn = unlearntBag.shift();
    } else {
        // learnt
        if (!learntBag.length) [].push.apply(learntBag, ShuffleFisherYates(unlearntPool.slice()));
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
}
