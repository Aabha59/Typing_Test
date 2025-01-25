
const charSets = {
    middle: "asdfghjkl ASDFGHJKL",
    upper: "qwertyuio QWERTYUIO",
    down: "zxcvbnm ZXCVBNM",
    all: "1234567890!@#$%^&*()_+ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz"
};

let currentPrompt = "";
let currentIndex = 0;
let startTime = null;
let correctCharacters = 0;
let wrongCharacters = 0;
let totalWords = 300;
let timerInterval;

function startPractice() {
    const level = document.getElementById("level").value;
    totalWords = parseInt(document.getElementById("word-count").value) || 150;
    correctCharacters = 0;
    wrongCharacters = 0;
    currentIndex = 0;
    startTime = null;

    generatePrompt(level);
    renderPrompt();

    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("practice-screen").style.display = "block";

    document.getElementById("message").textContent = "Start typing...";
    // document.getElementById("wpm-display").textContent = "WPM: 0";

    document.addEventListener("keydown", handleTyping);

    updateStats();
    startTimer();
}

function generatePrompt(level) {
    const charSet = charSets[level];
    const words = [];
    for (let i = 0; i < totalWords; i++) {
        const wordLength = Math.floor(Math.random() * 5) + 3; // Random word length between 3-7
        let word = "";
        for (let j = 0; j < wordLength; j++) {
            const char = charSet[Math.floor(Math.random() * charSet.length)];
            word += char;
        }
        words.push(word);
    }
    currentPrompt = words.join(" ");
}

function renderPrompt() {
    const promptArea = document.getElementById("prompt-area");
    promptArea.innerHTML = "";
    currentPrompt.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.className = "prompt-letter";
        span.dataset.index = index;
        promptArea.appendChild(span);
    });
}

function handleTyping(event) {
    if (["Shift", "CapsLock", "Tab"].includes(event.key)) {
        return; // Ignore these keys
    }

    const promptLetters = document.querySelectorAll(".prompt-letter");

    if (!startTime) {
        startTime = new Date();
    }

    if (event.key === "Backspace") {
        if (currentIndex > 0) {
            currentIndex--;
            const prevLetter = promptLetters[currentIndex];
            prevLetter.classList.remove("correct", "error");
        }
        return;
    }

    if (event.key === " " && event.target === document.body) {
        event.preventDefault();
    }

    if (currentIndex >= currentPrompt.length) {
        finishPractice();
        return;
    }

    const currentLetter = promptLetters[currentIndex];

    if (event.key === currentPrompt[currentIndex]) {
        currentLetter.classList.add("correct");
        correctCharacters++;
    } else {
        currentLetter.classList.add("error");
        wrongCharacters++;
    }

    currentIndex++;

    if (currentIndex === currentPrompt.length) {
        finishPractice();
    }

    updateStats();
}

function updateStats() {
    document.getElementById("total-words").textContent = totalWords;
    document.getElementById("correct-inputs").textContent = correctCharacters;
    document.getElementById("wrong-inputs").textContent = wrongCharacters;
}

function finishPractice() {
    clearInterval(timerInterval);
    document.removeEventListener("keydown", handleTyping);
    const timeTaken = getTimeElapsed();
    const wordsPerMinute = calculateWPM();
    alert(`Practice Complete!\nWPM: ${wordsPerMinute}\nCorrect Inputs: ${correctCharacters}\nWrong Inputs: ${wrongCharacters}\nTime Taken: ${timeTaken}`);
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    startTime = new Date();

    timerInterval = setInterval(() => {
        const timeElapsed = getTimeElapsed();
        timerElement.textContent = timeElapsed;
    }, 1000);
}

function getTimeElapsed() {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function calculateWPM() {
    const now = new Date();
    const timeDiff = (now - startTime) / 1000 / 60; // Time in minutes
    const words = correctCharacters / 5; // Average word length is 5
    return Math.round(words / timeDiff);
}

// Make the stats panel draggable
const statsPanel = document.getElementById("stats-panel");
let isDragging = false, offsetX = 0, offsetY = 0;

statsPanel.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - statsPanel.offsetLeft;
    offsetY = event.clientY - statsPanel.offsetTop;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging) {
        statsPanel.style.left = `${event.clientX - offsetX}px`;
        statsPanel.style.top = `${event.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});
