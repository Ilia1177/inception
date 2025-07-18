
// Display a full page canvas with title "Hazardous editorial" in a perlin noise fog
// It uses a grid of cells to display the fog and makes a pixels effect
function noise(p) {
	let		mouse;
	let img;
	let face;

    var parent;
	var w, h;

	var	item = document.querySelector('.item.digital');
	var		displayValue = getComputedStyle(item).display;

	p.setup = function () {
		parent = p._userNode;
		p.createCanvas(0, 0).parent(parent);
		img = p.createImage(0, 0);
		p.frameRate(2);
		p.pixelDensity(10);
		if (displayValue == 'block') {
			p.resizeCanvas(w, h);
			img = p.createImage(w, h);
			img.loadPixels();
		}
	};

	p.draw = function() {
		console.log("draw", displayValue);
		p.background(255);
		if (displayValue == 'block') {
			make_img();
			w = parent.clientWidth;   // CSS width in px
			h = p.floor(w * 1.4142); // CSS height in 
			gaussian_noise(img);
			p.image(img, 0, 0);
		}
	}


	function gaussian_noise(img) {
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
		if (displayValue == 'block') {
			w = parent.clientWidth + 30;   // CSS width in px
			h = p.floor(w * 1.4142); // CSS height in 
			img = p.createImage(w, h);
			img.loadPixels();
		}
	};

	p.mouseClicked = function() {

	}

	function make_img() {
			p.resizeCanvas(w, h);
			w = parent.clientWidth;   // CSS width in px
			h = p.floor(w * 1.4142); // CSS height
			img = p.createImage(w, h);
			img.loadPixels();
	}

	// Function to handle the click logic
	function handleClick() {
		displayValue = getComputedStyle(item).display;
		if (displayValue == 'block') {
			make_img();
		}
	}
	document.addEventListener('click', handleClick);
};
