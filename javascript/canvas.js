let canvas = document.getElementById("field");
let context = canvas.getContext("2d");

/* size of block (px) */
const BLOCK_SIZE = 30;

/* set block color  */
context.fillStyle="red";
/* draw block argument=(position(x), position(y), width, height ) */
context.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);