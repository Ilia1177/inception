//affiche lignes de couleurs verticales

document.addEventListener('DOMContentLoaded',function (){

    let sketch10 = function(p) {
        let xoff = p.random(99999), yoff = p.random(99999);
        let numberOfLines = 3
        let amp=50
        let size= 1;
        let multiply = true
        let loop = false;
        let change = 0;
        let r, b, g;
        let button1 = document.getElementById("button1");
        let button2 = document.getElementById("button2");
        let button3 = document.getElementById("button3");
        let button4 = document.getElementById("button4");
        let slider1 = document.getElementById("slider1")
        let slider2 = document.getElementById("slider2")
        let slider3 = document.getElementById("slider3")

        function verticals() {

            amp = p.map(slider2.value,0,255,0,50)
            spaceBetween = p.map(slider1.value,0,100,20,400)
            p.noStroke();
            for(let x=0; x< p.width ; x+=spaceBetween){
              p.stroke (change,g,b,127)
              for(let y = - 50 ; y < p.height + 50;y+=1){
                size = p.map(p.noise(yoff),0,1,0,slider3.value)
                let n = p.map(p.noise(xoff,yoff),0,1,-amp,amp);
                let posX = x + n
                let posY = y
                p.circle (posX,posY,size);
                xoff+=0.005
              }
              yoff += 0.05
              change = p.random(255)
            }
        }
        function blender(){
            multiply = !multiply
            if (multiply) p.blendMode(p.MULTIPLY)
            else if (!multiply) p.blendMode(p.BLEND)
        }
        function looper(){
    loop = !loop
        }
        function couleur(){
            r = p.floor(p.random(0, 255));
            g = p.floor(p.random(0, 255));
            b = p.floor(p.random(0, 255));
        }
    p.setup = function () {
        r = p.floor(p.random(0, 255));
        g = p.floor(p.random(0, 255));
        b = p.floor(p.random(0, 255));
        p.background(r,g,b,127);
        p.createCanvas(400, 400);
        verticals();
    }

    p.draw = function(){

        if (loop) {
            p.background(255)
            verticals();
        }

    }
   
    if (button1) {
        button1.addEventListener("click", function() {
          verticals();
        //   myp5.redraw(); // Redraw the canvas to reflect the changes
        });
      }
    if (button2) {
        button2.addEventListener("click", function() {
          blender();
        //   myp5.redraw(); // Redraw the canvas to reflect the changes
        });
      }
    if (button3) {
        button3.addEventListener("click", function() {
          looper();
        //   myp5.redraw(); // Redraw the canvas to reflect the changes
        });
      }
    if (button4) {
        button4.addEventListener("click", function() {
          couleur();
        //   myp5.redraw(); // Redraw the canvas to reflect the changes
        });
      }
  }
  
  
  
  
  let myP510 = new p5(sketch10, "CNV1")
})
  