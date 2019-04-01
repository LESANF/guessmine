import { getSocket } from "./sockets";
const modeBtn = document.getElementById("paintMode");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colors = document.getElementsByClassName("color");
const controls = document.getElementById("controls");

const SELECTED_COLOR = "selectedColor";

canvas.width = 700;
canvas.height = 700;

let painting = false,
  filling = false,
  x,
  y;

context.lineWidth = 2.5;
context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#000000";

function movePath(x, y) {
  context.beginPath();
  context.moveTo(x, y);
}

function strokePath(x, y, eventColor) {
  let currentStroke = context.strokeStyle;
  context.strokeStyle = eventColor;
  context.lineTo(x, y);
  context.stroke();
  context.strokeStyle = currentStroke;
}

function onMouseMove(event) {
  x = event.offsetX;
  y = event.offsetY;
  if (!filling) {
    if (!painting) {
      movePath(x, y);
      // eslint-disable-next-line no-undef
      getSocket().emit(socketEvents.moving, { x, y });
    } else {
      strokePath(x, y);
      // eslint-disable-next-line no-undef
      getSocket().emit(socketEvents.painting, {
        x,
        y,
        color: context.strokeStyle
      });
    }
  }
}

function startPainting() {
  painting = true;
}
function stopPainting() {
  painting = false;
}

function startFilling() {
  filling = true;
}
function stopFilling() {
  filling = false;
}

function onModeClick() {
  if (filling === true) {
    modeBtn.innerText = "Fill";
    stopFilling();
  } else {
    modeBtn.innerText = "Paint";
    startFilling();
  }
}

function fillCanvas(color) {
  context.closePath();
  context.beginPath();
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function onCanvasClick() {
  if (filling) {
    fillCanvas(context.strokeStyle);
    // eslint-disable-next-line no-undef
    getSocket().emit(socketEvents.filling, { color: context.strokeStyle });
  }
}

function onColorClick(e) {
  const style = e.target.style;
  const selected = document.querySelector(`.${SELECTED_COLOR}`);
  if (selected !== null) {
    selected.classList.remove(SELECTED_COLOR);
  }
  e.target.classList.add(SELECTED_COLOR);
  context.strokeStyle = style.backgroundColor;
}

Array.from(colors).forEach(color =>
  color.addEventListener("click", onColorClick, false)
);

if (modeBtn) {
  modeBtn.addEventListener("click", onModeClick);
}

export function restartCanvas() {
  fillCanvas("#ffffff");
}

export function enableCanvas() {
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mousedown", startPainting, false);
  canvas.addEventListener("mouseup", stopPainting, false);
  canvas.addEventListener("mouseleave", stopPainting, false);
  canvas.addEventListener("click", onCanvasClick, false);
  controls.style.opacity = 1;
  restartCanvas();
}

export function disableCanvas() {
  canvas.removeEventListener("mousemove", onMouseMove, false);
  canvas.removeEventListener("mousedown", startPainting, false);
  canvas.removeEventListener("mouseup", stopPainting, false);
  canvas.removeEventListener("mouseleave", stopPainting, false);
  canvas.removeEventListener("click", onCanvasClick, false);
  controls.style.opacity = 0;
  restartCanvas();
}

if (canvas) {
  disableCanvas();
}

function subscribeToMoved() {
  const onMoved = ({ x, y }) => movePath(x, y);
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.moved, onMoved);
}

function subscribeToPainted() {
  const onPainted = ({ x, y, color }) => strokePath(x, y, color);
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.painted, onPainted);
}

function subscribeToFilled() {
  const onFilled = ({ color }) => fillCanvas(color);
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.filled, onFilled);
}

export default {
  subscribeToMoved,
  subscribeToPainted,
  subscribeToFilled
};
