let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let max_width = 9999
console.log("Window width:", windowWidth);

let hzd_fog = function (p) {
    let cnv;
    let grid 
    //let niveau = 120
    //let xoff = 1;
    //let yoff = 5000;
    //let zoff = 0;
    let buffer;
    const cell_size = 5;
	// Shade of gray
	const tones = 10;
	// Blur noise
	const shaking = 0.003;
	const saturation = 1; // [0 - 100]
	let mouse;

    window.addEventListener("resize", function() {
      console.log("Window size has changed !");
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      grid.init();
	});

    p.setup = function () {
      p.noiseDetail(1);
      p.noStroke();
      p.pixelDensity(1);
      if (windowWidth > max_width) {
        cnv = p.createCanvas(max_width, windowHeight).parent("CNV0");
      } else if(windowWidth <= max_width){
        cnv = p.createCanvas(windowWidth, windowHeight).parent("CNV0");
        console.log(windowWidth)
      }
      buffer = p.createGraphics(p.width, p.height);
      grid = new Grid(cnv, cell_size)
      grid.init();
	  console.log(p.width, p.height, windowWidth, windowHeight);
    };

    p.draw = function () {
      p.background(0);
      mouse = p.createVector(p.mouseX, p.mouseY)
      grid.run(0.01);
      grid.display();
      //grid.shadeFrom();
	  p.fill(255)
	  p.textSize(14);
	  p.text("Frame Rate:" + p.frameRate().toFixed(2), 30, 30);
      grid.noise.z += 0.005; 
    };

    p.mouseClicked = function () {
      console.log("mouseclicked")
      for (let g of grid.cells) {
          if (g.contains(p.mouseX, p.mouseY) && g.letter) {
              g.changeColor();
          }
      }
    }

	class Cell {
	  constructor(x, y, alpha, size, noise) {
		this.letter = false;
		this.i = x;
		this.j = y;
		this.n = noise;
		this.alpha = alpha;		//unused
		this.size = size;
	  }

	  draw() {
	  	let color = p.floor(p.map(this.n, 0, 1, -saturation, tones + saturation)) * (255 / tones);
		if (this.letter)
			color = 255 - color;
		p.fill(color);
		p.rect(this.i * this.size, this.j * this.size, this.size);
	  }

	  contains(px, py) {
		if (px >= (this.i * this.size) && px <= (this.i * this.size) + this.size &&
			py >= (this.j * this.size) && py <= (this.j * this.size) + this.size) {
			return true;
		}
		return false;
	  }

	  changeColor() {
		this.letter = false;
	  }
	}
  
	class Grid {
		constructor (cnv, size){
			this.cellSize = size;
			this.res = {x:p.floor(p.width / this.cellSize),
						y:p.floor(p.height / this.cellSize)};
			this.ctx = cnv;
			this.cells = [];
			this.noise = p.createVector(1, 5000, 0);
		}

		init() {  
			console.log("initialisation...");
			this.cells = [];
			if(windowWidth > max_width){
			  cnv = p.createCanvas(max_width , windowHeight).parent("CNV0");
			} else if (windowWidth <= max_width) {
			  cnv = p.createCanvas(windowWidth , windowHeight).parent("CNV0");
			}
			buffer = p.createGraphics(p.width, p.height);
			this.res = {x:p.floor(p.width / this.cellSize),
						y:p.floor(p.height / this.cellSize)}
			let alpha = 255; 
			for (let i = 0; i < this.res.x; i ++) {
			  for (let j = 0; j < this.res.y; j ++) {
				this.cells.push(new Cell(i, j, alpha, this.cellSize, 0))
			  }
			}
			this.printText("HAZARDOUS","center", 0, -40, 90);
			this.printText("ÉDiTORiAL","center", 0, 40, 80);
		}

		// Print text on buffer
		// then assign if letter is true on each Cell of the cells 
		printText(str, align, x, y, textSize = 80) {
			console.log("Print text on buffer");
			let xOff, yOff;
			let threshold = 180;
			buffer.background(255);
			buffer.fill(0);
			buffer.textSize(textSize);
			buffer.textFont("Ubuntu");
			buffer.textLeading(2);
			buffer.textStyle(p.BOLDITALIC);
			let textWidth = buffer.textWidth(str);
			let textHeight = (p.textAscent() + p.textDescent()); // * (lines.lenght + 1);
			if (align == "justify") {
				xOff = (p.width - textWidth) / 2;
				yOff = 0;
			} else if (align == "center") {
				xOff = (p.width - textWidth) / 2
				yOff = (p.height - textHeight) / 2;
			}
			buffer.text(str, xOff + x, yOff + y);
			buffer.loadPixels();

			// assign cells.letter if a cell is a letter cell
			let cellSize = this.cellSize;
			// iter on each cell of the cells
			for (let i = 0; i < this.res.x; i ++) {
				for (let j = 0; j < this.res.y; j ++) {
					let cellsIndex = j + i * this.res.y;
					// evaluate average color for every pix of buffer that are in the Cell
					let total = 0;
					for (let x = i * cellSize; x < i * cellSize + cellSize; x++) {
						for (let y = j * cellSize; y < j * cellSize + cellSize; y++) {
							let pixelIndex = (x + y * buffer.width) * 4;
							let greyShade = (buffer.pixels[pixelIndex] +
											buffer.pixels[pixelIndex + 1] +
											buffer.pixels[pixelIndex + 2]) / 3;
							total += greyShade;
						}
					}
					let average = total / (cellSize * cellSize);
					if (average <= threshold) {
						this.cells[cellsIndex].letter = true;
					}
				}
			}
			buffer.clear();
		}

		run(size) {
			this.noise.x = 1;
			for (let i = 0; i < this.res.x; i++) {
				this.noise.y = 99;
				for (let j = 0 ; j < this.res.y; j++) {
					let n = p.noise(this.noise.x, this.noise.y, this.noise.z)
					let index = j + i * this.res.y;
					this.cells[index].n = n;
					this.noise.y += size;
				}
				this.noise.x += size;
			}
		}

		display() {
			for (let g of this.cells) {
				g.n += p.random(-shaking, shaking);
				g.draw();
			};
		}
		
		shadeFrom(x,y){
			let center = p.createVector(this.res / 2, this.res/2)
			let radius = 50
			for (let i = 0; i < this.res.x; i++) {
				for (let j = 0; j < this.res.y; j++) {
					let pos = p.createVector(i,j)
					let dist = pos.dist(center)
					if(dist>radius) this.cells[i+j*this.res.y].alpha = 255;
				}
			}
		}
	}
};

new p5(hzd_fog);
