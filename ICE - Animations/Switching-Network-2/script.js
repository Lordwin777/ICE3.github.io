function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
    background(220);
    drawCircuit();
}

function drawCircuit() {
    stroke(0);
    strokeWeight(2);
    fill(100, 150, 255);
    
    // Draw sender
    rect(50, 150, 80, 40);
    textAlign(CENTER);
    fill(0);
    text("Sender", 90, 175);
    
    // Draw receiver
    rect(270, 150, 80, 40);
    text("Receiver", 310, 175);
    
    // Draw circuit path
    line(130, 170, 270, 170);
    
    // Draw intermediate switches
    for (let i = 1; i <= 3; i++) {
        fill(255, 100, 100);
        rect(130 + (i * 40), 150, 20, 40);
        fill(0);
        text("Switch " + i, 130 + (i * 40) + 10, 175);
    }
}