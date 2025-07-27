const sketch1 = function(p) {

	let w, h;
	let parent;
	let risoInitialized = false;
	let blue, yellow, pink;

	p.setup = function() {       
		parent = p._userNode;
		window._p5Instance = p;
		w = 400;  
		h = w * 1.4142;
		p.createCanvas(w, h).parent(parent);
		p.background(255);
		blue = new Riso("blue");
		yellow = new Riso("yellow");
		pink = new Riso("fluorescentpink");
		drawCircle(blue, 100);
		drawCircle(yellow, 100);
		drawCircle(pink, 100);
	}

	p.draw = function() { 
			console.log("drw");
	}

	 function drawCircle(layer, n) {
		for (let i = 0; i < n; i++) {
			clearRiso();
			layer.strokeWeight(10);
			layer.stroke(127);
			layer.noFill();
			layer.circle(p.random(0, w), p.random(0, h), 50)
			drawRiso();
		}
	}

}

if (typeof initializeSketch === 'function') {
  initializeSketch(sketch1);
}
