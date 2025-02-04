const switches = {'i':'we','my':'our','me':'us','non-binary':'plural','i am':'we are','ive':'weve','mine':'ours','refract?':'recombine?'};
const switchesreversed = {"we":"i","our":"my","us":"me","plural":"non-binary","we are":"i am","weve":"ive","ours":"mine",'recombine?':'refract?'};

function toggleText(on, flair=false) {
    document.querySelectorAll('o').forEach((element, i)=>{
        if ((on?switches:switchesreversed)[element.innerText] == undefined) { return };
        if (flair) {
            setTimeout(()=>{
                element.innerText = (on?switches:switchesreversed)[element.innerText];
                element.classList.toggle('switched');
            }, 17 * i);
        } else {
            element.innerText = (on?switches:switchesreversed)[element.innerText];
            element.classList.toggle('switched');
        };
    });
};
toggleText(localStorage.getItem('refracted'));
