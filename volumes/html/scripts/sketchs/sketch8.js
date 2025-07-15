let cnv;
let space;
let pink;
let yellow;
let purple;
let cells = [];
let cellPos;
let bacteriaColony = [];
let food = [];
let bacteriaCounter = 0;
let buffer;

function setup() {
  rectMode(CENTER);
  cnv = createCanvas(400, 400);
  cnv.parent("CNV3");
  space = new SPACE(cnv, 40);

  pink = new Riso("FLUORESCENT PINK");
  purple = new Riso("PURPLE");
  yellow = new Riso("YELLOW");

  cells[0] = new Cell(space, createVector(200, 200));
  cells[0].create(300, 300, 100);
  cells[1] = new Cell(space, createVector(200, 200));
  cells[1].create(100, 100, 100);

  for (let i = 0; i < 10; i++) {
    let bactPos = createVector(random(width), random(height));
    bacteriaColony[i] = new Bacteria(space, bactPos);
  }
  space.build();
}

function draw() {
  cnv.background(255);

  clearRiso();

  bacteriaCounter = bacteriaColony.length;
  space.reBuild();
  space.display(pink);
  let mouse = createVector(mouseX, mouseY);
  // cells[0].plasmicMembrane[44].pos = mouse;
  for (let c of cells) {
    c.attach();
    c.sticks();
    c.cyt();
    c.display(purple, pink, yellow);
    // c.display2();
    // c.display3();
    c.eat(food);
    c.avoid(cells);
  }
  for (let b of bacteriaColony) {
    b.show(purple);
    b.avoid(cells);
    if (food.length !== 0) {
      b.eat(food);
    }
  }
  // show food
  fill(255, 0, 0);
  for (let f of food) {
    rect(f.x, f.y, 10, 10);
  }

  // display counter
  pink.fill(255);
  pink.textSize(20);
  pink.text("Bacteria: " + bacteriaCounter, 10, 20);
  text("Frame Rate: " + floor(frameRate()), 10, 30);
  drawRiso();
}

// bacteria class
function ToPixel(buffer) {
  let threshold = 127;
  buffer.loadPixels();
  let grid = [];
  for (let j = 0; j < buffer.width; j += 10) {
    let row = [];
    for (let i = 0; i < buffer.height; i += 10) {
      let total = 0;
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          let pixelIndex = (j + x + (i + y) * buffer.width) * 4; // Calculate pixel index for the current space
          let r =
            (buffer.pixels[pixelIndex] +
              buffer.pixels[pixelIndex + 1] +
              buffer.pixels[pixelIndex + 2]) /
            3; // grayscale

          total += r;
        }
      }
      let average = total / (10 * 10);
      if (average <= threshold) {
        row.push(0); // If average pixel is not black, set it as 0
      } else if (average >= threshold) {
        row.push(1); // If average pixel is black, set it as 1
      }
    }
    grid.push(row);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 1) {
        fill(0);
        rect(i * 10, j * 10, 10);
      } else if (grid[i][j] == 0) {
        fill(255);
        rect(i * 10, j * 10, 10);
      }
    }
  }

  buffer.clear();
  // return textGrid;
}
class Cell {
  constructor(space, pos, vel = createVector(0, 0)) {
    this.plasmicMembrane = [];
    this.cytoplasm = [];
    this.space = space;
    this.core;
    this.pos = pos;
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.maxSpeed = 0.2;
    this.radius = 100;
    this.damping = 1;
    this.mass = 1;
  }
  create(x, y, radius = 100) {
    this.radius = radius;
    let pos = createVector(x, y);
    let phi = 0;

    // CORE
    let core = new Cell(this.space, pos);
    core.mass = 2;
    this.core = core;
    let center = this.core.pos.copy();
    // PLASMIC MEMBRANE
    for (let i = 0; i < 45; i += 1) {
      let x = cos((phi * PI) / 180) * radius + center.x;
      let y = sin((phi * PI) / 180) * radius + center.y;
      this.plasmicMembrane[i] = new Cell(this.space, createVector(x, y));
      this.plasmicMembrane[i].maxSpeed = 0.3;
      this.plasmicMembrane[i].damping = 0.95;
      phi += 8;
    }

    // CYTOPLASM
    for (let j = this.space.cellSize; j < radius; j += this.space.cellSize) {
      for (let i = 0; i < 100; i += 1) {
        let x = cos((phi * PI) / 180) * (radius - j) + center.x;
        let y = sin((phi * PI) / 180) * (radius - j) + center.y;
        this.cytoplasm.push(new Cell(this.space, createVector(x, y)));
        phi += 4;
      }
    }
  }

  cyt() {
    for (let i = 0; i < this.cytoplasm.length; i++) {
      let cytoplasm = this.cytoplasm[i];
      cytoplasm.update();
      cytoplasm.maxSpeed = 1;
      cytoplasm.acc = p5.Vector.random2D().mult(0.1);
      for (let j = 0; j < this.plasmicMembrane.length; j++) {
        let membrane = this.plasmicMembrane[j];
        let d = cytoplasm.pos.dist(membrane.pos);

        if (d < this.space.cellSize) {
          let dir = p5.Vector.sub(cytoplasm.pos, membrane.pos);
          let force = p5.Vector.sub(this.core.pos, membrane.pos)
            .add(dir)
            .normalize()
            .mult(0.2);
          cytoplasm.applyForce(force);
          cytoplasm.update();
        }
      }
    }
  }

  calculateSpringForce(other) {
    let spacing = 10;
    const k = 0.4; // Spring constant
    let direction = p5.Vector.sub(other.pos, this.pos);
    let distance = direction.mag();
    let stretch = distance - spacing; // How much the spring is stretched or compressed
    direction.normalize();
    let forceMag = k * stretch;
    direction.mult(forceMag);
    return direction;
  }
  sticks() {
    // sticks membrane cell with each other
    for (let i = 0; i < this.plasmicMembrane.length - 1; i++) {
      let A = this.plasmicMembrane[i];
      let B = this.plasmicMembrane[i + 1];
      let spring = A.calculateSpringForce(B);
      A.applyForce(spring.mult(1));
      B.applyForce(spring.mult(-1));
      A.update();
      B.update();
    }
    let Y = this.plasmicMembrane[0];
    let Z = this.plasmicMembrane[44];
    let spring = Y.calculateSpringForce(Z);
    Y.applyForce(spring.mult(1));
    Z.applyForce(spring.mult(-1));
    Y.update();
    Z.update();
  }

  clicked(x, y) {
    let d = dist(x, y, this.pos.x, this.pos.y);
    if (d < this.space.cellSize) {
      console.log("Clicked");
      return true;
    }
  }

  grab(x, y) {
    let mouse = createVector(x, y);
    for (let i = 0; i < this.plasmicMembrane.length; i++) {
      let membrane = this.plasmicMembrane[i];
      let d = mouse.dist(membrane.pos);
      console.log(d);
      if (d < 100) {
        membrane.pos = mouse;
      }
    }
  }

  avoid(cells) {
    for (let i = 0; i < this.plasmicMembrane.length; i++) {
      let thisOne = this.plasmicMembrane[i];
      for (let j = 0; j < cells.length; j++) {
        for (let k = 0; k < this.plasmicMembrane.length; k++) {
          let other = cells[j].plasmicMembrane[k];
          if (this !== cells[j]) {
            let d = thisOne.pos.dist(other.pos);
            if (d < this.space.cellSize) {
              let force = p5.Vector.sub(other.pos, thisOne.pos);
              force.normalize();
              let mag = map(d, 0, 20, 200, 20);
              force.mult(-mag);
              thisOne.applyForce(force);
              // thisOne.update();
              force.mult(-mag);
              other.applyForce(force);
              // other.update();
            }
          }
        }
      }
    }
  }
  attach() {
    for (let i = 0; i < this.plasmicMembrane.length; i++) {
      let v = p5.Vector.sub(this.core.pos, this.plasmicMembrane[i].pos);
      v.normalize();
      let d = this.core.pos.dist(this.plasmicMembrane[i].pos);
      if (d < 50) {
        let mag = map(d, 0, 50, 2, 0);
        v.setMag(-mag);
        this.plasmicMembrane[i].applyForce(v);
        v.mult(-0.1);
        this.core.applyForce(v);
      }
    }
  }
  display3() {
    noStroke();
    // PLASMIC MEMBRANE
    // for (let pM of this.plasmicMembrane) {
    //   fill(0, 250, 0, 255);
    //   circle(pM.pos.x, pM.pos.y, 10);
    // }
    fill(255, 214, 25);
    beginShape();
    for (let i = 0; i < this.plasmicMembrane.length; i++) {
      let cell = this.plasmicMembrane[i];
      text(i, cell.pos.x, cell.pos.y);
      vertex(cell.pos.x, cell.pos.y, 10);
    }
    endShape();
    // CYTOPLASME
    stroke(255);
    fill(255, 255, 0, 127);
    strokeWeight(2);
    beginShape();
    for (let c of this.cytoplasm) {
      vertex(c.pos.x, c.pos.y);
      // circle(c.pos.x, c.pos.y, 10);
    }
    endShape();
    // CORE
    fill(48, 54, 186);
    circle(this.core.pos.x, this.core.pos.y, 20);
    circle(this.core.pos.x, this.core.pos.y, 10);
    circle(this.core.pos.x, this.core.pos.y, 50);
  }
  display2() {
    noStroke();
    // PLASMIC MEMBRANE
    // for (let pM of this.plasmicMembrane) {
    //   fill(0, 250, 0, 255);
    //   circle(pM.pos.x, pM.pos.y, 10);
    // }

    for (let i = 0; i < this.plasmicMembrane.length; i++) {
      let cell = this.plasmicMembrane[i];
      text(i, cell.pos.x, cell.pos.y);
      circle(cell.pos.x, cell.pos.y, 10);
    }
    // CYTOPLASME
    for (let c of this.cytoplasm) {
      fill(255, 255, 0, 255);
      circle(c.pos.x, c.pos.y, 10);
    }
    // CORE
    fill(0);
    circle(this.core.pos.x, this.core.pos.y, 20);
  }
  display(color1, color2, color3) {
    let size = this.space.cellSize;
    if (color1 && color2 && color3 !== undefined) {
      color1.noStroke();
      color2.noStroke();
      color2.noStroke();
      // PLASMIC MEMBRANE
      for (let pM of this.plasmicMembrane) {
        let inSpace = this.space.getInSpace(pM.pos.x, pM.pos.y, 1);
        color1.fill(255);
        color1.rect(inSpace.x, inSpace.y, size * this.mass);
      }
      // CYTOPLASME
      for (let c of this.cytoplasm) {
        let inSpace = this.space.getInSpace(c.pos.x, c.pos.y, 1);
        color2.fill(127);
        color2.rect(inSpace.x, inSpace.y, size * this.mass);
      }
      // CORE
      let pos = this.space.getInSpace(this.core.pos.x, this.core.pos.y, 1);
      color3.fill(255);
      color2.fill(255);
      color1.fill(255);
      color3.rect(pos.x, pos.y, size * this.core.mass);
      color2.rect(pos.x, pos.y, size * this.core.mass);
      color1.rect(pos.x, pos.y, 20);
    } else {
      noStroke();
      // PLASMIC MEMBRANE
      for (let pM of this.plasmicMembrane) {
        let inSpace = this.space.getInSpace(pM.pos.x, pM.pos.y, 1);
        fill(0, 250, 0, 255);
        rect(inSpace.x, inSpace.y, 10);
      }
      // CYTOPLASME
      for (let c of this.cytoplasm) {
        let inSpace = this.space.getInSpace(c.pos.x, c.pos.y, 1);
        fill(255, 255, 0, 255);
        rect(inSpace.x, inSpace.y, 10);
      }
      // CORE
      let pos = this.space.getInSpace(this.core.pos.x, this.core.pos.y, 1);
      fill(0);
      rect(pos.x, pos.y, 20);
    }
  }
  applyForce(force) {
    let f = force.div(this.mass);
    this.acc.add(f);
    // this.update();
  }
  update() {
    this.vel.add(this.acc);
    this.vel.mult(this.damping);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  look4(object) {
    let record = Infinity;
    let indexSeeked;
    for (let i = 0; i < object.length; i++) {
      let d = this.core.pos.dist(object[i]);
      if (d < record) {
        record = d;
        indexSeeked = i;
      }
    }
    return indexSeeked;
  }
  eat(food) {
    if (food.length !== 0) {
      let force = p5.Vector.sub(food[this.look4(food)], this.core.pos);
      force.setMag(this.maxSpeed);
      this.core.applyForce(force);
      this.core.update();
      let d = this.core.pos.dist(food[this.look4(food)]);
      if (d < 10) {
        food.splice(this.look4(food), 1);
      }
    }
  }
}

class Bacteria {
  constructor(space, pos) {
    this.space = space;
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.max_speed = 0.8;
    this.size = 1;
  }

  avoid(cells) {
    for (let i = 0; i < cells.length; i++) {
      let d = cells[i].pos.dist(this.pos);
      if (d < 100) {
        let f = p5.Vector.sub(cells[i].core.pos, this.pos);
        f.normalize().mult(-200);
        this.applyForce(f);
        this.update();
      }
    }
  }
  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.max_speed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  look4(object) {
    let record = Infinity;
    let indexSeeked;
    for (let i = 0; i < object.length; i++) {
      let d = this.pos.dist(object[i]);
      if (d < record) {
        record = d;
        indexSeeked = i;
      }
    }
    return indexSeeked;
  }
  eat(food) {
    let force = p5.Vector.sub(food[this.look4(food)], this.pos);
    force.setMag(0.01);
    this.applyForce(force);
    this.update();
    let d = this.pos.dist(food[this.look4(food)]);
    if (d < 10) {
      food.splice(this.look4(food), 1);
    }
  }

  grow(food) {
    let scl = 1 / 4;
    let d = this.pos.dist(food[this.look4(food)]);
    if (d < 10) {
      this.size += scl;
      food.splice(this.look4(food), 1);
    }
  }

  show(risoLayer) {
    risoLayer.noStroke();
    let spacePos = this.space.getInSpace(this.pos.x, this.pos.y, this.size);
    risoLayer.fill(127);
    risoLayer.rect(spacePos.x, spacePos.y, this.space.cellSize * this.size);
  }
}

class SPACE {
  constructor(ctx, lpi) {
    this.checkerBoard = [];
    this.ctx = ctx;
    this.numberOfCells = { x: lpi, y: lpi };
    this.cellSize = this.ctx.width / lpi;
    this.xoff = 1;
    this.yoff = 1000;
    this.zoff = 1000000;
  }

  build() {
    // build the checkerBoard =[]
    for (let i = 0; i < this.numberOfCells.x; i++) {
      this.xoff = 1;
      let line = [];
      for (let j = 0; j < this.numberOfCells.y; j++) {
        let n = noise(this.xoff, this.yoff, this.zoff);
        let height = n * 255;
        let force = createVector(1.1);
        let rad = n * 2 * PI;
        force.normalize().mult(0.1);
        force.setHeading(rad);
        line.push({ relief: height, force: force });
        this.xoff += 0.1;
      }
      this.yoff += 0.1;
      this.checkerBoard.push(line);
    }
    this.zoff += 0.1;
  }
  reBuild() {
    this.yoff = 1000;
    for (let i = 0; i < this.checkerBoard.length; i++) {
      this.xoff = 1;
      for (let j = 0; j < this.checkerBoard[i].length; j++) {
        let n = noise(this.xoff, this.yoff, this.zoff);
        let height = n * 255;
        let force = createVector(1.1);
        let rad = n * 2 * PI;
        force.normalize().mult(0.1);
        force.setHeading(rad);
        this.checkerBoard[i][j] = { relief: height, force: force };
        this.xoff += 0.1;
      }
      this.yoff += 0.1;
      // this.checkerBoard.push(line);
    }
    this.zoff += 0.01;
  }
  display(risoLayer) {
    risoLayer.noStroke();
    for (let i = 0; i < this.checkerBoard.length; i++) {
      for (let j = 0; j < this.checkerBoard[i].length; j++) {
        let relief = this.checkerBoard[i][j].relief;
        // risoLayer.fill(relief, 127);
        // risoLayer.rect(i * this.cellSize, j * this.cellSize, this.cellSize);
        if (relief < 127) {
          risoLayer.fill(relief, 255);
        } else {
          risoLayer.fill(relief, 255);
        }
        risoLayer.rect(i * this.cellSize, j * this.cellSize, this.cellSize);
      }
    }
  }
  getInSpace(x, y, size) {
    const i =
      Math.floor((x / this.ctx.width) * (this.checkerBoard.length / size)) *
      this.cellSize *
      size;
    const j =
      Math.floor((y / this.ctx.height) * (this.checkerBoard.length / size)) *
      this.cellSize *
      size;

    return createVector(i, j);
  }
  getCheckerboardPosition(x, y) {
    let i = Math.floor((x / this.space.ctx.width) * this.checkerBoard.length);
    let j = Math.floor((y / this.space.ctx.height) * this.checkerBoard.length);
    if (i > this.checkerBoard.length - 1) {
      i = this.checkerBoard.length - 1;
    } else if (i < 0) {
      i = 0;
    }
    if (j > this.checkerBoard.length - 1) {
      j = this.checkerBoard.length - 1;
    } else if (j < 0) {
      j = 0;
    }
    return { i, j };
  }
}
function check4grab(x, y) {
  for (let c of cells) {
    c.grab(x, y);
  }
}
function mouseDragged() {
  let x = mouseX;
  let y = mouseY;
  // check4grab();
  let f = space.getInSpace(x, y, 1);
  food.push(f);
}
