/*
 * ============================================================================
 * 《HOME》 - Generative Art Project
 * Version: v37.0 [EditArt Gold / Professor's Setup Integrated]
 * Platform: EditArt
 * ============================================================================
 *
 * 【參數控制 / Parameters (m0-m4)】
 * m0 : [Color] 主色調 (0-360)
 * m1 : [Type] 星球種類 (Yarn / Fluid / Fur)
 * m2 : [Galaxy] 銀河旋轉角度
 * m3 : [Shadow] 陰影類型 (Razor / Crescent / Eclipse)
 * m4 : [Light] 光照角度
 *
 * ============================================================================
 */

// --- 1. 教授提供的核心設定 (Core Setup) ---
let targetCanvasWidth = 2000;
let targetCanvasHeight = 2000;
let deviceRatio = 1;

// --- 2. 藝術專案全域變數 ---
let universeLayer;
let planetLayer1;
let grainLayer;

let planetX, planetY, planetSize;
let mainHue = 0;
let globalLightAngle = 0;
let globalGalaxyAngle = 0;
let galaxyPivotOffsetX = 0;
let galaxyPivotOffsetY = 0;
let currentShadowProfile = {};
let isSilverSalt = false;

// 固定參數 (陰影配置)
const SHADOW_PROFILES = [
  { name: "Razor", shadowOffset: 0.95, shadowRadius: 1.9, haloOffset: 0.5, haloRadius: 1.4 },
  { name: "Crescent", shadowOffset: 0.85, shadowRadius: 1.6, haloOffset: 0.4, haloRadius: 1.3 },
  { name: "Eclipse", shadowOffset: 0.6, shadowRadius: 1.3, haloOffset: 0.3, haloRadius: 1.25 }
];

// 銀河消失機率
const VOID_CHANCE = 0.3;

// --- 3. 系統函式 (System Functions) ---

// EditArt 提供的亂數輔助函式
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
    createCanvas(targetCanvasWidth, targetCanvasHeight);
    SetupCanvasScale();
    flex(); // p5.flex 啟動響應式

    colorMode(HSB, 360, 100, 100);

    // 初始化圖層 (使用固定邏輯尺寸)
    universeLayer = createGraphics(width, height);
    universeLayer.colorMode(HSB, 360, 100, 100);

    planetLayer1 = createGraphics(width, height);
    planetLayer1.colorMode(HSB, 360, 100, 100);

    grainLayer = createGraphics(width, height);
    // 雜訊層生成
    generateGrain(grainLayer);

    // 計算尺寸比例
    calculateDimensions();
    
    noLoop(); 
}

// 計算核心尺寸 (基於 2000 邏輯畫布)
function calculateDimensions() {
    let s = min(width, height);
    // 保持 v29/v36 的黃金比例 (約 0.335)
    planetSize = s * 0.335; 
    planetX = width / 2;
    planetY = height / 2;
}


// --- 4. 主繪製迴圈 (由 EditART 滑桿觸發) ---

async function draw() {
    colorMode(HSB);
    
    // 【核心機制】鎖定隨機種子
    // 使用 editRandom 取得一個固定的種子值
    let seedVal = editRandom(0, 1000000);
    noiseSeed(seedVal);
    randomSeed(seedVal); // 確保 random() 也被鎖定，這對生成藝術至關重要

    // 映射滑桿參數
    mapParameters();

    // 開始繪圖流程
    
    // 1. 清空圖層
    universeLayer.clear();
    planetLayer1.clear();

    // 2. 繪製背景 (銀河)
    // 注意：這裡改回您的黑色背景 (0)，而非教授範例的白色 (100)
    background(0); 
    
    drawUniverseStars(universeLayer);
    image(universeLayer, 0, 0, width, height);
  
    // 3. 繪製星球
    drawPlanet(); 
    
    // 4. 星球柔焦處理
    drawingContext.filter = 'blur(0.55px)'; 
    image(planetLayer1, 0, 0, width, height);
    drawingContext.filter = 'none'; 

    // 5. 疊加雜訊 (質感)
    push();
    blendMode(OVERLAY);
    image(grainLayer, 0, 0, width, height);
    pop();

    // 通知 EditART 預覽圖已完成
    triggerPreview();
}


// --- 5. 參數映射邏輯 ---

function mapParameters() {
    // m0: 主色調 (Hue)
    mainHue = map(m0, 0, 1, 0, 360);

    // 隨機特性: 銀鹽模式 (5% 機率，由種子決定)
    isSilverSalt = random() < 0.05; 

    // m2: 銀河角度與偏移
    globalGalaxyAngle = map(m2, 0, 1, 0, TAU);
    
    // 偏移量比例 (維持 1.2 倍星球寬度)
    let shiftRange = planetSize * 1.2; 
    galaxyPivotOffsetX = map(noise(m2 * 10, 0), 0, 1, -shiftRange, shiftRange);
    galaxyPivotOffsetY = map(noise(0, m2 * 10), 0, 1, -shiftRange, shiftRange);

    // m3: 陰影類型 (Shadow Profile)
    let profileIndex = floor(map(m3, 0, 1, 0, SHADOW_PROFILES.length));
    profileIndex = constrain(profileIndex, 0, SHADOW_PROFILES.length - 1);
    currentShadowProfile = SHADOW_PROFILES[profileIndex];

    // m4: 光照角度
    globalLightAngle = map(m4, 0, 1, 0, TAU);
}


// --- 6. 繪圖核心函式 (維持 Pixel-Perfect 比例) ---

function generateGrain(pg) {
  pg.clear();
  pg.noStroke();
  let d = pg.pixelDensity();
  pg.loadPixels();
  for (let i = 0; i < pg.width * d * pg.height * d * 4; i += 4) {
    let noiseVal = Math.random() * 255;
    pg.pixels[i] = noiseVal;      
    pg.pixels[i+1] = noiseVal;    
    pg.pixels[i+2] = noiseVal;    
    pg.pixels[i+3] = Math.random() * 30 + 20; 
  }
  pg.updatePixels();
}

function drawUniverseStars(layer) {
  let bgHue, bgSat, bgBri;

  if (isSilverSalt) {
    bgHue = 0; bgSat = 0; bgBri = random(4, 7); 
  } else {
    bgHue = (mainHue + 180) % 360; 
    bgSat = random(30, 50); 
    bgBri = random(2, 5);   
  }

  layer.background(bgHue, bgSat, bgBri); 

  let noiseOffsetA = random(1000); 
  let noiseOffsetB = random(2000); 
  let galaxyAngle = globalGalaxyAngle; 
  
  let isVoidInstance = random() < VOID_CHANCE;
  let maskThreshold = isVoidInstance ? random(0.35, 0.5) : random(0.65, 0.85);

  layer.push();
  layer.noStroke();
  layer.blendMode(SCREEN); 
  
  let cx = layer.width / 2 + galaxyPivotOffsetX;
  let cy = layer.height / 2 + galaxyPivotOffsetY;
  
  let area = layer.width * layer.height;
  let dustCount = area * random(0.004, 0.005); 

  for (let i = 0; i < dustCount; i++) {
    let x = random(-layer.width * 0.5, layer.width * 1.5);
    let y = random(-layer.height * 0.5, layer.height * 1.5);
    let nx = x - cx;
    let ny = y - cy;
    let rx = nx * cos(galaxyAngle) - ny * sin(galaxyAngle);
    let ry = nx * sin(galaxyAngle) + ny * cos(galaxyAngle);
    let flowNoise = noise(rx * 0.0015 + noiseOffsetA, ry * 0.0015 + noiseOffsetA);
    let distortion = map(flowNoise, 0, 1, -layer.width*0.25, layer.width*0.25);
    let baseWidth = layer.width * 0.35; 
    let widthVariation = map(noise(rx*0.0025, ry*0.0025), 0, 1, 0.6, 1.4);
    let currentWidth = baseWidth * widthVariation;
    let distFromAxis = abs(ry + distortion);
    if (distFromAxis > currentWidth) continue;
    let normalizedDist = distFromAxis / currentWidth;
    let baseDensity = pow(1 - normalizedDist, 3.0);
    let dustNoiseScale = 0.0008; 
    let dustMaskVal = noise(x * dustNoiseScale + noiseOffsetB, y * dustNoiseScale + noiseOffsetB);
    let occlusion = map(dustMaskVal, maskThreshold, maskThreshold + 0.3, 0, 1, true);
    baseDensity *= (1 - pow(occlusion, 2));
    if (isVoidInstance) { baseDensity = 0; }
    if (random() > baseDensity * 1.1) continue;
    let h, s, b, a, pSize;
    let baseSize = layer.width * 0.0011; 
    if (isSilverSalt) {
        h = 0; s = 0; b = random(20, 50); a = random(0.03, 0.06);
        pSize = random(baseSize * 1.2, baseSize * 2.2);
    } else {
        if (baseDensity > random (0.35,0.5)) { 
            h = random(190, 220); s = random(5, 25); b = random(40, 60); a = random(0.04, 0.08); 
            pSize = random(baseSize * 1.5, baseSize * 2.8); 
        } else { 
            h = random(220, 260); s = random(40, 70); b = random(15, 30); a = random(0.01, 0.03); 
            pSize = random(baseSize * 1.0, baseSize * 1.8); 
        }
    }
    layer.fill(h, s, b, a * 100);
    layer.ellipse(x, y, pSize, pSize);
  }
  layer.pop();
  
  layer.filter(BLUR, 0.8); 

  layer.push();
  layer.noStroke();
  layer.blendMode(ADD); 
  
  let starCount = area * random(0.00016, 0.00025); 
  
  for (let i = 0; i < starCount; i++) {
    let x = random(layer.width);
    let y = random(layer.height);
    if (random() < 0.1) continue; 
    let baseStarSize = layer.width * random(0.00088, 0.0013);
    let size = random(baseStarSize * 0.8, baseStarSize * 2.2);
    let bri = pow(random(), 3.5) * 220; 
    let starSat = isSilverSalt ? 0 : random(10, 30);
    let starHue = isSilverSalt ? 0 : random(200, 240);
    layer.fill(starHue, starSat, bri); 
    layer.ellipse(x, y, size, size);
  }
  layer.pop();
  
  drawShootingStars(layer);
}

// 繪製流星 (隨機但受種子鎖定)
function drawShootingStars(layer) {
  if (random() > 0.33) return;
  
  let countRoll = random();
  let count;
  if (countRoll < 0.70) count = 1; 
  else if (countRoll < 0.85) count = 2; 
  else count = random(3, 5); 
  
  layer.push();
  layer.blendMode(SCREEN);
  
  for (let i = 0; i < count; i++) {
    let x = random(layer.width);
    let y = random(layer.height);
    let len = random(layer.width * 0.015, layer.width * 0.05); 
    let angle = random(TAU); 
    let x2 = x + cos(angle) * len;
    let y2 = y + sin(angle) * len;
    let ctx = layer.drawingContext;
    let grad = ctx.createLinearGradient(x, y, x2, y2);
    let headAlpha = random(0.4, 0.8);
    let tailColor, headColor;
    
    if (isSilverSalt) {
        tailColor = 'rgba(255, 255, 255, 0)';
        headColor = `rgba(255, 255, 255, ${headAlpha})`;
    } else {
        let h = mainHue; let s = random(5, 15); let b = random(90, 100); 
        let c = color(h, s, b);
        tailColor = `rgba(${red(c)}, ${green(c)}, ${blue(c)}, 0)`;
        headColor = `rgba(${red(c)}, ${green(c)}, ${blue(c)}, ${headAlpha})`;
    }
    grad.addColorStop(0.0, tailColor); 
    grad.addColorStop(1.0, headColor); 
    ctx.strokeStyle = grad;
    layer.strokeWeight(random(0.8, 1.8)); 
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
  }
  layer.pop();
}


// --- 7. 星球生成邏輯 ---

function drawPlanet() {
  if (m1 < 0.333) {
    drawYarnPlanet(planetLayer1, planetX, planetY, planetSize);
  } else if (m1 < 0.666) {
    drawFluidPlanet(planetLayer1, planetX, planetY, planetSize);
  } else {
    drawFurPlanet(planetLayer1, planetX, planetY, planetSize);
  }
}

function recursiveRectSubdivision(layer, _x, _y, _w, _h, cx, cy, r, currentHue, minSize, blockRenderer, extraParam) {
    let doDivide = true;
    if (_w < minSize || _h < minSize) doDivide = false;
    if (!doDivide) {
        blockRenderer(layer, _x, _y, _w, _h, cx, cy, r, currentHue, extraParam);
        return;
    }
    let divideRatioY = random(0.2, 0.8);
    let divideRatioX = random(0.2, 0.8);
    let hueShift = random(-15, 15);
    let nextHue = (currentHue + hueShift + 360) % 360;
    if (random() <= 0.5) {
        let rectA_H = _h * divideRatioY;
        let rectB_Y = _y + rectA_H;
        let rectB_H = _h - rectA_H;
        recursiveRectSubdivision(layer, _x, _y, _w, rectA_H, cx, cy, r, nextHue, minSize, blockRenderer, extraParam);
        recursiveRectSubdivision(layer, _x, rectB_Y, _w, rectB_H, cx, cy, r, nextHue, minSize, blockRenderer, extraParam);
    } else {
        let rectC_W = _w * divideRatioX;
        let rectD_X = _x + rectC_W;
        let rectD_W = _w - rectC_W;
        recursiveRectSubdivision(layer, _x, _y, rectC_W, _h, cx, cy, r, nextHue, minSize, blockRenderer, extraParam);
        recursiveRectSubdivision(layer, rectD_X, _y, rectD_W, _h, cx, cy, r, nextHue, minSize, blockRenderer, extraParam);
    }
}

// --- Type A: Yarn ---
function drawYarnPlanet(layer, cx, cy, pSize) {
  let r = pSize / 2;
  let ctx = layer.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TWO_PI);
  ctx.clip();  
  let baseCol = JColor(mainHue);
  let paleBg = color(hue(baseCol), saturation(baseCol)*0.5, 95);
  layer.noStroke();
  layer.fill(paleBg);
  layer.ellipse(cx, cy, pSize);
  let rectX = cx - r;
  let rectY = cy - r;
  let rectSize = r * 2;
  
  // 視覺校正：保持 v29 比例 (80/666 ≈ 0.12)
  let dynamicMinSize = pSize * 0.12; 
  recursiveRectSubdivision(layer, rectX, rectY, rectSize, rectSize, cx, cy, r, mainHue, dynamicMinSize, drawYarnBlock);
  applySunlight(layer, cx, cy, r);
  applyDynamicHalo(layer, cx, cy, r); 
  applySubtleLighting(layer, cx, cy, r, mainHue); 
  ctx.restore(); 
}

function drawYarnBlock(layer, rx, ry, rw, rh, cx, cy, r, blockHue) {
  layer.push();
  layer.blendMode(OVERLAY);
  layer.noStroke();
  let patchColor = JColor(blockHue);
  patchColor.setAlpha(random(30, 60));
  layer.fill(patchColor);
  let overlap = 1.5;
  layer.rect(rx - overlap/2, ry - overlap/2, rw + overlap, rh + overlap);
  layer.pop();
  
  layer.noFill(); 
  
  let isHorizontal = rw > rh;
  let density = random(2.0, 4.0);
  drawYarnLayer(layer, rx, ry, rw, rh, blockHue, isHorizontal, density);
  if (random() < 0.7) {
    drawYarnLayer(layer, rx, ry, rw, rh, blockHue, !isHorizontal, density * 1.5);
  }
}

function drawYarnLayer(layer, rx, ry, rw, rh, blockHue, horizontal, density) {
  let waveFreqScale = random(0.02, 0.05) * (600/planetSize);
  let waveAmpScale = random(1.5, 3.5) * (planetSize/600);
  if (horizontal) {
    for (let y = ry + density/2; y < ry + rh; y += density) {
      let col = JColor(blockHue);
      col.setAlpha(random(100, 200));
      layer.stroke(col);
      layer.strokeWeight(random(1.2, 2.8) * (planetSize/300));
      let phase = random(TAU);
      let freq = waveFreqScale * random(0.8, 1.2);
      let amp = waveAmpScale * random(0.5, 1.5);
      let angleJitter = random(-0.05, 0.05);
      layer.beginShape();
      for (let x = rx; x <= rx + rw; x += 5) {
        let yOffset = sin(x * freq + phase) * amp;
        let finalY = y + yOffset + (x - rx) * tan(angleJitter);
        layer.curveVertex(x, finalY);
      }
      layer.endShape();
    }
  } else {
    for (let x = rx + density/2; x < rx + rw; x += density) {
      let col = JColor(blockHue);
      col.setAlpha(random(100, 200));
      layer.stroke(col);
      layer.strokeWeight(random(1.2, 2.8) * (planetSize/300));
      let phase = random(TAU);
      let freq = waveFreqScale * random(0.8, 1.2);
      let amp = waveAmpScale * random(0.5, 1.5);
      let angleJitter = random(-0.05, 0.05);
      layer.beginShape();
      for (let y = ry; y <= ry + rh; y += 5) {
        let xOffset = sin(y * freq + phase) * amp;
        let finalX = x + xOffset + (y - ry) * tan(angleJitter);
        layer.curveVertex(finalX, y);
      }
      layer.endShape();
    }
  }
}

// --- Type B: Fluid ---
function drawFluidPlanet(layer, cx, cy, pSize) {
  let r = pSize / 2;
  let ctx = layer.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TWO_PI);
  ctx.clip(); 
  let baseCol = JColor(mainHue);
  let paleBg = color(hue(baseCol), saturation(baseCol)*0.5, 95);
  layer.noStroke();
  layer.fill(paleBg);
  layer.ellipse(cx, cy, pSize);
  let rectX = cx - r;
  let rectY = cy - r;
  let rectSize = r * 2;
  
  // 視覺校正：保持 v29 比例 (100/666 ≈ 0.15)
  let dynamicMinSize = pSize * 0.15; 
  recursiveRectSubdivision(layer, rectX, rectY, rectSize, rectSize, cx, cy, r, mainHue, dynamicMinSize, drawFluidBlock);
  applySunlight(layer, cx, cy, r);
  applyDynamicHalo(layer, cx, cy, r); 
  applySubtleLighting(layer, cx, cy, r, mainHue); 
  ctx.restore(); 
}

function drawFluidBlock(layer, rx, ry, rw, rh, cx, cy, r, blockHue) {
  layer.push();
  layer.blendMode(OVERLAY);
  layer.noStroke();
  let patchColor = JColor(blockHue);
  patchColor.setAlpha(random(30, 60));
  layer.fill(patchColor);
  let overlap = 1.5;
  layer.rect(rx - overlap/2, ry - overlap/2, rw + overlap, rh + overlap);
  layer.pop();
  
  let noiseScale = random(0.003, 0.006);
  let stepSize = 5;
  let maxSteps = 80;
  let densityFactor = 0.3;
  let numStreamlines = floor((rw * rh) * densityFactor * (planetSize / 600));
  numStreamlines = constrain(numStreamlines, 50, 1000);
  layer.noFill();
  for (let i = 0; i < numStreamlines; i++) {
    let x = random(rx, rx + rw);
    let y = random(ry, ry + rh);
    if (dist(x, y, cx, cy) > r) continue;
    let col = JColor(blockHue);
    col.setAlpha(random(80, 180));
    layer.stroke(col);
    layer.strokeWeight(random(0.8, 2.5) * (planetSize/300));
    layer.beginShape();
    for (let s = 0; s < maxSteps; s++) {
      layer.curveVertex(x, y);
      let angle = noise(x * noiseScale, y * noiseScale) * TAU * 2;
      let nextX = x + cos(angle) * stepSize;
      let nextY = y + sin(angle) * stepSize;
      if (nextX < rx || nextX > rx + rw || nextY < ry || nextY > ry + rh) break;
      x = nextX;
      y = nextY;
    }
    layer.endShape();
  }
}

// --- Type C: Fur ---
function drawFurPlanet(layer, cx, cy, pSize) {
  let r = pSize / 2;
  let ctx = layer.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TWO_PI);
  ctx.clip(); 
  let baseCol = JColor(mainHue);
  let paleBg = color(hue(baseCol), saturation(baseCol)*0.5, 95);
  layer.noStroke();
  layer.fill(paleBg);
  layer.ellipse(cx, cy, pSize);
  let swirlDir = random() > 0.5 ? 1 : -1;
  layer.noFill();
  let coreRadius = r * 0.35;
  let coreDensity = 800;
  for (let i = 0; i < coreDensity; i++) {
    let angle = random(TAU);
    let rad = pow(random(1), 3) * coreRadius;
    let x = cx + cos(angle) * rad;
    let y = cy + sin(angle) * rad;
    let distFromCenter = dist(x, y, cx, cy);
    let baseAngle = atan2(y - cy, x - cx);
    let swirlOffset = map(distFromCenter, 0, r, 0, PI * 0.7) * swirlDir;
    let jitter = random(-0.3, 0.3);
    let finalAngle = baseAngle + swirlOffset + jitter;
    let len = random(10, 25) * (planetSize/300);
    let x2 = x + cos(finalAngle) * len;
    let y2 = y + sin(finalAngle) * len;
    let col = JColor(mainHue);
    col.setAlpha(random(60, 160));
    layer.stroke(col);
    layer.strokeWeight(random(1.5, 3.0) * (planetSize/300));
    layer.line(x, y, x2, y2);
  }
  let rectX = cx - r;
  let rectY = cy - r;
  let rectSize = r * 2;
  
  // 視覺校正：保持 v29 比例 (100/666 ≈ 0.15)
  let dynamicMinSize = pSize * 0.15;
  recursiveRectSubdivision(layer, rectX, rectY, rectSize, rectSize, cx, cy, r, mainHue, dynamicMinSize, drawFurBlock, swirlDir);
  applySunlight(layer, cx, cy, r);
  applyDynamicHalo(layer, cx, cy, r); 
  applySubtleLighting(layer, cx, cy, r, mainHue); 
  ctx.restore(); 
}

function drawFurBlock(layer, rx, ry, rw, rh, cx, cy, r, blockHue, swirlDir) {
  layer.push();
  layer.blendMode(OVERLAY);
  layer.noStroke();
  let patchColor = JColor(blockHue);
  patchColor.setAlpha(random(30, 60));
  layer.fill(patchColor);
  let overlap = 1.5;
  layer.rect(rx - overlap/2, ry - overlap/2, rw + overlap, rh + overlap);
  layer.pop();
  
  let densityFactor = 0.4;
  let numHairs = floor((rw * rh) * densityFactor * (planetSize / 600));
  numHairs = constrain(numHairs, 50, 1000);
  let noiseScale = 0.01;
  layer.noFill();
  for (let i = 0; i < numHairs; i++) {
    let x = random(rx, rx + rw);
    let y = random(ry, ry + rh);
    let distFromCenter = dist(x, y, cx, cy);
    if (distFromCenter > r) continue;
    let baseAngle = atan2(y - cy, x - cx);
    let swirlOffset = map(distFromCenter, 0, r, 0, PI * 0.7) * swirlDir;
    let n = noise(x * noiseScale, y * noiseScale);
    let jitter = map(n, 0, 1, -0.4, 0.4);
    let finalAngle = baseAngle + swirlOffset + jitter;
    let len = random(5, 20) * (planetSize/300);
    let x2 = x + cos(finalAngle) * len;
    let y2 = y + sin(finalAngle) * len;
    let col = JColor(blockHue);
    col.setAlpha(random(50, 150));
    layer.stroke(col);
    layer.strokeWeight(random(2.0, 4.0) * (planetSize/300));
    layer.line(x, y, x2, y2);
  }
}

// --- 8. 光影與輔助函式 ---

function applySunlight(layer, cx, cy, r) {
  let ctx = layer.drawingContext;
  layer.push();
  layer.blendMode(ADD);
  layer.noStroke();
  let dist = r * 0.65;
  let sunCenterX = cx + cos(globalLightAngle + PI) * dist;
  let sunCenterY = cy + sin(globalLightAngle + PI) * dist;
  let sunRadius = r * 1.0; 
  let sunGrad = ctx.createRadialGradient(sunCenterX, sunCenterY, 0, sunCenterX, sunCenterY, sunRadius);
  sunGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.08)'); 
  sunGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.04)'); 
  sunGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.01)');        
  ctx.fillStyle = sunGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  layer.pop();
}

function applyDynamicHalo(layer, cx, cy, r) {
  let ctx = layer.drawingContext;
  layer.push();
  layer.blendMode(SCREEN); 
  layer.noStroke();
  let hOffset = r * currentShadowProfile.haloOffset; 
  let haloCenterX = cx + cos(globalLightAngle) * hOffset;
  let haloCenterY = cy + sin(globalLightAngle) * hOffset;
  let haloRadius = r * currentShadowProfile.haloRadius; 
  let haloGrad = ctx.createRadialGradient(haloCenterX, haloCenterY, 0, haloCenterX, haloCenterY, haloRadius);
  haloGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.005)'); 
  haloGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)'); 
  haloGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.15)'); 
  haloGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.5)');  
  ctx.fillStyle = haloGrad;
  ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
  layer.pop();
}

function applySubtleLighting(layer, cx, cy, r, hueBase) {
  let ctx = layer.drawingContext;
  layer.push();
  layer.blendMode(MULTIPLY);
  layer.noStroke();
  let dist = r * currentShadowProfile.shadowOffset;
  let shadowCenterX = cx + cos(globalLightAngle + PI) * dist;
  let shadowCenterY = cy + sin(globalLightAngle + PI) * dist;
  let shadowRadius = r * currentShadowProfile.shadowRadius; 
  let shadowGrad = ctx.createRadialGradient(shadowCenterX, shadowCenterY, 0, shadowCenterX, shadowCenterY, shadowRadius);
  shadowGrad.addColorStop(0.0, 'rgba(0,0,0,0)'); 
  shadowGrad.addColorStop(0.75, 'rgba(0,0,0,0)'); 
  
  let sVal = isSilverSalt ? 0 : 60;
  shadowGrad.addColorStop(0.9, `hsla(${hueBase}, ${sVal}%, 5%, 0.8)`); 
  shadowGrad.addColorStop(1.0, `hsla(${hueBase}, ${sVal}%, 2%, 0.97)`); 
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4); 
  
  layer.noFill();
  layer.strokeWeight(3); 
  layer.stroke(0, 0, 0, 0.8); 
  
  let shadowAngle = globalLightAngle + PI;
  let arcSpan = radians(240); 
  let startAngle = shadowAngle - arcSpan / 2;
  let endAngle = shadowAngle + arcSpan / 2;
  layer.arc(cx, cy, r * 2, r * 2, startAngle, endAngle);
  layer.pop(); 
}

function JColor(hueBasis) {
  let base = hueBasis !== undefined ? hueBasis : mainHue;
  let colorHue = (base + random(-30, 30)) % 360;
  
  let colorSat = random(30, 60);
  let colorBri = random(80, 100);

  if (isSilverSalt) {
    colorSat = random(0, 15); 
    colorBri = random(70, 100); 
  }

  if (colorHue < 0) colorHue += 360; 
  if (random(0.0, 1.0) < 0.02) { colorHue = (colorHue + 180) % 360; }
  
  if (random(0.0, 1.0) < 0.04) { colorSat = 0; colorBri = 100; }
  
  return color(colorHue, colorSat, colorBri);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}