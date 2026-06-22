const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

ctx.fillRect(canvas.width/2-canvas.width/4,canvas.height/2-canvas.height/4,canvas.width/2,canvas.height/2);

let x;
let y;

canvas.addEventListener("pointerdown", (e)=> {
x = e.clientX;
y = e.clientY;
});

function gameLoop(){
    currentTime = performance.now();
    dt = (currentTime - lastTime) / 16.6667;
    lastTime = currentTime;
    update(dt);
    draw();
}

function update(dt){

}
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillRect(canvas.width/2-canvas.width/4,canvas.height/2-canvas.height/4,canvas.width/2,canvas.height/2);
}

setInterval(gameLoop, 4);