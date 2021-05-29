// index.js 
// FRONT END JAVASCRIPT FOR DRAW SOMETHING 

// CONSTS
// DIMENSIONS
const WIDTH = 600;
const HEIGHT = 600;
const FRAME_RATE = 60;

// GAME COLORS
const BG_COLOR = '#FFF';

// DOM elements
const gameScreen = document.getElementById('gameScreen');
const brushSize = document.getElementById('size');
const rValue = document.getElementById('red');
const gValue = document.getElementById('green');
const bValue = document.getElementById('blue');
const undoBtn = document.getElementById('undo');

let canvas, ctx; 
const gameState = {
  points: [],
  isDown: false,
  size: 2,
  color: {
    r:0,
    g:0,
    b:0
  },
  lengths: []
}

function init() {
  canvas = document.getElementById('canvas');  
  ctx = canvas.getContext('2d');

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  brushSize.value = gameState.size;
  rValue.value = gameState.color.r;
  gValue.value = gameState.color.g;
  bValue.value = gameState.color.b;

  gameState.lengths = [0];

  // Event listeners
  canvas.addEventListener('mousedown',mouseDown)
  canvas.addEventListener('mouseup',mouseUp)
  canvas.addEventListener('mousemove',mouseMove)
  brushSize.addEventListener('input', updateSize)
  rValue.addEventListener('input', updateColor)
  gValue.addEventListener('input', updateColor)
  bValue.addEventListener('input', updateColor)
  undoBtn.addEventListener('click', undoLast)
  startGameInterval();
} init();

function mouseDown() {
  gameState.isDown = true;
}
function mouseUp() {
  gameState.isDown = false;
  let index = gameState.lengths.length-1;
  let prevLength;
  prevLength = gameState.lengths[index]
  if(gameState.points.length !== prevLength)
    gameState.lengths.push(gameState.points.length);
}
function mouseMove(e) {
  //e.stopPropagation();
  if(gameState.isDown) {
    gameState.points.push({
      x: e.offsetX,
      y: e.offsetY,
      z: gameState.size,
      r: gameState.color.r,
      g: gameState.color.g,
      b: gameState.color.b,
    })
  }
}
function updateSize() {
  gameState.size = brushSize.value;
}
function updateColor() {
  gameState.color.r = rValue.value;
  gameState.color.g = gValue.value;
  gameState.color.b = bValue.value;
}
function undoLast() {

  let lastIndex = gameState.lengths.length - 1;
  let prevLength, newLength;
  // There should always be at least one length, 0
  if (lastIndex === 0) {
    gameState.points = [];
  } else {
    prevLength = gameState.lengths[lastIndex];
    newLength = gameState.lengths[lastIndex-1];
    
    //remove prevLength
    gameState.lengths.splice(lastIndex,1);   
    gameState.points.splice(newLength,prevLength-newLength);
  }
}

function startGameInterval() {
  const id = setInterval(() => {
    paintGame();
  },1000/FRAME_RATE)
}
function paintGame() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  gameState.points.forEach(pt => {
    ctx.fillStyle = `rgb(${pt.r},${pt.g},${pt.b})`;
    ctx.fillRect(pt.x,pt.y,pt.z,pt.z);
  })

  ctx.fillStyle = BG_COLOR;

}