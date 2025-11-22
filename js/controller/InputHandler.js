import { GAMESTATE } from '../model/GameState.js';

export default class InputHandler {
    constructor(gameController) {
        this.game = gameController;

        // 1. LISTENER DEL MOUSE
        document.addEventListener('mousemove', (event) => {
            // Solo movemos si estamos jugando, no está en pausa y el modo es MOUSE
            if (this.game.gameState.current === GAMESTATE.RUNNING && 
                this.game.inputMode === 'MOUSE') {
                
                // Calculamos posición relativa al canvas
                const rect = this.game.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                
                // Movemos el paddle directamente
                this.game.paddle.moveTo(mouseX);
            }
        });
        
        // ... (Mouse Click para lanzar bola opcional) ...
        document.addEventListener('mousedown', (event) => {
             if (this.game.gameState.current === GAMESTATE.RUNNING && this.game.inputMode === 'MOUSE') {
                 this.game.launchBall();
             }
        });

        // --- KEY DOWN (Presionar tecla) ---
        document.addEventListener('keydown', (event) => {
            const state = this.game.gameState.current;

            // MENU
            if (state === GAMESTATE.MENU) {
                switch (event.code) {
                    case 'ArrowUp': this.game.mainMenuView.moveUp(); break;
                    case 'ArrowDown': this.game.mainMenuView.moveDown(); break;
                    case 'Space': case 'Enter': this.game.handleMenuSelection(); break;
                }
            } 
            // OPCIONES
            if (state === GAMESTATE.OPTIONS) {
                const currentOpt = this.game.optionsView.getCurrentOption();
                switch (event.code) {
                    case 'ArrowUp': this.game.optionsView.moveUp(); break;
                    case 'ArrowDown': this.game.optionsView.moveDown(); break;
                    case 'ArrowLeft': 
                        if (currentOpt.type === 'music') this.game.adjustMusicVol(-0.1);
                        if (currentOpt.type === 'sfx') this.game.adjustSFXVol(-0.1);
                        if (currentOpt.type === 'input') this.game.toggleInputMode(); // <--- CAMBIAR INPUT
                        break;
                    case 'ArrowRight': 
                        if (currentOpt.type === 'music') this.game.adjustMusicVol(0.1);
                        if (currentOpt.type === 'sfx') this.game.adjustSFXVol(0.1);
                        if (currentOpt.type === 'input') this.game.toggleInputMode(); // <--- CAMBIAR INPUT
                        break;
                    case 'Space': case 'Enter': case 'Escape':
                        if (currentOpt.type === 'back' || event.code === 'Escape') {
                            this.game.gameState.set(GAMESTATE.MENU);
                        }
                        // También permite cambiar input con Enter si estás en esa opción
                        if (currentOpt.type === 'input') this.game.toggleInputMode();
                        break;
                }
            }
            // JUEGO (RUNNING)
            else if (state === GAMESTATE.RUNNING) {
                switch (event.code) {
                    // Solo permitimos teclado si el modo es KEYBOARD
                    case 'ArrowLeft': 
                        if (this.game.inputMode === 'KEYBOARD') this.game.paddle.pressLeft(); 
                        break;
                    case 'ArrowRight': 
                        if (this.game.inputMode === 'KEYBOARD') this.game.paddle.pressRight(); 
                        break;
                    
                    case 'Escape': case 'KeyP': this.game.togglePause(); break;
                    case 'Space': this.game.launchBall(); break;
                }
            }
            // PAUSA
            else if (state === GAMESTATE.PAUSED) {
                switch (event.code) {
                    case 'Escape': case 'KeyP': this.game.togglePause(); break;
                    case 'KeyQ':
                        this.game.togglePause(); 
                        this.game.gameState.set(GAMESTATE.MENU); 
                        break;
                }
            }
            // GAME OVER
            else if (state === GAMESTATE.GAMEOVER) {
                if (event.code === 'Space') {
                    this.game.returnToMenu();
                }
            }
        });

        // --- KEY UP (Soltar tecla) ---
        document.addEventListener('keyup', (event) => {
            if (this.game.gameState.current === GAMESTATE.RUNNING) {
                // Solo soltamos si estamos en modo teclado
                 if (this.game.inputMode === 'KEYBOARD') {
                    switch (event.code) {
                        case 'ArrowLeft': this.game.paddle.releaseLeft(); break;
                        case 'ArrowRight': this.game.paddle.releaseRight(); break;
                    }
                 }
            }
        });
    }
}