// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
function level_2(p) {
    let		grid 
	let		mouse;
	let		tones = p.floor(p.random(5, 10)); 		// [0 - 100]
	let		blur = 0.08;			// Noisy Blur effect (doesnt work that well...)
	let		saturation = p.floor(p.random(5, 20)); 		// [0 - 100]
    //const	cell_size = 3;
    p.cell_size = p.floor(p.random(10, 20));			// size of cells in px
	let imgs = [8];
	let face;
	const	noise_precision = 16;	// Nois Precisions [1 - 32]
	const	cursor_size = 80;		// size of Halo effect around the cursor

	p.preload = function () {
		face = new Face(400, 400, 0 ,0 ,0, 0);
		face.head[0] = p.loadImage("../images/HEAD_0001.png");
		face.head[1] = p.loadImage("../images/HEAD_0002.png");
		face.head[2] = p.loadImage("../images/HEAD_0003.png");
		face.head[3] = p.loadImage("../images/HEAD_0004.png");
		face.mouth[0] = p.loadImage("../images/HEAD_0005.png");
		face.mouth[1] = p.loadImage("../images/HEAD_0006.png");
		face.mouth[2] = p.loadImage("../images/HEAD_0007.png");
		face.mouth[3] = p.loadImage("../images/HEAD_0008.png");
		face.nose[0] = p.loadImage("../images/HEAD_0009.png");
		face.nose[1] = p.loadImage("../images/HEAD_0010.png");
		face.nose[2] = p.loadImage("../images/HEAD_0011.png");
		face.nose[3] = p.loadImage("../images/HEAD_0012.png");
		face.eye[0] = p.loadImage("../images/HEAD_0013.png");
		face.eye[1] = p.loadImage("../images/HEAD_0014.png");
		face.eye[2] = p.loadImage("../images/HEAD_0015.png");
		face.eye[3] = p.loadImage("../images/HEAD_0016.png");
	}

	p.setup = function () {
		p.frameRate(10);
		p.noCursor();
		p.noiseDetail(noise_precision);
		p.noStroke();
		p.pixelDensity(1);
		grid = new Grid(p, p.cell_size, "background")
		grid.init(p.cell_size, background);
		p.printText(grid);
		p.printFace(grid, face);

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
		p.printInfos(0, 80);
		grid.noise.z += 0.005; 
	};

	p.printFace = function(grid, face) {
		grid.buffer.background(255);

		let x = window.innerWidth / 2 - (face.width / 2);
		let y = 200;
		grid.img_to_buffer(face.head[face.iH], x, y);
		grid.buffer_to_grid(200, "head");
		grid.img_to_buffer(face.mouth[face.iM], x, y);
		grid.buffer_to_grid(200,"mouth");
		grid.img_to_buffer(face.eye[face.iE], x, y);
		grid.buffer_to_grid(200,"eye");
		grid.img_to_buffer(face.nose[face.iN], x, y);
		grid.buffer_to_grid(200,"nose");
	}

	p.printText = function(grid) {
		grid.buffer.background(255);
		grid.text_to_buffer("HAZARDOUS  ÉDiTORiAL","justify", 0, 80, 60);
		grid.buffer_to_grid(180, "title");
	}


	p.mouseClicked = function() {
		for (let c of grid.cells) {
			if (c.group != 0 && c.group != "title") {
				c.group = 0;
				c.printed = false;
			} else if (c.group == "title" && mouse.dist(c.realPos) < 20) {
				window.location.replace("index.html");
			}

		}
		face.iM = p.floor(p.random(0, 4));
		face.iH = p.floor(p.random(0, 4));
		face.iN = p.floor(p.random(0, 4));
		face.iE = p.floor(p.random(0, 4));
		console.log(face.iH, face.iN, face.iH, face.iE);
		p.printFace(grid, face);
		if (face.iM == face.iE == face.iN == face.iH) {
			console.log("Level 1 -> next")
			sketch_index = (sketch_index + 1) % sketches.length;
			p5_start(sketches[sketch_index]);
		}
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
		grid.init(p.cell_size, "background"); // Reinitialize the grid
		p.printFace(grid);
	};
};
