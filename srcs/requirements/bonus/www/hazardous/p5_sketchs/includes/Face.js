class Face {
	constructor(width, height, h, e, m, n) {
		this.width = width;
		this.height = height;
		this.iM = m;
		this.iE = e;
		this.iH = h;
		this.iN = n;
		this.nose = [4];
		this.mouth = [4];
		this.head = [4];
		this.eye = [4];
	};

	increment(group) {
		if (group == "head") {
			this.iH = this.ih + 1 % 4;
		} else if (group == "mouth") {
			this.iM = this.iM + 1 % 4;
		} else if (group == "nose") {
			this.iN = this.iN + 1 % 4;
		} else if (group == "eyes")
			this.iE = this.iE + 1 % 4;
	}

	draw(buffer, x, y) {
		console.log(buffer, this.nose[0], this.iN);
		buffer.image(this.nose[this.iH], x, y);
		buffer.image(this.head[this.iM], x, y);
		buffer.image(this.mouth[this.iE], x, y);
		buffer.image(this.eye[this.iN], x, y);
	}
}

