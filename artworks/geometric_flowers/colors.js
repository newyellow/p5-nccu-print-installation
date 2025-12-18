function getRandomColorSetting () {
    let sets = [];

    sets.push({
        mainColorA: new NYColor(260, 100, 60),
        mainColorB: new NYColor(320, 100, 60),
        subColorA: new NYColor(340, 100, 80),
        subColorB: new NYColor(60, 100, 80),
        normalColor: new NYColor(120, 100, 100),
        stickColorA: new NYColor(60, 100, 80),
        stickColorB: new NYColor(280, 100, 30),
    });

    sets.push({
        mainColorA: new NYColor(269, 80, 100),
        mainColorB: new NYColor(360, 80, 100),
        subColorA: new NYColor(236, 100, 60),
        subColorB: new NYColor(207, 100, 60),
        normalColor: new NYColor(30, 20, 100),
        stickColorA: new NYColor(260, 80, 100),
        stickColorB: new NYColor(66, 60, 100),
    });

    sets.push({
        mainColorA: new NYColor(160, 92, 93),
        mainColorB: new NYColor(198, 80, 100),
        subColorA: new NYColor(351, 86, 80),
        subColorB: new NYColor(0, 97, 98),
        normalColor: new NYColor(60, 0, 100),
        stickColorA: new NYColor(351, 86, 100),
        stickColorB: new NYColor(0, 97, 98),
    });

    sets.push({
        mainColorA: new NYColor(0, 0, 10),
        mainColorB: new NYColor(0, 0, 60),
        subColorA: new NYColor(0, 0, 80),
        subColorB: new NYColor(0, 0, 98),
        normalColor: new NYColor(0, 0, 100),
        stickColorA: new NYColor(0, 0, 100),
        stickColorB: new NYColor(0, 0, 98),
    // });
    })

    return random(sets);
    // return sets[0];
}