let slider1;
let slider2;
let slider3;

let palette = [];
let lpi = 60;
let xOff = 0;
let yOff = 9999;
let zOff = 0;
function preload() {}
function setup() {
  noiseDetail(5);

  cnv = createCanvas(400, 400).parent("CNV2");
  //   generateTriadicPalette();
  let slider4 = createSlider(0, 100, 50, 1).parent("input");
  let slider5 = createSlider("B").parent("input");
  let slider6 = createSlider("C").parent("input");
  console.log(slider4.value());
}

function draw() {
  slider1 = document.getElementById("slider1"); // Get the slider value
  slider2 = document.getElementById("slider2"); // Get the slider value
  slider3 = document.getElementById("slider3"); // Get the slider value
  const label1 = document.querySelector('label[for="slider1"]');
  const label2 = document.querySelector('label[for="slider2"]');
  const label3 = document.querySelector('label[for="slider3"]');
  let sliderValue1 = floor(map(slider1.value, 0, 100, 0, 100));
  let sliderValue2 = floor(map(slider2.value, 0, 100, 0, 360));
  let sliderValue3 = floor(map(slider3.value, 0, 100, 0, 100));
  label1.textContent = `saturation: ${sliderValue1}`;
  label2.textContent = `baseHue: ${sliderValue2}`;
  label3.textContent = `brightness: ${sliderValue3}`;

  background(255);

  yOff = 0;
  for (let i = 0; i < lpi; i++) {
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

    xOff = 0;
    for (let j = 0; j < lpi; j++) {
      let space = width / lpi;
      noStroke();
      let n = noise(xOff, yOff, zOff);
      let n2 = noise(xOff + 500, yOff + 90, zOff + 6);
      alpha = map(n, 0, 1, 0, 2 * PI);
      triadicPalette(sliderValue1, sliderValue2, sliderValue3);
      //   if (n < 0.3) {
      //     stroke(palette[0]);
      //   } else if (n < 0.6) {
      //     stroke(palette[1]);
      //   } else if (n < 1) {
      //     stroke(palette[2]);
      //   }
      stroke(palette[1]);
      strokeWeight(2);
      line(
        i * space + space / 2 - cos(alpha),
        j * space + space / 2 - sin(alpha),
        i * space - space / 2 + cos(alpha),
        j * space - space / 2 + sin(alpha)
      );
      console.log(j, space / 2, sin(alpha), space);
      //   rect(i * space, j * space, space);
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
