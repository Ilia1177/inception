let palette = [];
let lpi = 90;
let xOff = 0;
let yOff = 9999;
let zOff = 0;
let button1;
let button2;
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
function setup() {
  noiseDetail(1);

  cnv = createCanvas(400, 400).parent("CNV2");
  input = createInput().parent("input");
  button1 = createButton("apply text").parent("input");
  p1 = createP(``).parent("input");
  slider1 = createSlider(0, 360, 0, 1).parent("input");
  p2 = createP(``).parent("input");
  slider2 = createSlider(0, 100, 0, 1).parent("input");
  p3 = createP(``).parent("input");
  slider3 = createSlider(0, 255, 42, 1).parent("input");
  //   p4 = createP(``).parent("input");
  //   slider4 = createSlider(1, 5, 1, 1).parent("input");
  //   p5 = createP(``).parent("input");
  //   slider5 = createSlider(0, 10, 1, 1).parent("input");
  //   p6 = createP(``).parent("input");
  //   slider6 = createSlider(-2, 2, -2, 0.1).parent("input");
  //   p7 = createP(``).parent("input");
  //   slider7 = createSlider(0, 1, 0, 0.01).parent("input");
  console.log();
}

function draw() {
  p1.html(`hue:${slider1.value()}`);
  p2.html(`saturation:${slider2.value()}`);
  p3.html(`light:${slider3.value()}`);
  //   p4.html(`iteration:${slider4.value()}`);
  //   p5.html(`fontSize dif:${slider5.value()}`);
  //   p6.html(`X space:${slider6.value()}`);
  //   p7.html(`background:${slider7.value()}`);

  background(255);

  yOff = 0;
  for (let i = 0; i < lpi; i++) {
    xOff = 0;
    for (let j = 0; j < lpi; j++) {
      let space = width / lpi;
      noStroke();
      let n = noise(xOff, yOff, zOff);
      let n2 = noise(xOff + 500, yOff + 90, zOff + 6);
      triadicPalette(floor(n2 * 255), slider2.value(), slider3.value());
      if (n < 0.3) {
        fill(palette[0]);
      } else if (n < 0.6) {
        fill(palette[1]);
      } else if (n < 1) {
        fill(palette[2]);
      }
      line(i + space / 2, j);
      rect(i * space, j * space, space);
      xOff += 0.1;
    }
    yOff += 0.1;
  }
  zOff += 0.1;
}

function triadicPalette(hue, saturation, lightness) {
  palette = [];
  let baseHue = hue; // Randomly select a base hue
  let sat = saturation; // Randomly select a base hue
  let light = lightness; // Randomly select a base hue
  let hue1 = floor((baseHue + 120) % 360); // Calculate two additional hues spaced 120 degrees apart
  let hue2 = floor((baseHue + 240) % 360);
  // Convert HSL values to RGB using p5.js' color function
  palette = [
    color(`hsl(${baseHue}, ${sat}%, ${light}%)`),
    color(`hsl(${hue1}, ${sat}%, ${light}%)`),
    color(`hsl(${hue2}, ${sat}%, ${light}%)`),
  ];
}
