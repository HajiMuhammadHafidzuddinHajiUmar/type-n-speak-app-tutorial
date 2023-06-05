// Init Speech Synth API
const synth = window.speechSynthesis;
console.log(synth);

// DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    // Loop through voices and create option element for each one
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.textContent = `${voice.name}(${voice.lang})`;
        option.setAttribute("data-name", voice.name);
        option.setAttribute("data-lang", voice.lang);
        voiceSelect.appendChild(option);
    })
}

// Call function and browser support fix
getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    // Check if speaking
    if (synth.speaking) {
        console.log("Still speaking...");
        return;
    }

    if (textInput.value !== "") {
        // Add background gif
        body.style.background = "#141414 url(img/wave.gif)";
        body.style.backgroundRepeat = "repeat-x";
        body.style.backgroundSize = "100% 100%";

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Speak end event and error event
        speakText.onend = e => {
            console.log("Done speaking");
            body.style.background = "#141414";
        }
        speakText.onerror = e => {
            console.log("Something went wrong...");
        }

        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
        // Loops through voices to find a match with selected voice
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;        // Set voice
            }
        })

        // Set rate and pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
}

// Submit textForm event listener
textForm.addEventListener("submit", e => {
    e.preventDefault();
    speak();
    textInput.blur();       // To hide the keyboard in Firefox OS
});

// Rate and Pitch change event listener
rate.addEventListener("input", e => rateValue.textContent= rate.value);
pitch.addEventListener("input", e => pitchValue.textContent= pitch.value);