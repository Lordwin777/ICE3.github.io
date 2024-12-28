let isComparing = false;
let compareCanvas;

document.getElementById('compare-button').addEventListener('click', () => {
    isComparing = !isComparing;
    document.getElementById('right-canvas').style.display = isComparing ? 'block' : 'none';
    document.getElementById('left-canvas').style.width = isComparing ? '50%' : '100%';

    if (isComparing) {
        // Create compare canvas if it doesn't exist
        if (!compareCanvas) {
            const compareSketchHolder = document.getElementById('compare-sketch-holder');
            const canvasWidth = compareSketchHolder.offsetWidth;
            const canvasHeight = compareSketchHolder.offsetHeight;
            compareCanvas = createCanvas(canvasWidth, canvasHeight);
            compareCanvas.parent('compare-sketch-holder');
        }
    } else {
        // Resize original canvas to full width if not comparing
        resizeCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
    }
});

function draw() {
    if (!isAnimating || bitSequence.length === 0) {
        // If animation is paused or there's no input, keep the canvas blank and still
        background(255);
        return;
    }

    background(255);
    stroke(0);
    strokeWeight(2);

    const bitWidth = 50;
    const height = 200;
    const yCenter = height / 2;

    // Draw x and y axes
    line(0, yCenter, width, yCenter);
    line(0, 0, 0, height);

    // Draw bit sequence
    textSize(12);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < bitSequence.length; i++) {
        fill(i === Math.floor((frameCount * speed % width) / bitWidth) ? 'red' : 'black');
        text(bitSequence[i].toString(), i * bitWidth + bitWidth / 2, 20);
    }

    // Draw waveform with smooth transitions
    noFill();
    stroke(0, 0, 255); // Blue color for waveform
    strokeWeight(2);

    beginShape();
    for (let x = 0; x < width; x++) {
        const bitIndex = Math.floor(x / bitWidth);
        const bit = bitSequence[bitIndex % bitSequence.length];
        const withinBit = x % bitWidth;
        let y = yCenter;

        switch (encoding) {
            case 'polar-nrz':
                y = bit === 1 ? yCenter - 50 : yCenter + 50;
                break;
            case 'polar-rz':
                y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter) : yCenter;
                break;
            case 'unipolar-nrz':
                y = bit === 1 ? yCenter - 50 : yCenter;
                break;
            case 'unipolar-rz':
                y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter) : yCenter;
                break;
            case 'manchester':
                y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter + 50) : (withinBit < bitWidth / 2 ? yCenter + 50 : yCenter - 50);
                break;
            case 'biphase-manchester':
                y = withinBit < bitWidth / 2
                    ? (bit === 1 ? yCenter - 50 : yCenter + 50)
                    : (bit === 1 ? yCenter + 50 : yCenter - 50);
                break;
            case 'bipolar-nrz':
                y = bit === 1 ? (bitIndex % 2 === 0 ? yCenter - 50 : yCenter + 50) : yCenter;
                break;
            case 'bipolar-rz':
                y = bit === 1 ? (withinBit < bitWidth / 2 ? (bitIndex % 2 === 0 ? yCenter - 50 : yCenter + 50) : yCenter) : yCenter;
                break;
        }

        vertex(x, y);
    }
    endShape();

    // Move the waveform
    translate(-frameCount * speed % bitWidth, 0);

    // Draw the waveform on the compare canvas if comparing
    if (isComparing) {
        compareCanvas.clear();
        compareCanvas.background(255);
        compareCanvas.stroke(0);
        compareCanvas.strokeWeight(2);

        // Draw x and y axes on compare canvas
        compareCanvas.line(0, yCenter, width, yCenter);
        compareCanvas.line(0, 0, 0, height);

        // Draw bit sequence on compare canvas
        compareCanvas.textSize(12);
        compareCanvas.textAlign(CENTER, CENTER);
        for (let i = 0; i < bitSequence.length; i++) {
            compareCanvas.fill(i === Math.floor((frameCount * speed % width) / bitWidth) ? 'red' : 'black');
            compareCanvas.text(bitSequence[i].toString(), i * bitWidth + bitWidth / 2, 20);
        }

        // Draw waveform with smooth transitions on compare canvas
        compareCanvas.noFill();
        compareCanvas.stroke(0, 0, 255); // Blue color for waveform
        compareCanvas.strokeWeight(2);

        compareCanvas.beginShape();
        for (let x = 0; x < width; x++) {
            const bitIndex = Math.floor(x / bitWidth);
            const bit = bitSequence[bitIndex % bitSequence.length];
            const withinBit = x % bitWidth;
            let y = yCenter;

            switch (encoding) {
                case 'polar-nrz':
                    y = bit === 1 ? yCenter - 50 : yCenter + 50;
                    break;
                case 'polar-rz':
                    y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter) : yCenter;
                    break;
                case 'unipolar-nrz':
                    y = bit === 1 ? yCenter - 50 : yCenter;
                    break;
                case 'unipolar-rz':
                    y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter) : yCenter;
                    break;
                case 'manchester':
                    y = bit === 1 ? (withinBit < bitWidth / 2 ? yCenter - 50 : yCenter + 50) : (withinBit < bitWidth / 2 ? yCenter + 50 : yCenter - 50);
                    break;
                case 'biphase-manchester':
                    y = withinBit < bitWidth / 2
                        ? (bit === 1 ? yCenter - 50 : yCenter + 50)
                        : (bit === 1 ? yCenter + 50 : yCenter - 50);
                    break;
                case 'bipolar-nrz':
                    y = bit === 1 ? (bitIndex % 2 === 0 ? yCenter - 50 : yCenter + 50) : yCenter;
                    break;
                case 'bipolar-rz':
                    y = bit === 1 ? (withinBit < bitWidth / 2 ? (bitIndex % 2 === 0 ? yCenter - 50 : yCenter + 50) : yCenter) : yCenter;
                    break;
            }

            compareCanvas.vertex(x, y);
        }
        compareCanvas.endShape();

        // Move the waveform on compare canvas
        compareCanvas.translate(-frameCount * speed % bitWidth, 0);
    }
}
