const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width/2-canvas.width/4;
let y = canvas.height/2-canvas.height/4;

const boardSize = canvas.width/1.1;
const boardX = canvas.width/2-boardSize/2;
const boardY = canvas.height/2-boardSize/2-boardSize/4;

const board2X = boardX;
const board2Y = boardY+boardSize+boardSize/10;

const blockY = board2Y+boardSize/3/2;
const block1X = board2X+boardSize/4*1;
const block2X = board2X+boardSize/4*2;
const block3X = board2X+boardSize/4*3;

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
    let currentTime = performance.now();
    let dt = (currentTime - lastTime) / 16.6667;
    lastTime = currentTime;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

function update(dt){

}
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //playing board outline
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 5;
    ctx.strokeRect(boardX,boardY,boardSize,boardSize);

    //playing board karo
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    for(let i = 1; i < 8; i++){
        ctx.beginPath();
        ctx.moveTo(boardX+boardSize/8*i, boardY);   // Startpunkt
        ctx.lineTo(boardX+boardSize/8*i, boardY+boardSize); // Endpunkt
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(boardX, boardY+boardSize/8*i);   // Startpunkt
        ctx.lineTo(boardX+boardSize, boardY+boardSize/8*i); // Endpunkt
        ctx.stroke();
    }
    //2nd board outline
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(board2X,board2Y,boardSize,boardSize/3);

    ctx.strokeRect(block1X-boardSize/6/2,blockY-boardSize/6/2,boardSize/6,boardSize/6);
    ctx.strokeRect(block2X-boardSize/6/2,blockY-boardSize/6/2,boardSize/6,boardSize/6);
    ctx.strokeRect(block3X-boardSize/6/2,blockY-boardSize/6/2,boardSize/6,boardSize/6);
}

gameLoop();
