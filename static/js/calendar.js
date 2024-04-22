let particles = [];
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

function draw() {
    background('#9AADAF');
    for (let i = 0; i < particles.length; i++) {
        particles[i].moveToTarget();
        particles[i].display();
    }
}

function mouseMoved() {
    // Calculate central area
    let centralArea = { x: width * 0.25, y: 0, w: width * 0.5, h: height  };
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

// Define the Particle class
class Particle {
    constructor(side) {
        // Don't set x and y here, as width and height are not available yet
        this.initialSide = side; // Store the initial side
        this.targetX = 0; // Will be set in setup
        this.targetY = 0; // Will be set in setup
        this.size = 20;
        this.side = side;
    }

    arrange(index) {
        const cols = 7; // 7 days a week
        const cellWidth = width * 0.02;
        const cellHeight = height * 0.03;
        const startX = width * 0.35; // Starting X position
        const startY = height * 0.3; // Starting Y position, adjusted to be under the headline
        const blockSpacingX = width * 0.03; // Additional space between month blocks on X
        const blockSpacingY = height * 0.04; // Additional space between month blocks on Y
    
        let dayCounter = 0;
        let monthIndex = 0;
        let dayOfMonth = 0;
    
        // Calculate the day's month and index within the month
        for (let m = 0; m < months.length; m++) {
            dayCounter += months[m].days;
            if (index < dayCounter) {
                monthIndex = m;
                dayOfMonth = index - (dayCounter - months[m].days);
                break;
            }
        }
    
        let monthRow = Math.floor(monthIndex / 2);
        let monthCol = monthIndex % 2;
        let col = dayOfMonth % cols;
        let row = Math.floor(dayOfMonth / cols);
    
        // Calculate the target X and Y for the particle
        this.targetX = startX + (monthCol * (cols * cellWidth + blockSpacingX)) + (col * cellWidth);
        this.targetY = startY + (monthRow * (Math.ceil(months[0].days / cols) * cellHeight + blockSpacingY)) + (row * cellHeight);
        this.isArranged = true;
    }
    
    // Call this in draw to move particle towards targetX and targetY
    moveToTarget() {
        // Adjust speed as necessary
        let speed = this.isArranged ? 0.05 : 0.01; // Faster speed when arranging
        this.x = lerp(this.x, this.targetX, speed);
        this.y = lerp(this.y, this.targetY, speed);
    }
    
    scatter() {
        // Define target positions based on the initial side
        if (this.initialSide === 'left') {
            this.targetX = random(width * 0.1); // Target X for left side
        } else {
            this.targetX = random(width * 0.9, width); // Target X for right side
        }
        this.targetY = random(height); // Target Y can be anywhere vertically
        // Add a flag to indicate the particle is scattered
        this.isArranged = false;
    }
    display() {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}