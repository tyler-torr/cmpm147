/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Train Wreck", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Migrant mother", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      credit: "Four-year-old Zoë Roth, 2005",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Red Ball", 
      assetUrl: "https://cdn.glitch.global/d319d726-b0e9-41a4-831d-50c21de8477a/redball.jpg?v=1746765248067",
      credit: "ar.inspiredpencil.com",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Pork Steak", 
      assetUrl: "https://cdn.glitch.global/d319d726-b0e9-41a4-831d-50c21de8477a/porksteak.jpg?v=1746779122198",
      credit: "www.istockphoto.com",
      style: "width: 300px; height: auto;"
    },
    {
      name: "On A Walk", 
      assetUrl: "https://cdn.glitch.global/d319d726-b0e9-41a4-831d-50c21de8477a/thumbnails%2FSaturday.png?1746773070345",
      credit: "https://x.com/iloli_i8g",
      style: "width: 300px; height: auto;"
    },
    {
      name: "Delicious Burger", 
      assetUrl: "https://cdn.glitch.global/d319d726-b0e9-41a4-831d-50c21de8477a/thumbnails%2FScreenshot%202025-02-16%20195150.png?1746773050059",
      credit: "Tyler's Phone (He cooked it himself)",
      style: "width: 300px; height: auto;"
    },
  ];
}

const numShapes = 1500
let scale = 4
function initDesign(inspiration) {
  let canvasWidth = inspiration.image.width;
  let canvasHeight = inspiration.image.height;

  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit);

  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  image(inspiration.image, 0, 0, width, height);
  inspiration.image.loadPixels();
  loadPixels();

  let design = {
    bg: 128,
    fg: []
  };
  
  for(let i = 0; i < numShapes; i++) {
    let circleX = random(width)
    let circleY = random(height)
    design.fg.push({x: circleX,
                    y: circleY,
                    w: random(width/12, width/10),
                    h: random(height/12, height/10),
                    fill: getColor(inspiration.image, circleX, circleY)})
  }
  return design;
}

function getColor(img, x, y) {
  x = constrain(floor(x)*scale, 0, img.width - 1)
  y = constrain(floor(y)*scale, 0, img.height - 1)
  let pixelPos = (y * img.width + x) * 4
  let r = img.pixels[pixelPos];
  let g = img.pixels[pixelPos + 1];
  let b = img.pixels[pixelPos + 2];
  return [r, g, b];
  
}

function renderDesign(design) {
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(box.fill);
    push()
    //rotate(box.rot)
    ellipse(box.x, box.y, box.w, box.h);
    pop()
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 6, width/8, rate);
    box.h = mut(box.h, 6, height/8,rate);
    box.rot = mut(box.rot, 0, 360, rate);
    box.fill[0] = mut(box.fill[0], 0, 255, rate);
    box.fill[1] = mut(box.fill[1], 0, 255, rate);
    box.fill[2] = mut(box.fill[2], 0, 255, rate);
    box.fill[3] = mut(box.fill[3], 50, 200, rate);
  }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}