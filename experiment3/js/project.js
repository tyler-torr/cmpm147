// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
//main();

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

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}