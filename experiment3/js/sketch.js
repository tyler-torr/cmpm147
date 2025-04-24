// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}


function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  // Generate dungeons
  let roomCoords = [];
  
  for (let n = 0; n < 4; n++) {
    let regionWidth = floor(random(4, 8));
    let regionHeight = floor(random(4, 6));
    
    let startX = 0, startY = 0;
    if (n >= 2) {
      startX = 8;
    }
    if (n == 1 || n == 3) {
      startY = 8;
    }

    let regionX = floor(random(1, numCols/2 - regionWidth)) + startX;
    let regionY = floor(random(1, numRows/2 - regionHeight)) + startY;

    for (let y = regionY; y < regionY + regionHeight; y++) {
      for (let x = regionX; x < regionX + regionWidth; x++) {
        grid[y][x] = ".";
      }
    }
    
    let coordX = floor(random(regionX, regionX + regionWidth))
    let coordY = floor(random(regionY, regionY + regionHeight))
    roomCoords.push({x: coordX, y: coordY});
  }
  
  // Generate hallways
  for (let i = 0; i < roomCoords.length - 1; i++) {
    let hallwayStart = roomCoords[i];
    let hallwayEnd = roomCoords[(i + 1) % roomCoords.length];
    
    let x = hallwayStart.x;
    let y = hallwayStart.y;
    
    while (x !== hallwayEnd.x) {
      grid[y][x] = ".";
      x += x < hallwayEnd.x ? 1 : -1;
    }
    
    while (y !== hallwayEnd.y) {
      grid[y][x] = ".";
      y += y < hallwayEnd.y ? 1 : -1;
    }
  }
  
  // Generate dungeon walls
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] == "_") {
        if (
          gridCheck(grid, j, i - 1, ".") ||
          gridCheck(grid, j, i + 1, ".") ||
          gridCheck(grid, j - 1, i, ".") ||
          gridCheck(grid, j + 1, i, ".")
        ) {
          grid[i][j] = "$";
        }
      }
    }
  }
  
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "_")) {
        placeTile(i, j, 0, 22); // Dungeon generic
        if (random() < 0.15) {
          placeTile(i, j, 11, floor(random(4)) + 21); // Dungeonn generic
        }
      }
      else if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, 0, 23); // Dungeon opening
        if (random() < 0.01) {
          placeTile(i, j, floor(random(3)), 28); // Chest!
        }
      }
      else if (gridCheck(grid, i, j, "~")) {
        placeTile(i, j, (floor(random(4))), 6); // Darker grass
        if (random() < 0.1) {
          placeTile(i, j, 18, 6); // Darker trees
        }
      }
      else if (gridCheck(grid, i, j, "/")) {
        placeTile(i, j, (floor(random(4))), 1); // Darker grass
      }
      else if (gridCheck(grid, i, j, "$")) {
        if (random() < 0.75) {
          placeTile(i, j, 1, floor(random(4)) + 21); // Dungeon walls
        } else {
          placeTile(i, j, 11, floor(random(4)) + 21); // Dungeon walls
        }
      }
    }
  }
  
  // Simulate fog
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let n = noise(i * 0.1, j * 0.4, millis() * 0.0005);
      
      let fog = map(n, 0, 1, 0, 100);
      fill(0, 0, 0, fog);
      noStroke();
      rect(i * 16, j * 16, 16, 16);
    }
  }
}

function gridCheck(grid, i, j, target) {
  if ((i < 0 || i >= grid.length) || (j < 0 || j >= grid[0].length)) {
    return false;
  }
  return grid[i][j] === target;
}

function gridCode(grid, i, j, target) {
  
  let northBit = 0, southBit = 0, eastBit = 0, westBit = 0
  
  if (gridCheck(grid, i - 1, j, target)) {
    northBit = 1;
  }
  if (gridCheck(grid, i + 1, j, target)) {
    southBit = 1;
  }
  if (gridCheck(grid, i, j + 1, target)) {
    eastBit = 1;
  }
  if (gridCheck(grid, i, j - 1, target)) {
    westBit = 1;
  }
  return (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3);
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

const lookup = [
  [1,1],
  [1,0],
  [1,2],
  [1,1],
  [0,1],
  [0,0],
  [0,2],
  [0,1],
  [2,1],
  [2,0],
  [2,2],
  [2,1],
  [1,1],
  [1,0],
  [1,2],
  [1,1]
];
