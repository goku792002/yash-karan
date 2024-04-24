let particles = [];
let popup;
let popupActive = false; // Define this at the top of your scrip
let selectedParticle = null;


const months = [
    { days: 31, even: false }, // January
    { days: 28, even: true },  // February
    { days: 31, even: false },  // March
    { days: 30, even: true },  // April
    { days: 31, even: false },  // May
    { days: 30, even: true },  // June
    { days: 31, even: false },  // July
    { days: 31, even: true },  // August
    { days: 30, even: false },  // September
    { days: 31, even: true },  // October
    { days: 30, even: false },  // November
    { days: 31, even: true },  // Decemeber
];

function setup() {  
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    // Create particles for each day of the year
    for (let i = 0; i < 365; i++) {
        let side = i % 2 === 0 ? 'right' : 'left';
        let particle = new Particle(side);
        // Assign initial positions here where width and height are known
        particle.x = side === 'left' ? random(width * 0.1) : random(width * 0.9, width);
        particle.y = random(height);
        particle.targetX = particle.x; // Set the initial target position
        particle.targetY = particle.y;
        particles.push(particle);
    }
    // Create the pop-up element
    popup = createDiv('');
    popup.position(windowWidth / 2, windowHeight / 2);
    popup.size(200, 200); // Set the size of the popup
    popup.style('display', 'none'); // Hide it initially
    popup.style('background-color', 'white');
    popup.style('padding', '20px');
    popup.style('text-align', 'center');
    popup.style('border-radius', '8px');
    popup.style('position', 'fixed');
    popup.style('top', '50%');
    popup.style('left', '50%');
    popup.style('transform', 'translate(-50%, -50%)');
    popup.style('z-index', '100'); // Set a high z-index to make it appear on top
    let closeButton = createButton('Close');
    closeButton.mousePressed(hidePopup);
    popup.child(closeButton);
  }

function draw() {
    background('#9AADAF');
    particles.forEach(particle => {
        if (!popupActive || particle === selectedParticle) {
            particle.moveToTarget();
        }
        particle.display();
    });

    if (popupActive) {
        fill(0, 0, 0, 127);
        rect(0, 0, width, height);
        selectedParticle.display();  // Ensure selected particle is visible on top of overlay
    }
}


function hidePopup() {
    popup.style('display', 'none');
    popupActive = false;

    if (selectedParticle) {
        selectedParticle.isSelected = false;
        selectedParticle = null;
    }
    // React to the current mouse position to either scatter or arrange particles
    mouseMoved();
}

function showPopup(dayOfYear) {
    // Set the content for the pop-up based on the dayOfYear
    popup.html('Day of Year: ' + dayOfYear);
    popup.style('display', 'block');
    popupActive = true;
}

function mouseClicked() {
    if (popupActive) {
      return;  // Ignore clicks if a popup is active
    }
    
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].isMouseOver() && particles[i].isArranged) {
            particles[i].clicked();
            break; // Stop after the first hit to prevent multiple selections
        }
    }
  }

function mouseMoved() {
    if (popupActive) {
        console.log(popupActive);
    return; // Ignore mouse moves if a popup is active
    }
  
    // Calculate central area
    let centralArea = { x: width * 0.25, y: 0, w: width * 0.5, h: height };
    if (mouseX > centralArea.x && mouseX < centralArea.x + centralArea.w &&
        mouseY > centralArea.y && mouseY < centralArea.y + centralArea.h) {
        for (let i = 0; i < particles.length; i++) {
            particles[i].arrange(i); // Arrange the particles into a grid
        }
    } else {
        for (let i = 0; i < particles.length; i++) {
            particles[i].scatter(); // Scatter the particles
        }
    }
  }
