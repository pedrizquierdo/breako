// controller/SpriteManager.js
export default class SpriteManager {
    constructor() {
        this.sprites = {
            // Entidades Base
            paddle: this.loadImage('assets/sprites/paddle.png'),
            ball:   this.loadImage('assets/sprites/ball.png'),

            // POWER-UPS (Las claves coinciden con POWERUP_TYPES)
            'MEGA':    this.loadImage('assets/sprites/powerups/mega.png'),
            'BOOM':    this.loadImage('assets/sprites/powerups/Bola Explosiva.png'),
            'MULTI':   this.loadImage('assets/sprites/powerups/multi.png'),
            'RAIN':    this.loadImage('assets/sprites/powerups/lluvia.png'),
            'SHIELD':  this.loadImage('assets/sprites/powerups/Escudo Inferior.png'),
            
            'MINI':    this.loadImage('assets/sprites/powerups/Mini-Paddle.png'),
            'HEAVY':   this.loadImage('assets/sprites/powerups/Bola Pesada.png'),
            'CONFUSE': this.loadImage('assets/sprites/powerups/Controles Invertidos.png'),
            'ARMOR':   this.loadImage('assets/sprites/powerups/Ladrillos Blindados.png'),
            'DARK':    this.loadImage('assets/sprites/powerups/Oscurecimiento del Nivel.png')
        };
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        img.onerror = () => console.warn(`Falta sprite: ${src}`);
        return img;
    }

    get(name) {
        const img = this.sprites[name];
        return (img && img.complete && img.naturalWidth !== 0) ? img : null;
    }
}