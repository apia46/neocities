window.onload = () => {
    console.log("wsdfsd")
    document.body.style.setProperty("--height", document.getElementById("body").scrollHeight + "px")
    window.scrollTo(0, document.getElementById("body").scrollHeight);
}