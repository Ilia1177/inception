
const blanck = function(p) {

	let w, h;
	let parent;
	p.setup = function() {
		parent = p.userNode;
		//w = 400;   // CSS width in px
		w = parent.clientWidth;   // CSS width in px
		h = w * 1.4142;
		p.createCanvas(w, h).parent(parent);
		p.background(255);
	}

	p.draw = function() {
		p.strokeWeight(10);
		p.stroke(255);
		p.noFill();
		p.circle(w/2, h/2, 50)
	}
}

if (typeof initializeSketch === 'function') {
  initializeSketch(sketch1);
}
