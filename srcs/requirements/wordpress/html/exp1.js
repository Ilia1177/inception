let textString =
  "In our brain, stand the faculty of imagination. Everythings can exist as idea, and ideas, can be expressed in this world. Everythings is fluid. Everything might not be what we think it is. ";
let fontSize = 20;
let stableCase = false;
let font;
let button1;
let button2;
let button3;
let button4;
let inputText;
let p1;
let slider1;
let p2;
let slider2;
let p3;
let slider3;
let p4;
let slider4;
let p5;
let slider5;
let p6;
let slider6;
let p7;
let slider7;
let input;
let inLoop = true;
function preload() {
  font = loadFont("dogicapixel.ttf");
  font = loadFont("verdana.ttf");
}

function setup() {
  cnv = createCanvas(400, 400).parent("CNV2");
  cnv.background(255);

  input = createInput().parent("input");
  button1 = createButton("apply text").parent("input");
  button1.mousePressed(changeString);
  button2 = createButton("stable case").parent("input");
  button2.mousePressed(stableSpace);
  button3 = createButton("write again").parent("input");
  button3.mousePressed(draw);
  button4 = createButton("loop").parent("input");
  button4.mousePressed(looper);
  p1 = createP(``).parent("input");
  slider1 = createSlider(0, 400, 350, 1).parent("input");
  p2 = createP(``).parent("input");
  slider2 = createSlider(0, PI / 4, 0, 0.01).parent("input");
  p3 = createP(``).parent("input");
  slider3 = createSlider(0, 255, 42, 1).parent("input");
  p4 = createP(``).parent("input");
  slider4 = createSlider(0, 4, 0, 0.1).parent("input");
  p5 = createP(``).parent("input");
  slider5 = createSlider(0, 100, 0, 1).parent("input");
  p6 = createP(``).parent("input");
  slider6 = createSlider(-2, 2, -2, 0.1).parent("input");
  p7 = createP(``).parent("input");
  slider7 = createSlider(0, 1, 0, 0.01).parent("input");
  textFont(font);
  textSize(fontSize);
  textAlign(LEFT, TOP); // Align text to the top left corner
  // textWrap(WORD); // Enable word wrapping
}

function draw() {
  p1.html(`p.width:${slider1.value()}`);
  p2.html(`rotation:${slider2.value()}`);
  p3.html(`print:${slider3.value()}`);
  p4.html(`fontSize:${slider4.value()}`);
  p5.html(`background:${slider5.value()}`);
  p6.html(`0:${slider6.value()}`);
  p7.html(`0:${slider7.value()}`);
  cnv.background(255, slider3.value());
  let pSize = slider1.value();
  stroke(0);

  // for (let i = 0; i < 400; i++) {
  //   for (let j = 0; j < 400; j++) {
  //     stroke(0, 127, 255);
  //     line(i * 10, 0, i * 10, 400);
  //     line(0, j * 10, 400, j * 10);
  //   }
  // }

  stroke(255, 128, 0);
  line(pSize, 0, pSize, 400);
  writeP(
    textString,
    slider1.value(),
    slider2.value(),
    slider4.value(),
    slider5.value()
  );

  if (!inLoop) {
    noLoop();
  } else {
  }
}

function changeString() {
  inputText = input.value();
  textString = inputText;
}
function stableSpace() {
  stableCase = !stableCase;
  if (stableCase) {
    button2.style("background-color", "#EEEEEE");
  } else {
    button2.style("background-color", "black");
  }
}
function savePNG() {
  saveCanvas("myCanvas", "png"); // Save the canvas as a PNG file with the name 'myCanvas'
}
function looper() {
  inLoop = !inLoop;
  if (inLoop) {
    button4.style("background-color", "black");
    draw();
  } else {
    button4.style("background-color", "#EEEEEE");
    // noLoop();
  }
}
function writeP(textString, pWidth, rotation, size, bG) {
  let words = textString.split(" ");
  let lineToPrint = "";
  let x = 10;
  let y = 10;
  let lineHeight = fontSize + 5;
  noStroke();
  textSize(fontSize);
  for (let i = 0; i < words.length; i++) {
    let testLine = lineToPrint + words[i] + " ";
    let testWidth = textWidth(testLine);
    if (testWidth > pWidth && i > 0) {
      // fill(0, 255, 0);
      // text(lineToPrint, x, y);
      fill(0);
      writeLine(lineToPrint, x, y, rotation, size, bG);
      lineToPrint = words[i] + " ";
      y += lineHeight;
    } else {
      lineToPrint = testLine;
    }
  }
  writeLine(lineToPrint, x, y, rotation, size, bG);
}

function writeLine(
  line,
  x,
  y,
  rotation,
  charSize,
  backgroundPercent,
  slider5,
  slider6,
  slider7
) {
  let backG = false;
  let space = 0;
  let posX = x;
  let posY = y;
  for (let j = 0; j < line.length; j++) {
    let char = line.charAt(j);
    space = textWidth(char);
    let angle = random(-rotation, rotation);
    textSize(random(fontSize - charSize, fontSize + charSize));
    noStroke();
    push();
    translate(posX, posY);
    rotate(angle);
    // textSize(fontSize);

    let r = random(100);
    if (r < backgroundPercent) {
      backG = true;
    }

    if (backG) {
      fill(0); // Background color
      let backgroundPadding = floor(random(2, 5));
      rect(
        0 - backgroundPadding / 2,
        0 - backgroundPadding / 2,
        textWidth(char) + backgroundPadding,
        fontSize + backgroundPadding
      );
      fill(255);
      text(char, 0, 0);
    } else {
      text(char, 0, 0);
    }

    if (stableCase) {
      posX += fontSize;
    } else {
      posX += space;
    }
    pop();
  }
}
