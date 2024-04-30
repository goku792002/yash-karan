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

    wrapWords();
    initUnblurOnHover();
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
  // fetchRandomThought();

function wrapWords() {
  const thoughts = document.querySelectorAll('.weekly-thought');
  
  thoughts.forEach(thought => {
    let newHTML = '';
    // Split the text content into words
    thought.childNodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        let words = node.nodeValue.split(' ');
        newHTML += words.map(word => `<span class="word">${word}</span> `).join('');
      } else if (node.nodeType === 1) { // Element node (e.g., .highlight)
        newHTML += node.outerHTML;
      }
    });
    thought.innerHTML = newHTML;
  });
}

  // Function to handle blur effect on hover
  function initUnblurOnHover() {
    const words = document.querySelectorAll('.weekly-thought .word');
  
    words.forEach(word => {
      word.addEventListener('mouseenter', () => {
        gsap.to(word, { filter: 'blur(0px)', duration: 0.5 });
        gsap.to(word, { opacity: 1, duration: 0.5 });
      });
    });
  }
  

  document.addEventListener("DOMContentLoaded", function() {
    var sidebar = document.getElementById("sidebar");
    var discoverBar = document.getElementById("discover-bar");
    var categories = document.querySelectorAll('#sidebar > .category:not(#discover-bar)');

    // Function to expand the sidebar and show "Discover yourself"
    function resetToDiscover() {
        categories.forEach(function(category) {
            category.style.display = "block"; // Show all categories
        });
        discoverBar.textContent = "Discover yourself"; // Reset the text
        discoverBar.classList.add('medium-headline-regular');
        discoverBar.classList.add('default'); // Add 'default' class back
        sidebar.classList.add("expanded"); // Expand the sidebar
    }

    // Set the event listener on the discover bar to reset to the initial state
    discoverBar.addEventListener("click", function() {
        if (!sidebar.classList.contains("expanded") || !this.classList.contains('default')) {
            resetToDiscover();
        }
    });

    // Set the event listener on each category
    categories.forEach(function(category) {
        category.addEventListener('click', function() {
            if (sidebar.classList.contains("expanded")) {

                // get background color for selected category
                var bgColor = window.getComputedStyle(category).backgroundColor;

                // Update the discover bar text and hide the clicked category
                discoverBar.textContent = this.textContent;
                // sidebar.style.paddingRight = "30px";
                sidebar.style.backgroundColor = bgColor;
                discoverBar.classList.remove('default'); // Remove 'default' class
                this.style.display = "none"; // Hide the clicked category
                sidebar.classList.remove("expanded"); // Collapse the sidebar
            }
        });
    });
});
