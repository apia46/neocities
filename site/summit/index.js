window.onload = () => {
    setTimeout(()=>{document.getElementById("parallax").scrollTo(0, document.getElementById("body").scrollHeight - 1)}, 10)
    window.onresize()
}

window.onresize = () => {
    document.body.style.setProperty("--height", document.getElementById("body").scrollHeight + "px")
}