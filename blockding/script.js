const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

ctx.fillRect(canvas.width/2-canvas.width/4,canvas.height/2-canvas.height/4,canvas.width/2,canvas.height/2);