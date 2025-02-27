const texts = document.querySelector('.texts');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = true;

let isStopped = false;

recognition.addEventListener('result', (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();

    if (transcript === "stop") {
        isStopped = true;
        recognition.stop();
        texts.innerText = "Microphone stopped";
        console.log("Microphone stopped");
        return;
    }

    if (transcript === "scroll down") {
        window.scrollBy({ top: 2000, behavior: "smooth" });
        console.log("Scrolled down");
        return;
    }

    if (transcript === "scroll up") {
        window.scrollBy({ top: -2000, behavior: "smooth" });
        console.log("Scrolled up");
        return;
    }

    // Navigation Commands
    const sections = {
        "team details": "#team-details",
        "problem statement": "#problem-statement",
        "project description": "#project-description",
        "solution proposed": "#solution-proposed",
        "architecture": "#architecture",
        "frontend": "#frontend",
        "backend": "#backend",
        "workflow": "#workflow",
        "advantages": "#advantages",
        "constraints": "#constraints",
        "video": "#video"
    };

    // Handle navigation
    if (sections[transcript]) {
        window.location.href = sections[transcript]; 
        console.log(`Navigated to ${transcript}`);
        return;
    }

    // Handle expanding/collapsing details sections
    Object.keys(sections).forEach((key) => {
        if (transcript === `expand ${key}`) {
            const detailsElement = document.querySelector(sections[key]);
            if (detailsElement && detailsElement.tagName.toLowerCase() === "details") {
                detailsElement.open = true;
                console.log(`Expanded ${key}`);

                // Expand all nested <details> inside the section
                const nestedDetails = detailsElement.querySelectorAll("details");
                nestedDetails.forEach((detail) => {
                    detail.open = true;
                });
            }
        }
        if (transcript === `collapse ${key}`) {
            const detailsElement = document.querySelector(sections[key]);
            if (detailsElement && detailsElement.tagName.toLowerCase() === "details") {
                detailsElement.open = false;
                console.log(`Collapsed ${key}`);

                // Collapse all nested <details> inside the section
                const nestedDetails = detailsElement.querySelectorAll("details");
                nestedDetails.forEach((detail) => {
                    detail.open = false;
                });
            }
        }
    });

    texts.innerText = transcript;
    console.log(transcript);
});

// Restart recognition unless manually stopped
recognition.addEventListener('end', () => {
    if (!isStopped) {
        recognition.start();
    }
});

// Start speech recognition
recognition.start();
