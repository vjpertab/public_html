class AICookApp {
    constructor() {
        this.apiKey = localStorage.getItem("geminiAPIKey") || "";
        this.initializeElements();
        this.bindEvents();
        this.loadAPIKey();

    }

    initializeElements() {
        this.apiKeyInput = document.getElementById("apiKey");
        this.saveAPIKeyButton = document.getElementById("saveApiKey");
        this.ingredientsInput = document.getElementById("ingredients");
        this.dietarySelect = document.getElementById("dietary");
        this.cuisineSelect = document.getElementById("cuisine");

        this.generateButton = document.getElementById("generateRecipe");
        this.loading = document.getElementById("loading");
        this.recipeSection = document.getElementById("recipeSection");
        this.recipeContent = document.getElementById("recipeContent");
    }

    bindEvents() {
        this.saveAPIKeyButton.addEventListener("click", () => this.saveAPIKey());
        this.generateButton.addEventListener("click", () => this.generateRecipe());

        this.apiKeyInput.addEventListener("keypress", (e) => {
            if (e.key == "Enter") {
                this.saveAPIKey();
            }
        });

        this.ingredientsInput.addEventListener("keypress", (e) => {
            if ((e.key == "Enter" || e.key == "\n") && e.ctrlKey) {
                this.generateRecipe();
            }
        });
    }

    loadAPIKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.updateAPIKeyStatus(true);
        }
    }

    saveAPIKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showError("Please enter your Gemini API key");
            return;
        }
        this.apiKey = apiKey;
        localStorage.setItem("geminiAPIKey", apiKey);
        this.updateAPIKeyStatus(true);
    }

    async generateRecipe() {
        if (!this.apiKey) {
            this.showError("Please save your Gemini API key first");
            return;
        }

        const ingredients = this.ingredientsInput.value.trim();

        if (!ingredients) {
            this.showError("Please enter some ingredients");
            return;
        }

        this.showLoading(true);
        this.hideRecipe();

        try {
            const recipe = await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe);
        } catch (error) {
            console.log("Error generating recipe: ", error);
            this.showError("Failed to generate recipe. Please check your API key and try again.");
        } finally {
            this.showLoading(false);
        }
    }

    displayRecipe(recipe) {
        let formattedRecipe = this.formatRecipe(recipe);
        this.recipeContent.innerHTML = recipe;
        this.showRecipe();
    }

    showRecipe() {
        this.recipeSection.classList.add("show");
        this.recipeSection.scrollIntoView({ behavior: "smooth" });
    }

    formatRecipe(recipe) {
        recipe = recipe.replace(/(^| ) +/gm, "$1");
        recipe = recipe.replace(/^- */gm, "");
        recipe = recipe.replace(/\*\*(.+?)\*\*/gm, "<strong>$1</strong>");
        recipe = recipe.replace(/^(.+)/g, '<h3 class="recipe-title">$1</h3>');
        recipe = recipe.replace(/^(.+)/gm, '<p>$1</p>');
        return recipe;
    }

    async callGeminiAPI(ingredients) {
        const dietary = this.dietarySelect.value;
        const cuisine = this.cuisineSelect.value;
        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}`;
        if (dietary) {
            prompt += ` Make it ${dietary}.`;
        }
        if (cuisine) {
            prompt += ` The cuisine style should be ${cuisine}.`;
        }

        prompt += `
        
        Please format your response as follows:
        - recipe name
        - prep time
        - cook time
        - servings
        - ingredients (with quantities)
        - instructions (number steps)
        - tips (optional)
        
        Make sure the recipe is formatted using this CSS template: 
        /* =============================================
   GLOBAL RESET AND BASE STYLES
   ============================================= */

/* Universal reset - removes default margins, padding, and sets consistent box-sizing */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* Includes padding and border in element's total width/height */
}

/* Main body styles - sets up the overall page appearance */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern, readable font stack */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Beautiful gradient background */
    min-height: 100vh; /* Ensures full viewport height coverage */
    color: #333; /* Dark gray text for good readability */
}

/* =============================================
   LAYOUT CONTAINERS
   ============================================= */

/* Main container - centers content and provides responsive padding */
.container {
    max-width: 800px; /* Limits content width for better readability */
    margin: 0 auto; /* Centers the container horizontally */
    padding: 20px; /* Provides breathing room on all sides */
}

/* Header section - app branding and introduction */
header {
    text-align: center; /* Centers all header content */
    margin-bottom: 40px; /* Spaces header from main content */
    color: white; /* White text for contrast against gradient background */
}

/* Main app title styling */
header h1 {
    font-size: 3rem; /* Large, prominent title */
    margin-bottom: 10px; /* Space between title and subtitle */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3); /* Subtle shadow for depth */
}

/* Subtitle/description styling */
header p {
    font-size: 1.2rem; /* Slightly larger than normal text */
    opacity: 0.9; /* Slightly transparent for hierarchy */
}

/* =============================================
   MAIN CONTENT CARD
   ============================================= */

/* Main content area - white card that contains all interactive elements */
main {
    background: white; /* Clean white background for contrast */
    border-radius: 20px; /* Rounded corners for modern look */
    padding: 40px; /* Generous padding for comfortable content spacing */
    box-shadow: 0 20px 40px rgba(0,0,0,0.1); /* Subtle shadow for depth and elevation */
}

/* =============================================
   FORM SECTIONS AND INPUTS
   ============================================= */

/* Input section container - groups all form inputs */
.input-section {
    margin-bottom: 30px; /* Space between input section and other content */
}

/* Individual form sections - consistent spacing between different input groups */
.api-key-section,
.ingredients-section,
.preferences-section,
.cuisine-section {
    margin-bottom: 25px; /* Consistent vertical spacing between form sections */
}

/* Form labels - consistent styling for all input labels */
label {
    display: block; /* Makes labels take full width and stack vertically */
    margin-bottom: 8px; /* Space between label and input */
    font-weight: 600; /* Semi-bold for emphasis */
    color: #555; /* Dark gray for readability without being too harsh */
}

/* Base styling for all form inputs */
input[type="password"],
textarea,
select {
    width: 100%; /* Full width for consistent layout */
    padding: 12px; /* Comfortable padding for touch and mouse interaction */
    border: 2px solid #e1e5e9; /* Light border for subtle definition */
    border-radius: 10px; /* Rounded corners matching the overall design */
    font-size: 16px; /* Prevents zoom on mobile devices */
    transition: border-color 0.3s ease; /* Smooth transition for focus states */
}

/* Focus states for form inputs - provides visual feedback */
input[type="password"]:focus,
textarea:focus,
select:focus {
    outline: none; /* Removes default browser outline */
    border-color: #667eea; /* Changes border to accent color when focused */
}

/* =============================================
   API KEY SECTION STYLING
   ============================================= */

/* API key section layout - stacks input and button vertically */
.api-key-section {
    display: flex;
    flex-direction: column; /* Stacks items vertically */
    gap: 10px; /* Space between input and button */
}

/* API key input field - takes available space */
.api-key-section input {
    flex: 1; /* Takes up remaining space in flex container */
}

/* API key save button - distinct styling for important action */
.api-key-section button {
    padding: 12px 20px; /* Comfortable click target */
    background: #28a745; /* Green color indicates success/save action */
    color: white; /* White text for contrast */
    border: none; /* Removes default button border */
    border-radius: 10px; /* Rounded corners matching input fields */
    cursor: pointer; /* Indicates clickable element */
    font-weight: 600; /* Bold text for emphasis */
    transition: background 0.3s ease; /* Smooth color change on hover */
}

/* Hover state for API key button - darker green for feedback */
.api-key-section button:hover {
    background: #218838; /* Darker green on hover */
}

/* =============================================
   TEXTAREA AND MAIN BUTTON STYLING
   ============================================= */

/* Textarea specific styling - for ingredients input */
textarea {
    height: 120px; /* Fixed height for multi-line input */
    resize: vertical; /* Allows vertical resizing only */
    font-family: inherit; /* Uses same font as parent element */
}

/* Main generate button - primary call-to-action */
.generate-btn {
    width: 100%; /* Full width for prominence */
    padding: 15px; /* Large padding for easy clicking */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Gradient matching page theme */
    color: white; /* White text for contrast */
    border: none; /* Removes default border */
    border-radius: 10px; /* Rounded corners */
    font-size: 18px; /* Larger font for importance */
    font-weight: 600; /* Bold text */
    cursor: pointer; /* Indicates clickable */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth animations */
}

/* Hover effect for generate button - lifts button for feedback */
.generate-btn:hover {
    transform: translateY(-2px); /* Lifts button slightly */
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4); /* Adds shadow for depth */
}

/* Active state for generate button - pressed effect */
.generate-btn:active {
    transform: translateY(0); /* Returns to original position when clicked */
}

/* Disabled state for generate button - indicates unavailable action */
.generate-btn:disabled {
    background: #ccc; /* Gray background when disabled */
    cursor: not-allowed; /* Shows not-allowed cursor */
    transform: none; /* Removes hover transform */
}

/* =============================================
   LOADING STATE STYLING
   ============================================= */

/* Loading container - hidden by default, shown during API calls */
.loading {
    display: none; /* Hidden by default */
    text-align: center; /* Centers loading content */
    padding: 40px; /* Generous padding for visual space */
}

/* Show class for loading state - controlled by JavaScript */
.loading.show {
    display: block; /* Makes loading visible when needed */
}

/* Animated spinner element */
.spinner {
    width: 50px; /* Fixed size for consistency */
    height: 50px;
    border: 5px solid #f3f3f3; /* Light gray border for base */
    border-top: 5px solid #667eea; /* Colored top border creates spinning effect */
    border-radius: 50%; /* Makes it circular */
    animation: spin 1s linear infinite; /* Continuous spinning animation */
    margin: 0 auto 20px; /* Centers spinner and adds bottom margin */
}

/* Keyframe animation for spinner rotation */
@keyframes spin {
    0% { transform: rotate(0deg); } /* Starting position */
    100% { transform: rotate(360deg); } /* Full rotation */
}

/* =============================================
   RECIPE DISPLAY SECTION
   ============================================= */

/* Recipe section container - hidden by default, shown when recipe is generated */
.recipe-section {
    display: none; /* Hidden by default */
    margin-top: 30px; /* Space from previous content */
    padding-top: 30px; /* Internal top padding */
    border-top: 2px solid #e1e5e9; /* Visual separator from input section */
}

/* Show class for recipe section - controlled by JavaScript */
.recipe-section.show {
    display: block; /* Makes recipe visible when generated */
}

/* Recipe section header */
.recipe-section h2 {
    color: #667eea; /* Accent color for section title */
    margin-bottom: 20px; /* Space between title and content */
    font-size: 2rem; /* Large, prominent heading */
}

/* =============================================
   RECIPE CONTENT FORMATTING
   ============================================= */

/* Main recipe content container - styles dynamically generated content */
#recipeContent {
    line-height: 1.6; /* Comfortable line spacing for readability */
    color: #555; /* Dark gray for good contrast */
}

/* Recipe content headings - different levels for hierarchy */
#recipeContent h3 {
    color: #333; /* Darker color for main headings */
    margin: 20px 0 10px 0; /* Vertical spacing around headings */
    font-size: 1.4rem; /* Prominent but not overwhelming */
}

#recipeContent h4 {
    color: #555; /* Slightly lighter than h3 for hierarchy */
    margin: 15px 0 8px 0; /* Smaller margins for sub-headings */
    font-size: 1.2rem; /* Smaller than h3 but still prominent */
}

/* Lists in recipe content - ingredients and instructions */
#recipeContent ul, #recipeContent ol {
    margin-left: 20px; /* Indentation for list items */
    margin-bottom: 15px; /* Space after lists */
}

/* Individual list items */
#recipeContent li {
    margin-bottom: 5px; /* Small space between list items */
}

/* Paragraphs in recipe content */
#recipeContent p {
    margin-bottom: 15px; /* Space between paragraphs */
}

/* =============================================
   RECIPE TITLE AND METADATA
   ============================================= */

/* Recipe title styling - generated recipe name */
.recipe-title {
    color: #667eea; /* Accent color for recipe name */
    font-size: 1.8rem; /* Large, prominent title */
    margin-bottom: 15px; /* Space before recipe details */
    text-align: center; /* Centers the recipe title */
}

/* Recipe metadata container - displays prep time, cook time, servings */
.recipe-meta {
    background: #f8f9fa; /* Light gray background for distinction */
    padding: 15px; /* Comfortable padding */
    border-radius: 10px; /* Rounded corners matching design */
    margin-bottom: 20px; /* Space before recipe content */
    display: flex; /* Flexbox for horizontal layout */
    justify-content: space-around; /* Evenly distributes metadata items */
    text-align: center; /* Centers text in each metadata item */
}

/* Individual metadata items */
.recipe-meta div {
    flex: 1; /* Each item takes equal space */
}

/* Metadata labels (Prep Time, Cook Time, etc.) */
.recipe-meta strong {
    display: block; /* Makes label appear on its own line */
    color: #667eea; /* Accent color for labels */
    font-size: 1.1rem; /* Slightly larger than normal text */
}

/* =============================================
   ERROR MESSAGE STYLING
   ============================================= */

/* Error message container - displays user-friendly error messages */
.error {
    background: #f8d7da; /* Light red background for error state */
    color: #721c24; /* Dark red text for contrast */
    padding: 15px; /* Comfortable padding */
    border-radius: 10px; /* Rounded corners matching design */
    margin-top: 20px; /* Space from previous content */
    border: 1px solid #f5c6cb; /* Subtle border for definition */
}

/* =============================================
   RESPONSIVE DESIGN - MOBILE OPTIMIZATIONS
   ============================================= */

/* Media query for mobile devices and small screens */
@media (max-width: 600px) {
    /* Reduced padding for mobile screens */
    .container {
        padding: 10px; /* Less padding on mobile for more content space */
    }
    
    /* Smaller header title for mobile */
    header h1 {
        font-size: 2rem; /* Reduced from 3rem for mobile readability */
    }
    
    /* Reduced padding in main content area */
    main {
        padding: 20px; /* Less padding on mobile */
    }
    
    /* Stack recipe metadata vertically on mobile */
    .recipe-meta {
        flex-direction: column; /* Changes from horizontal to vertical layout */
        gap: 10px; /* Adds space between stacked items */
    }
}
    }`;

        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    top_k: 40,
                    top_p: 0.95,
                    max_output_tokens: 2048
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || "Unknown error"}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    updateAPIKeyStatus(isValid) {
        const button = this.saveAPIKeyButton;
        if (isValid) {
            button.textContent = "Save ✔️";
            button.style.backgroundColor = "#28a745";
        }
        else {
            button.textContent = "Save ❌";
            button.style.backgroundColor = "#dc3545";
        }
    }

    showError(message) {
        alert(message);
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.add("show");
            this.generateButton.disabled = true;
            this.generateButton.textContent = "Generating...";
        }
        else {
            this.loading.classList.remove("show");
            this.generateButton.disabled = false;
            this.generateButton.textContent = "Generate Recipe";
        }
    }

    hideRecipe() {
        this.recipeSection.classList.remove("show");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AICookApp();
});