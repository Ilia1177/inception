// made by Hazardous.editorial -- Ilia


function level_2(p) {
    let		grid 
	let		mouse;
	let		tones = 10;				// Shade of grey
	let		blur = 0.08;			// Noisy Blur effect (doesnt work that well...)
	let		saturation = 1; 		// [0 - 100]
    const	cell_size = 5;			// size of cells in px
	const	noise_precision = 16;	// Nois Precisions [1 - 32]
	const	cursor_size = 80;		// size of Halo effect around the cursor

	p.setup = function () {
		p.noCursor();
		p.noiseDetail(noise_precision);
		p.noStroke();
		p.pixelDensity(1);
		grid = new Grid(p, cell_size, "background")
		grid.init(cell_size, "background");
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
		p.text("LEVEL 2 -- Frame Rate: " + Math.round(p.frameRate()), 30, 30);
		grid.noise.z += 0.005; 
	};

	p.windowResized = function () {
		console.log("level 2 -- Window size has changed !");
		p.resizeCanvas(window.innerWidth, window.innerHeight); // 🔧 resize canvas!
		grid.init(cell_size, "background"); // Reinitialize the grid
	};

	p.mouseClicked = function() {
		console.log("Level 2 -> next")
		sketch_index = (sketch_index + 1) % sketches.length;
		p5_start(sketches[sketch_index]);
	}
};

