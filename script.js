const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

let x = canvas.width/2-canvas.width/4;
let y = canvas.height/2-canvas.height/4;

let lastTime = performance.now();

let dragging = false;

document.body.addEventListener("touchmove", (e) => {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener("pointerdown", (e)=> {
x = e.clientX;
y = e.clientY;
dragging = true;
canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
})
canvas.addEventListener("pointermove", (e)=> {
    if(dragging == true){
        x = e.clientX;
        y = e.clientY;
    }
});

function gameLoop(){
    currentTime = performance.now();
    dt = (currentTime - lastTime) / 16.6667;
    lastTime = currentTime;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

function update(dt){

}
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillRect(x-canvas.width/8,y-canvas.width/8,canvas.width/4,canvas.width/4);
}

gameLoop();
