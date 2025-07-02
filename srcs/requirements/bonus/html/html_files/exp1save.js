let textString =
  "In our brain, stand the faculty of imagination. Everythings can exist as idea, and ideas, can be expressed in this world. Everythings is fluid. Everythings is not. ";

let font;
let fontSize = 10;
let button1;
let button3;
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
function preload() {
  font = loadFont("dogicapixel.ttf");
}

function setup() {
  cnv = createCanvas(400, 400).parent("CNV2");
  input = createInput().parent("input");
  button1 = createButton("apply text").parent("input");
  button1.mousePressed(changeString);
  p1 = createP(``).parent("input");
  slider1 = createSlider(0, 2, 0, 0.1).parent("input");
  p2 = createP(``).parent("input");
  slider2 = createSlider(0, 1, 0, 0.01).parent("input");
  p3 = createP(``).parent("input");
  slider3 = createSlider(0, 255, 42, 1).parent("input");
  p4 = createP(``).parent("input");
  slider4 = createSlider(1, 5, 1, 1).parent("input");
  p5 = createP(``).parent("input");
  slider5 = createSlider(0, 10, 1, 1).parent("input");
  p6 = createP(``).parent("input");
  slider6 = createSlider(-2, 2, -2, 0.1).parent("input");
  p7 = createP(``).parent("input");
  slider7 = createSlider(0, 1, 0, 0.01).parent("input");

  textFont(font);
  textSize(fontSize);
  textAlign(LEFT, TOP); // Align text to the top left corner
  textWrap(WORD); // Enable word wrapping
}

function draw() {
  p1.html(`shake:${slider1.value()}`);
  p2.html(`amp:${slider2.value()}`);
  p3.html(`print:${slider3.value()}`);
  p4.html(`iteration:${slider4.value()}`);
  p5.html(`fontSize dif:${slider5.value()}`);
  p6.html(`X space:${slider6.value()}`);
  p7.html(`background:${slider7.value()}`);

  cnv.background(255, slider3.value());
  stroke(0);
  noStroke();

  for (let i = 0; i < slider4.value(); i++) {
    let offset = random(-slider1.value(), slider1.value()); // Random horizontal offset
    let amp = 0;
    let wave = sin(frameCount * 0.001 + i * 10) * amp; // Sinusoidal distortion

    let words = textString.split(" ");
    let line = "";
    let x = 0;
    let y = 0;
    let spacingX = slider6.value();
    let spacingY = 0;
    let backgroundPadding = 2;

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      let testWidth = textWidth(testLine);

      if (testWidth > 395 && i > 0) {
        writeLine(
          line,
          x,
          y,
          slider1,
          slider2,
          slider3,
          slider4,
          slider5,
          slider6,
          slider7
        );
        // text(line, x+offset, y+wave);
        line = words[i] + " ";
        y += fontSize + spacingY;
      } else {
        line = testLine;
      }
    }

    writeLine(
      line,
      x,
      y,
      slider1,
      slider2,
      slider3,
      slider4,
      slider5,
      slider6,
      slider7
    );
  }
  //   noLoop();
}

function changeString() {
  inputText = input.value();
  textString = inputText;
}

function savePNG() {
  saveCanvas("myCanvas", "png"); // Save the canvas as a PNG file with the name 'myCanvas'
}

function writeLine(
  line,
  x,
  y,
  slider1,
  slider2,
  slider3,
  slider4,
  slider5,
  slider6,
  slider7
) {
  let backG = false;

  for (let j = 0; j < line.length; j++) {
    let r = random(1);
    if (r < slider7.value()) {
      backG = true;
    }

    let char = line.charAt(j);
    let x1 = x + j * fontSize; // Adjust the starting x position of each character
    let y1 = y;
    let rotation = random(-slider2.value(), slider2.value()); // Example rotation
    push();
    translate(x1 + textWidth(char) / 2, y1 + textWidth(char) / 2);
    rotate(rotation);
    textSize(random(fontSize - slider5.value(), fontSize + slider5.value()));
    if (backG) {
      fill(0); // Background color
      // BackgroundPadding = floor(random(5,25))
      rect(
        0 - backgroundPadding / 2,
        0 - backgroundPadding / 2,
        textWidth(char) + backgroundPadding,
        fontSize + backgroundPadding
      );
      fill(255);
      text(char, 0, 0);
    } else {
      fill(0);
      text(char, 0, 0);
    }
    pop();
  }
}
