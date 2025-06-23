document.addEventListener("DOMContentLoaded", function() {


  let sketch3 = function (p) {

    let xoff = 1;
    let yoff = 1000;
    let size =10

    p.setup = function () {
      p.createCanvas(400, 400);
    };
  
    p.draw = function () {
      p.clear();
      p.noStroke();
      p.fill(180);
      p.fill(127,127,127,127)

      for(let i=0;i<p.width;i+=size){
        for(let j=0;j<p.height;j+=size){
          let r1 = Math.floor(Math.random() * 400) + 1;
          let x = Math.floor(r1 / 10) * 10;
          let r2 = Math.floor(Math.random() * 400) + 1;
          let y = Math.floor(r2 / 10) * 10;
          p.rect(x,y,10)
        }
      }

    };
  };

  let myp53a = new p5(sketch3,"CNV1");
  let myp53b = new p5(sketch3,"CNV2");
  let myp53c = new p5(sketch3,"CNV3");
});

