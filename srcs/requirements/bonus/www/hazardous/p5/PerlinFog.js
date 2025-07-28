// made by Hazardous.editorial -- Ilia

function PerlinFog(p, option = {}) {
    let		grid 
	let		mouse;
	let		tones = 10;				// Shade of grey
	let		blur = 0.08;			// Noisy Blur effect (doesnt work that well...)
	let		saturation = 1; 		// [0 - 100]
    const	cell_size = option.cell_size || 10;			// size of cells in px
	const	noise_precision = 16;	// Nois Precisions [1 - 32]
	const	cursor_size = 80;		// size of Halo effect around the cursor
	let		parent;

	p.setup = function () {
		parent = p._userNode;
		p.createCanvas(window.innerWidth, window.innerHeight).parent(parent);
		p.noCursor();
		p.frameRate(10);
		p.noiseDetail(noise_precision);
		p.noStroke();
		p.pixelDensity(1);
		grid = new Grid(p, window.innerWidth, window.innerHeight, cell_size, parent)
		grid.init(window.innerWidth, window.innerHeight, cell_size, parent);
		p.printText(grid, 60);

	};

	p.draw = function() {
		//p.background(0);
		mouse = p.createVector(p.mouseX, p.mouseY)
		grid.run_noise(0.01);
		for (let cell of grid.cells) {
			let dist = mouse.dist(cell.realPos);
			if (dist < cursor_size) {
				cell.n += p.map(dist, 0, cursor_size, 0.25, 0);
			}
		}
		grid.display(tones, blur, saturation, "noise");
		p.printInfos(0, 80);
		grid.noise.z += 0.005; 
	};

	p.windowResized = function () {
		console.log("level 2 -- Window size has changed !");
		p.resizeCanvas(window.innerWidth, window.innerHeight); // 🔧 resize canvas!
		grid.init(window.innerWidth, window.innerHeight, cell_size, parent);
		if (window.innerWidth < 1100) {
			console.log("resize text");
			p.printText(grid, 30);
		} else {
			p.printText(grid, 60);
		}
	};

	p.printInfos = function(x, y) {
		p.fill(255)
		p.textSize(14);
		p.text("size: ", 30 + x, 30 + y);
		p.text(cell_size, 70 + x, 30 + y);
		p.text("frame Rate: " + Math.round(p.frameRate()), 30 + x, 44 + y);
	}

	p.printText = function(grid, size) {
		grid.buffer.background(255);
		let fontSize = p.floor(0.0833 * window.innerWidth - 1.65);
		if (window.innerWidth > 600)
			grid.text_to_buffer("HAZARDOUS  ÉDiTORiAL","justify", 0, 160, fontSize);
		else
			grid.text_to_buffer("HAZARDOUS  ÉDiTORiAL","justify", 0, 100, fontSize);

		grid.buffer_to_grid(180, "title");
	}

	p.handleClick = function(grid, mouse) {
		for (let cell of grid.cells) {
			if (mouse.dist(cell.realPos) < 20) {
				if (cell.group == "title") {
					const items = document.querySelectorAll('.item.digital');
					items.forEach(item => {
						item.style.display = 'block';
					});
					break ;
				}
			}
		}
	}

	p.mouseClicked = function() {
		p.handleClick(grid, mouse);
	}
};

