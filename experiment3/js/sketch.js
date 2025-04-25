// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}





// setup() function is called once when the program starts
function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let rvalue = noise(i / 10, j / 5);
      if (rvalue > 0.5) {
        row.push("_");
      }
      else if (rvalue > 0.2 && rvalue <= 0.5) {
        row.push("/");
      }
      else {
        row.push("~");
      }
    }
    grid.push(row);
  }
    
  // Designate a random region full of '.'s
  let regionWidth = floor(random(4, 12));
  let regionHeight = floor(random(3, 10));
  
  let regionX = floor(random(1, numCols - regionWidth))
  let regionY = floor(random(1, numRows - regionHeight))
  
  for (let y = regionY; y < regionY + regionHeight; y++) {
    for (let x = regionX; x < regionX + regionWidth; x++) {
      grid[y][x] = ".";
    }
  }
  
  // Create a river that flows through
  let riverChance = floor(random(1, 10));
  let riverWidth = floor(random(1, 5));
  let riverCount = 1;
  
  if (riverChance > 5) {
    riverCount++;
    if (riverChance > 8) {
      riverCount++;
    }
  }
  
  for (let r = 0; r < riverCount; r++) {
    let startRow = floor(random(2, numCols - riverWidth));
    let curveLeft = true;
    if (random(1, 10) < 5) {
      curveLeft = false;
    }
    for (let i = 0; i < numRows; i++) {
      for (let w = 0; w < riverWidth; w++) {
        grid[i][startRow + w] = "w";
        if (random(1, 10) > 8) {
          if (curveLeft) {
            startRow++;
            grid[i][startRow + w] = "w";
          } else {
            startRow--;
            grid[i][startRow] = "w";
          }
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
        placeTile(i, j, (floor(random(4))), 0); // Grass floor
        if (random() < 0.15) {
          placeTile(i, j, 18, 0); // Trees
        } else if (random() < 0.151 && random() > 0.15) {
          placeTile(i, j, 26, 0); // House
        }
      }
      else if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, (floor(random(4))), 1); // Darker grass
        if (random() < 0.9) {
          placeTile(i, j, 18, 0); // Trees
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
      else if (gridCheck(grid, i, j, "w")) {
        // Animate water
        let frame = floor(millis() / 1000) % 2
        placeTile(i, j, (floor(random(3))) + frame, 13); // Water
      }
    }
  }
  
  // Simulate fog
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let n = noise(i * 0.1, j * 0.2, millis() * 0.0005);
      
      let fog = map(n, 0, 1, 0, 100);
      fill(0, 0, 0, fog);
      noStroke();
      rect(i * 16, j * 16, 16, 16);
    }
  }
}