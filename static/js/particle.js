
class Particle {
    constructor(id) {
        this.id = id;  // Unique identifier for the particle
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.size = 15;
        this.currentSize = 15;  // Initialize currentSize to match size
        this.dayOfYear = null;
        this.dayOfMonth = null;  // Add this to store day of the month
        this.monthIndex = null;  // Add this to store the index of the month
        this.isSelected = false;
        this.isHovered = false;  // Ensure this is initialized
        this.isArranged = true;  // Assume particles start arranged
    }

    arrange(index) {
        const cols = 7; // 7 days a week
        const cellWidth = width * 0.02;
        const cellHeight = height * 0.03;
        const startX = width * 0.3; // Starting X position, adjusted for 3 months per row
        const startY = height * 0.1; // Starting Y position, adjusted to be under the headline
        const blockSpacingX = width * 0.01; // Reduced space between month blocks on X
        const blockSpacingY = height * 0.03; // Additional space between month blocks on Y
    
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
        this.monthIndex = monthIndex; // Store the month index
        let monthRow = Math.floor(monthIndex / 3); // Now dividing by 3 for three months per row
        let monthCol = monthIndex % 3; // Modulo 3 for three months per row
        let col = dayOfMonth % cols;
        let row = Math.floor(dayOfMonth / cols);
    
        // Calculate the target X and Y for the particle
        this.targetX = startX + (monthCol * (cols * cellWidth + blockSpacingX)) + (col * cellWidth);
        this.targetY = startY + (monthRow * (Math.ceil(months[0].days / cols) * cellHeight + blockSpacingY)) + (row * cellHeight);
        this.isArranged = true;
        this.dayOfYear = index + 1; // Assign the day of the year based on index
        this.dayOfMonth = dayOfMonth + 1; // Store the day of the month
        

        months.forEach(month => {
            month.animate = true;
        });
    }
    
    // Call this in draw to move particle towards targetX and targetY
    moveToTarget() {
        let speed = this.isArranged ? 0.05 : 0.01; // Adjust speed based on whether the particles are arranged
        if (this.isHovered) {
            speed = 0.3; // Increase speed when hovering effect is active
        }
        this.x = lerp(this.x, this.targetX, speed);
        this.y = lerp(this.y, this.targetY, speed);

        // Use Perlin noise for a smoother, more organic motion
        if (!this.isArranged) {
            let noiseScale = 0.1; // Scale factor for the noise input to control smoothness
            // Apply noise-based motion for a continuous natural movement
            this.x += map(noise(this.id + frameCount * noiseScale), 0, 1, -0.5, 0.5);
            this.y += map(noise(this.id + 1000 + frameCount * noiseScale), 0, 1, -0.5, 0.5);
        } else {
            // Handle hover effect for arranged particles
            if (this.isHovered) {
                // Increase the size of the hovered particle
                this.currentSize = lerp(this.currentSize, this.size * 12, 0.05);
                // Push away nearby particles within the same month block
                particles.forEach(p => {
                    if (p.monthIndex === this.monthIndex && p !== this) {
                        let distance = dist(this.x, this.y, p.x, p.y);
                        let effectRange = this.size * 5; // Define the range of the hover effect
                        if (distance < effectRange) {
                            let angle = atan2(p.y - this.y, p.x - this.x);
                            p.targetX += 0.5 * cos(angle); // Push away slightly
                            p.targetY += 0.5 * sin(angle);
                        }
                    }
                });
            } else {
                // Return to normal size when not hovered
                this.currentSize = lerp(this.currentSize, this.size, 0.05);
            }
        }
    }

    scatter() {
        let angleStep = TWO_PI / particles.length; // Calculate the angle step for positioning particles in a circle
        let radiusX = width * 0.4; // Set the horizontal radius of the ellipse
        let radiusY = height * 0.3; // Set the vertical radius of the ellipse
        let centerX = width / 2; // Calculate the center X of the ellipse
        let centerY = height / 2; // Calculate the center Y of the ellipse
    
        for (let i = 0; i < particles.length; i++) {
            let angle = i * angleStep; // Calculate the angle for this particle
            let randomRadius = random(0.8, 1.2); // Add randomness to the radius
            let randomAngle = angle + random(-PI / 4, PI / 4); // Add randomness to the angle
            particles[i].targetX = centerX + cos(randomAngle) * radiusX * randomRadius; // Calculate the target X position based on the angle and radius
            particles[i].targetY = centerY + sin(randomAngle) * radiusY * randomRadius; // Calculate the target Y position based on the angle and radius
        }
        months.forEach(month => {
            month.alpha = 0;
            month.animate = false;
        });
        // Add a flag to indicate the particles are scattered
        this.isArranged = false;
    }
    

    isMouseOver() {
        const d = dist(mouseX, mouseY, this.x, this.y);
        this.isHovered = d < this.size / 2 + 5;  // Slightly larger hover area
        return this.isHovered;
    }

    clicked() {
        if (this.isMouseOver() && this.isArranged && !popupActive) {
            this.isSelected = true; // Set this particle as selected
            selectedParticle = this; // Reference this particle globally
            showPopup(selectedParticle);

            // Scatter all other particles
            particles.forEach(p => {
                if (p !== this) {
                    p.scatter();
                }
            });
        }
    }

    display() {
        // Use currentSize to adjust size dynamically
        let targetSize = this.isHovered && this.isArranged ? this.size * 1 : this.size;
        this.currentSize = lerp(this.currentSize, targetSize, 0.1); // Smooth transition in size
    
        // Calculate breathing size based on currentSize for dynamic adjustment
        let breathingSize = this.currentSize + sin(frameCount * 0.05) * 2;
    
        // Define two colors for the breathing effect
        let colorStart = color(210, 230, 240); // Very light cyan
        let colorEnd = color(235, 245, 255); // Soft, light blue
    
        // Interpolate between colors based on the same sine value used for breathing size
        let breatheColor = lerpColor(colorStart, colorEnd, (sin(frameCount * 0.05) + 1) / 2);
    
        // Set up the drawing context based on whether the particle is arranged or scattered
        if (this.isArranged) {
            noStroke();
            fill(breatheColor);
            ellipse(this.x, this.y, breathingSize);
            if (this.isHovered) {
                console.log(this.monthIndex);
                push();  // Save the current drawing settings
                fill('#557474');  // Black text
                textSize(20);  // Small text size that fits on the particle
                textAlign(CENTER, CENTER);  // Center the text on the particle's coordinates
                text(this.dayOfMonth, this.x, this.y);  // Draw the day of the month
                pop();  // Restore the previous drawing settings
            }
        } else {
            // Smoky and blurred style for scattered particles
            let blurAmount = 5; // Adjust the blur amount as needed
            drawingContext.shadowBlur = blurAmount;
            drawingContext.shadowColor = color(breatheColor);
            fill(breatheColor);
            ellipse(this.x, this.y, breathingSize);
        }
    }
}