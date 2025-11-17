var buttons;

var storage = {
    question:"",
    voters:[[],[],[]],
    rows:[0,0,0],
    rowsMax:0,
    vetoed:false,
    numVoters:0,
}
window.onload = ()=>{
    question.value = "";
    if (localStorage.voting) {
        storage = JSON.parse(localStorage.voting);
        question.value = storage.question;
        if (storage.question) questionSet()
        for (let i=0;i<storage.rowsMax;i++) {
            results.innerHTML += "<tr><td></td><td></td><td></td></tr>";
        }
        storage.voters.forEach((voters,column)=>{
            voters.forEach((value,row)=>{
                results.querySelector(`tr:nth-child(${row+1}) td:nth-child(${column+1})`).innerText = value;
            });
        });
        setResult();
    }

    buttons = [yea, nay, abstain, veto];
    questionlength.innerText = question.value;
    question.style.setProperty("--length", questionlength.offsetWidth);
    question.addEventListener("input", event=>{
        questionlength.innerText = question.value;
        if (event.key === "Enter") questionSet();
        question.style.setProperty("--length", questionlength.offsetWidth);
    });
    submit.addEventListener("click", questionSet);
    buttons.forEach(button=>{
        button.checked = false;
        button.addEventListener("click", selected);
    });
    confirmed.setAttribute("disabled", "true");
    confirmed.addEventListener("click", ()=>{
        var index;
        storage.numVoters += 1;
        buttons.forEach((button,i)=>{if (button.checked) index = i});
        if (index == 3) {
            storage.vetoed = true;
        } else {
            storage.rows[index] += 1;
            if (storage.rows[index] > storage.rowsMax) {
                storage.rowsMax = storage.rows[index];
                results.innerHTML += "<tr><td></td><td></td><td></td></tr>";
            }
            results.querySelector(`tr:nth-child(${storage.rows[index]}) td:nth-child(${index+1})`).innerText = voter.value;
            storage.voters[index].push(voter.value);
        }
        voter.value = "";
        buttons.forEach(button=>{button.checked=false})
        confirmed.setAttribute("disabled", "true");
        localStorage.voting = JSON.stringify(storage);
        setResult();
    });
}

function setResult() {
    votercount.innerText = `${storage.numVoters} voters`;
    if (storage.vetoed) {
        result.innerHTML = `<span class="fontawesome">&#xf05e;</span><span id="vetotext"> Vetoed by ${voter.value}!`;
        result.style.setProperty("color","#dd6666");
    } else if (storage.rows[0] > storage.rows[1]) {
        result.innerHTML = `<span class="fontawesome">&#xf00c;</span><span id="vetotext"> Yea (+${storage.rows[0]-storage.rows[1]})`;
        result.style.setProperty("color","#50e0d4");
    } else if (storage.rows[1] > storage.rows[0]) {
        result.innerHTML = `<span class="fontawesome">&#xf00d;</span><span id="vetotext"> Nay (-${storage.rows[1]-storage.rows[0]})`;
        result.style.setProperty("color","#ec903a");
    } else {
        result.innerHTML = `<span class="fontawesome">&#x3f;</span><span id="vetotext"> Undecided`;
        result.style.setProperty("color","#777888");
    }
}

function selected() {
    confirmed.removeAttribute("disabled");
}

function questionSet() {
    storage.question = question.value;
    document.body.classList.add("questionSet");
    question.disabled = true;
    localStorage.voting = JSON.stringify(storage);
}

function clearVotes() {
    localStorage.removeItem("voting");
    window.location.reload();
}