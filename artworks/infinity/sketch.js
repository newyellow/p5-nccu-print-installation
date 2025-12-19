
let targetCanvasWidth = 1240;
let targetCanvasHeight = 1748;
let deviceRatio = 2;

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

async function setup() {
    createCanvas(1240, 1748);
    // SetupCanvasScale();
    pixelDensity(2);
    flex();
    noLoop();
}

async function draw() {
    clear();
    background(255);
    blendMode(MULTIPLY);
    colorMode(HSB);

    // 如果有用到 noise 要記得固定 noise 的隨機種子
    randomSeed(editRandom(0, 1000000));
    noiseSeed(editRandom(0, 1000000));

    mainHue = random(200, 240);

    // let padding = 80;
    let padding =  lerp(0, 160, m0)

    await myDivide(padding, padding, width - padding, padding,
        width - padding, height - padding, padding, height - padding);

    stroke(15);
    if(padding < 80){
        strokeWeight(0);
    }
    else{
        strokeWeight(padding);
    }
    rect(0, 0, width, height);

    triggerPreview();
}

function myColor_fill() {
    let colorHue = (mainHue + random(-30, 30)) % 360;
    let colorSat = random(70, 90);
    let colorBri = random(80, 90);

    if (random() < 0.05) {
        colorHue = (colorHue + 180) % 360;
    }
    fill(colorHue, colorSat, colorBri);
    noStroke();
}

function myColor_stroke() {
    let colorHue = (mainHue + random(-30, 30)) % 360;

    // let colorSat = lerp(40, 60, m2);
    let colorSat = random(40, 60);

    // let colorBri = lerp(80, 100, m3);
    let colorBri = random(80, 100);

    let r = lerp(0, 1, m1);
    if (random() < r) {
    // if (random() < 0.25) {
        colorHue = (colorHue + 180) % 360;
    }
    stroke(colorHue, colorSat, colorBri);
    noFill();
}

async function myDivide(x1, y1, x2, y2, x3, y3, x4, y4) {
    let doDivide = true;

    let distWidth = dist(x1, y1, x2, y2);
    let distHeight = dist(x1, y1, x4, y4);

    let minSize = lerp(20, 160, m2);
    // if (distWidth < 80 || distHeight < 80) {
    if (distWidth < minSize || distHeight < minSize) {
        doDivide = false;
    }

    // ----------------------
    if (doDivide == false) {
        myColor_stroke();
        await lineRect(x1, y1, x2, y2, x3, y3, x4, y4);
    } else {
        let divideRatio = lerp(0.3, 0.7, m3);
        // let divideRatio = random(0.4, 0.6);

        if (random() < 0.8) {
            let triangle1_ax = x1;
            let triangle1_ay = y1;
            let triangle1_bx = x2;
            let triangle1_by = y2;
            let triangle1_cx = lerp(x2, x3, divideRatio);
            let triangle1_cy = lerp(y2, y3, divideRatio);

            let triangle2_ax = x4;
            let triangle2_ay = y4;
            let triangle2_bx = x3;
            let triangle2_by = y3;
            let triangle2_cx = lerp(x4, x1, divideRatio);
            let triangle2_cy = lerp(y4, y1, divideRatio);

            let triangle3_ax = triangle1_ax;
            let triangle3_ay = triangle1_ay;
            let triangle3_bx = lerp(triangle1_ax, triangle1_cx, divideRatio);
            let triangle3_by = lerp(triangle1_ay, triangle1_cy, divideRatio);
            let triangle3_cx = triangle2_cx;
            let triangle3_cy = triangle2_cy;

            let triangle4_ax = triangle1_cx;
            let triangle4_ay = triangle1_cy;
            let triangle4_bx = triangle2_bx;
            let triangle4_by = triangle2_by;
            let triangle4_cx = lerp(triangle2_bx, triangle2_cx, divideRatio);
            let triangle4_cy = lerp(triangle2_by, triangle2_cy, divideRatio);

            let rect_ax = triangle3_bx;
            let rect_ay = triangle3_by;
            let rect_bx = triangle1_cx;
            let rect_by = triangle1_cy;
            let rect_cx = triangle4_cx;
            let rect_cy = triangle4_cy;
            let rect_dx = triangle2_cx;
            let rect_dy = triangle2_cy;
            myColor_stroke();
            await lineTriangle(triangle1_ax, triangle1_ay, triangle1_bx, triangle1_by, triangle1_cx, triangle1_cy); // 原本：triangle
            myColor_stroke();
            await lineTriangle(triangle2_ax, triangle2_ay, triangle2_bx, triangle2_by, triangle2_cx, triangle2_cy);
            myColor_stroke();
            await lineTriangle(triangle3_ax, triangle3_ay, triangle3_bx, triangle3_by, triangle3_cx, triangle3_cy);
            myColor_stroke();
            await lineTriangle(triangle4_ax, triangle4_ay, triangle4_bx, triangle4_by, triangle4_cx, triangle4_cy);
            myColor_stroke();
            await myDivide(rect_ax, rect_ay, rect_bx, rect_by, rect_cx, rect_cy, rect_dx, rect_dy);
        } else {
            let triangle1_ax = x1;
            let triangle1_ay = y1;
            let triangle1_bx = x2;
            let triangle1_by = y2;
            let triangle1_cx = lerp(x1, x4, divideRatio);
            let triangle1_cy = lerp(y1, y4, divideRatio);

            let triangle2_ax = x4;
            let triangle2_ay = y4;
            let triangle2_bx = x3;
            let triangle2_by = y3;
            let triangle2_cx = lerp(x3, x2, divideRatio);
            let triangle2_cy = lerp(y3, y2, divideRatio);

            let triangle3_ax = triangle1_bx;
            let triangle3_ay = triangle1_by;
            let triangle3_bx = lerp(triangle1_cx, triangle1_bx, divideRatio);
            let triangle3_by = lerp(triangle1_cy, triangle1_by, divideRatio);
            let triangle3_cx = triangle2_cx;
            let triangle3_cy = triangle2_cy;

            let triangle4_ax = triangle1_cx;
            let triangle4_ay = triangle1_cy;
            let triangle4_bx = triangle2_ax;
            let triangle4_by = triangle2_ay;
            let triangle4_cx = lerp(triangle2_cx, triangle2_ax, divideRatio);
            let triangle4_cy = lerp(triangle2_cy, triangle2_ay, divideRatio);

            let rect_ax = triangle3_bx;
            let rect_ay = triangle3_by;
            let rect_bx = triangle1_cx;
            let rect_by = triangle1_cy;
            let rect_cx = triangle4_cx;
            let rect_cy = triangle4_cy;
            let rect_dx = triangle2_cx;
            let rect_dy = triangle2_cy;
            myColor_stroke();
            await lineTriangle(triangle1_ax, triangle1_ay, triangle1_bx, triangle1_by, triangle1_cx, triangle1_cy);
            myColor_stroke();
            await lineTriangle(triangle2_ax, triangle2_ay, triangle2_bx, triangle2_by, triangle2_cx, triangle2_cy);
            myColor_stroke();
            await lineTriangle(triangle3_ax, triangle3_ay, triangle3_bx, triangle3_by, triangle3_cx, triangle3_cy);
            myColor_stroke();
            await lineTriangle(triangle4_ax, triangle4_ay, triangle4_bx, triangle4_by, triangle4_cx, triangle4_cy);
            myColor_stroke();
            await myDivide(rect_ax, rect_ay, rect_bx, rect_by, rect_cx, rect_cy, rect_dx, rect_dy);
        }
    }
}

// ---------------------------------------------
async function lineTriangle(x1, y1, x2, y2, x3, y3) {
    let lineCount = floor(lerp(150, 350, m4));
    // let lineCount = floor(random(150, 200));
    strokeWeight(dist(x1, y1, x2, y2) * random(0.8, 2) / 450);

    for (let i = 0; i < lineCount; i++) {
        let t = (i + 1) / lineCount;

        if (random() < 1) {
            let line_x1 = lerp(x1, x3, t) + random(-2, 2);
            let line_y1 = lerp(y1, y3, t) + random(-2, 2);
            let line_x2 = lerp(x2, x3, t) + random(-2, 2);
            let line_y2 = lerp(y2, y3, t) + random(-2, 2);
            line(line_x1, line_y1, line_x2, line_y2);

        } else {
            let line_x1 = lerp(x1, x2, t) + random(-2, 2);
            let line_y1 = lerp(y1, y2, t) + random(-2, 2);
            let line_x2 = lerp(x3, x2, t) + random(-2, 2);
            let line_y2 = lerp(y3, y2, t) + random(-2, 2);
            line(line_x1, line_y1, line_x2, line_y2);
        }

        if(i % 24 == 0) {
            await sleep(1);
        }
    }
}

// ---------------------------------------------
async function lineRect(x1, y1, x2, y2, x3, y3, x4, y4) {

    let lineCount = floor(random(50, 100));
    strokeWeight(dist(x1, y1, x2, y2) * random(1, 3) / 450);

    for (let i = 0; i < lineCount; i++) {
        let t = (i + 1) / lineCount;

        if (random() < 0.5) {
            let x_1 = lerp(x1, x4, t);
            let x_2 = lerp(x2, x3, t);
            let y_1 = lerp(y1, y4, t);
            let y_2 = lerp(y2, y3, t);
            line(x_1, y_1, x_2, y_2);
        } else {
            let x_1 = lerp(x2, x3, t);
            let x_2 = lerp(x1, x4, t);
            let y_1 = lerp(y2, y3, t);
            let y_2 = lerp(y1, y4, t);
            line(x_1, y_1, x_2, y_2);
        }

        if(i % 24 == 0) {
            await sleep(1);
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}