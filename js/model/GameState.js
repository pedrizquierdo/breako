export const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    VICTORY: 4,
    OPTIONS: 5 // <--- Nuevo estado
};

export default class GameState {
    constructor() {
        this.current = GAMESTATE.MENU;
    }
    
    set(newState) {
        this.current = newState;
    }
}