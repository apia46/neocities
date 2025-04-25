function practicePoolOnload() {
    document.querySelector("#practice-pool").innerHTML = `
        <div class="symbols"></div>
        <br>
        <button>Reset</button>
    `;

    let contents = "";
    PRACTICE_POOL_SYMBOLS.forEach(symbol=>{
        contents += `
            <div class="symbol" state="out-of-pool">
                <img src="../${PRACTICE_POOL_IMAGE_DIRECTORY}/${symbol}.${PRACTICE_POOL_IMAGE_FILETYPE}">
                <div class="overlay">3/5</div>
            </div>`
    });
    document.querySelector("#practice-pool .symbols").innerHTML = contents;
}
