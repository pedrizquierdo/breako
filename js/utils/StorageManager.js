export default class StorageManager {
    // --- PUNTUACIÓN MÁXIMA ---
    saveHighScore(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem('breako_highscore', score);
            return true;
        }
        return false;
    }

    getHighScore() {
        const stored = localStorage.getItem('breako_highscore');
        return stored ? parseInt(stored, 10) : 0;
    }

    // --- GUARDADO DE PARTIDA (CONTINUAR) ---
    saveProgress(gameStateData) {
        // Guardamos un objeto JSON con nivel, vidas y score
        localStorage.setItem('breako_savegame', JSON.stringify(gameStateData));
    }

    loadProgress() {
        const stored = localStorage.getItem('breako_savegame');
        return stored ? JSON.parse(stored) : null;
    }

    hasSavedGame() {
        return localStorage.getItem('breako_savegame') !== null;
    }

    clearProgress() {
        localStorage.removeItem('breako_savegame');
    }
}