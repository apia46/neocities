var indexes = {pyanodons: 5}
var maxIndexes = {pyanodons: 5}
var focused = "pyanodons"

window.onload = ()=>{
    for (var index in indexes) {
        if (Object.prototype.hasOwnProperty.call(indexes, index)) {
            changeIndex(index)
        }
    }
}

function goBack(id){
    if (indexes[id] > 0) {
        indexes[id] -= 1
        changeIndex(id)
    }
}

function goForward(id){
    if (indexes[id] < maxIndexes[id]) {
        indexes[id] += 1
        changeIndex(id)
    }
}

function changeIndex(id){
    focused = id
    var entries = document.querySelectorAll(`#${id} .box1`)
    entries.forEach(entry=>{
        entry.style.display = (entry.getAttribute("index") == indexes[id]) ? 'block' : 'none'
        if (entry.getAttribute("index") == indexes[id]){
            entry.insertBefore(document.querySelector(`#${id} .header`), entry.querySelector(".baseimg"))
            entry.querySelector(".date").textContent = entry.getAttribute("date")
            entry.querySelector(".playtime").textContent = entry.getAttribute("playtime")
        }
    })
    document.querySelector(`#${id} .goback`).style.visibility = (indexes[id] <= 0) ? 'hidden' : 'visible'
    document.querySelector(`#${id} .goforward`).style.visibility = (indexes[id] >= maxIndexes[id]) ? 'hidden' : 'visible'
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "ArrowLeft":
            goBack(focused)
            break
        case "ArrowRight":
            goForward(focused)
            break
    }
})