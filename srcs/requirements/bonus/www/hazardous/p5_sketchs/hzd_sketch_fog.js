//windowWidth = window.innerWidth;
//windowHeight = window.innerHeight;

// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
let hzd_fog = function(p) {
    let		grid 
	let		mouse;
	let		tones = 10;				// Shade of grey
	let		blur = 0.08;			// Noisy Blur effect (doesnt work that well...)
	let		saturation = 1; 		// [0 - 100]
    var		cell_size;			// size of cells in px
	const	noise_precision = 16;	// Nois Precisions [1 - 32]
	const	cursor_size = 80;		// size of Halo effect around the cursor
	var	parent;
	p.setup = function () {
		parent = p._userNode;
		p.createCanvas(window.innerWidth, window.innerHeight).parent(parent);
		if (window.innerWidth > 1500) {
			cell_size = 20;
		} else {
			cell_size = 10;
		}
		p.frameRate(10);
		p.noCursor();
		p.noiseDetail(noise_precision);
		p.noStroke();
		p.pixelDensity(1);
		grid = new Grid(p, window.innerWidth, window.innerHeight, cell_size, parent)
		grid.init(window.innerWidth, window.innerHeight, cell_size, parent);
		p.printText(grid);
	};

	p.draw = function() {
		p.background(0);
		mouse = p.createVector(p.mouseX, p.mouseY)
		grid.run_noise(0.01);
		for (let cell of grid.cells) {
			let dist = mouse.dist(cell.realPos);
			if (dist < cursor_size) {
				cell.n += p.map(dist, 0, cursor_size, 0.25, 0);
			}
		}
		grid.display(tones, blur, saturation, "noise");
		p.fill(255)
		p.textSize(14);
		p.text("Frame Rate: " + Math.round(p.frameRate()), 30, 30);
		grid.noise.z += 0.005; 
	};


	p.printText = function(grid) {
		grid.buffer.background(255);
		grid.text_to_buffer("HAZARDOUS","center", 0, -45, 90);
		grid.text_to_buffer("- ÉDiTORiAL -","center", 0, 45, 80);
		grid.buffer_to_grid(180, "title");
		//grid.buffer.background(255);
		//grid.text_to_buffer("Analog","center", -160, 180, 80);
		//grid.buffer_to_grid(180, 2);
		//grid.buffer.background(255);
		//grid.text_to_buffer("|","center", 0, 180, 80);
		//grid.buffer_to_grid(180, 0);
		//grid.buffer.background(255);
		//grid.text_to_buffer("Digital","center", 160, 180, 80);
		//grid.buffer_to_grid(180, 3);
	}


	p.mouseClicked = function() {
		saturation = p.map(mouse.x, 0, p.width, 0, 100);
		tones = p.floor(p.map(mouse.y, 0, p.height, 3, 74));
		for (let cell of grid.cells) {
			if (mouse.dist(cell.realPos) < 20) {
				if (cell.group == "title") {
					window.location.replace("analog.html");
				}

		  }
		}
	}
	p.windowResized = function () {
		p.resizeCanvas(window.innerWidth, window.innerHeight); // 🔧 resize canvas!
		if (window.innerWidth > 1500) {
			cell_size = 20;
		} else {
			cell_size = 10;
		}
		grid.init(window.innerWidth, window.innerHeight, cell_size, parent);// Reinitialize the grid
		p.printText(grid);
	};
};

