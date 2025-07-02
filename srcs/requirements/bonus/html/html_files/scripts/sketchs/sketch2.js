document.addEventListener("DOMContentLoaded", function() {

let sketch2 = function (p) {
  let img;
 let Ppixels = [];
  function rgbToHsl(r, g, b) {
    // Ensure that the input values are in the range [0, 255]
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find the maximum and minimum values among R, G, and B
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
  
    // Calculate the lightness
    const lightness = (max + min) / 2;
  
    // Check if the color is achromatic (no hue)
    if (max === min) {
      return [0, 0, lightness]; // HSL representation for black/white
    }
  
    // Calculate the saturation
    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  
    // Calculate the hue
    let hue;
    switch (max) {
      case r:
        hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        hue = ((b - r) / delta + 2) * 60;
        break;
      case b:
        hue = ((r - g) / delta + 4) * 60;
        break;
    }
  
    return [hue, saturation * 100, lightness * 100];
  }
  
  
  let scan = function (img, array) {
    img.loadPixels();
    let size =10;
    for (let y = 0; y < img.height; y += size) {
      for (let x = 0; x < img.width; x += size) {
        let totalAverage = 0;
        let averageR = 0;
        let averageG = 0;
        let averageB = 0;
        for (let yB = 0; yB < size; yB++) {
          for (let xB = 0; xB < size; xB++) {
            let index = (x + xB + (y + yB) * img.width) * 4;
            let average = 0;
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];
            
            average= (r+g+b)/3
            totalAverage += average;
            
            averageR += r;
            averageG += g;
            averageB += b;
          }
        }
        let r2 = averageR/(size*size)
        let g2 = averageG/(size*size)
        let b2 = averageB/(size*size)
        let posX, posY
        posX = x *400/img.width
        posY = y *400/img.height
        p.noStroke()

        if (totalAverage/(size*size) > p.random(180,190)) {
          // array.push(new Pix(posX,posY,size))
          p.fill(255-r2,slider2.value-g2,b2);
          p.rect(posX, posY, size);
        } else {
          p.fill(r2,g2,b2);
          p.rect(posX, posY, size);
        }
      }
    }
  };

  p.preload = function () {
    img = p.loadImage('images/chromaticEphemeris.jpg');
    
  }

  p.setup = function () {
    p.createCanvas(400, 400).parent("CNV2");
    p.frameRate(10);
  };

  p.draw = function () {
    scan(img, Ppixels);

    p.fill(255);
    p.text("Frame Rate: " + p.frameRate().toFixed(2), 10, 30);
    p.fill(0, 0, 255);
    p.noStroke();
     for(let p of Ppixels){
      p.draw();
     }
   

    // Optional: Uncomment the following lines for a gradual scan
    // if (p.frameCount < img.width * img.height / 25) {
    //   scan(img, p.frameCount);
    // }
  };
};

let myp52 = new p5(sketch2);

// let slider2 = document.getElementById("slider2");
// if (slider2) {
//   slider2.addEventListener("click", function() {
//     myp52.redraw(); // Redraw the canvas to reflect the changes
//   });
// }

});


class Pix {
  constructor(x,y,size,color){
    this.pos.x = x;
    this.pos.y = y;
    this.size = size;
    this.color = color
  }
  draw(){
    rect(this.pos.x,this.pos.y,this.size)
  }
}