const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.textAlign = "center";
ctx.textBaseline = "middle";

if (localStorage.getItem("highscore") == null) {
    localStorage.setItem("highscore", "0");
}

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

let state = 0;

let score = 0;

let lastTime = performance.now();

let dragging = false;
let selected = null;

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

const buttons = [
    {
        displayText: "▸",
        color: "gray",
        font: "80px Arial",
        x: canvas.width / 2 - boardSize / 2,
        y: canvas.height / 2 - boardSize / 4,
        w: boardSize,
        h: boardSize / 2,
        action: function () {
            state = 1;
        },
        State: 0,
    },
    {
        displayText: "Home",
        color: "gray",
        font: "60px Arial",
        x: canvas.width / 2 - boardSize / 2,
        y: canvas.height / 2 - boardSize / 4,
        w: boardSize,
        h: boardSize / 2,
        action: function () {
            state = 0;
            score = 0;
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    grid[y][x] = 0;
                }
            }
            blocks.forEach((b) => {
                b.x = b.homeX;
                b.y = b.homeY;
                b.placed = false;
                b.Id = Math.floor(Math.random() * blockLib.length);
                b.mirrored = Math.random() < 0.5;
                b.rotation = Math.floor(Math.random() * 4);
                const shape = getShape(b.Id, b.rotation, b.mirrored);
                b.Height = shape.length * blockSize;
                b.Width = shape[0].length * blockSize;
            });
            placeCount = 0;
        },
        State: 2,
    },
    {
        displayText: "Rewards",
        color: "gold",
        font: "50px Arial",
        x: canvas.width / 2 - boardSize / 2,
        y: canvas.height / 2 + boardSize / 3,
        w: boardSize,
        h: boardSize / 4,
        action: function () {
            state = 3;
        },
        State: 0,
    },
    {
        displayText: "↩",
        color: "gray",
        font: "50px Arial",
        x: canvas.width / 2 - boardSize / 4,
        y: canvas.height * 0.75,
        w: boardSize / 2,
        h: canvas.height * 0.08,
        action: function () {
            state = 0;
        },
        State: 3,
    },
];


const blocks = [
    {
        homeX: block1X,
        homeY: blockY,
        x: block1X,
        y: blockY,
        placed: false,
        Id: 0,
        rotation: 0,
        mirrored: false,
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
        rotation: 0,
        mirrored: false,
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
        rotation: 0,
        mirrored: false,
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
    if (state == 1) {
        blocks.forEach((b) => {
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
    }
    else if (state == 0 || state == 2 || state == 3) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        buttons.forEach((but) => {
            if (
                mx > but.x &&
                mx < but.x + but.w &&
                my > but.y &&
                my < but.y + but.h &&
                but.State == state
            ) {
                but.action();
            }
        });
    }
});
canvas.addEventListener("pointerup", (e) => {
    if (!selected) return;

    canvas.releasePointerCapture(e.pointerId);
    dragging = false;
    let b = selected;
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
    if (dragging == true) {
        let b = selected;
        b.x = e.clientX;
        b.y = e.clientY;
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
                    const shape = getShape(b.Id, b.rotation, b.mirrored);
                    for (let h = 0; h < shape.length; h++) {
                        for (let w = 0; w < shape[0].length; w++) {
                            if (shape[h][w] == true) {
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
    const shape = getShape(b.Id, b.rotation, b.mirrored);
    if (y + shape.length > 8 || x + shape[0].length > 8) {
        return false;
    }
    for (let h = 0; h < shape.length; h++) {
        for (let w = 0; w < shape[0].length; w++) {
            if (shape[h][w] == true && grid[y + h][x + w] == true) {
                return false;
            }
        }
    }
    return true;
}

function clearRows() {
    for (let y = 0; y < 8; y++) {
        let full = true;

        for (let x = 0; x < 8; x++) {
            if (!grid[y][x]) {
                full = false;
                break;
            }
        }

        if (full) {
            for (let x = 0; x < 8; x++) {
                grid[y][x] = 0;
            }
            score++;
        }
    }
}

function clearCols() {
    for (let x = 0; x < 8; x++) {
        let full = true;

        for (let y = 0; y < 8; y++) {
            if (!grid[y][x]) {
                full = false;
                break;
            }
        }

        if (full) {
            for (let y = 0; y < 8; y++) {
                grid[y][x] = 0;
            }
            score++;
        }
    }
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

function checkLoose() {
    for (const b of blocks) {
        if (b.placed) continue;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (checkIfFree(b, x, y)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function update(dt) {
    if (state == 1) {
        if (placeCount >= 3) {
            blocks.forEach((b) => {
                b.x = b.homeX;
                b.y = b.homeY;
                b.placed = false;
                b.Id = Math.floor(Math.random() * blockLib.length);
                b.mirrored = Math.random() < 0.5;
                b.rotation = Math.floor(Math.random() * 4);
                const shape = getShape(b.Id, b.rotation, b.mirrored);
                b.Height = shape.length * blockSize;
                b.Width = shape[0].length * blockSize;
            });
            placeCount = 0;
        }
        clearRows();
        clearCols();
        if (checkLoose()) {
            if (score > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", score);
            }
            state = 2;
        }

    }
    else if (state == 0) {

    }
    else if (state == 2) {

    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state == 1) {
        ctx.fillStyle = "black";
        ctx.font = `${canvas.height * 0.04}px Arial`;

        ctx.fillText(
            "Score: " + score,
            canvas.width / 2,
            boardY - canvas.height * 0.03
        );
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
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (grid[y][x] == true) {
                    ctx.fillRect(
                        boardX + x * blockSize,
                        boardY + y * blockSize,
                        blockSize,
                        blockSize,
                    );
                    ctx.strokeRect(
                        boardX + x * blockSize,
                        boardY + y * blockSize,
                        blockSize,
                        blockSize,
                    );
                }
            }
        }
        blocks.forEach((b) => {
            const shape = getShape(b.Id, b.rotation, b.mirrored);
            if (b.placed == false && (!dragging || b != selected)) {
                for (let h = 0; h < shape.length; h++) {
                    for (let w = 0; w < shape[0].length; w++) {
                        if (shape[h][w] == true) {
                            let y = b.y - b.Height / 4 + h * (blockSize / 2);
                            let x = b.x - b.Width / 4 + w * (blockSize / 2);
                            ctx.fillRect(x, y, blockSize / 2, blockSize / 2);
                            ctx.strokeRect(x, y, blockSize / 2, blockSize / 2);
                        }
                    }
                }
            } else if (b.placed == false && dragging && b == selected) {
                for (let h = 0; h < shape.length; h++) {
                    for (let w = 0; w < shape[0].length; w++) {
                        if (shape[h][w] == true) {
                            let y = b.y - b.Height / 2 + h * blockSize;
                            let x = b.x - b.Width / 2 + w * blockSize;
                            ctx.fillRect(x, y, blockSize, blockSize);
                            ctx.strokeRect(x, y, blockSize, blockSize);
                        }
                    }
                }
            }
        });
    }
    else if (state == 0) {
        buttons.forEach((but) => {
            if (but.State == 0) {
                ctx.beginPath();
                ctx.roundRect(but.x, but.y, but.w, but.h, 20);
                ctx.fillStyle = "black";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = but.color;
                ctx.fill();

                ctx.fillStyle = "black";
                ctx.font = but.font;

                ctx.fillText(but.displayText, but.x + but.w / 2, but.y + but.h / 2 + 2);
            }
        });
    }
    else if (state == 2) {
        buttons.forEach((but) => {
            if (but.State == 2) {
                ctx.beginPath();
                ctx.roundRect(but.x, but.y, but.w, but.h, 20);
                ctx.fillStyle = "black";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = but.color;
                ctx.fill();

                ctx.fillStyle = "black";
                ctx.font = but.font;

                ctx.fillText(but.displayText, but.x + but.w / 2, but.y + but.h / 2 + 2);
            }
        });
        ctx.font = "30px Arial";
        ctx.fillText("Score: " + score, canvas.width / 2, buttons[0].y - buttons[0].y / 2);
        ctx.fillText("Highscore: " + score, canvas.width / 2, buttons[0].y - buttons[0].y / 4);
    }
    else if (state == 3) {
        buttons.forEach((but) => {
            if (but.State == 3) {
                ctx.beginPath();
                ctx.roundRect(but.x, but.y, but.w, but.h, 20);
                ctx.fillStyle = "black";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = but.color;
                ctx.fill();

                ctx.fillStyle = "black";
                ctx.font = but.font;

                ctx.fillText(but.displayText, but.x + but.w / 2, but.y + but.h / 2 + 2);
            }
        });
        const rewards = [
            { score: 5, text: "🥉 Beginner - 5 Punkte" },
            { score: 15, text: "🥈 Amateur - 15 Punkte" },
            { score: 30, text: "🥇 Profi - 30 Punkte" },
            { score: 60, text: "💎 Meister - 60 Punkte" },
            { score: 100, text: "👑 Legende - 100 Punkte" }
        ];

        const highscore = Number(localStorage.getItem("highscore"));

        const centerX = canvas.width / 2;
        const startY = canvas.height * 0.15;
        const rowH = canvas.height * 0.12;
        const boxW = canvas.width * 0.85;
        const boxH = canvas.height * 0.08;

        ctx.fillStyle = "black";
        ctx.font = `${canvas.height * 0.06}px Arial`;
        ctx.fillText("Rewards", centerX, canvas.height * 0.07);

        for (let i = 0; i < rewards.length; i++) {
            const y = startY + i * rowH;

            // Box
            ctx.beginPath();
            ctx.roundRect(
                centerX - boxW / 2,
                y - boxH / 2,
                boxW,
                boxH,
                canvas.height * 0.02
            );

            if (highscore >= rewards[i].score) {
                ctx.fillStyle = "limegreen";
            } else {
                ctx.fillStyle = "#cccccc";
            }

            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = canvas.width * 0.003;
            ctx.stroke();

            // Text
            ctx.fillStyle = "black";
            ctx.font = `${canvas.height * 0.035}px Arial`;
            ctx.fillText(rewards[i].text, centerX, y);
        }

        // Highscore unten
        ctx.font = `${canvas.height * 0.04}px Arial`;
        ctx.fillText(
            "Highscore: " + highscore,
            centerX,
            canvas.height * 0.93
        );
    }
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
