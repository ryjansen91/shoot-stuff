var body = document.getElementById('body');
var enemies = document.getElementsByClassName('enemy')
var svg = document.getElementById('svg');

let nodeListId
var starttime
var timestamp
let stopAnimation37, stopAnimation38, stopAnimation39, stopAnimation40, stopAnimation65, stopAnimation87, stopAnimation68, stopAnimation83
let clickX, clickY
let timer
let stop
let bulletColor = '#EB01A5'

body.addEventListener("mousedown", (event)=> {
  event.preventDefault();
  stop = false;
  clickX = event.clientX
  clickY = event.clientY
  createThing(event);
  timer = this.setInterval(() => {
    if (stop) return;
    createThing(event);
  }, 150);

  mouseMove = (event) => {
    clickX = event.clientX;
    clickY = event.clientY;
  }

  body.addEventListener("mousemove", mouseMove)
  body.addEventListener("mouseup", ()=> {
    stop = true;
    body.removeEventListener("mousemove", mouseMove)
    clearInterval(timer);
  })
})


body.addEventListener('keydown', (event)=> {
  handleKeyCodeDown(event.keyCode)
})
body.addEventListener('keyup', (event)=> {
  handleKeyCodeUp(event.keyCode)
})
generatePlayer();
generateEnemies();
// setInterval(() => {
  
// }, 3000)