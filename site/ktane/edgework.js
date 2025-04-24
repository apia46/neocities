const CHARACTERS = "ABCDEEFGHIJKLMNPQRSTUVWXZ0123456789";
const LETTERS = "ABCDEEFGHIJKLMNPQRSTUVWXZ";
const DIGITS = "0123456789";
const INDICATORS = ["SND", "CLR", "CAR", "IND", "FRQ", "SIG", "NSA", "MSA", "TRN", "BOB", "FRK", "NLL"];
const PORTS = [["Serial", "Parallel"], ["DVI-D", "RJ-45", "PS/2", "Stereo RCA"]];
const PORTS_SHORTEN = {
    "Serial": "se",
    "Parallel": "pa",
    "DVI-D": "DV",
    "RJ-45": "RJ",
    "PS/2": "PS",
    "Stereo RCA": "RC"
};
WIDGETS = 5;

let serial;
let batteries;
let holders;
let indicators;
let unlits;
let lits;
let plates;
let ports;

function edgeworkSetup() {
    console.log("New edgework");
    
    serial = CHARACTERS[rInt(35)] + CHARACTERS[rInt(35)] + DIGITS[rInt(10)] + LETTERS[rInt(25)] + LETTERS[rInt(25)] + DIGITS[rInt(10)];
    batteries = 0;
    holders = 0;
    indicators = [];
    unlits = 0;
    lits = 0;
    plates = [];
    ports = [];

    let availableIndicators = INDICATORS.slice(0,11);
    for (let i = 0; i < WIDGETS; i++) {
        switch (rInt(3)) {
            case 0:
                batteries += rInt(2) + 1;
                holders += 1;
                break;
            case 1:
                let indInd = rInt(availableIndicators.length);
                let thisIndicator = availableIndicators.length?availableIndicators[indInd]:"NLL";
                if (rInt(5) < 2) {
                    thisIndicator = thisIndicator.toLowerCase();
                    unlits += 1;
                } else {
                    lits += 1;
                }
                indicators.push(thisIndicator);
                availableIndicators.splice(indInd, 1);
                break;
            case 2:
                let thisPlate = [];
                PORTS[rInt(2)].forEach((port)=>{
                    if (rInt(2)) {
                        thisPlate.push(port);
                        if (!ports.includes(port)) ports.push(port);
                    }
                });
                plates.push(thisPlate);
                break;
        }
    }

    document.querySelector("#edgework").innerHTML = `
        <tbody>
            <tr>
                <th>Serial</th>
                ${batteries?'<th><u title="battery count / holder count">Batteries</u></th>':''}
                ${indicators.length?`<th colspan="${indicators.length}"><u title="upper: lit; lower: unlit">Indicators</u></th>`:''}
                ${plates.length?`<th colspan="${plates.length}"><u title="[] contains a port plate; ports abbreviated to first two letters">Port Plates</u></th>`:''}
            </tr>
            <tr>
                <td>${serial}</td>
                ${batteries?`<td>${batteries}/${holders}</td>`:''}
                ${indicators.map(indicator=>`<td>${indicator}</td>`).join("")}
                ${plates.map(plate=>`<td>[${plate.map(port=>PORTS_SHORTEN[port]).join(" ")}]</td>`).join("")}
            </tr>
        </tbody>`;
}

function settingsEdgework() {
    if (!localStorage.ktane_settings_edgework_widgets) localStorage.ktane_settings_edgework_widgets = 5;
    return `
    <tr><th colspan="2" class="section">Edgework</th></tr>
    <tr>
        <th>Widgets</th>
        <td><span><input id="widgets" type="number" min="0" value="${localStorage.ktane_settings_edgework_widgets}" pattern="[0-9]" oninput="if(this.value!==''&&!parseInt(this.value)) this.value=5"></span></td>
    </tr>
    `;
}

function edgeworkOnload() {
    let widgetSetting = document.querySelector("#widgets");
    WIDGETS = parseInt(widgetSetting.value);
    widgetSetting.onchange = ()=>{
        localStorage.ktane_settings_edgework_widgets = parseInt(widgetSetting.value);
        WIDGETS = parseInt(widgetSetting.value);
    }
}
