let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let max_width = 9999
console.log("Window width:", windowWidth);


let typo = function (p) {
    let cnv
    let lpi = 10;
    let niveau = 12
    let xoff = 1;
    let yoff = 5000;
    let zoff = 999999;
    let buffer;
    let toile 

    window.addEventListener("resize", function() {
      // Your function code here
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      toile.init()
      console.log("Window width has changed");
  });

    p.setup = function () {
      p.noiseDetail(16);
      p.noStroke();
      p.pixelDensity(1);
      if(windowWidth>max_width){
        cnv = p.createCanvas(max_width , windowHeight).parent("CNV0");
      } else if(windowWidth <= max_width){
        cnv = p.createCanvas(windowWidth , windowHeight).parent("CNV0");
        console.log(windowWidth)
      }
      buffer = p.createGraphics(p.width, p.height);
      toile = new ToileDeFond(cnv,lpi)
      toile.init();


      
    };
    
    
    p.draw = function () {
      p.background(0);
      let mouse = p.createVector(p.mouseX,p.mouseY)
      
      toile.run();
      toile.display(mouse);
      // toile.shadeFrom();
        
        p.fill(0)
        p.rect(10,20,110,10)
        p.fill(255)
        p.text("Frame Rate:"+ p.frameRate().toFixed(2), 10, 30);
        
        zoff += 0.005; 
    };

    p.mouseClicked = function () {
      console.log("mouseclicked")
      for (let g of toile.grid) {
          if (g.contains(p.mouseX, p.mouseY) && g.letter) {
              g.changeColor();
          }
      }
    }






    function Field(i,j,a,s, n){
      this.letter = false;
      this.i = i
      this.j = j 
      this.n = n
      this.alpha = a;
      this.size = s;
      this.level
      this.draw = function(){
          let max_level = 12 
          this.level = p.floor(p.map(this.n,0,1,0,max_level))
          this.color = this.level*(255/max_level)
          if(this.letter) this.color =  255-this.color
          // if(this.letter) this.color =  0
          // if(this.alpha==0 && this.letter) this.alpha =255
          // if(this.level < 4 || this.level > 8) this.alpha = 0
          p.noStroke();
          p.fill(this.color,this.alpha)
          p.rect(this.i*this.size,this.j*this.size,this.size)
      }

      this.contains = function (px, py) {
        return px > (this.i*this.size) && px < (this.i*this.size) + this.size &&
               py > (this.j*this.size) && py < (this.j*this.size) + this.size ;
    }

      this.changeColor = function(){
        console.log("changeColor")
        this.n +=0.5
      }
  
    }
  
    class ToileDeFond {
      constructor (cnv, size){
        this.cellSize = size;
        this.res = {x:p.floor(p.width / this.cellSize), y:p.floor(p.height / this.cellSize)}

        this.ctx = cnv;
        this.grid = []
      }
  
      init(){  
        this.grid = []
  
        if(windowWidth>max_width){
          cnv = p.createCanvas(max_width , windowHeight).parent("CNV0");
        } else if(windowWidth <= max_width){
          cnv = p.createCanvas(windowWidth , windowHeight).parent("CNV0");
          console.log(windowWidth)
        }
        buffer = p.createGraphics(p.width, p.height);
        this.res = {x:p.floor(p.width / this.cellSize), y:p.floor(p.height / this.cellSize)}

   
        // this.ctx = p.createCanvas(windowWidth , windowHeight).parent("CNV0");

        console.log("init",windowWidth , windowHeight)
        let alpha = 255 
  
        for (let i = 0; i < this.res.x; i ++) {
          for (let j = 0; j < this.res.y; j ++) {
            this.grid.push(new Field(i,j,alpha,this.cellSize,0))
          }
        }

        let textPosY = windowHeight/3
        let textPosX = windowWidth/12
        this.printText("HAZARDOUS",textPosX,textPosY,90);
        this.printText("ÉDiTORIAL",textPosX,textPosY+100,80);
      }
  
      run() {
        xoff = 1;
        for (let i = 0; i < this.res.x; i++) {
            yoff = 99;
            for (let j = 0 ; j < this.res.y; j++) {
                let n = p.noise(xoff, yoff, zoff)
                let index = j + i * this.res.y;
                this.grid[index].n = n;
                yoff += 0.01;
            }
            xoff += 0.01;
        }
      }

      display(mouse){
        xoff = 1
        // let shaking = p.map(p.noise(xoff),0,1,0,0.01)
        let shaking = 0.0008

        for(let g of this.grid){
          g.n += p.random (-shaking,shaking)
          // if (g.clicked(mouse)) g.color = 0
          g.draw()
          xoff++
        }
      }
    
    shadeFrom(x,y){
      let center = p.createVector(this.res/2,this.res/2)
      let radius = 50
      for (let i = 0;i < this.res.x;i++){
        for (let j = 0; j< this.res.y;j++){
          let pos = p.createVector(i,j)
          let dist = pos.dist(center)
          if(dist>radius) this.grid[i+j*this.res.y].alpha = 0;
        }
      }
    }
    update(){
      for(let g of this.grid){
        g.n =+ p.random (-0.05,0.05)
      }
    }
    
  


      printText(string, x, y, textSize =80){
        // justify
        let offSetX = x
        let offSetY = y;
        let text = string;

        // let space = p.floor(buffer.width / lpi);
        let space = this.cellSize
        let threshold = 180;
        buffer.background(255);
        buffer.fill(0);
        buffer.stroke(255);
        buffer.strokeWeight(2);
        buffer.textSize(textSize);
      
      buffer.textFont("Ubuntu");
      buffer.textLeading(25);
      buffer.textStyle(p.BOLDITALIC);
      let length = p.textWidth(text)
      console.log("length", length )
      offSetX = (p.width - length)/5
      
      buffer.text(text, offSetX, offSetY);
      buffer.loadPixels();



      for (let i = 0; i < this.res.x; i ++) {
        for (let j = 0; j < this.res.y; j ++) {

          let gridIndex = j + i * this.res.y;
          let total = 0;
          for (let x = i*this.cellSize; x < i*this.cellSize + this.cellSize; x++) {
            for (let y = j*this.cellSize; y < j*this.cellSize + this.cellSize; y++) {
              
              let pixelIndex = (x + y * buffer.width) * 4;
              let greyShade =
              (buffer.pixels[pixelIndex] +
                buffer.pixels[pixelIndex + 1] +
                buffer.pixels[pixelIndex + 2]) /
                3;
                
                total += greyShade;
              }
            }
            
            let average = total / (this.cellSize * this.cellSize);
            if (average <= threshold) {
                this.grid[gridIndex].letter = true;
            }
            else  {

            };
        }
        }
 
        buffer.clear();
    }
    //   printText(string, x, y, textSize =80){
    //     let offSetX = x
    //     let offSetY = y;
    //     let text = string;
    //     // let space = p.floor(buffer.width / lpi);
    //     let space = this.cellSize
    //     let threshold = 180;
    //   buffer.background(255);
    //   buffer.fill(0);
    //   buffer.stroke(100);
    //   buffer.strokeWeight(2);
    //   buffer.textSize(textSize);
    //   buffer.textFont("Ubuntu");
    //   buffer.textLeading(10);
    //   buffer.textStyle(p.BOLDITALIC);
    //   buffer.text(text, offSetX, offSetY);
    //   buffer.loadPixels();

    //     for (let i = 0; i < this.res; i ++) {
    //       let row = [];
    //       for (let j = 0; j < this.res; j ++) {
    //         let total = 0;
    //         for (let x = i*this.cellSize; x < i*this.cellSize + this.cellSize; x++) {
    //           for (let y = j*this.cellSize; y < j*this.cellSize + this.cellSize; y++) {
    //             let pixelIndex = (y + x * buffer.width) * 4;
    //             let greyShade =
    //               (buffer.pixels[pixelIndex] +
    //                 buffer.pixels[pixelIndex + 1] +
    //                 buffer.pixels[pixelIndex + 2]) /
    //               3;
                    
    //             total += greyShade;
    //           }
    //         }
  
    //         let average = total / (space * space);
    //         let index = i + j*this.res;
    //         if (average <= threshold) {
    //             this.grid[index].letter = true;
    //         }
    //         else if (average >= threshold || !this.grid[index].letter  ) {
    //           // this.grid[index].letter = false;

    //         };
    //     }
    //     }
    //     buffer.updatePixels()
    //     p.image(buffer,0,0)
    //     buffer.clear();
    // }

      }
      
  };
  
  // --> ADD
  // Choix aléatoire du sketch
  // Création de sketchs alternatif
  new p5(typo);


  
