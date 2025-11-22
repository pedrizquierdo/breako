export default class Ball {
    constructor(gameWidth, gameHeight, position = null) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // DIMENSIÓN DEL SPRITE
        this.size = 20; 
        
        this.isExplosive = false;
        this.isHeavy = false;
        
        if (position) {
            // Para bolas clonadas (Multiball)
            this.position = { x: position.x, y: position.y };
            this.speed = { x: 4, y: -4 };
            this.isStuck = false;
        } else {
            this.reset();
        }
    }

    reset() {
        this.isStuck = true;
        this.isExplosive = false;
        this.isHeavy = false;
        this.speed = { x: 0, y: 0 };
        // Posición temporal, se sobrescribe en el primer update si isStuck es true
        this.position = { x: this.gameWidth / 2, y: this.gameHeight - 50 }; 
    }

    launch() {
        if (this.isStuck) {
            this.isStuck = false;
            this.speed = { x: 4, y: -4 }; 
        }
    }

    update(deltaTime, paddle) {
        if (this.isStuck) {
            // Lógica de pegado centrada
            this.position.x = paddle.position.x + paddle.width / 2 - this.size / 2;
            this.position.y = paddle.position.y - this.size; // Justo encima del paddle
        } else {
            let speedMultiplier = this.isHeavy ? 1.5 : 1.0;

            this.position.x += this.speed.x * speedMultiplier;
            this.position.y += this.speed.y * speedMultiplier;

            // Rebotes Paredes
            if (this.position.x + this.size > this.gameWidth) {
                this.speed.x = -Math.abs(this.speed.x); // Forzamos velocidad a la Izquierda
                this.position.x = this.gameWidth - this.size; // CORRECCIÓN: La sacamos del muro
            }

            // Pared Izquierda
            if (this.position.x < 0) {
                this.speed.x = Math.abs(this.speed.x); // Forzamos velocidad a la Derecha
                this.position.x = 0; // CORRECCIÓN: La sacamos del muro
            }

            // Techo
            if (this.position.y < 0) {
                this.speed.y = Math.abs(this.speed.y); // Forzamos velocidad Abajo
                this.position.y = 0; // CORRECCIÓN: La sacamos del techo
            }
        }
    }
}