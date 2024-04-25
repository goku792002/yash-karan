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

// Function to calculate the necessary canvas height
function calculateCanvasHeight() {
    const cols = 7; // 7 days a week
    const cellWidth = width * 0.02;
    const cellHeight = 15;
    const blockSpacingX = width * 0.02; // Horizontal space between month blocks
    const blockSpacingY = height * 0.03; // Vertical space between month blocks

    let totalHeight = 0;
    let maxWidth = 0;

    // Calculate the required height and the maximum width of a month block
    for (let m = 0; m < months.length; m++) {
        let rows = Math.ceil(months[m].days / cols);
        let monthHeight = rows * cellHeight; // Use cellHeight here
        totalHeight += monthHeight;

        // Add space between month blocks except after the last one
        if (m < months.length - 1) {
            totalHeight += blockSpacingY;
        }

        let monthWidth = cols * cellWidth;
        maxWidth = max(maxWidth, monthWidth);
    }

    // Add some top and bottom padding to the total height
    totalHeight += 2 * blockSpacingY; // For example, add space at the top and bottom

    // Now ensure the canvas width fits the largest month block, if it's not already larger
    let necessaryWidth = maxWidth + 2 * blockSpacingX; // Add some padding on the sides
    if (width < necessaryWidth) {
        // Adjust the canvas width here or ensure your canvas setup handles this case
        console.log("Canvas width is too small to fit the largest month block.");
    }

    return totalHeight + 100;

}



function setup() {
    let canvasHeight = calculateCanvasHeight(); // Function to determine the required height
    createCanvas(windowWidth, canvasHeight); 
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
  }



function windowResized() {
    let canvasHeight = calculateCanvasHeight();
    resizeCanvas(windowWidth, canvasHeight);
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
        particles.forEach(particle => {
            if (particle != selectedParticle) {
                particle.moveToTarget();
            }
            particle.display();
        })
        fill(0, 0, 0, 127);
        rect(0, 0, width, height);
        
        //selectedParticle.display();  // Ensure selected particle is visible on top of overlay
    }
}


function hidePopup() {
    document.getElementById('popup').style.display = 'none'; // Hide the popup
    popupActive = false; // Set the popup as inactive
    if (selectedParticle) {
        selectedParticle.isSelected = false;
        selectedParticle = null;
    }
    mouseMoved(); // Update particles based on mouse position
}

function showPopup(dayOfYear) {
    let popupText = document.getElementById('popup-text');
    popupText.innerHTML = 'Day of Year: ' + dayOfYear; // Set the content of the popup
    document.getElementById('popup').style.display = 'block'; // Show the popup
    popupActive = true; // Set the popup as active
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
    if (popupActive) return; // Ignore mouse moves if a popup is active
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
