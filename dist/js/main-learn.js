/* References:
https://www.youtube.com/watch?v=ZORXxxP49G8&list=PLillGF-RfqbbnEGy3ROiLWk7JMCuSyQtX&index=25
https://github.com/bradtraversy/type-n-speak/blob/master/dist/js/main.js
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#speech_synthesis
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
*/

// Init SpeechSynth API
const synth = window.speechSynthesis; 
console.log(synth);     // to see the methods of speechSynthesis that is and can be used

// DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Init Voices Array
let voices = [];

const getVoices = () => {               // getVoices here is a custom function
    voices = synth.getVoices();         // getVoices here is a method of speechSynthesis | The two are not the same
    console.log(voices);            // runs asynchronously with event onvoiceschanged | May show empty | Need to alter onvoiceschanged

    // Loop through voices and create an option element for each one
    voices.forEach(voice => {
        // Create option element
        const option = document.createElement("option");
        // Fill option
        option.textContent = `${voice.name}(${voice.lang})`;
        // Set attributes
        option.setAttribute("data-name", voice.name);
        option.setAttribute("data-lang", voice.lang);

        voiceSelect.appendChild(option);
    })
};

// To help with browsers not fully supported ie. firefox and chrome | readmore: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#speech_synthesis
getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}
/*note: there is minor bug duplication that can be seen from line 27: console.log(voices);
It does not alter the functionality but there is a fix in https://github.com/bradtraversy/type-n-speak/blob/master/dist/js/main.js */

// Speak
const speak = () => {
    // Check if speaking
    if (synth.speaking) {
        console.log("Already speaking...");
        return;
    }

    if (textInput.value !== "") {
        // Add background animation
        body.style.background = "#141414 url(img/wave.gif)";
        body.style.backgroundRepeat = "repeat-x";
        body.style.backgroundSize = "100% 100%";

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
    
        // Speak end event
        speakText.onend = e => {
            console.log("Done speaking...");
            body.style.background = "#141414";
        }
        // Speak error event
        speakText.onerror = e => {
            console.log("Something went wrong");
        }
        /*note: alternatively
        speakText.addEventListener("end", e => console.log("Done speaking..."));
        speakText.addEventListener("error", e => console.log("Done speaking..."));
        */

        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
        // Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
}

// Event Listeners

// Submit textForm
textForm.addEventListener("submit", e => {
    e.preventDefault();
    speak();
    textInput.blur();       // to hide the keyboard on Firefox OS
})

// Rate value change
rate.addEventListener("input", e => rateValue.textContent = rate.value);       // Personally prefers "input" event
// Pitch value change
pitch.addEventListener("input", e => pitchValue.textContent = pitch.value);

// Voice Select change
voiceSelect.addEventListener("change", e => speak());           // Personally feels unnecessary