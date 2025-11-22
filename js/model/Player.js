export default class Player {
    constructor(maxLives = 3) {
        this.maxLives = maxLives;
        this.lives = maxLives;
        this.score = 0;
        this.activeShield = false; // Para lógica de escudo
        this.puntosMejora = 0; // [PDF Pág 5] Puntos de mejora / Monedas
    }

    loseLife() {
        if (this.activeShield) {
            this.activeShield = false; // El escudo protege una vez
            return false; // No pierde vida real
        }
        this.lives--;
        return true;
    }

    addScore(points) {
        this.score += points;
    }

    addCoins(amount) {
        this.puntosMejora += amount;
    }

    reset() {
        this.lives = this.maxLives;
        this.score = 0;
        this.puntosMejora = 0;
        this.activeShield = false;
    }
}