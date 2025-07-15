let max_width = 9999

// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
let hzd_fog = function(p) {
	let		parent = "background";
	let		width;
	let		height;
    let		grid 
	let		mouse;
	let		tones = 10;				// Shade of grey
	let		blur = 0.08;			// Noisy Blur effect (doesnt work that well...)
	let		saturation = 1; 		// [0 - 100]
    const	cell_size = p.floor(p.random(5, 20));			// size of cells in px
	const	noise_precision = 16;	// Nois Precisions [1 - 32]
	const	cursor_size = 80;		// size of Halo effect around the cursor
	p.setup = function () {
		width = window.innerWidth;
		height = document.getElementById(parent).offsetHeight;
		p.noCursor();
		p.noiseDetail(noise_precision);
		p.noStroke();
		p.pixelDensity(1);
		grid = new Grid(p, width, height, cell_size, parent)
		place_text(grid);
	};

	p.draw = function() {

		console.log(width, height);
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
		grid.noise.z += 0.005; 
	};

	p.mouseClicked = function() {
		saturation = p.map(mouse.x, 0, p.width, 0, 100);
		tones = p.floor(p.map(mouse.y, 0, p.height, 3, 74));
		for (let cell of grid.cells) {
			if (mouse.dist(cell.realPos) < 20) {
				if (cell.group == "title") {
					window.location.replace("index.html");
				} 
			}
		}
	}

	window.addEventListener("resize", function() {
		console.log("Window size has changed !");
		width = window.innerWidth;
		grid.init(width, height, cell_size, parent);
		place_text(grid);
	});

	function place_text(grid) {
		grid.buffer.textSize(50);
		grid.buffer.background(255);
		grid.text_to_buffer("HAZARDOUS ÉDiTORiAL","justify", 0, 80);
		grid.buffer_to_grid(180, "title");
	};
};

new p5(hzd_fog);
