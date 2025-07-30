import * as Controls from "./controls.js";
import { BOARD_WIDTH, BOARD_HEIGHT, BALL_RADIUS } from "./model.js";


export function bind_events(model) {
    document.getElementById("reset").onclick = () => Controls.resetGame(model);
    document.getElementById("nameL").oninput = (ev) => Controls.set_left_name(model, ev);
    document.getElementById("nameR").oninput = (ev) => Controls.set_right_name(model, ev);
    document.getElementById("cpucheck").onchange = (ev) => Controls.set_cpu(model, ev);
    window.addEventListener("keyup", key => Controls.keyUp(model, key));
    window.addEventListener("keydown", key => Controls.keyDown(model, key));
}

export function updateScore(model) {
    document.getElementById("scoreboard").innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

export function draw_game(model) {
    const canvas = document.getElementById("gameboard");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "hotpink";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function draw_paddle(ctx, paddle) {
    ctx.fillStyle = paddle.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    //draw rectangle
    ctx.fillRect(paddle.posx, paddle.posy, paddle.width, paddle.height);
    ctx.strokeRect(paddle.posx, paddle.posy, paddle.width, paddle.height);
}

export function speak_reset() {
    const resetPhrases = [
        "Game reset, let's play again",
        "New game starting",
        "Scores reset, fresh start",
        "Game restarted",
        "Ready for a new match"
    ];
    speak_one_of(resetPhrases);
}


export function speak_hit(name) {
    const hitPhrases = [
        `${name} returns the ball`,
        `Eat dirt, ${opponent_name}`,
        `Nice save by ${name}`,
        `${name} strikes back`,
        `Good hit from ${name}`,
        `${name} keeps it alive`,
        `${name} with the return`,
        `Nice try, ${opponent_name}`,
        `Excellent defense by ${name}`,
        `${name} sends it back`,
        `In your face, ${opponent_name}`
    ];
    speak_one_of(hitPhrases)
}

export function speak_miss(name, opponent_name) {
    const missPhrases = [
        `${name} missed the ball`,
        `${name} couldn't reach it`,
        `Eat dirt, ${name}`,
        `Point to ${opponent_name}`,
        `${name} let it slip by`,
        `${opponent_name} scores`,
        `${name} missed that one`,
        `Nice try, ${name}`
        `Too fast for ${name}`,
        `${opponent_name} takes the point`,
        `In your face, ${name}`
    ];
    speak_one_of(missPhrases)
}

export function speak_win(name) {
    const winPhrases = [
        `${name} wins the game`,
        `Victory goes to ${name}`,
        `${name} is the champion`,
        `Game over, ${name} wins`,
        `${name} takes the victory`,
        `Congratulations ${name}`,
        `${name} dominates the match`
    ];
    speak_one_of(winPhrases)
}

function speak_one_of(lines) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    speak(line);
}

function speak(text) {

    // Don't speak if speechSynthesis doesn't exist
    if (!window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();
    // Find first English voice, fallback to any available voice
    let gameVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];

    // Cancel any currently playing speech to avoid overlap
    window.speechSynthesis.cancel();

    // Create and configure the speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = gameVoice;      // Use selected voice
    utterance.rate = 1.5;             // Speak 50% faster for ULTRA responsiveness
    utterance.pitch = 1.8;            // Normal pitch
    utterance.volume = 0.8;           // 80% volume

    // Speak the announcement
    window.speechSynthesis.speak(utterance);
}

export function play_beep() {
    let audioContext = new window.AudioContext();

    // Create oscillator (tone generator) and gain node (volume control)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect audio nodes: oscillator -> gain -> speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the oscillator
    oscillator.frequency.value = 150;
    oscillator.type = 'square';  // Square wave produces a REALLY ANNOYING tone (which is what we want hahahahaha)

    gainNode.gain.value = 1

    // Start and schedule stop of the oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + .25);
}