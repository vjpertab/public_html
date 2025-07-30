import Model from './model.js';
import View from './view.js';

const recognition = new webkitSpeechRecognition();
recognition.lang = Model.getLanguage().lang;

let aiRequestInProgress = false;

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = Model.appendLine("Player", userText);

    View.toggleLoading(true);
    aiRequestInProgress = true;

    const aiResponse = await Model.generateStory(updateStory + "\nNarrator: ");
    aiRequestInProgress = false;

    View.toggleLoading(false);

    const finalStory = Model.appendLine("Narrator", aiResponse);
    View.updateStory(finalStory);

    View.speakText(aiResponse, Model.getLanguage().lang);
}

function handleLanguageChange() {
    const selectOption = View.getLanguageSelect().selectedOptions[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dataset.name;
    Model.setLanguage(newLang, newLangName);
    recognition.lang = newLang;
}

function handleStopSpeaking() {
    View.stopSpeaking();
    if (aiRequestInProgress) {
        View.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = Model.resetStory();
    View.updateStory(resetStory);

    setTimeout(() => {
        View.speakText("Story reset!  Help me build a story! Start a sentence and I will continue it.", Model.getLanguage().lang)
    }, 500);
}

function handlePauseAndResume(e) {
    const newState = View.pauseOrResumeSpeaking();
    e.target.textContent = newState === "⏸️ Pause" ? "▶️ Resume" : "⏸️ Pause";
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => { };
    const initialStoryContent = View.getInitialStoryContent();
    Model.initializeStory(initialStoryContent);
    View.updateStory(Model.getStory());

    setTimeout(() => {
        View.speakText("Story reset!  Help me build a story! Start a sentence and I will continue it.", Model.getLanguage().lang)
    }, 500);

    View.getSpeakButton().onclick = () => {
        try {
            recognition.start();
        }
        catch (e) {
            console.error("Speech recognition error: " + e);
        }
    };
    recognition.onresult = handleVoiceInput;
    recognition.onerror = (event) => {
        console.error("Speech recognition error: " + error.error);
        View.toggleLoading(false);
        aiRequestInProgress = false;
    };

    View.getLanguageSelect().addEventListener("change", handleLanguageChange);

    View.getStopSpeakBtn().onclick = handleStopSpeaking;

    View.getPauseSpeakButton().onclick = handlePauseAndResume;
}

init();