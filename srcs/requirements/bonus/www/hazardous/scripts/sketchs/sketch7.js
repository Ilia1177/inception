document.addEventListener("DOMContentLoaded",function(){


let sketch7 = function (p) {
  let cnv;
  let xoff = 1,
    yoff = 1000;

  p.setup = function () {
    p.createCanvas(400, 400).parent("CNV2");


  };

  p.draw = function () {
    p.clear();
    p.noStroke();
    p.fill(255);
    // Calculate the mouse speed

    let a = 0,
      b = 200;
    for (let i = 0; i < p.width; i++) {
      p.circle(a, p.noise(xoff) * p.height, 1);
      a++;
      xoff += 0.001;
    }

  };
};

})

let myP57 = new p5(sketch7, "CNV2")