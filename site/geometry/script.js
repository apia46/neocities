// https://www.youtube.com/watch?v=L1eu737bu70

window.onload = ()=>{
    scrollingVideo(document.querySelector('#slopeyslopes'))
    scrollingVideo(document.querySelector('#thechallenge'))
    scrollingVideo(document.querySelector('#thirtyfour'))
    scrollingVideo(document.querySelector('#thirtyfive'))
};

function scrollingVideo(section) {
    var video = section.querySelector('video');
    video.pause()
    window.addEventListener('scroll', ()=>{
        var percentage = (window.scrollY - section.offsetTop + window.innerHeight) / (section.clientHeight + window.innerHeight)
        if (percentage > 0 && percentage < 1) {
            video.currentTime = video.duration * percentage
        }
    })
}