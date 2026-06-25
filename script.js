const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2 - canvas.width / 4;
let y = canvas.height / 2 - canvas.height / 4;

const boardSize = canvas.width / 1.1;
const boardX = canvas.width / 2 - boardSize / 2;
const boardY = canvas.height / 2 - boardSize / 2 - boardSize / 4;

const board2X = boardX;
const board2Y = boardY + boardSize + boardSize / 10;

const blockY = board2Y + boardSize / 3 / 2;
const block1X = board2X + (boardSize / 4) * 1;
const block2X = board2X + (boardSize / 4) * 2;
const block3X = board2X + (boardSize / 4) * 3;

const blockSize = boardSize / 8;

let placeCount = 0;

let lastTime = performance.now();

let dragging = false;

const blockLib = [
  [
    //0
    [1],
  ],
  [
    //1
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    //2
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    //3
    [1, 1],
    [0, 1],
  ],
  [
    //4
    [1, 1],
    [1, 1],
  ],
  [
    //5
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  [
    //6
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  [
    //7
    [1, 1, 1, 1, 1],
  ],
  [
    //8
    [1, 1, 1, 1],
  ],
  [
    //9
    [1, 1, 1],
    [1, 1, 1],
  ],
  [
    //10
    [1, 1, 1],
    [1, 1, 1],
  ],
  [
    //12
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    //11
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    //13
    [1, 0],
    [0, 1],
  ],
];

const blocks = [
  {
    homeX: block1X,
    homeY: blockY,
    x: block1X,
    y: blockY,
    placed: false,
    Id: 0,
    Height: blockSize,
    Width: blockSize,
  },
  {
    homeX: block2X,
    homeY: blockY,
    x: block2X,
    y: blockY,
    placed: false,
    Id: 0,
    Height: blockSize,
    Width: blockSize,
  },
  {
    homeX: block3X,
    homeY: blockY,
    x: block3X,
    y: blockY,
    placed: false,
    Id: 0,
    Height: blockSize,
    Width: blockSize,
  },
];

document.body.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

canvas.addEventListener("pointerdown", (e) => {
  blocks.forEach((b) => {
    if (
      e.clientX >= b.x - b.Width / 2 &&
      e.clientX <= b.x + b.Width / 2 &&
      e.clientY >= b.y - b.Height / 2 &&
      e.clientY <= b.y + b.Height / 2 &&
      !b.placed
    ) {
      b.x = e.clientX;
      b.y = e.clientY;
    }
  });
  dragging = true;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointerup", (e) => {
  canvas.releasePointerCapture(e.pointerId);
  dragging = false;
  blocks.forEach((b) => {
    if (
      e.clientX >= b.x - b.Width / 2 &&
      e.clientX <= b.x + b.Width / 2 &&
      e.clientY >= b.y - b.Height / 2 &&
      e.clientY <= b.y + b.Height / 2
    ) {
      b.placed = checkForSnap(b);
    }
  });
});
canvas.addEventListener("pointermove", (e) => {
  if (dragging == true) {
    blocks.forEach((b) => {
      if (
        e.clientX >= b.x - b.Width / 2 &&
        e.clientX <= b.x + b.Width / 2 &&
        e.clientY >= b.y - b.Height / 2 &&
        e.clientY <= b.y + b.Height / 2 &&
        !b.placed
      ) {
        b.x = e.clientX;
        b.y = e.clientY;
      }
    });
  }
});

const grid = Array(8)
  .fill()
  .map(() => Array(8).fill(0));

function checkForSnap(b) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (
        Math.abs(b.x - b.Width / 2 - (boardX + x * blockSize)) <=
          blockSize / 2.1 &&
        Math.abs(b.y - b.Height / 2 - (boardY + y * blockSize)) <=
          blockSize / 2.1
      ) {
        if (checkIfFree(b, x, y)) {
          for (let h = 0; h < blockLib[b.Id].length && y + h < 8; h++) {
            for (let w = 0; w < blockLib[b.Id][0].length && x + w < 8; w++) {
              if (blockLib[b.Id][h][w] == true) {
                grid[y + h][x + w] = true;
              }
            }
          }
          b.x = b.homeX;
          b.y = b.homeY;
          placeCount++;
          return true;
        }
      }
    }
  }
  b.x = b.homeX;
  b.y = b.homeY;
  return false;
}

function checkIfFree(b, x, y) {
  for (let h = 0; h < blockLib[b.Id].length && y + h < 8; h++) {
    for (let w = 0; w < blockLib[b.Id][0].length && x + w < 8; w++) {
      if (blockLib[b.Id][h][w] == true && grid[y + h][x + w] == true) {
        return false;
      }
    }
  }
  return true;
}

function update(dt) {
  if (placeCount >= 3) {
    blocks.forEach((b) => {
      b.x = b.homeX;
      b.y = b.homeY;
      b.placed = false;
      b.Id = Math.floor(Math.random() * blockLib.length);
      b.Height = blockLib[b.Id].length * blockSize;
      b.Width = blockLib[b.Id][0].length * blockSize;
    });
    placeCount = 0;
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //playing board outline
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  ctx.lineWidth = 5;
  ctx.strokeRect(boardX, boardY, boardSize, boardSize);

  //playing board karo
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(boardX + blockSize * i, boardY); // Startpunkt
    ctx.lineTo(boardX + blockSize * i, boardY + boardSize); // Endpunkt
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(boardX, boardY + blockSize * i); // Startpunkt
    ctx.lineTo(boardX + boardSize, boardY + blockSize * i); // Endpunkt
    ctx.stroke();
  }
  //2nd board outline
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(board2X, board2Y, boardSize, boardSize / 3);

  //blocks
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (grid[y][x] == true) {
        ctx.fillRect(
          boardX + x * blockSize,
          boardY + y * blockSize,
          blockSize,
          blockSize,
        );
      }
    }
  }
  blocks.forEach((b) => {
    if (b.placed == false) {
      for (let h = 0; h < blockLib[b.Id].length; h++) {
        for (let w = 0; w < blockLib[b.Id][0].length; w++) {
          if (blockLib[b.Id][h][w] == true) {
            let y = b.y - b.Height / 2 + h * blockSize;
            let x = b.x - b.Width / 2 + w * blockSize;
            ctx.fillRect(x, y, blockSize, blockSize);
          }
        }
      }
    }
  });
}

function gameLoop() {
  let currentTime = performance.now();
  let dt = (currentTime - lastTime) / 16.6667;
  lastTime = currentTime;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
