let pages = ["shapedbynews.html","galluhree.html","memoriam.html"];

let currentUrl = window.location.href;
let i = pages.indexOf(currentUrl) 
let arrowUp = document.getElementById("up");
let arrowDown = document.getElementById("down");

function next(){
    if(i==pages.length){
        i = 0; 
    } else {
        i++
    }
    let goTo = pages[i];
    window.location = goTo;
}

function prev(){

    if(i==0){
        i = pages.length; 
    } else {
        i--
    }
    let goTo = pages[i];
    window.location = goTo;
}
