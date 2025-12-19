// Here is the await time setting if you would like to slow down the animation
let FRAME_AWAIT_TIME = 1;

// Here are the steps to create the folding effect
// 1. Generate card objects to know their own position and size
// 2. Draw cards' front layer
// 3. Calculate the folding angle, and erase the folded part
// 4. Draw cards' back layer

//
// In order to make the fold one by one, there are multiple graphics used
//
// Also, in order to speed up the drawing, each card's front / back visual is firstly drawn on two different graphics (like a sprite sheet),
// and getCardGraphic() is called just before each card got drawn

// settings
let targetWidth = 1920;
let targetHeight = 1080;
let targetDensity = 1;
let targetPadding = 200;
let bgTransparent = false;
// settings

function editRandom(min, max) {
  if (max === undefined) {
    if (min === undefined) return randomFull();
    max = min;
    min = 0;
  }
  return randomFull() * (max - min) + min;
}

let _frontLayer;
let _backLayer;
let _cardGraphicDisplayLayer;

// prepare cards' visual on this graphic
let _cardFrontGraphic;
let _cardBackGraphic;

// global use for drawing cards
let _currentCardFront;
let _currentCardBack;

let _tempCardGraphic;

let BLACK_FRAME = false;

async function init() {
  targetWidth = 1748;
  targetHeight = 1240;
  targetPadding = 100;
  targetDensity = 2;
  bgTransparent = false;
}

async function setup() {
  init();
  createCanvas(1748, 1240);
  flex();
  randomSeed(randomFull() * 10000000);
  noiseSeed(randomFull() * 10000000);

  _frontLayer = createGraphics(width, height);
  _backLayer = createGraphics(width, height);
  _cardGraphicDisplayLayer = createGraphics(width, height);

  _cardFrontGraphic = createGraphics(width, height);
  _cardBackGraphic = createGraphics(width, height);
  _cardFrontGraphic.colorMode(HSB);
  _cardBackGraphic.colorMode(HSB);

  _tempCardGraphic = createGraphics(100, 100);
  _tempCardGraphic.colorMode(HSB);

  _currentCardFront = createGraphics(width, height);
  _currentCardBack = createGraphics(width, height);

  pixelDensity(targetDensity);
  _frontLayer.pixelDensity(targetDensity);
  _backLayer.pixelDensity(targetDensity);
  _cardGraphicDisplayLayer.pixelDensity(targetDensity);

  _cardFrontGraphic.pixelDensity(targetDensity);
  _cardBackGraphic.pixelDensity(targetDensity);

  _tempCardGraphic.pixelDensity(targetDensity);
  _currentCardFront.pixelDensity(targetDensity);
  _currentCardBack.pixelDensity(targetDensity);

  colorMode(HSB);
  if (bgTransparent) {
    clear();
  }
  else {
    background(0, 0, 6);
  }

  // traits
  let _mainHue = m0 * 360;
  _mainHue %= 360;

  // m3 controls outer padding
  let padding = 20 + m3 * 400; // 20 to 420
  let areaX = padding;
  let areaY = padding;
  let areaW = width - padding * 2;
  let areaH = height - padding * 2;

  let cards = [];
  let rectDatas = [];

  // m1 controls density
  let divideType = m1 < 0.5 ? 0 : 1;

  // subdivision
  if (divideType == 0) {
    rectDatas = subdivideRect(areaX, areaY, areaW, areaH, m1);

    rectDatas.sort((a, b) => {
      let sizeA = a.w * a.h;
      let sizeB = b.w * b.h;

      if (sizeA < sizeB)
        return -1;
      else if (sizeA > sizeB)
        return 1;
      else
        return 0;
    });
  }
  // even rects
  else if (divideType == 1) {
    let xCount = int(editRandom(3, 3 + m1 * 20));
    let yCount = int(editRandom(3, 3 + m1 * 20));

    // some special devide style
    let sizeRandom = editRandom();
    if (sizeRandom < 0.2) {
      xCount = int(editRandom(1, 1 + m1 * 4));
      yCount = int(editRandom(10, 10 + m1 * 40));
    }
    else if (sizeRandom < 0.4) {
      xCount = int(editRandom(10, 10 + m1 * 40));
      yCount = int(editRandom(1, 1 + m1 * 4));
    }


    let rectWidth = areaW / xCount;
    let rectHeight = areaH / yCount;

    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        rectDatas.push(new RectData(areaX + rectWidth * x, areaY + rectHeight * y, rectWidth, rectHeight));
      }
    }

    rectDatas.sort((a, b) => {
      if (editRandom() < 0.5)
        return -1;
      else
        return 1;
    });

  }

  for (let i = 0; i < rectDatas.length; i++) {
    cards[i] = new Card(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
    cards[i].cardHue = processHue(_mainHue + editRandom(-30, 30));
    cards[i].cardSat = editRandom(40, 60);
    cards[i].cardBri = editRandom(80, 100);

    let colorRandom = editRandom();

    if (colorRandom < 0.12) {
      cards[i].cardHue += 60;
    }
    // else if (colorRandom < 0.24) {
    //   cards[i].cardHue += 180;
    // }

  }

  // draw card graphics
  for (let i = 0; i < rectDatas.length; i++) {
    let cardHue = cards[i].cardHue;
    let cardSat = cards[i].cardSat;
    let cardBri = cards[i].cardBri;

    let _x = rectDatas[i].x;
    let _y = rectDatas[i].y;
    let _w = rectDatas[i].w;
    let _h = rectDatas[i].h;
    let _hue = cardHue;
    let _sat = cardSat;
    let _bri = cardBri;
    let _seed = cards[i].seed;

    let _hueBack = processHue(_hue + 180);
    let _satBack = _sat;
    let _briBack = _bri;

    if (editRandom() < 0.12)
      _hueBack = processHue(_hueBack + 60);

    _satBack += editRandom(-20, 20);
    _briBack += editRandom(-20, 20);

    // m4 controls line count
    drawGradientRect(_x, _y, _w, _h, _hue, _sat, _bri, _seed, _cardFrontGraphic, m4);
    drawGradientRect(_x, _y, _w, _h, _hueBack, _satBack, _briBack, _seed, _cardBackGraphic, m4);
    // drawStyledRect(_x, _y, _w, _h, _hue, _sat, _bri, _seed, _cardFrontGraphic);
    // drawStyledRect(_x, _y, _w, _h, _hueBack, _sat, _bri, _seed, _cardBackGraphic);
    // drawStyledRect(_x, _y, _w, _h, _hue, _sat, _briBack, _seed, _cardBackGraphic);
    let backTypeRandom = editRandom();


    background(0, 0, 6);
    image(_cardFrontGraphic, 0, 0);
    await sleep(FRAME_AWAIT_TIME);
  }

  // draw on graphic display
  _cardGraphicDisplayLayer.image(_cardFrontGraphic, 0, 0);

  // // remove
  // for (let i = 0; i < rectDatas.length; i++) {
  //   _cardGraphicDisplayLayer.erase();
  //   _cardGraphicDisplayLayer.rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
  //   _cardGraphicDisplayLayer.noErase();

  //   cards[i].getCardGraphic();
  //   cards[i].drawFront();

  //   background(0, 0, 6);
  //   image(_cardGraphicDisplayLayer, 0, 0);
  //   image(_frontLayer, 0, 0);
  //   // rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
  //   await sleep(FRAME_AWAIT_TIME);
  // }

  // // fold after
  for (let i = 0; i < cards.length; i++) {
    _cardGraphicDisplayLayer.erase();
    _cardGraphicDisplayLayer.rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
    _cardGraphicDisplayLayer.noErase();

    cards[i].getCardGraphic();
    cards[i].drawFront();

    cards[i].cropCard(editRandom(0.2, 0.8), editRandom(0.2, 0.8));
    cards[i].removeCroppedFront();
    cards[i].drawBack();

    if (bgTransparent) {
      clear();
    }
    else {
      background(0, 0, 6);
    }

    image(_cardGraphicDisplayLayer, 0, 0);
    image(_frontLayer, 0, 0);
    image(_backLayer, 0, 0);
    await sleep(30);
  }

  // await sleep(2000);
  // window.location.reload();
  triggerPreview();
}

function subdivideRect(_x, _y, _w, _h, _m1) {
  let minSize = 200 - _m1 * 150; // 200 to 50
  let splitProb = 0.4 + _m1 * 0.55; // 0.4 to 0.95
  let isSplit = editRandom() < splitProb;

  if (_w < minSize || _h < minSize)
    isSplit = false;

  if (isSplit) {
    let splitRatio = editRandom(0.2, 0.8);
    let isSplitLeftRight = (_w > _h);

    // split left right
    if (isSplitLeftRight) {
      let rectAs = subdivideRect(_x, _y, _w * splitRatio, _h, _m1);
      let rectBs = subdivideRect(_x + _w * splitRatio, _y, _w * (1 - splitRatio), _h, _m1);
      return rectAs.concat(rectBs);
    }
    // split top bottom
    else {
      let rectAs = subdivideRect(_x, _y, _w, _h * splitRatio, _m1);
      let rectBs = subdivideRect(_x, _y + _h * splitRatio, _w, _h * (1 - splitRatio), _m1);
      return rectAs.concat(rectBs);
    }
  }
  else {
    return [new RectData(_x, _y, _w, _h)];
  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function keyPressed(e) {
  if (e.key == 's') {
    save("folding-" + randomSeedEditArt + ".png");
  }
}