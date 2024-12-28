let currentScreen = 'dashboard';
let binaryInput = '';
let animationSpeed = 1;
let isPlaying = false;
let waveformColor = '#000000'; // Default waveform color
let lineStyle = 'solid';
let overlayOpacity = 0.5;

function setup() {
    createCanvas(800, 200);
    background('#00A2FF');
    noLoop(); // Prevent continuous redrawing
}

function draw() {
    background('#00A2FF'); // Set the background color
    if (isPlaying) {
        generateWaveform();
    }
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        loop(); // Start the drawing loop
    } else {
        noLoop(); // Stop the drawing loop
    }
}

function validateInput() {
    const inputField = document.getElementById('binary-input');
    binaryInput = inputField.value.trim();
    if (/^[01]{1,16}$/.test(binaryInput)) {
        generateWaveform();
    } else {
        showError('Please enter a valid binary sequence (up to 16 bits, only 0s and 1s).');
    }
}

function generateWaveform() {
    switch (currentScreen) {
        case 'polar-nrz':
            drawWaveform(drawPolarNRZ);
            break;
        case 'polar-rz':
            drawWaveform(drawPolarRZ);
            break;
        case 'unipolar-nrz':
            drawWaveform(drawUnipolarNRZ);
            break;
        case 'unipolar-rz':
            drawWaveform(drawUnipolarRZ);
            break;
        case 'manchester':
            drawWaveform(drawManchester);
            break;
        case 'biphase-manchester':
            drawWaveform(drawBiphaseManchester);
            break;
        case 'bipolar-nrz':
            drawWaveform(drawBipolarNRZ);
            break;
        case 'bipolar-rz':
            drawWaveform(drawBipolarRZ);
            break;
        default:
            showError('Invalid encoding scheme selected.');
    }
}

function drawWaveform(drawFunction) {
    clear();
    drawFunction();
}

function drawPolarNRZ() {
    drawLineEncoding((bit) => (bit === '1' ? -100 : 100));
}

function drawPolarRZ() {
    const height = 200;
    const width = 800;
    const bitWidth = width / binaryInput.length;

    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth;

        stroke(waveformColor);
        strokeWeight(2);
        if (bit === '1') {
            line(x, height / 2, x + bitWidth / 2, height / 2 - height / 2);
            line(x + bitWidth / 2, height / 2 - height / 2, x + bitWidth, height / 2);
        } else {
            line(x, height / 2, x + bitWidth, height / 2);
        }
    }
}

function drawUnipolarNRZ() {
    drawLineEncoding((bit) => (bit === '1' ? -100 : 100));
}

function drawUnipolarRZ() {
    const height = 200;
    const width = 800;
    const bitWidth = width / binaryInput.length;

    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth;

        stroke(waveformColor);
        strokeWeight(2);
        if (bit === '1') {
            line(x, height / 2, x, height / 2 - height / 2);
            line(x, height / 2 - height / 2, x + bitWidth, height / 2);
        } else {
            line(x, height / 2, x + bitWidth, height / 2);
        }
    }
}

function drawManchester() {
    const height = 200;
    const width = 800;
    const bitWidth = width / (binaryInput.length * 2);

    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth * 2;

        stroke(waveformColor);
        strokeWeight(2);
        if (bit === '1') {
            line(x, height / 2, x + bitWidth, height / 2);
            line(x + bitWidth, height / 2 - height / 2, x + bitWidth * 2, height / 2);
        } else {
            line(x, height / 2, x + bitWidth, height / 2);
            line(x + bitWidth, height / 2, x + bitWidth * 2, height / 2 - height / 2);
        }
    }
}

function drawBiphaseManchester() {
    const height = 200;
    const width = 800;
    const bitWidth = width / (binaryInput.length * 2);

    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth * 2;

        stroke(waveformColor);
        strokeWeight(2);

        if (bit === '1') {
            line(x, height / 2, x + bitWidth, height / 2 - height / 2);
            line(x + bitWidth, height / 2 - height / 2, x + bitWidth * 2, height / 2);
        } else {
            line(x, height / 2, x + bitWidth, height / 2);
            line(x + bitWidth, height / 2, x + bitWidth * 2, height / 2 - height / 2);
        }
    }
}

function drawBipolarNRZ() {
    const height = 200;
    const width = 800;
    const bitWidth = width / binaryInput.length;

    let lastLevel = 0; // 0: No signal, 1: Positive, -1: Negative
    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth;

        stroke(waveformColor);
        strokeWeight(2);

        if (bit === '1') {
            lastLevel = lastLevel === 1 ? -1 : 1; // Alternate between positive and negative
            line(x, height / 2, x, height / 2 + (lastLevel * height / 2));
        } else {
            line(x, height / 2, x, height / 2); // No signal for '0'
        }
    }
}

function drawBipolarRZ() {
    const height = 200;
    const width = 800;
    const bitWidth = width / binaryInput.length;

    let lastLevel = 0; // 0: No signal, 1: Positive, -1: Negative
    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth;

        stroke(waveformColor);
        strokeWeight(2);

        if (bit === '1') {
            lastLevel = lastLevel === 1 ? -1 : 1; // Alternate between positive and negative
            line(x, height / 2, x, height / 2 + (lastLevel * height / 2)); // First half of the bit
            line(x, height / 2 + (lastLevel * height / 2), x + bitWidth, height / 2); // Second half of the bit
        } else {
            line(x, height / 2, x + bitWidth, height / 2); // No signal for '0'
        }
    }
}

function drawLineEncoding(getY) {
    const height = 200;
    const width = 800;
    const bitWidth = width / binaryInput.length;

    for (let i = 0; i < binaryInput.length; i++) {
        const bit = binaryInput[i];
        const x = i * bitWidth;

        stroke(waveformColor);
        strokeWeight(2);
        line(x, height / 2, x, height / 2 + getY(bit));
    }
}

function showError(message) {
    alert(message);
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const screen = this.getAttribute('data-screen');
        switchScreen(screen);
    });
});

function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screen).classList.add('active');
    currentScreen = screen;
    if (screen !== 'dashboard') {
        setupWaveform(screen);
    }
}

function setupWaveform(screen) {
    clear();
    background(255);
    validateInput();
}

function adjustAnimationSpeed(value) {
    animationSpeed = value;
}

// Event listeners for userInput
document.getElementById('binary-input').addEventListener('input', validateInput);
document.getElementById('overlay-opacity').addEventListener('input', function() {
    overlayOpacity = this.value;
});
document.getElementById('waveform-color').addEventListener('input', function() {
    waveformColor = this.value;
});
document.getElementById('line-style').addEventListener('change', function() {
    lineStyle = this.value;
});

// Initialize the p5.js sketch
setup();