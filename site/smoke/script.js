var indexes = {pyanodons: 0}
var maxIndexes = {pyanodons: 1}

function goLeft(id){
    indexes[id] -= 1
    changeIndex(id)
}

function goRight(id){
    indexes[id] += 1
    changeIndex(id)
}

function changeIndex(id){
    var entries = document.querySelectorAll(`#${id} .box1`)
    entries.forEach(entry=>{
        entry.style.display = (entry.getAttribute("index") == indexes[id]) ? 'block' : 'none'
        if (entry.getAttribute("index") == indexes[id]){
            entry.insertBefore(document.querySelector(`#${id} .buttons`), entry.querySelector(".baseimg"))
            entry.querySelector(".date").textContent = entry.getAttribute("date")
        }
    })
    document.querySelector(`#${id} .goleft`).style.visibility = (indexes[id] <= 0) ? 'hidden' : 'visible'
    document.querySelector(`#${id} .goright`).style.visibility = (indexes[id] >= maxIndexes[id]) ? 'hidden' : 'visible'
}