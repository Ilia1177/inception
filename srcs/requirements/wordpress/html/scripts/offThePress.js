let cnv;

let lpi = 160;
let xoff = 1;
let yoff = 5000;
let zoff = 999999;
let buttonDl;
let buttonD2;
let textGrid;
function setup() {
  cnv = createCanvas(900, 100);
  cnv.parent("CNV");

  pixelDensity(1);
  textGrid = risoPixelText(cnv, null, "           Off The Press", lpi);
}
function download() {
  exportRiso();
}

function draw() {
  cnv.background(255);
  noiseDetail(2);
  let size = width / lpi;

  xoff = 1;

  fill(255);
  noStroke();
  let color;
  for (let i = 0; i < width; i += size) {
    yoff = 1000;
    for (let j = 0; j < height; j += size) {
      let n = noise(xoff, yoff, zoff);
      color = map(n, 0, 1, 0, size);
      pos = { x: i, y: j };
      let shade = size / 12;
      let scl = 255 / 12;
      noStroke();
      fill(0, 0);
      if (color > 0 && color < 1 * shade) {
        fill(0 * scl);
        fill(12 * scl);
      } else if (color > 1 * shade && color < 2 * shade) {
        fill(0 * scl);
        fill(11 * scl);
      } else if (color > 2 * shade && color < 3 * shade) {
        fill(0 * scl);
        fill(10 * scl);
        fill(127);
      } else if (color > 3 * shade && color < 4 * shade) {
        fill(4 * scl);
        fill(9 * scl);
      } else if (color > 4 * shade && color < 5 * shade) {
        fill(5 * scl);
        fill(8 * scl);
      } else if (color > 5 * shade && color < 6 * shade) {
        fill(6 * scl);
        fill(7 * scl);
      } else if (color > 6 * shade && color < 7 * shade) {
        fill(7 * scl);
        fill(6 * scl);
        fill(127);
      } else if (color > 7 * shade && color < 8 * shade) {
        fill(8 * scl);
        fill(5 * scl);
      } else if (color > 8 * shade && color < 9 * shade) {
        fill(9 * scl);
        fill(4 * scl);
      } else if (color > 9 * shade && color < 10 * shade) {
        fill(10 * scl);
        fill(3 * scl);
      } else if (color > 10 * shade && color < 11 * shade) {
        fill(11 * scl);
        fill(12 * scl);
      } else if (color > 11 * shade && color < 12 * shade) {
        fill(12 * scl);
        fill(1 * scl);
      }

      rect(pos.x, pos.y, size);

      yoff += 0.1;
    }
    xoff += 0.1;
  }
  zoff += 0.01;
  noStroke();
  for (let i = 0; i < textGrid.length; i++) {
    for (let j = 0; j < textGrid[i].length; j++) {
      if (textGrid[i][j] == 1) {
        // fill(255, 0);
        // rect(i * size, j * size, size);
      } else if (textGrid[i][j] == 0) {
        fill(0);
        rect(i * size, j * size, size);
      }
    }
  }
}

function risoPixelText(ctx, layer, string = "Off The\n Press", lpi) {
  let xPos = 5;
  let letterSpacing = -6;
  let text = string;
  let buffer = createGraphics(width, height);
  let space = floor(buffer.width / lpi);
  let threshold = 140;
  let textGrid = [];

  buffer.background(255);
  buffer.fill(0);
  buffer.stroke(0);
  buffer.strokeWeight(0);
  buffer.textSize(70);
  buffer.style;
  buffer.textFont("Verdana");
  buffer.textLeading(60);
  buffer.textStyle(BOLDITALIC);
  //   buffer.text(text, 0, 80);
  for (let i = 0; i < text.length; i++) {
    let character = text.charAt(i);
    let charWidth = buffer.textWidth(character);

    buffer.text(character, xPos, 80);
    xPos += charWidth + letterSpacing;
  }

  //   buffer.circle(340, 300, 100);
  buffer.loadPixels();
  for (let j = 0; j < buffer.width; j += space) {
    let row = [];
    for (let i = 0; i < buffer.height; i += space) {
      let total = 0;
      for (let x = 0; x < space; x++) {
        for (let y = 0; y < space; y++) {
          let pixelIndex = (j + x + (i + y) * buffer.width) * 4; // Calculate pixel index for the current space
          let r =
            (buffer.pixels[pixelIndex] +
              buffer.pixels[pixelIndex + 1] +
              buffer.pixels[pixelIndex + 2]) /
            3; // grayscale

          total += r;
        }
      }
      let average = total / (space * space);
      if (average <= threshold) {
        row.push(0); // If average pixel is not black, set it as 0
      } else if (average >= threshold) {
        row.push(1); // If average pixel is black, set it as 1
      }
    }
    textGrid.push(row);
  }
  buffer.clear();
  return textGrid;
}
