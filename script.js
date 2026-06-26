const canvas = document.getElementById("myCanvas"); 
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boardSize = canvas.width / 1.1;
let boardX = canvas.width / 2 - boardSize / 2;
let boardY = canvas.height / 2 - boardSize / 2 - boardSize / 4;

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
let selected = null;

const blockLib = [
  [[1]],
  [[1,0,0],[0,1,0],[0,0,1]],
  [[1,0,0],[1,1,1]],
  [[1,1],[0,1]],
  [[1,1],[1,1]],
  [[1,1,1],[1,0,0],[1,0,0]],
  [[1,1,1],[1,0,0],[1,0,0]],
  [[1,1,1,1,1]],
  [[1,1,1,1]],
  [[1,1,1],[1,1,1]],
  [[1,1,1],[1,1,1]],
  [[0,1,0],[1,1,1]],
  [[1,1,0],[0,1,1]],
  [[1,0],[0,1]],
];

const blocks = [
  makeBlock(0, block1X),
  makeBlock(0, block2X),
  makeBlock(0, block3X),
];

function makeBlock(id, x) {
  const rotation = Math.floor(Math.random() * 4);
  const mirrored = Math.random() < 0.5;

  let temp = getShape(id, rotation, mirrored);

  return {
    homeX: x,
    homeY: blockY,
    x,
    y: blockY,
    placed: false,
    Id: id,
    rotation,
    mirrored,
    Height: temp.length * blockSize,
    Width: temp[0].length * blockSize,
  };
}

function getShape(id, rotation, mirrored) {
  let shape = blockLib[id].map(r => [...r]);

  if (mirrored) {
    shape = shape.map(r => r.reverse());
  }

  for (let i = 0; i < rotation; i++) {
    shape = shape[0].map((_, c) =>
      shape.map(r => r[c]).reverse()
    );
  }

  return shape;
}
const grid = Array(8).fill().map(() => Array(8).fill(0));

function getShapeOf(b) {
  return getShape(b.Id, b.rotation, b.mirrored);
}

function checkForSnap(b) {
  const shape = getShapeOf(b);

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {

      if (
        Math.abs(b.x - b.Width / 2 - (boardX + x * blockSize)) <= blockSize / 2.1 &&
        Math.abs(b.y - b.Height / 2 - (boardY + y * blockSize)) <= blockSize / 2.1
      ) {

        if (checkIfFree(shape, x, y)) {

          for (let h = 0; h < shape.length; h++) {
            for (let w = 0; w < shape[0].length; w++) {
              if (shape[h][w]) {
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

function checkIfFree(shape, x, y) {
  if (y + shape.length > 8 || x + shape[0].length > 8) return false;

  for (let h = 0; h < shape.length; h++) {
    for (let w = 0; w < shape[0].length; w++) {
      if (shape[h][w] && grid[y + h][x + w]) return false;
    }
  }
  return true;
}

function clearRows() {
  for (let y = 0; y < 8; y++) {
    if (grid[y].every(v => v)) {
      grid[y].fill(0);
    }
  }
}

function clearCols() {
  for (let x = 0; x < 8; x++) {
    let full = true;

    for (let y = 0; y < 8; y++) {
      if (!grid[y][x]) full = false;
    }

    if (full) {
      for (let y = 0; y < 8; y++) grid[y][x] = 0;
    }
  }
}

function update() {
  if (placeCount >= 3) {
    blocks.forEach(b => {
      const newId = Math.floor(Math.random() * blockLib.length);
      const rotation = Math.floor(Math.random() * 4);
      const mirrored = Math.random() < 0.5;

      let temp = getShape(newId, rotation, mirrored);

      b.Id = newId;
      b.rotation = rotation;
      b.mirrored = mirrored;

      b.x = b.homeX;
      b.y = b.homeY;
      b.placed = false;

      b.Height = temp.length * blockSize;
      b.Width = temp[0].length * blockSize;
    });

    placeCount = 0;
  }

  clearRows();
  clearCols();
}
document.body.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

canvas.addEventListener("pointerdown", (e) => {
  blocks.forEach(b => {
    if (
      e.clientX >= b.x - b.Width / 2 &&
      e.clientX <= b.x + b.Width / 2 &&
      e.clientY >= b.y - b.Height / 2 &&
      e.clientY <= b.y + b.Height / 2 &&
      !b.placed &&
      selected == null
    ) {
      selected = b;
      dragging = true;
    }
  });

  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointerup", (e) => {
  canvas.releasePointerCapture(e.pointerId);
  dragging = false;

  let b = selected;
  if (!b) return;

  if (
    e.clientX >= b.x - b.Width / 2 &&
    e.clientX <= b.x + b.Width / 2 &&
    e.clientY >= b.y - b.Height / 2 &&
    e.clientY <= b.y + b.Height / 2
  ) {
    b.placed = checkForSnap(b);
    selected = null;
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (dragging && selected) {
    selected.x = e.clientX;
    selected.y = e.clientY;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.strokeRect(boardX, boardY, boardSize, boardSize);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.1)";

  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(boardX + i * blockSize, boardY);
    ctx.lineTo(boardX + i * blockSize, boardY + boardSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(boardX, boardY + i * blockSize);
    ctx.lineTo(boardX + boardSize, boardY + i * blockSize);
    ctx.stroke();
  }

  ctx.fillStyle = "orange";
  ctx.strokeStyle = "black";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (grid[y][x]) {
        ctx.fillRect(boardX + x * blockSize, boardY + y * blockSize, blockSize, blockSize);
        ctx.strokeRect(boardX + x * blockSize, boardY + y * blockSize, blockSize, blockSize);
      }
    }
  }

  blocks.forEach(b => {
    const shape = getShape(b.Id, b.rotation, b.mirrored);

    for (let h = 0; h < shape.length; h++) {
      for (let w = 0; w < shape[0].length; w++) {
        if (!shape[h][w]) continue;

        let x, y;

        if (b === selected && dragging) {
          x = b.x - b.Width / 2 + w * blockSize;
          y = b.y - b.Height / 2 + h * blockSize;
        } else {
          x = b.x - b.Width / 4 + w * (blockSize / 2);
          y = b.y - b.Height / 4 + h * (blockSize / 2);
        }

        ctx.fillRect(x, y, blockSize / 2, blockSize / 2);
        ctx.strokeRect(x, y, blockSize / 2, blockSize / 2);
      }
    }
  });
}

function gameLoop() {
  let now = performance.now();
  let dt = (now - lastTime) / 16.6667;
  lastTime = now;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();