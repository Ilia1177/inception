document.addEventListener("DOMContentLoaded", function() {

  let button1 = document.getElementById("button1");
  let img;

  let reverseColor = function(img) {
    img.loadPixels();
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        let a = img.pixels[index + 3];
        img.pixels[index] = 255 - r;
        img.pixels[index + 1] = 255 - g;
        img.pixels[index + 2] = 255 - b;
        img.pixels[index + 3] = a;
      }
    }
    img.updatePixels();
  };



  let sketch1 = function (p) {
    p.preload = function () {
      img = p.loadImage('images/chromaticEphemeris.jpg');
    };

    p.setup = function () {
      p.createCanvas(400, 400).parent("CNV1");
    };
    let n
    let xoff =1, yoff=5000;
    p.draw = function () {

      n = p.noise(xoff,yoff);
      let nuance = n*255;
      p.image(img, 0, 0, 400, 400);
      p.fill(0);
      p.text("Frame Rate: " + p.frameRate().toFixed(2), 10, 30);
    };
  };

  let myp5 = new p5(sketch1);

 
  if (button1) {
    button1.addEventListener("click", function() {
      reverseColor(img);
      myp5.redraw(); // Redraw the canvas to reflect the changes
    });
  }

});