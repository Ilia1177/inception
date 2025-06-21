document.addEventListener("DOMContentLoaded",function(){

let sketch6 = function (p) {
  let xoff = 0;
  let yoff = 10000;
  let zoff = 100000000;
  p.setup = function () {
    p.rectMode(p.CENTER);
    p.createCanvas(400, 400);
    p.frameRate(60);
  };

  p.draw = function () {
    p.background(0);
    p.fill(255);
    p.text("Frame Rate: " + p.frameRate().toFixed(2), 10, 30);
    p.fill(0, 0, 255);
    p.noStroke();
    let step = 10;
    for (let i = 0; i < p.width; i += step) {
      xoff = 0;
      for (let j = 0; j < p.height; j += step) {
        let size = p.noise(xoff, yoff) * step;
        p.rect(i, j, size, size);
        xoff += 0.5;
      }
      yoff += 0.5;
    }
    p.fill(0, 255, 0);

    for (let i = 0; i < p.width; i += step) {
      xoff = 0;
      for (let j = 0; j < p.height; j += step) {
        let size = p.noise(xoff, yoff) * step;
        p.rect(i, j, size, size);
        xoff += 0.5;
      }
      yoff += 0.5;
    }
  };
};

let myp56 = new p5(sketch6,"CNV2")
});