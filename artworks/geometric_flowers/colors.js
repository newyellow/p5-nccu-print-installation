function getColorSettingFromM0(m0) {
    let sets = [];

    // 0: Mono (0.00 - 0.05)
    sets.push({
        mainColorA: new NYColor(0, 0, 10),
        mainColorB: new NYColor(0, 0, 60),
        subColorA: new NYColor(0, 0, 90),
        subColorB: new NYColor(0, 0, 100),
        normalColor: new NYColor(0, 0, 100),
        stickColorA: new NYColor(0, 0, 100),
        stickColorB: new NYColor(0, 0, 98),
    });

    // 1: Sunset (0.05 - 0.10)
    sets.push({
        mainColorA: new NYColor(10, 80, 90),
        mainColorB: new NYColor(30, 90, 100),
        subColorA: new NYColor(340, 70, 80),
        subColorB: new NYColor(50, 100, 100),
        normalColor: new NYColor(60, 20, 100),
        stickColorA: new NYColor(20, 60, 40),
        stickColorB: new NYColor(40, 80, 20),
    });

    // 2: Forest (0.10 - 0.15)
    sets.push({
        mainColorA: new NYColor(193, 89, 92),
        mainColorB: new NYColor(236, 78, 26),
        subColorA: new NYColor(230, 50, 90),
        subColorB: new NYColor(140, 90, 80),
        normalColor: new NYColor(100, 30, 90),
        stickColorA: new NYColor(30, 40, 30),
        stickColorB: new NYColor(20, 50, 20),
    });

    // 3: Ocean (0.15 - 0.20)
    sets.push({
        mainColorA: new NYColor(200, 80, 80),
        mainColorB: new NYColor(220, 90, 60),
        subColorA: new NYColor(180, 70, 90),
        subColorB: new NYColor(240, 100, 40),
        normalColor: new NYColor(190, 20, 100),
        stickColorA: new NYColor(210, 50, 30),
        stickColorB: new NYColor(230, 60, 20),
    });

    // 4: Desert (0.20 - 0.25)
    sets.push({
        mainColorA: new NYColor(35, 60, 90),
        mainColorB: new NYColor(45, 80, 80),
        subColorA: new NYColor(25, 70, 70),
        subColorB: new NYColor(55, 40, 95),
        normalColor: new NYColor(40, 10, 100),
        stickColorA: new NYColor(30, 50, 40),
        stickColorB: new NYColor(20, 60, 30),
    });

    // 5: Cyberpunk (0.25 - 0.30)
    sets.push({
        mainColorA: new NYColor(300, 100, 100),
        mainColorB: new NYColor(180, 100, 100),
        subColorA: new NYColor(330, 100, 80),
        subColorB: new NYColor(200, 100, 90),
        normalColor: new NYColor(60, 100, 100),
        stickColorA: new NYColor(280, 100, 40),
        stickColorB: new NYColor(260, 100, 20),
    });

    // 6: Spring (0.30 - 0.35)
    sets.push({
        mainColorA: new NYColor(325, 55, 100),
        mainColorB: new NYColor(140, 40, 100),
        subColorA: new NYColor(330, 30, 95),
        subColorB: new NYColor(120, 30, 95),
        normalColor: new NYColor(60, 10, 100),
        stickColorA: new NYColor(100, 40, 80),
        stickColorB: new NYColor(90, 50, 60),
    });

    // 7: Autumn (0.35 - 0.40)
    sets.push({
        mainColorA: new NYColor(25, 90, 80),
        mainColorB: new NYColor(15, 100, 60),
        subColorA: new NYColor(45, 80, 90),
        subColorB: new NYColor(5, 90, 50),
        normalColor: new NYColor(50, 40, 100),
        stickColorA: new NYColor(20, 70, 30),
        stickColorB: new NYColor(10, 80, 20),
    });

    // 8: Earth (0.40 - 0.45)
    sets.push({
        mainColorA: new NYColor(80, 40, 50),
        mainColorB: new NYColor(40, 50, 60),
        subColorA: new NYColor(100, 30, 40),
        subColorB: new NYColor(30, 60, 40),
        normalColor: new NYColor(60, 20, 80),
        stickColorA: new NYColor(70, 30, 30),
        stickColorB: new NYColor(50, 40, 20),
    });

    // 9: Vintage (0.45 - 0.50)
    sets.push({
        mainColorA: new NYColor(5, 50, 70),
        mainColorB: new NYColor(200, 40, 60),
        subColorA: new NYColor(40, 30, 90),
        subColorB: new NYColor(220, 30, 50),
        normalColor: new NYColor(45, 10, 100),
        stickColorA: new NYColor(30, 20, 40),
        stickColorB: new NYColor(210, 20, 30),
    });

    // 10: Lavender (0.50 - 0.55)
    sets.push({
        mainColorA: new NYColor(270, 40, 90),
        mainColorB: new NYColor(290, 50, 80),
        subColorA: new NYColor(260, 30, 95),
        subColorB: new NYColor(280, 60, 70),
        normalColor: new NYColor(275, 10, 100),
        stickColorA: new NYColor(270, 30, 50),
        stickColorB: new NYColor(280, 40, 40),
    });

    // 11: Candy (0.55 - 0.60)
    sets.push({
        mainColorA: new NYColor(190, 60, 100),
        mainColorB: new NYColor(340, 60, 100),
        subColorA: new NYColor(170, 50, 95),
        subColorB: new NYColor(320, 50, 95),
        normalColor: new NYColor(60, 50, 100),
        stickColorA: new NYColor(180, 40, 80),
        stickColorB: new NYColor(330, 40, 80),
    });

    // 12: Midnight (0.60 - 0.65)
    sets.push({
        mainColorA: new NYColor(240, 80, 30),
        mainColorB: new NYColor(280, 90, 40),
        subColorA: new NYColor(220, 70, 50),
        subColorB: new NYColor(300, 100, 20),
        normalColor: new NYColor(210, 40, 80),
        stickColorA: new NYColor(240, 60, 20),
        stickColorB: new NYColor(260, 70, 10),
    });

    // 13: Tropical (0.65 - 0.70)
    sets.push({
        mainColorA: new NYColor(100, 90, 90),
        mainColorB: new NYColor(20, 90, 100),
        subColorA: new NYColor(120, 80, 80),
        subColorB: new NYColor(40, 100, 100),
        normalColor: new NYColor(60, 30, 100),
        stickColorA: new NYColor(110, 70, 40),
        stickColorB: new NYColor(30, 80, 30),
    });

    // 14: Industrial (0.70 - 0.75)
    sets.push({
        mainColorA: new NYColor(210, 30, 50),
        mainColorB: new NYColor(30, 60, 60),
        subColorA: new NYColor(200, 20, 40),
        subColorB: new NYColor(40, 70, 50),
        normalColor: new NYColor(0, 0, 90),
        stickColorA: new NYColor(210, 40, 30),
        stickColorB: new NYColor(30, 50, 20),
    });

    // 15: Aurora (0.75 - 0.80)
    sets.push({
        mainColorA: new NYColor(150, 100, 100),
        mainColorB: new NYColor(280, 80, 90),
        subColorA: new NYColor(170, 90, 80),
        subColorB: new NYColor(260, 70, 100),
        normalColor: new NYColor(160, 20, 100),
        stickColorA: new NYColor(150, 80, 30),
        stickColorB: new NYColor(270, 60, 20),
    });

    // 16: Berries (0.80 - 0.85)
    sets.push({
        mainColorA: new NYColor(330, 90, 70),
        mainColorB: new NYColor(250, 80, 60),
        subColorA: new NYColor(350, 100, 80),
        subColorB: new NYColor(270, 90, 50),
        normalColor: new NYColor(340, 20, 100),
        stickColorA: new NYColor(320, 70, 30),
        stickColorB: new NYColor(260, 60, 20),
    });

    // 17: Cosmic (0.85 - 0.90)
    sets.push({
        mainColorA: new NYColor(260, 100, 20),
        mainColorB: new NYColor(300, 80, 50),
        subColorA: new NYColor(280, 90, 40),
        subColorB: new NYColor(50, 100, 90),
        normalColor: new NYColor(280, 10, 100),
        stickColorA: new NYColor(260, 100, 10),
        stickColorB: new NYColor(300, 90, 5),
    });

    // 18: Fire (0.90 - 0.95)
    sets.push({
        mainColorA: new NYColor(0, 100, 100),
        mainColorB: new NYColor(40, 100, 100),
        subColorA: new NYColor(20, 90, 90),
        subColorB: new NYColor(60, 100, 100),
        normalColor: new NYColor(50, 30, 100),
        stickColorA: new NYColor(10, 100, 30),
        stickColorB: new NYColor(0, 100, 10),
    });

    // 19: Blue-Purple (Original Set 1) (0.95 - 1.00)
    sets.push({
        mainColorA: new NYColor(260, 100, 60),
        mainColorB: new NYColor(320, 100, 60),
        subColorA: new NYColor(340, 100, 80),
        subColorB: new NYColor(60, 100, 80),
        normalColor: new NYColor(120, 100, 100),
        stickColorA: new NYColor(60, 100, 80),
        stickColorB: new NYColor(280, 100, 30),
    });

    // 21: Red set
    sets.push({
        mainColorA: new NYColor(160, 92, 93),
        mainColorB: new NYColor(198, 80, 100),
        subColorA: new NYColor(351, 86, 80),
        subColorB: new NYColor(0, 97, 98),
        normalColor: new NYColor(60, 0, 100),
        stickColorA: new NYColor(351, 86, 100),
        stickColorB: new NYColor(0, 97, 98),
    });

    // 20: Blue-Purple (Original Set 2) (0.95 - 1.00)
    sets.push({
        mainColorA: new NYColor(269, 80, 100),
        mainColorB: new NYColor(360, 80, 100),
        subColorA: new NYColor(236, 100, 60),
        subColorB: new NYColor(207, 100, 60),
        normalColor: new NYColor(30, 20, 100),
        stickColorA: new NYColor(260, 80, 100),
        stickColorB: new NYColor(66, 60, 100),
    });

    // Calculate index from m0 based on total available sets
    let totalSets = sets.length;
    let bucketSize = 1.0 / totalSets;
    let index = Math.floor(m0 / bucketSize);
    index = Math.min(index, totalSets - 1);
    
    let result = sets[index];

    // Slightly hue shift with the same palette within its range
    let shiftRange = 20;
    let shift = ((m0 % bucketSize) / bucketSize - 0.5) * shiftRange;

    // Apply shift to all hue values except Mono (index 0)
    if (index > 0) {
        result.mainColorA.hue = processHue(result.mainColorA.hue + shift);
        result.mainColorB.hue = processHue(result.mainColorB.hue + shift);
        result.subColorA.hue = processHue(result.subColorA.hue + shift);
        result.subColorB.hue = processHue(result.subColorB.hue + shift);
        result.normalColor.hue = processHue(result.normalColor.hue + shift);
        result.stickColorA.hue = processHue(result.stickColorA.hue + shift);
        result.stickColorB.hue = processHue(result.stickColorB.hue + shift);
    }

    return result;
}

function getRandomColorSetting () {
    // This is now legacy, using m0 instead
    return getColorSettingFromM0(random());
}
