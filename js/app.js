import GameController from './controller/GameController.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new GameController(canvas);
    game.start();
});