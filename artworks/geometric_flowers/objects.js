class NYColor {
    constructor(_h, _s, _b, _a = 1.0) {
        this.hue = _h;
        this.sat = _s;
        this.bri = _b;

        this.r = 0;
        this.g = 0;
        this.b = 0;

        this.a = _a;
    }

    copy() {
        return new NYColor(this.hue, this.sat, this.bri, this.a);
    }

    slightRandomize(_hDiff = 10, _sDiff = 12, _bDiff = 12, _aDiff = 0.0) {
        this.hue += random(-0.5 * _hDiff, 0.5 * _hDiff);
        this.sat += random(-0.5 * _sDiff, 0.5 * _sDiff);
        this.bri += random(-0.5 * _bDiff, 0.5 * _bDiff);
        this.a += random(-0.5 * _aDiff, 0.5 * _aDiff);

        this.hue = processHue(this.hue);
    }

    processHsbValues () {
        let hsbValues = rgbToHsb(this.r, this.g, this.b);
        
        this.hue = hsbValues.h;
        this.sat = hsbValues.s;
        this.bri = hsbValues.b;
    }

    processRgbValues () {
        let rgbValues = hsbToRgb(this.hue, this.sat, this.bri);
        
        this.r = rgbValues.r;
        this.g = rgbValues.g;
        this.b = rgbValues.b;
    }

    color() {
        return color(this.hue, this.sat, this.bri, this.a);
    }

    static newRandomColor(_mainHue) {
        let _hue = processHue(_mainHue + random(-80, 80));
        let _sat = random(40, 100);
        let _bri = random(60, 100);

        return new NYColor(_hue, _sat, _bri);
    }

    static lerpHSB (_colorA, _colorB, _t) {
        return NYLerpColor(_colorA, _colorB, _t);
    }

    static lerpRGB (_colorA, _colorB, _t) {
        let resultColor = _colorA.copy();
        
        _colorA.processRgbValues();
        _colorB.processRgbValues();
        
        resultColor.r = lerp(_colorA.r, _colorB.r, _t);
        resultColor.g = lerp(_colorA.g, _colorB.g, _t);
        resultColor.b = lerp(_colorA.b, _colorB.b, _t);
        resultColor.processHsbValues();
        
        return resultColor;
    }
}

class WalkPoint {
    constructor(_x, _y, _startAngle) {
        this.x = _x;
        this.y = _y;
        this.startAngle = _startAngle;
        this.angle = this.startAngle;
        this.stepLength = 1;
    }

    step () {
        this.x += sin(radians(this.angle)) * this.stepLength;
        this.y -= cos(radians(this.angle)) * this.stepLength;
    }

    draw () {
        point(this.x, this.y);
    }
}

class NoiseSystem {
    constructor(_options = {}) {
        let defaultOption = {
            xStart: random(-10000, 10000),
            yStart: random(-10000, 10000),
            zStart: random(-10000, 10000),
            xScale: 0.01,
            yScale: 0.01,
            zScale: 0.01,
        }

        optionOverride(defaultOption, _options);
        
        this.xStart = defaultOption.xStart;
        this.yStart = defaultOption.yStart;
        this.zStart = defaultOption.zStart;
        this.xScale = defaultOption.xScale;
        this.yScale = defaultOption.yScale;
        this.zScale = defaultOption.zScale;
    }

    getNoise(_x, _y = 0, _z = 0) {
        return noise(this.xStart + _x * this.xScale, this.yStart + _y * this.yScale, this.zStart + _z * this.zScale);
    }
}

class CircluarNoiseSystem {
    constructor(_options = {})
    {
        let o = {
            noiseX: random(-10000, 10000),
            noiseY: random(-10000, 10000),
            noiseZ: random(-10000, 10000),
            noiseScaleX: 0.01,
            noiseScaleY: 0.01,
        }

        optionOverride(o, _options);

        this.noiseX = o.noiseX;
        this.noiseY = o.noiseY;
        this.noiseZ = o.noiseZ;
        this.noiseScaleX = o.noiseScaleX;
        this.noiseScaleY = o.noiseScaleY;
    }

    getNoise(_angle, _radius = 100) {
        let sampleX = this.noiseX + sin(radians(_angle)) * _radius * this.noiseScaleX;
        let sampleY = this.noiseY + cos(radians(_angle)) * _radius * this.noiseScaleY;

        let noiseValue = noise(sampleX, sampleY, this.noiseZ);
        return noiseValue;
    }
}