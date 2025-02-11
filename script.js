document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";  
        document.getElementById("ai-container").style.display = "block"; 
        displayMessage("🟢 System Online. Welcome, Arjun.", "bot-message");
        updateSystemStatus();
    }, 5000);
});

const aiScreen = document.getElementById("ai-screen");
const userInput = document.getElementById("user-input");

// Display AI Messages
function displayMessage(message, className) {
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.innerText = message;
    aiScreen.appendChild(msgDiv);
    aiScreen.scrollTop = aiScreen.scrollHeight;
}

// Send Message Function
async function sendMessage() {
    let userMessage = userInput.value.trim();
    if (!userMessage) return;

    displayMessage("🗣️ " + userMessage, "user-message");
    displayMessage("⏳ Processing...", "bot-message");

    userInput.value = "";

    const response = await fetchAIResponse(userMessage);
    displayMessage(response, "bot-message");
}

// Fetch AI Response from Mistral-Nemo-Instruct-2407
async function fetchAIResponse(prompt) {
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407";
    const API_KEY = "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";  // Replace with your actual API key

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        const data = await response.json();
        return data.generated_text || "🤖 I am not sure about that.";
    } catch (error) {
        return "⚠️ Error fetching response. Please try again.";
    }
}

// Update System Readings (Time, Battery, CPU, RAM, Internet)
function updateSystemStatus() {
    setInterval(() => {
        let now = new Date();
        document.getElementById("time").innerText = now.toLocaleTimeString();
    }, 1000);

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateBattery() {
                document.getElementById("battery").innerText = `🔋 ${Math.round(battery.level * 100)}%`;
            }
            updateBattery();
            battery.addEventListener('levelchange', updateBattery);
        });
    } else {
        document.getElementById("battery").innerText = "🔋 Battery Info Unavailable";
    }

    setInterval(() => {
        document.getElementById("cpu").innerText = `⚡ ${(Math.random() * 50 + 10).toFixed(1)}%`;
    }, 2000);

    setInterval(() => {
        document.getElementById("ram").innerText = `🖥️ ${(Math.random() * 60 + 20).toFixed(1)}%`;
    }, 3000);

    setInterval(() => {
        let download = (Math.random() * 100).toFixed(2);
        let upload = (Math.random() * 50).toFixed(2);
        document.getElementById("internet").innerText = `📡 ⬇ ${download} Mbps | ⬆ ${upload} Mbps`;
    }, 5000);
}

// Voice Activation with Speech Recognition
async function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let voiceText = event.results[0][0].transcript.toLowerCase();
        displayMessage(`🎤 ${voiceText}`, "user-message");

        if (voiceText.includes("hello jarvis")) {
            displayMessage("Hello, Arjun. I am online.", "bot-message");
        } else {
            sendMessage(voiceText);
        }
    };

    recognition.onerror = function () {
        displayMessage("⚠️ Voice recognition error. Try again.", "bot-message");
    };
}

// Clear Chat Function
function clearChat() {
    aiScreen.innerHTML = "";
    displayMessage("🗑️ Chat cleared.", "bot-message");
}
