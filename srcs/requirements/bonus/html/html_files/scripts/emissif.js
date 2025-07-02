let typo = function (p) {
  let lpi = 160;
  let xoff = 1;
  let yoff = 5000;
  let zoff = 999999;
  let textGrid;
  let buffer;

  p.setup = function () {
    p.createCanvas(1200, 100).parent("CNV0");
    p.pixelDensity(1);
    buffer = p.createGraphics(p.width, p.height);
    textGrid = risoPixelText("HAZARDOUS ÉDITORIAL", lpi, buffer);
  };
  function risoPixelText(string, lpi, buffer) {
    let text = string;
    let space = p.floor(buffer.width / lpi);
    let threshold = 140;
    let textGrid = [];

    buffer.background(255);
    buffer.fill(0);
    buffer.stroke(0);
    buffer.strokeWeight(0);
    buffer.textSize(70);
    buffer.textFont("Verdana");
    buffer.textLeading(120);
    buffer.textStyle(p.BOLDITALIC);
    buffer.text(text, 60, 80);
    buffer.loadPixels();

    for (let j = 0; j < buffer.width; j += space) {
      let row = [];
      for (let i = 0; i < buffer.height; i += space) {
        let total = 0;
        for (let x = 0; x < space; x++) {
          for (let y = 0; y < space; y++) {
            let pixelIndex = (j + x + (i + y) * buffer.width) * 4;
            let r =
              (buffer.pixels[pixelIndex] +
                buffer.pixels[pixelIndex + 1] +
                buffer.pixels[pixelIndex + 2]) /
              3;

            total += r;
          }
        }
        let average = total / (space * space);
        if (average <= threshold) {
          row.push(0);
        } else if (average >= threshold) {
          row.push(1);
        }
      }
      textGrid.push(row);
    }
    buffer.clear();
    return textGrid;
  }
  p.draw = function () {
    p.background(255);
    p.noiseDetail(2);
    let size = p.width / lpi;
    xoff = 1;
    p.fill(255);
    p.noStroke();
    let color;
    for (let i = 0; i < p.width; i += size) {
      yoff = 1000;
      for (let j = 0; j < p.height; j += size) {
        let n = p.noise(xoff, yoff, zoff);
        color = p.map(n, 0, 1, 0, size);
        pos = { x: i, y: j };
        let shade = size / 12;
        let scl = 255 / 12;
        p.noStroke();
        p.fill(0, 0);
        if (color > 0 && color < 1 * shade) {
          p.fill(0 * scl);
          p.fill(12 * scl);
        } else if (color > 1 * shade && color < 2 * shade) {
          p.fill(0 * scl);
          p.fill(11 * scl);
        } else if (color > 2 * shade && color < 3 * shade) {
          p.fill(0 * scl);
          p.fill(10 * scl);
          p.fill(127);
        } else if (color > 3 * shade && color < 4 * shade) {
          p.fill(4 * scl);
          p.fill(9 * scl);
        } else if (color > 4 * shade && color < 5 * shade) {
          p.fill(5 * scl);
          p.fill(8 * scl);
        } else if (color > 5 * shade && color < 6 * shade) {
          p.fill(6 * scl);
          p.fill(7 * scl);
        } else if (color > 6 * shade && color < 7 * shade) {
          p.fill(7 * scl);
          p.fill(6 * scl);
          p.fill(127);
        } else if (color > 7 * shade && color < 8 * shade) {
          p.fill(8 * scl);
          p.fill(5 * scl);
        } else if (color > 8 * shade && color < 9 * shade) {
          p.fill(9 * scl);
          p.fill(4 * scl);
        } else if (color > 9 * shade && color < 10 * shade) {
          p.fill(10 * scl);
          p.fill(3 * scl);
        } else if (color > 10 * shade && color < 11 * shade) {
          p.fill(11 * scl);
          p.fill(12 * scl);
        } else if (color > 11 * shade && color < 12 * shade) {
          p.fill(12 * scl);
          p.fill(1 * scl);
        }

        p.rect(pos.x, pos.y, size);

        yoff += 0.1;
      }
      xoff += 0.1;
    }
    zoff += 0.01;
    p.noStroke();

    for (let i = 0; i < textGrid.length; i++) {
      for (let j = 0; j < textGrid[i].length; j++) {
        if (textGrid[i][j] == 1) {
          // fill(255, 0);
          // rect(i * size, j * size, size);
        } else if (textGrid[i][j] == 0) {
          p.fill(p.random(0, 100));
          p.rect(
            i * size + p.random(-1, 1),
            j * size + p.random(-1, 1),
            size + p.random(-0.5, 0.5)
          );
        }
      }
    }
    p.text("Frame Rate: " + p.frameRate().toFixed(2), 0, 10);
  };
};

new p5(typo);
