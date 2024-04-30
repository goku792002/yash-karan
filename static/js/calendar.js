let particles = [];
let popup;
let popupActive = false; // Define this at the top of your scrip
let selectedParticle = null;


const months = [
    { days: 31, even: false, name: 'Jan',alpha: 0, animate: false }, // January
    { days: 28, even: true, name: 'Feb', alpha: 0, animate: false },  // February
    { days: 31, even: false, name: 'Mar', alpha: 0, animate: false },  // March
    { days: 30, even: true, name: 'Apr', alpha: 0, animate: false },  // April
    { days: 31, even: false, name: 'May', alpha: 0, animate: false },  // May
    { days: 30, even: true, name: 'Jun', alpha: 0, animate: false },  // June
    { days: 31, even: false, name: 'Jul', alpha: 0, animate: false },  // July
    { days: 31, even: true, name: 'Aug', alpha: 0, animate: false },  // August
    { days: 30, even: false, name: 'Sep', alpha: 0, animate: false },  // September
    { days: 31, even: true, name: 'Oct', alpha: 0, animate: false },  // October
    { days: 30, even: false, name: 'Nov', alpha: 0, animate: false },  // November
    { days: 31, even: true, name: 'Dec', alpha: 0, animate: false },  // Decemeber
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

    const centerX = width / 2;
    const centerY = (height / 2) - 100;
    const radiusX = width * 0.4;
    const radiusY = height * 0.3;
    const angleStep = TWO_PI / 365;

    // Create particles for each day of the year
    for (let i = 0; i < 365; i++) {
        let angle = angleStep * i;
        let particle = new Particle(i); // Assume constructor now accepts an ID

        // Assign initial positions based on an ellipse
        particle.x = centerX + radiusX * cos(angle) + random(-10, 10);
        particle.y = centerY + radiusY * sin(angle) + random(-10, 10);

        // Initial target is the same as initial position
        particle.targetX = particle.x;
        particle.targetY = particle.y;

        particles.push(particle);
    }
}

function windowResized() {
    let canvasHeight = calculateCanvasHeight();
    resizeCanvas(windowWidth, canvasHeight);
}

function showMonthTitles() {
    textSize(16); // Set the text size
    textAlign(LEFT, TOP); // Align text to the top left


    for (let i = 0; i < months.length; i++) {
        const month = months[i];

        if (month.animate && month.alpha < 255) {
            month.alpha += 5; // Increment the alpha for the fade-in effect
        }

        const cols = 7; // Assuming 7 columns for the days of the week
        const cellWidth = width * 0.02;
        const cellHeight = height * 0.03;
        const startX = width * 0.3; // Starting X position, adjusted for 3 months per row
        const startY = height * 0.2; // Starting Y position, adjusted to be under the headline
        const blockSpacingX = width * 0.01; // Space between month blocks on X
        const blockSpacingY = height * 0.03; // Space between month blocks on Y

        let monthRow = Math.floor(i / 3); // Now dividing by 3 for three months per row
        let monthCol = i % 3; // Modulo 3 for three months per row

        // The month names should appear above the first row of particles
        // If your text size is bigger or you want more space above the grid, 
        // you might need to subtract more from `y`.
        let x =  -7 + startX + monthCol * (cols * cellWidth + blockSpacingX);
        let y = -105 + startY + monthRow * (Math.ceil(months[0].days / cols) * cellHeight + blockSpacingY) - cellHeight ; // Adjust this if needed

        // Animate the alpha for a fade-in effect
        // if (month.alpha < 255) {
        //     month.alpha += 1; // Control the fade-in speed here
        // }

        fill(255, 255, 255, month.alpha);
        noStroke();
        text(month.name, x, y);
    }
}

function draw() {
    background('#9AADAF');
    particles.forEach(particle => {
        // Update hover state for each particle
        particle.isMouseOver();

        // Move particle towards its target if the popup is not active or it is the selected particle
        if (!popupActive || particle === selectedParticle) {
            particle.moveToTarget();
        }

        // Display each particle
        particle.display();
    });

    // Handle the popup overlay if a popup is active
    if (popupActive) {
        // Darken the background for the popup
        // fill(0, 0, 0, 127);
        // rect(0, 0, width, height);

        // Redisplay the particles, ensuring interaction if not the selected one
        particles.forEach(particle => {
            if (particle !== selectedParticle) {
                particle.moveToTarget();
            }
            particle.display();
        });

        // Ensure selected particle is visible on top of overlay, if needed
        if (selectedParticle) {
            selectedParticle.display();
        }
    }

    if (allParticlesArranged()) {
        showMonthTitles();
    } else {
        // Optionally, when particles are not arranged, you could decrease the alpha to make them fade out.
        months.forEach(month => {
            if (month.alpha > 0) {
                month.alpha -= 5; // Decrement for fade-out effect
            }
        });
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

function allParticlesArranged() {
    // Return true if all particles are in their target positions
    // This is a placeholder; you'll have to implement this based on your own logic
    return particles.every(p => p.isArranged);
}