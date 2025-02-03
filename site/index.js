var scrollRange = 0;
var grad1 = new Color("#181a23").range("red", {space: "lch"});
var grad2 = new Color("red").range("black");
var redposition = 0;
var timer;
var maxhorizscroll = 0;

window.onload = ()=>{
    eyeAnim();

    const wrapper = document.getElementById("wrapper");
    wrapper.addEventListener('scroll', function scroll(){
        let scrollTop = document.getElementById("scroll").getBoundingClientRect().top + wrapper.scrollTop;
        let scrollHeight = document.getElementById("scroll").offsetHeight-window.innerHeight;
        scrollRange = Math.max(0, Math.min(1, (wrapper.scrollTop-scrollTop)/scrollHeight));
        document.body.style.backgroundColor = grad1(scrollRange*0.9);
        if (scrollRange > 0.9) document.body.style.backgroundColor = grad2(10*Math.max(0, scrollRange-0.9));
        document.getElementById("body").style.setProperty('--scroll-range', scrollRange);
        document.getElementById("scroll").style.setProperty('--fadeout-range', `${500*Math.max(0, scrollRange-0.8)}%`);
        
        if ((Math.abs(document.getElementById("sideways").getBoundingClientRect().top) < 200) != wrapper.classList.contains("canhorizontal")) {
            wrapper.classList.toggle("canhorizontal");
        };
        if (wrapper.scrollLeft > 0) {
            // youre in sideways
            maxhorizscroll = Math.max(maxhorizscroll, wrapper.scrollLeft);

            if ((document.getElementById("sideways").getBoundingClientRect().top != 0) && !timer) {
                let start = Date.now();
                let startPos = wrapper.scrollTop;
                let endPos = document.getElementById("sideways").getBoundingClientRect().top + wrapper.scrollTop;
                timer = setInterval(()=>{
                    let progress = (Date.now() - start) / 500;
                    if (progress > 1 || wrapper.scrollLeft == 0) {
                        clearInterval(timer);
                        timer = false;
                        return;
                    }
                    let left = (progress-1) ** 2
                    wrapper.scrollTo({top: startPos * left + endPos * (1-left)});
                }, 30);
            };
        };

        if ((wrapper.scrollLeft > 0) != wrapper.classList.contains("cantvertical")) {
            wrapper.classList.toggle("cantvertical");
            maxhorizscroll = window.innerWidth * 4;
        };
        wrapper.style.setProperty('--maxhorizscroll', maxhorizscroll);
    });
    scroll();
    window.addEventListener("resize", scroll());
};

function eyeAnim(){
    redposition += 30;
    redposition %= 120;
    document.getElementById("red").style.backgroundPositionX = `${redposition}vw`;
    setTimeout(eyeAnim, 100*Math.pow(2,1/(scrollRange+0.3)));
};