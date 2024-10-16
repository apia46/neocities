$(him)

function him() {
    document.body.setAttribute("target", "him")
    setTimeout(you, Math.random() * 10000 + 2000)
}

function you() {
    document.body.setAttribute("target", "you")
    setTimeout(him, Math.random() * 1000 + 500)
}