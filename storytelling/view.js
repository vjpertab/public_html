// get all the elements from the DOM
const storyDiv = document.getElementById('story');
const speakBtn = document.getElementById("speakBtn");
const stopSpeakBtn = document.getElementById("stopSpeakBtn");
const pauseSpeakBtn = document.getElementById("pauseSpeakBtn");
const languageSelect = document.getElementById("languageSelect");
const loadingDiv = document.getElementById("loading");

function updateStory(text) {
    if (storyDiv) {
        storyDiv.textContent = text;
    }
}

function toggleLoading(show) {
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }
}

function getStopSpeakBtn() {
    return stopSpeakBtn;
}

function getPauseSpeakButton() {
    return pauseSpeakBtn;
}

function getSpeakButton() {
    return speakBtn;
}

function getInitialStoryContent() {
    return storyDiv ? storyDiv.textContent.trim() : "Narrator: Help me build a story! Start with a sentence and I will continue.";
}

function getLanguageSelect() {
    return languageSelect;
}

function speakText(text, lang) {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voices = speechSynthesis.getVoices();

        if (voices.length == 0) {
            setTimeout(() => {
                speakText(text, lang);
            }, 100);
            return;
        }

        const voice = voices.find(v => v.lang.startsWith(lang));

        if (voice) {
            utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
    }
    catch (e) {
        console.error("Speech synthesis error: ", e);
    }
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}

function pauseOrResumeSpeaking() {
    if (window.speechSynthesis.speaking) {
        if(window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return "Pause";
        }
        else {
            window.speechSynthesis.pause();
            return "Resume";
        }
    }
    return "Pause";
}

export default {
    updateStory,
    toggleLoading,
    getStopSpeakBtn,
    getPauseSpeakButton,
    getSpeakButton,
    getInitialStoryContent,
    getLanguageSelect,
    speakText,
    stopSpeaking,
    pauseOrResumeSpeaking
}