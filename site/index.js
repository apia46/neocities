var scrollRange = 0;
var grad1 = new Color("#181a23").range("red", {space: "lch"});
var grad2 = new Color("red").range("black");
var redposition = 0;
var timer = false;
var timer2 = false;
var maxhorizscroll = window.innerWidth * 4;
var stopscroll = false;

window.onload = ()=>{
    eyeAnim();

    const wrapper = document.querySelector("#wrapper");
    wrapper.addEventListener('scroll', scrolldo);
    window.addEventListener("resize", scrolldo);
    scrolldo();
}

function eyeAnim(){
    redposition += 30;
    redposition %= 120;
    document.querySelector("#red").style.backgroundPositionX = `${redposition}vw`;
    setTimeout(eyeAnim, 100*Math.pow(2,1/(scrollRange+0.3)));
}

function scrolldo(){
    console.log(wrapper.scrollLeft)
    // eye stuff
    let scrollTop = document.querySelector("#scroll").getBoundingClientRect().top + wrapper.scrollTop;
    let scrollHeight = document.querySelector("#scroll").offsetHeight-window.innerHeight;
    scrollRange = Math.max(0, Math.min(1, (wrapper.scrollTop-scrollTop)/scrollHeight));
    document.body.style.backgroundColor = grad1(scrollRange*0.9);
    if (scrollRange > 0.9) document.body.style.backgroundColor = grad2(10*Math.max(0, scrollRange-0.9));
    document.querySelector("#body").style.setProperty('--scroll-range', scrollRange);
    document.querySelector("#scroll").style.setProperty('--fadeout-range', `${500*Math.max(0, scrollRange-0.8)}%`);

    // sideways stuff
    let canhorizontal = false;
    let canvertical = true;
    //completely fucked
    if ((Math.abs(document.querySelector("#sideways").getBoundingClientRect().top) < 200)) {
        canhorizontal = true;
    }
    if (wrapper.scrollLeft > 0 && !timer2) {
        //sidewaysing
        wrapper.classList.remove("toggletop")
        maxhorizscroll = Math.max(maxhorizscroll, wrapper.scrollLeft);
        canvertical = false;
        if (Math.abs(document.querySelector("#nonsideways").getBoundingClientRect().left) < 200) {
            //vertically aligned
            canvertical = true;
            if (wrapper.scrollTop > 0) {
                //verticalling
                canhorizontal = false;
                fixHorizontalScroll(document.querySelector("#nonsideways").getBoundingClientRect().left + wrapper.scrollLeft, ()=>{return wrapper.scrollTop == 0}, ()=>{document.querySelector("#nonsideways").scrollIntoView({block:"nearest"});});
                if (wrapper.classList.contains("onlysideways") && wrapper.scrollTop > window.innerHeight * 2) {
                    console.log("here1")
                    teleport2(true)
                }
            }
            teleport1(true)
            document.body.style.backgroundColor = '#000000';
        } else {
            //everywhere else
            if (document.querySelector("#nonsideways").getBoundingClientRect().left >= 200) {
                teleport1(false)
            }
            if (!wrapper.classList.contains("onlysideways")) {
                fixVerticalScroll(document.querySelector("#sideways").getBoundingClientRect().top + wrapper.scrollTop, ()=>{return wrapper.scrollLeft == 0}, ()=>{document.querySelector("#sideways").scrollIntoView();}); // i cannot explain why this is necessary. the js gods just want a non-integer sacrifice, i suppose? and why does this function turn things non-integer?
            }
        }
    } else {
        maxhorizscroll = window.innerWidth * 4;
        if (wrapper.classList.contains("toggletop") && wrapper.scrollTop < window.innerHeight * 1.5) {
            console.log("here")
            teleport2(false)
        }
    }
    if (canhorizontal && !stopscroll) {wrapper.classList.add("canhorizontal")}
    else {wrapper.classList.remove("canhorizontal")}
    if (canvertical && !stopscroll) {wrapper.classList.remove("cantvertical")}
    else {wrapper.classList.add("cantvertical")}

    wrapper.style.setProperty('--maxhorizscroll', maxhorizscroll);
}

function fixVerticalScroll(ypos, cancel, end=null) {
    if ((ypos != wrapper.scrollTop) && !timer) {
        let start = Date.now();
        let startPos = wrapper.scrollTop;
        let endPos = ypos;
        timer = setInterval(()=>{
            let progress = (Date.now() - start) / 500;
            if (progress > 1 || cancel()) {
                if (progress > 1) {end ? end() : wrapper.scrollTo({top: ypos})};
                clearInterval(timer);
                timer = false;
                end()
                return;
            }
            let easing = (progress-1) ** 2;
            wrapper.scrollTo({top: startPos * easing + endPos * (1-easing)});
        }, 30);
    }
}
function fixHorizontalScroll(xpos, cancel, end=null) {
    if ((xpos != wrapper.scrollLeft) && !timer) {
        let start = Date.now();
        let startPos = wrapper.scrollLeft;
        let endPos = xpos;
        timer = setInterval(()=>{
            let progress = (Date.now() - start) / 500;
            if (progress > 1 || cancel()) {
                if (progress > 1) {end ? end() : wrapper.scrollTo({left: xpos})};
                clearInterval(timer);
                timer = false;
                return;
            }
            let easing = (progress-1) ** 2;
            wrapper.scrollTo({left: startPos * easing + endPos * (1-easing)});
        }, 30);
    }
}

function teleport1(toggle, move=true) {
    if (toggle == wrapper.classList.contains("onlysideways") || wrapper.classList.contains("toggletop")) { return }
    console.log(wrapper.classList.contains("onlysideways"), "here")
    if (toggle) {document.querySelector("#nonsideways").style.setProperty('--bodyheight', wrapper.scrollHeight)};
    wrapper.classList.toggle("onlysideways");
    if (toggle) {
        wrapper.insertBefore(document.querySelector("#sideways"), document.querySelector("#top"));
    } else {
        document.querySelector("#afterwards").insertBefore(document.querySelector("#sideways"), document.querySelector("#line"));
    }
    if (move) {
        document.querySelector("#sideways").scrollIntoView();
    }
}

function teleport2(toggle) {
    if (toggle == wrapper.classList.contains("toggletop")) { return }
    wrapper.classList.toggle("toggletop");
    if (toggle) {
        wrapper.classList.remove("onlysideways");
        document.querySelector("#afterwards").insertBefore(document.querySelector("#sideways"), document.querySelector("#line"));
        document.querySelector("#hook").scrollIntoView();
        timer2 = setTimeout(()=>{document.querySelector("#hook").scrollIntoView(); timer2 = false}, 500);
        console.log(wrapper.scrollLeft);
    } else {
        wrapper.insertBefore(document.querySelector("#sideways"), document.querySelector("#top"));
        wrapper.classList.add("onlysideways");
        document.querySelector("#nonsideways").scrollIntoView();
    }
}
