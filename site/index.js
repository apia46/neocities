$(window).scroll(()=>{
    console.log(($(this).scrollTop-document.getElementById("scroll").offsetTop)/(document.getElementById("scroll").offsetHeight-window.innerHeight))
})