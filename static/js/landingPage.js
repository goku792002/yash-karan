window.onload = function() {
    var date = new Date();
    var monthNames = [
        "Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var dateString = monthNames[monthIndex] + " " + day + ", " + year;
    document.getElementById("current-date").innerHTML = dateString;
};

function fetchRandomThought() {
    fetch('/random_thought')
      .then(response => response.json())
      .then(data => {
        const randomThoughtEl = document.getElementById('random-thought');
        randomThoughtEl.innerHTML = ''; // Clear the current content
  
        // Split the text into words
        const words = data.thought.split(' ');
  
        // Calculate the total animation time
        const animationDuration = 1; // Duration of each word's animation
        const staggerDelay = 0.2; // Delay between each word's animation
        const totalAnimationTime = (words.length - 1) * staggerDelay + animationDuration;
  
        // Create a span for each word and append to the container
        words.forEach((word, index) => {
          const wordSpan = document.createElement('span');
          wordSpan.textContent = word + ' '; // Add space after the word
          randomThoughtEl.appendChild(wordSpan);
  
          // Animate each word span to unblur
          gsap.fromTo(wordSpan, 
            { opacity: 0.2, filter: 'blur(5px)' }, // Starting properties
            { // Ending properties
              opacity: 0.8, 
              filter: 'blur(0.5px)',
              duration: animationDuration,
              delay: index * staggerDelay, // Stagger the animation of each word
              ease: "power2.out"
            }
          );
        });
  
        // Schedule the next fetch after the entire text has been animated
        setTimeout(fetchRandomThought, (totalAnimationTime + 10) * 1000); // 10 seconds after the animation ends
      })
      .catch(error => console.error('Error fetching thought:', error));
  }
  
  // Initial call to fetch a random thought
  fetchRandomThought();