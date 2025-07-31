import Ball from "./ball.js";
import Paddle from "./paddle.js";

export const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };
export const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };

export const BOARD_WIDTH = 500;
export const BOARD_HEIGHT = 500;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 50;
export const BALL_RADIUS = 5;
export const PADDLE_VELOCITY = 15;
export const PADDLE_FORCE = 2; // 200% of speed before

export class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    is_cpu = false;
    state = STATE.STARTUP;
    intervalID = -1;
    nameL = "Player 1";
    nameR = "Player 2";

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.scoreL = 0;
        this.scoreR = 0;
        this.state = STATE.STARTUP;
        clearTimeout(this.intervalID);
        this.resetBall();
        this.paddleL = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.LEFT, "red");
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.RIGHT, "blue");
    }

    resetBall() {
        let velx = Math.ceil(Math.random() * 3) * 2;
        let vely = Math.ceil(Math.random() * 3) * 2;
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
    }

}

