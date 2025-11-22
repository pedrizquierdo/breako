export default class Particle {
    constructor(position, color) {
        this.position = { x: position.x, y: position.y };
        // Velocidad aleatoria en todas direcciones
        this.velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
        this.size = Math.random() * 4 + 2; // Tamaño variable
        this.life = 1.0; // Vida (Opacidad)
        this.color = color; // Color del ladrillo
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += 0.1; // Gravedad
        this.life -= 0.02; // Desvanecimiento
    }
}