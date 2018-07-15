
//if statements stop keydown from firing twice and "accelerating"
handleKeyCodeDown = (keyCode) => {
  switch (keyCode) {
    case 37:
      if (stopAnimation37 === false) {{
        console.log("Should not se...")
        return;
      }}
      stopAnimation37 = false;
      handleRAF(moveLeft, 2, 37)
      break;
    case 38:
      if (stopAnimation38 === false) {return;}
      stopAnimation38 = false;
      handleRAF(moveUp, 2, 38)
      break;
    case 39:
      if (stopAnimation39 === false) {return;}
      stopAnimation39 = false;
      handleRAF(moveRight, 2, 39)
      break;
    case 40:
      if (stopAnimation40 === false) {return;}
      stopAnimation40 = false;
      handleRAF(moveDown, 2, 40)
      break;
    case 65:
      if (stopAnimation65 === false) {return;}
      stopAnimation65 = false;
      handleRAF(moveLeft, 2, 65)
      break;
    case 87:
      if (stopAnimation87 === false) {return;}
      stopAnimation87 = false;
      handleRAF(moveUp, 2, 87)
      break;
    case 68:
      if (stopAnimation68 === false) {return;}
      stopAnimation68 = false;
      handleRAF(moveRight, 2, 68)
      break;
    case 83:
      if (stopAnimation83 === false) {return;}
      stopAnimation83 = false;
      handleRAF(moveDown, 2, 83)
      break;
    default:
      console.log('KeyDown not programmed');
  }
}


handleKeyCodeUp = (keyCode) => {
  switch (keyCode) {
    case 37:
      stopAnimation37 = true;
      break;
    case 38:
      stopAnimation38 = true;
      break;
    case 39:
      stopAnimation39 = true;
      break;
    case 40:
      stopAnimation40 = true;
      break;
    case 65:
      stopAnimation65 = true;
      break;
    case 87:
      stopAnimation87 = true;
      break;
    case 68:
      stopAnimation68 = true;
      break;
    case 83:
      stopAnimation83 = true;
      break;
    default:
      console.log('KeyUp not programmed');
  }
}



handleRAF = (moveFunction, moveValue, keyCode) => {
  requestAnimationFrame(function(timestamp){
    // starttime = timestamp || new Date().getTime() //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
    moveit(timestamp, moveFunction, moveValue, keyCode) // 400px over 1 second
  });
}

function moveit(timestamp, moveFunction, moveValue, keyCode ){
  if (eval('stopAnimation'+keyCode)) {
    window.cancelAnimationFrame(timestamp);
    return;
  }
  // starttime = timestamp || new Date().getTime() //if requestAnimationFrame unsupported
  moveFunction(moveValue);
  requestAnimationFrame(function(timestamp){ // call requestAnimationFrame again with parameters
    moveit(timestamp, moveFunction, moveValue, keyCode)
  })
}

moveLeft = (moveValue) => {
  let currentX = player.getAttribute("cx")
  let circleRadius = player.getAttribute("r")
  if (currentX > parseFloat(circleRadius)) {
    player.setAttribute("cx", parseFloat(currentX)-moveValue)
  } else {
    return;
  }
}

moveRight = (moveValue) => {
  let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
  let circleRadius = player.getAttribute("r")
  let currentX = player.getAttribute("cx")
  if (currentX < (viewBoxWidth-circleRadius)) {
    player.setAttribute("cx", parseFloat(currentX)+moveValue)
  } else {
    return;
  }
}

moveUp = (moveValue) => {
  let currentY = player.getAttribute("cy")
  let circleRadius = player.getAttribute("r")
  if (currentY > parseFloat(circleRadius)) {
    player.setAttribute("cy", parseFloat(currentY)-moveValue) //subtract 1 to move up in SVG
  } else {
    return;
  }
}

moveDown = (moveValue) => {
  let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
  let circleRadius = player.getAttribute("r")
  let currentY = player.getAttribute("cy")
  if (currentY < (viewBoxHeight-circleRadius)) {
    player.setAttribute("cy", parseFloat(currentY)+moveValue) //add 1 to move down in SVG
  } else {
    return;
  }
}

moveThing = (thing, timestamp, event, deltaY, deltaX) => {

  let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")

  let circleRadius = thing.getAttribute("r")
  let currentX = thing.getAttribute("cx")
  let currentY = thing.getAttribute("cy")
  
  if ((currentX < parseFloat(circleRadius)) || currentX > ((viewBoxWidth)-circleRadius) || currentY < parseFloat(circleRadius) || currentY > (viewBoxHeight-circleRadius)) {
    window.cancelAnimationFrame(timestamp);
    document.getElementById('svg').removeChild(thing)
    return
  }
  let atangent = Math.atan(deltaY/deltaX);
  let changeY = Math.sin(atangent);
  let changeX = Math.cos(atangent);
  if (deltaX < 0) {
    changeX = 0 - parseFloat(changeX)
    changeY = 0 - parseFloat(changeY)
  }
  thing.setAttribute("cx", parseFloat(thing.getAttribute("cx"))+(3*parseFloat(changeX)))
  thing.setAttribute("cy", parseFloat(thing.getAttribute("cy"))+(3*parseFloat(changeY)))
  detectCollisions(currentX, currentY, thing, timestamp, deltaY, deltaX)
  .then(() => {
    requestAnimationFrame((timestamp) => {
      moveThing(thing, timestamp, event, deltaY, deltaX)
    })
  })
  .catch((err) => {
    console.log('err', err)
    window.cancelAnimationFrame(timestamp);
  });

}
let bulletCount = 0
createThing = (event) => {

  var svg = document.getElementById('svg');
  var thing = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  thing.setAttribute("r", 1)
  thing.setAttribute("cx", parseFloat(player.getAttribute("cx")))
  thing.setAttribute("cy", parseFloat(player.getAttribute("cy")))
  thing.setAttribute("fill", bulletColor)
  thing.setAttribute("id", bulletCount)
  bulletCount ++
  svg.prepend(thing);

  // let {clientX, clientY} = event
  var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
  let percentX = clickX/clientWidth
  let percentY = clickY/(clientWidth/(viewBoxWidth/viewBoxHeight))
  let deltaY = ((percentY*viewBoxHeight)-player.getAttribute("cy"));
  let deltaX = ((percentX*viewBoxWidth)-player.getAttribute("cx"));
  

  requestAnimationFrame((timestamp) => {
    moveThing(thing, timestamp, event, deltaY, deltaX)
  })
}
let recentHits = []
detectCollisions = (currentX, currentY, thing, timestamp, deltaY, deltaX) => { 
  return new Promise((resolve, reject) => {
    Array.from(enemies).forEach((each) => {
      let enemyX = each.getAttribute("cx");
      let enemyY = each.getAttribute("cy");
      let enemyRadius = each.getAttribute("r");
      let thingRadius = thing.getAttribute("r");
      let enemyClasses = each.getAttribute("class")
      if (Math.abs(enemyX-currentX) <= (parseInt(enemyRadius)+parseInt(thingRadius)) &&
      Math.abs(enemyY-currentY) <= (parseInt(enemyRadius)+parseInt(thingRadius))) {
        if (enemyClasses.includes('enemy')) {
          if (recentHits.includes(thing.id)) {return;}
          svg.removeChild(each);
          svg.removeChild(thing);
          recentHits.push(thing.id)
          enemiesLeft = Array.from(svg.childNodes).filter((node) => {
            if (node.classList && Array.from(node.classList).includes('enemy')) {
              return true
            } else {
              return false;
            }
          })
          
          if (enemiesLeft.length === 0) {
            let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
            if ((viewBoxWidth) < 400) {
              svg.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth*1.3} ${viewBoxHeight*1.3}`);
              player.setAttribute("cx", viewBoxWidth)
              player.setAttribute("cy", viewBoxHeight)
              generateEnemies();
            } else {
              // resolve();
              var winMessage = document.createElementNS("http://www.w3.org/2000/svg", 'text');
              var textNode = document.createTextNode("YOU WIN!");
              winMessage.setAttribute("x", viewBoxWidth/2)
              winMessage.setAttribute("y", viewBoxHeight/2)
              winMessage.setAttribute("text-anchor", "middle")
              winMessage.appendChild(textNode);
              svg.appendChild(winMessage)
            }
          }
        }
      } else {
        resolve()
      }
    })
  })
}

let randColor = () => {
  // let cssColorArray = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
  let cssColorArray = ["#B000B5", "#BADA55", '#10aded', '#663399', "#e2071c"]
  return cssColorArray[Math.floor(Math.random() * Math.floor(cssColorArray.length))].toLowerCase()
};
generatePlayer = () => {
  let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
  player = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  player.setAttribute("id", "player");
  player.setAttribute("class", "player");
  player.setAttribute("cx", viewBoxWidth/2);
  player.setAttribute("cy", viewBoxHeight/2);
  player.setAttribute("r", 2);
  svg.appendChild(player);
}

generateEnemies = () => {
  for (let i = 0; i < 20; i++) {

    let [viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight] = svg.getAttribute("viewBox").split(" ")
    let randX = Math.floor(Math.random() * Math.floor(viewBoxWidth))
    let randY = Math.floor(Math.random() * Math.floor(viewBoxHeight))
    let enemy = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    enemy.setAttribute("cx", randX)
    enemy.setAttribute("cy", randY)
    enemy.setAttribute("r", 2)
    enemy.setAttribute("class", "enemy")
    enemy.setAttribute("fill", randColor())
    enemy.setAttribute("id", i)
    svg.prepend(enemy);
  }
}