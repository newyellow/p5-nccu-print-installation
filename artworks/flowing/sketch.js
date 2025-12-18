let targetCanvasWidth = 1240;
let targetCanvasHeight = 1748;
let deviceRatio = 1;

function editRandom(from = 0, to = 1) {
    let diff = to - from;
    return from + randomFull() * diff;
}

function SetupCanvasScale() {
    let originalDensity = pixelDensity();

    if (windowWidth > targetCanvasWidth) {
        deviceRatio = (windowWidth / targetCanvasWidth);
    } else {
        deviceRatio = originalDensity;
    }

    deviceRatio = max(deviceRatio, 1);
    pixelDensity(deviceRatio);
}

function windowResizedUser() {
    // do nothing, because p5.flex handles the resizing
}


let mainHue;
let countX = [80, 30];
let countY = [100, 30];
let mystyle;

async function setup() {
    createCanvas(targetCanvasWidth, targetCanvasHeight);
    SetupCanvasScale();
    flex();
    noLoop();
}

async function draw() {
    // 如果有用到 noise 要記得固定 noise 的隨機種子
    randomSeed(editRandom(0, 1000000));
    noiseSeed(editRandom(0, 1000000));

    blendMode(BLEND);
    colorMode(HSB, 360, 100, 100, 100);
    mainHue = lerp(0, 360, m1);
    // mainHue = random(360);
    
    background((mainHue + 180) % 360, 60, 80);    

    let posX, posY;
    let mycase = floor(random(2));
    mystyle = floor(lerp(1, 4, m2));
    // mystyle = floor(random(1, 4));

    cx = countX[mycase];
    cy = countY[mycase];

    let moveX = width / cx;
    let moveY = height / cy;


    for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
            posX = moveX * x;
            posY = moveY * y;

            let noiseAngle = noise(posX * 0.01, posY * 0.01);
            push()
            translate(posX, posY);
            let rr = lerp(-noiseAngle, noiseAngle, m3);
            rotate(rr);
            // rotate(noiseAngle);

            let s = lerp(1.6, 4, m4);
            scale(s);
            // scale(1.6);

            switch (mystyle) {
                case 1:
                    noStroke();
                    fill(myColor(100));
                    translate(0, 0);
                    rect(0, 0, 4, 30);
                    break;
                case 2:
                    push()
                    translate(5, 15);
                    stroke(myColor(50));
                    // lineRect(0, 0, 7.5, 100);
                    lineRect(0, 0, random(5, 10), 100);
                    pop()
                    break;
                case 3:
                    stroke(myColor(50));
                    MoMoRect(0, 0, 2, 50)
                    break;
            }
            pop()
        }
        await sleep(1);
    }

    noFill();

    stroke(255);
    let padding = lerp(80, 240, m0);
    strokeWeight(padding);
    rect(0, 0, width, height);
    
    stroke(15);
    if(padding < 160){
        strokeWeight(0);
    }
    else{
        strokeWeight(padding/2);
    }
    rect(0, 0, width, height);

    triggerPreview();
}



function myColor(alpha) {
    let colorHue = mainHue % 360;
    // let colorHue = (mainHue + random(-30, 30)) % 360;
    let colorSat = random(20, 50);
    let colorBri = random(80, 100);

    if (random() < 0.15) {
        colorSat = 0;
        colorBri = 100;
    }

    if (random() < 0.05) {
        colorHue = (colorHue + 180) % 360;
    }

    return color(colorHue, colorSat, colorBri, alpha);
}

// -----------------------------------------------

function lineRect(startX, startY, rectWidth, rectHeight) {
    let lineCount = floor(random(10, 50));
    // let lineCount = floor(lerp(10, 80, m3));

    for (let i = 0; i < lineCount; i++) {
        let t = (i + 1) / lineCount;

        // if (i%12<5) {
            let endX = startX + rectWidth;
            let x = lerp(startX, endX, t);
            let y1 = startY;
            let y2 = startY + rectHeight;
            line(x, y1, x, y2);
        // }
        //  else {
        //     let endY = startY + rectHeight;
        //     let y = lerp(startY, endY, t);
        //     let x1 = startX;
        //     let x2 = startX + rectWidth;
        //     line(x1, y, x2, y);
        // }
    }
}

function MoMoRect(x, y, rectWidth, rectHeight) {
    let density = random(0.4, 0.7);
    // let density = lerp(0.4, 0.9, m3);

    let xcount = rectWidth * density;
    let ycount = rectHeight * density;

    let xDist = rectWidth / xcount;
    let yDist = rectHeight / ycount;

    for (let j = 0; j < ycount; j++) {
        for (let i = 0; i < xcount; i++) {
            let posX = x + xDist * i;
            let posY = y + yDist * j;

            let noiseSize = noise(posX * 0.06, posY * 0.1);
            let arcSize = lerp(5, 90, noiseSize);
            strokeWeight(arcSize / 6);
            noFill();
            arc(posX, posY, arcSize, arcSize, -PI / 6, PI / 6);
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function keyPressed() {
    if (key == " ")
        saveCanvas("flowing", "png");
}