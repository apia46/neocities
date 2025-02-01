var scrollRange = 0
var grad1 = new Color("#181a23").range("red", {space: "lch"})
var grad2 = new Color("red").range("black")
var redposition = 0
window.onload = ()=>{
    eyeAnim()
    scroll()
}

window.addEventListener('scroll', function scroll(){
    let scrollTop = document.getElementById("scroll").getBoundingClientRect().top + window.scrollY
    let scrollHeight = document.getElementById("scroll").offsetHeight-window.innerHeight
    scrollRange = Math.max(0, Math.min(1, (window.scrollY-scrollTop)/scrollHeight))
    document.body.style.backgroundColor = grad1(scrollRange*0.9)
    if (scrollRange > 0.9) document.body.style.backgroundColor = grad2(10*Math.max(0, scrollRange-0.9))
    document.getElementById("body").style.setProperty('--scroll-range', scrollRange)
    document.getElementById("scroll").style.setProperty('--fadeout-range', `${500*Math.max(0, scrollRange-0.8)}%`)
})

function eyeAnim(){
    redposition += 30;
    redposition %= 120;
    document.getElementById("red").style.backgroundPositionX = `${redposition}vw`
    setTimeout(eyeAnim, 100*Math.pow(2,1/(scrollRange+0.3)))
}