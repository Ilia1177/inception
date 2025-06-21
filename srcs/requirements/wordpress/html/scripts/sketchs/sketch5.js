

let sketch5 = function (p) {
  p.setup = function () {
    p.createCanvas(400, 400).parent("CNV2");
    // Your setup code for sketch 2
  };

  p.draw = function () {
    p.background(127);
    p.circle(200, 200, p.random(20, 50));
    p.text("Frame Rate: " + p.frameRate().toFixed(2), 10, 30);
  };
};
