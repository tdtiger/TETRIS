/*--------------------data--------------------*/

/* size of field */
const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

let field = [];

/* size of a block (px) */
const BLOCK_SIZE = 30;

/* size of tetromino */
const MINO_SIZE = 4;

/* size of canvas (20blocks × 10blocks) */
const CANVAS_WIDTH = FIELD_WIDTH * BLOCK_SIZE;
const CANVAS_HEIGHT = FIELD_HEIGHT * BLOCK_SIZE;

let DROP_SPEED = 500;

let canvas = document.getElementById("field");
let context = canvas.getContext("2d");

let pre = document.getElementById("next");
let con_p = pre.getContext("2d");

let ho = document.getElementById("hold");
let con_h = ho.getContext("2d");

/* set field */
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

con_p.textAlign = "start";
con_p.textBaseline = "middle";
con_p.font = "22px Roboto medium";
con_p.fillText("Next", 100, 10);

con_h.textAlign = "start";
con_h.textBaseline = "middle";
con_h.font = "22px Roboto medium";
con_h.fillText("Hold", 100, 10);

const MINO_TYPES = [
    [],
    /* representing shape of tetromino by array (dim=2) */
    /* I mino index[1] */
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    /* L mino index[2] */
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    /* J mino index[3] */
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    /* T mino index[4] */
    [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
    ],
    /* O mino index[5] */
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    /* Z mino index[6] */
    [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    /* S mino index[7] */
    [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]];

/*
index[0] is empty
index[1]~index[7] are colors for tetromino
index[8]~index[14] are colors for shadow
*/
const MINO_COLORS = ["", "#00FFFF", "#FFA500", "#0000FF", "#9400D3", "#FFFF00", "#FF0000", "#00FF00",
    "#E5FFFF", "#FFF5E5", "#E5E5FF", "#F7E5FF", "#FFFFE5", "#FFE5E5", "#E5FFE5"]

/* generate number 1 to 7*/
let mino_t;
mino_t = Math.floor(Math.random() * (MINO_TYPES.length - 1) + 1);

/* for active mino */
let mino;
mino = MINO_TYPES[mino_t];

let HOLD_MINO_NUM = 0;

/* set tetromino center of canvas */
let START_X = FIELD_WIDTH / 2 - MINO_SIZE / 2;
let START_Y = 0;

/* coordinate of tetromino */
let mino_x = START_X;
let mino_y = START_Y;

/* gameover flag */
let over = false;

/* hold flag */
let flag_h = false;

let isPause = false;

/* variables for information */
let score;
let line;
let REN = 0;
const score_display = document.getElementById("score");
const highscore = document.getElementById("highscore");
let total_line = 0;
const line_display = document.getElementById("line");
const speed_display = document.getElementById("dropspeed");

/* to manage drop speed */
let sline = 0;

const music = document.querySelector("#music");
let flag_m = false;

/*--------------------function--------------------*/

/*
setInterval(function, cycle(ms))
-> function is repeated periodically
*/
let sp;

/* initialize various things */
function initialize() {
    score = 0;
    line = 0;
    REN = 0;
    total_line = 0;
    score_display.innerHTML = 0;
    line_display.innerHTML = 0;
    speed_display.innerHTML = 1 / DROP_SPEED * 1000;
    DROP_SPEED = 500;
    over = false;
    flag_h = false;
    generatemino();
    HOLD_MINO_NUM = 0;
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        /* dimention expansion */
        field[y] = [];
        for (let x = 0; x < FIELD_WIDTH; x++) {
            field[y][x] = 0;
        }
    }
    con_p.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    con_p.fillStyle = "black";
    con_p.fillText("Next", 100, 12);
    con_h.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    con_h.fillStyle = "black";
    con_h.fillText("Hold", 100, 12);
    if(sp)
        clearInterval(sp);
    sp = setInterval(dropmino, DROP_SPEED);
}

function drawBlock(x, y, c, target) {
    let xc = x * BLOCK_SIZE;
    let yc = y * BLOCK_SIZE;

    if (target == "field") {
        /* set block color  */
        context.fillStyle = MINO_COLORS[c];
        /* draw block <argument>=(x_coordinate, y_coordinate, width, height) */
        context.fillRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
        /* set border color */
        context.strokeStyle = "black";
        /* draw border of block */
        context.strokeRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
    }
    else if (target == "next") {
        con_p.fillStyle = MINO_COLORS[c];
        con_p.fillRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
        con_p.strokeStyle = "black";
        con_p.strokeRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
    }
    else if (target == "hold") {
        con_h.fillStyle = MINO_COLORS[c];
        con_h.fillRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
        con_h.strokeStyle = "black";
        con_h.strokeRect(xc, yc, BLOCK_SIZE, BLOCK_SIZE);
    }
}

function drawfield() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let y = 0; y < FIELD_HEIGHT; y++) {
        for (let x = 0; x < FIELD_WIDTH; x++) {
            if (field[y][x]) {
                drawBlock(x, y, field[y][x], "field");
            }
        }
    }
}

function drawmino(target) {
    if (target == "next") {
        let NextMino = MINO_TYPES[NEXT_MINO_NUM];
        for (let y = 0; y < MINO_SIZE; y++) {
            for (let x = 0; x < MINO_SIZE; x++) {
                if (NextMino[y][x]) {
                    drawBlock(3 + x, 1 + y, NEXT_MINO_NUM, target);
                }
            }
        }
    }
    else if (target == "hold") {
        let HoldMino = MINO_TYPES[HOLD_MINO_NUM];
        for (let y = 0; y < MINO_SIZE; y++) {
            for (let x = 0; x < MINO_SIZE; x++) {
                if (HoldMino[y][x]) {
                    drawBlock(3 + x, 1 + y, HOLD_MINO_NUM, target);
                }
            }
        }
    } else {
        for (let y = 0; y < MINO_SIZE; y++) {
            for (let x = 0; x < MINO_SIZE; x++) {
                if (mino[y][x]) {
                    drawBlock(mino_x + x, mino_y + y, mino_t, target);
                }
            }
        }
    }

    if (over)
        return;
}

function drawshadow(target) {
    let limit = 0;
    while (checkMove(0, limit + 1)) {
        limit++;
    }

    if (limit == 0) {
        return;
    }

    for (let y = 0; y < MINO_SIZE; y++) {
        for (let x = 0; x < MINO_SIZE; x++) {
            if (mino[y][x]) {
                drawBlock(mino_x + x, mino_y + y + limit, mino_t + 7, target);
            }
        }
    }
}

function generatemino() {
    NEXT_MINO_NUM = Math.floor(Math.random() * (MINO_TYPES.length - 1) + 1);
}

/* prepare next tetoromino */
function setmino(mino_num) {
    if (mino_num == undefined) {
        mino_t = Math.floor(Math.random() * (MINO_TYPES.length - 1) + 1);
        mino = MINO_TYPES[mino_t];
    } else {
        mino_t = mino_num;
        mino = MINO_TYPES[mino_t];
    }
    mino_x = START_X;
    mino_y = START_Y;
}

function preview() {
    drawmino("next");

    if (over)
        return;
}

function checkMove(move_x, move_y, n_mino) {
    /* when third arugument is not passed, the variable 'n_mino' is current active tetoromino */
    if (n_mino == undefined)
        n_mino = mino;

    for (let y = 0; y < MINO_SIZE; y++) {
        for (let x = 0; x < MINO_SIZE; x++) {
            let n_x = mino_x + move_x + x;
            let n_y = mino_y + move_y + y;

            if (n_mino[y][x]) {
                if (n_y < 0 || n_x < 0 || n_y >= FIELD_HEIGHT || n_x >= FIELD_WIDTH || field[n_y][n_x])
                    return false;
            }
        }
    }
    return true;
}

/* scan field by rasta scan */
function checkLine() {

    /* check line */
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        let flag = true;
        /* check row */
        for (let x = 0; x < FIELD_WIDTH; x++) {
            /* when empty block exists, no line is erased */
            if (!field[y][x]) {
                flag = false;
                break;
            }
        }
        /* when the line is filled */
        if (flag) {
            line++;
            total_line++;
            sline++;
            /* copy from line[n-1] to line[n] */
            for (let ny = y; ny > 0; ny--) {
                for (let nx = 0; nx < FIELD_WIDTH; nx++) {
                    field[ny][nx] = field[ny - 1][nx];
                }
            }

            /* accelerate every time 10 lines are erased */
            if (sline >= 10) {
                updateSpeed();
            }
        }
    }

    if (line)
        REN += 1;
    else
        REN = 0;

    score = calculateScore(score, line);
    line = 0;

    if (score > highscore.innerHTML) {
        highscore.innerHTML = score;
    }

    score_display.innerHTML = score;
    line_display.innerHTML = total_line;
}

function updateSpeed() {
    clearInterval(sp);
    sline -= 10;
    DROP_SPEED -= 50;
    sp = setInterval(dropmino, DROP_SPEED);
    speed_display.innerHTML = 1 / DROP_SPEED * 1000;
}

function calculateScore(sc, li) {
    if (li == 1)
        sc += 100;
    else if (li == 2)
        sc += 300;
    else if (li == 3)
        sc += 500;
    else if (li == 4)
        sc += 800;

    if (REN * 50 <= 1000)
        sc += REN * 50;
    else
        sc += 1000;

    return sc;
}

/* rotate a tetromino 90 degrres to the right */
function rotateToRight() {
    let newmino = [];

    for (let y = 0; y < MINO_SIZE; y++) {
        /* dimention expansion */
        newmino[y] = [];
        for (let x = 0; x < MINO_SIZE; x++) {
            newmino[y][x] = mino[MINO_SIZE - x - 1][y];
        }
    }

    return newmino;
}

/* rotate a tetromino 90 degrres to the left */
function rotateToLeft() {
    let newmino = [];

    for (let y = 0; y < MINO_SIZE; y++) {
        /* dimention expansion */
        newmino[y] = [];
        for (let x = 0; x < MINO_SIZE; x++) {
            newmino[y][x] = mino[x][MINO_SIZE - y - 1];
        }
    }

    return newmino;
}


function dropmino() {
    if (over) {
        if (!window.alert("GAME OVER")) {
            over = false;
            music.pause();
            initialize();
        }
        return;
    }

    if (checkMove(0, 1)) {
        mino_y++;
        score += 1;
        score_display.innerHTML = score;
    } else {
        setTimeout(fixmino(), 1000);
        checkLine();
        setmino(NEXT_MINO_NUM);
        con_p.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        con_p.fillStyle = "black";
        con_p.fillText("Next", 100, 12);
        generatemino();
        preview();

        if (!checkMove(0, 0))
            over = true;
    }

    drawfield();
    drawmino("field");
    drawshadow("field");
}

function fastdrop() {
    let limit = 0;
    while (checkMove(0, limit + 1)) {
        limit++;
    }
    mino_y += limit;
    score += limit * 2;
    score_display.innerHTML = score;
}

function fixmino() {
    for (let y = 0; y < MINO_SIZE; y++) {
        for (let x = 0; x < MINO_SIZE; x++) {
            if (mino[y][x]) {
                field[y + mino_y][x + mino_x] = mino_t;
            }
        }
    }

    flag_h = false;
}

function holdmino() {
    if (flag_h)
        return;

    if (HOLD_MINO_NUM) {
        let keep = mino_t;
        setmino(HOLD_MINO_NUM);
        HOLD_MINO_NUM = keep;
    } else {
        HOLD_MINO_NUM = mino_t;
        setmino(NEXT_MINO_NUM);
        generatemino();
        con_p.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        con_p.fillStyle = "black";
        con_p.fillText("Next", 100, 12);
        preview();
    }

    con_h.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    con_h.fillStyle = "black";
    con_h.fillText("Hold", 100, 12);
    for (let y = 0; y < MINO_SIZE; y++) {
        for (let x = 0; x < MINO_SIZE; x++) {
            if (MINO_TYPES[HOLD_MINO_NUM][y][x]) {
                drawBlock(1 + x, 1 + y, HOLD_MINO_NUM, "hold");
            }
        }
    }

    flag_h = true;
    if (over)
        return;
}

function pause(){
    if (isPause){
        sp = setInterval(dropmino, DROP_SPEED);
        isPause = false;
        music.play();
    } else {
        clearInterval(sp);
        isPause = true;
        music.pause();
    }
}

function managemusic(){
    if(!flag_m){
        music.play();
        flag_m = true;
    } else {
        music.pause();
        flag_m = false;
    }
}

/*--------------------main--------------------*/

initialize();
drawfield();
drawmino("field");
drawshadow("field");
generatemino();
preview();

/*
operate tetromino
when a key is pressed, the message stored in the variable 'e'
*/
document.onkeydown = function (e) {
    if (isPause && e.key != "p")
        return;

    switch (e.key) {
        /* when the leftarrow key is pressed */
        case "ArrowLeft":
            if (checkMove(-1, 0))
                mino_x--;
            break;
        /* when the uparrow key is pressed */
        case "ArrowUp":
            fastdrop();
            break;
        /* when the rightarrow key is pressed */
        case "ArrowRight":
            if (checkMove(1, 0))
                mino_x++;
            break;
        /* when the downarrow key is pressed */
        case "ArrowDown":
            if (checkMove(0, 1))
                mino_y++;
            break;
        /* when the x key is pressed */
        case "x":
            let r_mino = rotateToRight();
            if (checkMove(0, 0, r_mino))
                mino = r_mino;
            break;
        /* when the z key is pressed */
        case "z":
            let l_mino = rotateToLeft();
            if (checkMove(0, 0, l_mino))
                mino = l_mino;
            break;
        /* when the Space key is pressed */
        case " ":
            holdmino();
            break;
        /* when the enter key is pressed */
        case "Enter":
            initialize();
            setmino();
            break;
        case "p":
            pause();
            break;
        case "m":
            managemusic();
            break;
    }
    if (over)
        return;

    drawfield();
    drawmino("field");
    drawshadow("field");
}