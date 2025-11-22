import { GAMESTATE } from '../model/GameState.js';

export default class InputHandler {
    constructor(gameController) {
        this.game = gameController;

        document.addEventListener('keydown', (event) => {
            const state = this.game.gameState.current;

            // --- MENÚ PRINCIPAL ---
            if (state === GAMESTATE.MENU) {
                switch (event.code) {
                    case 'ArrowUp': this.game.mainMenuView.moveUp(); break;
                    case 'ArrowDown': this.game.mainMenuView.moveDown(); break;
                    case 'Space': case 'Enter': this.game.handleMenuSelection(); break;
                }
            } 
            
            // --- OPCIONES ---
            else if (state === GAMESTATE.OPTIONS) {
                const currentOpt = this.game.optionsView.getCurrentOption();
                switch (event.code) {
                    case 'ArrowUp': this.game.optionsView.moveUp(); break;
                    case 'ArrowDown': this.game.optionsView.moveDown(); break;
                    case 'ArrowLeft': 
                        if (currentOpt.type === 'music') this.game.adjustMusicVol(-0.1);
                        if (currentOpt.type === 'sfx') this.game.adjustSFXVol(-0.1);
                        break;
                    case 'ArrowRight': 
                        if (currentOpt.type === 'music') this.game.adjustMusicVol(0.1);
                        if (currentOpt.type === 'sfx') this.game.adjustSFXVol(0.1);
                        break;
                    case 'Space': case 'Enter': case 'Escape':
                        if (currentOpt.type === 'back' || event.code === 'Escape') {
                            this.game.gameState.set(GAMESTATE.MENU);
                        }
                        break;
                }
            }

            // --- JUEGO (RUNNING) ---
            else if (state === GAMESTATE.RUNNING) {
                switch (event.code) {
                    case 'ArrowLeft': this.game.paddle.moveLeft(); break;
                    case 'ArrowRight': this.game.paddle.moveRight(); break;
                    case 'Escape': case 'KeyP': this.game.togglePause(); break;
                    
                    // NUEVO: Lanzar bola
                    case 'Space': 
                        this.game.launchBall(); 
                        break;
                }
            }

            // --- PAUSA (NUEVO BLOQUE) ---
            else if (state === GAMESTATE.PAUSED) {
                switch (event.code) {
                    case 'Escape': 
                    case 'KeyP': 
                        // Quitar pausa
                        this.game.togglePause(); 
                        break;
                    
                    case 'KeyQ':
                        // SALIR AL MENÚ PRINCIPAL
                        // Primero guardamos por seguridad
                        this.game.togglePause(); // Para guardar estado actual
                        this.game.gameState.set(GAMESTATE.MENU); 
                        break;
                }
            }
            
            // --- GAME OVER ---
            else if (state === GAMESTATE.GAMEOVER) {
                if (event.code === 'Space') {
                    this.game.returnToMenu(); // Volver al menú en lugar de reiniciar directo
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.game.gameState.current === GAMESTATE.RUNNING) {
                if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                    this.game.paddle.stop();
                }
            }
        });
    }
}