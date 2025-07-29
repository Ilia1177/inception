
// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
function Noise(p) {
	let		mouse;
	let img;
	let face;

    var parent;
	var w, h;

	var	item;
	var		displayValue;

	p.setup = function () {
		parent = p._userNode;
		w = parent.clientWidth;   // CSS width in px
		h = parent.clientHeight;   // CSS width in px
		p.createCanvas(w, h).parent(parent);
		img = p.createImage(w, h);
		p.frameRate(2);
		p.pixelDensity(10);
	};

	p.draw = function() {
		p.background(255);
		gaussian_noise(img);
		p.image(img, 0, 0);
	}


	function gaussian_noise(img) {
		img.loadPixels();
		for (let i = 0; i < img.pixels.length; i += 4) {
			img.pixels[i] = p.floor(p.random(0, 255));   // R
			img.pixels[i + 1] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 2] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 3] = p.floor(p.random(0, 255)); // G
			img.pixels[i + 3] = 255;
		}
		img.updatePixels();
	}

	function p5_restart() {
		sketch_index = (sketch_index + 1) % sketches.length;
		p5_start(sketches[sketch_index]);
	}


	p.printInfos = function(x, y) {
		p.fill(255)
		p.textSize(14);
		p.text("empty", 30 + x, 30 + y);
		p.text("Frame Rate: " + Math.round(p.frameRate()), 30 + x, 44 + y);
	}

	p.windowResized = function () {
		p.resizeCanvas(0, 0);
		w = parent.clientWidth;   // CSS width in px
		h = parent.clientHeight;   // CSS width in px
		p.resizeCanvas(w, h);
		img = p.createImage(w, h);
	};

	p.mouseClicked = function() {

	}

	// Function to handle the click logic
	function handleClick() {
	//	displayValue = getComputedStyle(item).display;
	//	if (displayValue == 'block') {
	//		make_img();
	//	}
	}
	document.addEventListener('click', handleClick);
};
