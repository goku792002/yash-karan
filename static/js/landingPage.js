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

function fetchRandomThought(){
    fetch('/random_thought')
    .then(response => response.json())
    .then(data => {
        document.getElementById('random-thought').textContent = data.thought;
    })
    .catch(error => console.error('Error fetching thought:', error));
}

// Fetch a new thought every 10 seconds
setInterval(fetchRandomThought, 2000);

fetchRandomThought();



