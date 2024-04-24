
class Particle {
    constructor(side) {
        // Don't set x and y here, as width and height are not available yet
        this.initialSide = side; // Store the initial side
        this.targetX = 0; // Will be set in setup
        this.targetY = 0; // Will be set in setup
        this.size = 20;
        this.side = side;
        this.dayOfYear = null; // Add this property
        this.isSelected = false; // Add this property
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
        this.dayOfYear = index + 1; // Assign the day of the year based on index
    }
    
    // Call this in draw to move particle towards targetX and targetY
    moveToTarget() {
        // Adjust speed as necessary
        let speed = this.isArranged ? 0.05 : 0.01; // Faster speed when arranging
        this.x = lerp(this.x, this.targetX, speed);
        this.y = lerp(this.y, this.targetY, speed);
    }
    
    scatter() {
        // Don't scatter if this particle is the selected one
        if (this.isSelected) {
            return;
        }
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

    isMouseOver() {
        const d = dist(mouseX, mouseY, this.x, this.y);
        return d < this.size / 2;
    }

    clicked() {
        if (this.isMouseOver() && this.isArranged && !popupActive) {
            this.isSelected = true; // Set this particle as selected
            selectedParticle = this; // Reference this particle globally
            showPopup(this.dayOfYear);

            // Scatter all other particles
            particles.forEach(p => {
                if (p !== this) {
                    p.scatter();
                }
            });
        }
    }

    display() {
        // Increase size if mouse is over the particle and it's arranged
        //noStroke();
        if (this.isMouseOver() && this.isArranged) {
            fill(255); // Optional: Change color to indicate hover
            noStroke();
            ellipse(this.x, this.y, this.size * 1.2); // Increase the size by 20%
        } else {
            fill(255);
            noStroke();
            ellipse(this.x, this.y, this.size);
        }
    }
}