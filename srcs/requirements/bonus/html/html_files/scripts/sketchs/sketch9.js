// typo poesie

document.addEventListener('DOMContentLoaded',function (){

    let sketch9 = function (p) {
      let backGround = false
      let changeSize = false
      let stableCase = false;
      let charRotation = true
      let inLoop = true;

        let textString =
      "In our brain, stand the faculty of imagination. Everythings can exist as idea, and ideas, can be expressed in this world. Everythings is fluid. Everything might not be what we think it is. ";
        let fontSize = 20;
        let font;
        // input
        let inputText;
        let input;
        let button1 = document.getElementById("button9");
        let button2 = document.getElementById("button10");
        let button3 = document.getElementById("button11");
        let button4 = document.getElementById("button12");
        let slider1 = document.getElementById("slider7")
        let slider2 = document.getElementById("slider8")
        let slider3 = document.getElementById("slider9")

        p.preload = function() {
          font = p.loadFont("verdana.ttf");
        }
    
        p.setup = function() {
            cnv = p.createCanvas(400, 400).parent("CNV3");
            cnv.background(255);

            p.textFont(font);
            p.textSize(fontSize);
            p.textAlign(p.LEFT, p.TOP); // Align text to the top left corner
            // textWrap(WORD); // Enable word wrapping
        }
    
        p.draw = function() {
            cnv.background(255, 127);
            let pSize = slider1.value*4;
            p.stroke(255, 128, 0);
            p.line(pSize, 0, pSize, 400);
            writeP(
                textString,
                pSize,
                slider2.value,
                slider3.value,
                0
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
        // function stableSpace() {
        //     stableCase = !stableCase;
        //     if (stableCase) {
        //         button1.p.style("background-color", "#EEEEEE");
        //     } else {
        //         button1.p.style("background-color", "black");
        //     }
        // }
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
        function textRotation() {
            charRotation = !charRotation

            if (charRotation) {
                button1.style.backgroundColor = "grey"
            } else {
                button1.style.backgroundColor = "rgba(255 255 255 0.5)"
            }
        }

        function writeP(textString, pWidth, rotation, size, bG) {
            let words = textString.split(" ");
            let lineToPrint = "";
            let x = 10;
            let y = 10;
            let lineHeight = fontSize + 5;
            p.noStroke();
            p.textSize(fontSize);
            for (let i = 0; i < words.length; i++) {
              let testLine = lineToPrint + words[i] + " ";
              let testWidth = p.textWidth(testLine);
              if (testWidth > pWidth && i > 0) {
                // fill(0, 255, 0);
                // text(lineToPrint, x, y);
                p.fill(0);
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
        backgroundPercent=0
        ) {
          let space = 0;
          let posX = x;
          let posY = y;
          let r0 = p.map(rotation,0,255,0,2*p.PI)
          let t0 = p.map(charSize,0,100,0,50)
          for (let j = 0; j < line.length; j++) {
            let char = line.charAt(j);
            space = p.textWidth(char);
            // let angle = p.map(rotation,0,100,0,2*p.PI)
            let angle = p.random(-r0, r0);
            p.textSize(p.random(fontSize - t0, fontSize + t0));
            p.noStroke();
            p.push();
            p.translate(posX, posY);
            if(charRotation) {
                p.rotate(angle)
            } else {
                
            }
            // p.textSize(fontSize);
            let r = p.random(100);
            if (r < backgroundPercent) {
              backGround = true;
            }
            if (backGround) {
                p.fill(0); // Background color
                let backgroundPadding = floor(random(2, 5));
                p.rect(
                  0 - backgroundPadding / 2,
                  0 - backgroundPadding / 2,
                  p.textWidth(char) + backgroundPadding,
                  fontSize + backgroundPadding
                );
                p.fill(0);
                p.text(char, 0, 0);
            } else {
                p.text(char, 0, 0);
            }
    
            if (stableCase) {
                posX += fontSize;
            } else {
                posX += space;
            }
            p.pop();
        }
        }

        
        if (button1) {
          button1.addEventListener("click", function() {
            textRotation();
            myP59.redraw(); // Redraw the canvas to reflect the changes
          });
        }
        if (button2) {
          button2.addEventListener("click", function() {
            savePNG();
            myP59.redraw(); // Redraw the canvas to reflect the changes
          });
        }

    }
    // stableSpace = function () {
    //     stableCase = !stableCase;
    //     if (stableCase) {
    //         button2.style("background-color", "#EEEEEE");
    //     } else {
    //         button2.style("background-color", "black");
    //     }
    // }

let myP59 = new p5(sketch9)

})
