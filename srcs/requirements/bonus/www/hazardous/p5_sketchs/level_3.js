
// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
function level_3(p) {
	let		mouse;
	let img;
	let face;

	let w = window.innerWidth;
	let h = window.innerHeight;
	//w = 100;
	//h = 100;
	let pixelQueue = [];
	let visitedPixels = new Set();
	let running = false;

	p.setup = function () {
		let cnv = p.createCanvas(w, h).parent("background");
		img = p.createImage(w, h);
		img.loadPixels();

		p.pixelDensity(10);
		for (let i = 0; i < img.pixels.length; i += 4) {
			img.pixels[i] = p.floor(p.random(0, 255));   // R
			img.pixels[i + 1] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 2] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 3] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 3] = 255;
		}
		img.updatePixels();
		p.background(255);
		p.image(img, 0, 0);
		
	};

	function getColor(i) {
		let color = [4];
		color[0] = img.pixels[i  ];
		color[1] = img.pixels[i + 1];
		color[2] = img.pixels[i + 2];
		color[3] = img.pixels[i + 3];
		return color;
	}

	p.draw = function() {
		let last_color;
			if (pixelQueue.length > 0) {
				img.loadPixels();

				let i = pixelQueue.shift(); // Get one pixel per frame
				if (visitedPixels.has(i)) return;

				visitedPixels.add(i);
				if (pixelQueue.length > 0) {
					let old_i = pixelQueue[0];
					let r = img.pixels[old_i];
					let g = img.pixels[old_i + 1];
					let b = img.pixels[old_i + 2];
					let a = img.pixels[old_i + 3];
					// Darken pixel color (just an example change)
					img.pixels[i    ] = p.floor((img.pixels[i    ] + r) / 1);
					img.pixels[i + 1] = p.floor((img.pixels[i + 1] + g) / 1);
					img.pixels[i + 2] = p.floor((img.pixels[i + 2] + b) / 1);
					img.pixels[i + 3] = p.floor((img.pixels[i + 3] + a) / 1);
					img.updatePixels();
					console.log("change color");
				}
				// Add 4 neighbors
				let neighbors = getNeighbors(i, img);
				for (let ni of neighbors) {
				  if (!visitedPixels.has(ni)) {
					last_color = getColor(i);
					pixelQueue.push(ni);
				  }
				}
			}
			p.image(img, 0, 0);
	}


	function p5_restart() {
		sketch_index = (sketch_index + 1) % sketches.length;
		p5_start(sketches[sketch_index]);
	}


	function getNeighbors(i) {
		let neighbors = [];
		let w = img.width;

		// Convert 1D index to (x, y)
		let pixelIndex = i / 4;
		let x = pixelIndex % w;
		let y = Math.floor(pixelIndex / w);

		let offsets = [
			{ dx: -1, dy: 0 }, // left
			{ dx: 1, dy: 0 },  // right
			{ dx: 0, dy: -1 }, // top
			{ dx: 0, dy: 1 }   // bottom
		];

		for (let offset of offsets) {
			let nx = x + offset.dx;
			let ny = y + offset.dy;

			if (nx >= 0 && nx < w && ny >= 0 && ny < img.height) {
				let ni = (nx + ny * w) * 4;
				neighbors.push(ni); // store the index of the neighbor's red channel
			}
		}
		return neighbors; // each is the start index of a neighbor pixel (RGBA)
	}

	function isVisited(i) {
		for (let v of visitedPixels) {
			if (v == i) {
				return true;
			}
		}
		return false;
	}

	function grow(i, last_color) {
		if (isVisited(i)) {
			console.log("is visited");
			return ;
		}
		visitedPixels.push(i);
		let color = [
			img.pixels[i], 
			img.pixels[i + 1], 
			img.pixels[i + 2],
			img.pixels[i + 3],
		]
		img.pixels[i    ] 	= p.floor((img.pixels[i    ] + last_color[0]) / 2);
		img.pixels[i + 1]	= p.floor((img.pixels[i + 1] + last_color[1]) / 2);
		img.pixels[i + 2]	= p.floor((img.pixels[i + 2] + last_color[2]) / 2);
		img.pixels[i + 3]	= p.floor((img.pixels[i + 3] + last_color[3]) / 2);
		let neighbors = getNeighbors(i);
		for (let ni of neighbors) {
			grow(ni, color); 
  		}
		img.updatePixels();
		p.background(25);
		p.image(img, 0, 0)
		img.loadPixels();
	}

	p.mouseClicked = function() {
		running = true;
		  let seedIndex = (p.mouseX + p.mouseY * w) * 4;
		  pixelQueue.push(seedIndex);
		}


	p.printInfos = function(x, y) {
		p.fill(255)
		p.textSize(14);
		p.text("LEVEL 2", 30 + x, 30 + y);
		p.text("Frame Rate: " + Math.round(p.frameRate()), 30 + x, 44 + y);
	}

	p.windowResized = function () {
		console.log("level 2 -- Window size has changed !");
		p.resizeCanvas(window.innerWidth, window.innerHeight); // 🔧 resize canvas!
		grid.init(cell_size, "background"); // Reinitialize the grid
		p.printFace(grid);
	};
};
