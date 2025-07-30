import View from "./view.js";

let story = "";
let initialStory = "";
let currentLanguage = "en-US";
let currentLanguageName = "English";

async function generateStory(prompt) {
    const GEMINI_API_KEY = View.getKey();

    if (!GEMINI_API_KEY) {
        alert("Your key is empty.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
        contents: [{
            parts: [{
                text: `Continue the story in ${currentLanguageName}:\n${prompt}`
            }]
        }]
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "(no response)";
}

function appendLine(role, text) {
    story += `\n`;
    story += `${role}: ${text}`;
    return story;
}

function getStory() {
    return story;
}

function getLanguage() {
    return { lang: currentLanguage, name: currentLanguageName };
}

function setLanguage(lang, name) {
    currentLanguage = lang;
    currentLanguageName = name;
}

function resetStory() {
    story = initialStory;
    return story;
}

function initializeStory(initialText) {
    story = initialText;
    initialStory = initialText;
    return story;
}

export default {
    appendLine,
    getStory,
    getLanguage,
    setLanguage,
    resetStory,
    initializeStory,
    generateStory
}