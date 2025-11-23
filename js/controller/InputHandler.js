import { GAMESTATE } from '../model/GameState.js';

export default class InputHandler {
    constructor(gameController) {
        this.game = gameController;

        // 1. LISTENER DEL MOUSE (Movimiento del Paddle)
        document.addEventListener('mousemove', (event) => {
            if (this.game.gameState.current === GAMESTATE.RUNNING && 
                this.game.inputMode === 'MOUSE') {
                
                const rect = this.game.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                this.game.paddle.moveTo(mouseX);
            }
        });
        
        // 2. LISTENER DEL MOUSE (Click para lanzar/disparar)
        document.addEventListener('mousedown', (event) => {
             if (this.game.gameState.current === GAMESTATE.RUNNING && 
                 this.game.inputMode === 'MOUSE') {
                 this.game.launchBall();
             }
        });

        // 3. LISTENER DE TECLADO (KEYDOWN)
        document.addEventListener('keydown', (event) => {
            const state = this.game.gameState.current;

            // --- MENU PRINCIPAL ---
            if (state === GAMESTATE.MENU) {
                switch (event.code) {
                    case 'ArrowUp': this.game.mainMenuView.moveUp(); break;
                    case 'ArrowDown': this.game.mainMenuView.moveDown(); break;
                    case 'Space': case 'Enter': this.game.handleMenuSelection(); break;
                }
            } 

            // --- OPCIONES (AQUÍ ES DONDE PROBABLEMENTE FALLABA) ---
            else if (state === GAMESTATE.OPTIONS) {
                const currentOpt = this.game.optionsView.getCurrentOption();
                
                switch (event.code) {
                    // Navegación (Arriba/Abajo)
                    case 'ArrowUp': 
                        this.game.optionsView.moveUp(); 
                        break;
                    case 'ArrowDown': 
                        this.game.optionsView.moveDown(); 
                        break;

                    // Ajustes (Izquierda/Derecha)
                    case 'ArrowLeft': 
                    case 'ArrowRight':
                        // Definimos si sumamos o restamos valor (Derecha = 1, Izquierda = -1)
                        const direction = (event.code === 'ArrowRight') ? 1 : -1;

                        // 1. VOLUMEN MÚSICA
                        if (currentOpt.type === 'music') {
                            this.game.adjustMusicVol(0.1 * direction);
                        }
                        // 2. VOLUMEN EFECTOS
                        else if (currentOpt.type === 'sfx') {
                            this.game.adjustSFXVol(0.1 * direction);
                        }
                        // 3. CONTROLES (Mouse/Teclado)
                        else if (currentOpt.type === 'input') {
                            this.game.toggleInputMode();
                        }
                        // 4. DIFICULTAD (Normal/Dinámica)
                        else if (currentOpt.type === 'diff') {
                            this.game.toggleDifficulty();
                        }
                        break;

                    // Selección / Salir
                    case 'Space': case 'Enter': case 'Escape':
                        // Si es botón volver o tecla escape, salimos
                        if (currentOpt.type === 'back' || event.code === 'Escape') {
                            this.game.gameState.set(GAMESTATE.MENU);
                        }
                        // Si presionamos Enter en opciones de toggle, también las cambiamos
                        else if (currentOpt.type === 'input') this.game.toggleInputMode();
                        else if (currentOpt.type === 'diff') this.game.toggleDifficulty();
                        break;
                }
            }
            
            // --- JUEGO (RUNNING) ---
            else if (state === GAMESTATE.RUNNING) {
                switch (event.code) {
                    case 'ArrowLeft': 
                        if (this.game.inputMode === 'KEYBOARD') this.game.paddle.pressLeft(); 
                        break;
                    case 'ArrowRight': 
                        if (this.game.inputMode === 'KEYBOARD') this.game.paddle.pressRight(); 
                        break;
                    case 'Escape': case 'KeyP': 
                        this.game.togglePause(); 
                        break;
                    case 'Space': 
                        this.game.launchBall(); 
                        break;
                }
            }
            
            // --- PAUSA ---
            else if (state === GAMESTATE.PAUSED) {
                switch (event.code) {
                    case 'Escape': case 'KeyP': 
                        this.game.togglePause(); 
                        break;
                    case 'KeyQ':
                        this.game.togglePause(); 
                        this.game.gameState.set(GAMESTATE.MENU); 
                        break;
                }
            }

            // --- GAME OVER ---
            else if (state === GAMESTATE.GAMEOVER) {
                switch (event.code) {
                    case 'ArrowUp': this.game.gameOverView.moveUp(); break;
                    case 'ArrowDown': this.game.gameOverView.moveDown(); break;
                    case 'Space': case 'Enter': this.game.handleGameOverSelection(); break;
                }
            }
        });

        // 4. LISTENER DE TECLADO (KEYUP)
        document.addEventListener('keyup', (event) => {
            if (this.game.gameState.current === GAMESTATE.RUNNING) {
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