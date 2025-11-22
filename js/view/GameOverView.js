export default class GameOverView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    draw(ctx, score, level) {
        // Fondo Negro casi opaco (para tapar el nivel de fondo casi por completo)
        ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Título GAME OVER
        ctx.font = "bold 60px 'Courier New'";
        ctx.fillStyle = "white"; // Blanco puro
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2 - 60);

        // Línea decorativa
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.gameWidth / 2 - 100, this.gameHeight / 2 - 40);
        ctx.lineTo(this.gameWidth / 2 + 100, this.gameHeight / 2 - 40);
        ctx.stroke();

        // Estadísticas
        ctx.font = "24px 'Courier New'";
        ctx.fillStyle = "#cccccc"; // Gris muy claro
        
        const finalScore = score !== undefined ? score : 0;
        const finalLevel = level !== undefined ? level : 1;

        ctx.fillText(`Puntuación: ${finalScore}`, this.gameWidth / 2, this.gameHeight / 2 + 10);
        ctx.fillText(`Nivel Alcanzado: ${finalLevel}`, this.gameWidth / 2, this.gameHeight / 2 + 50);

        // Instrucción parpadeante (simulada o estática)
        ctx.fillStyle = "#666666"; // Gris oscuro
        ctx.font = "20px 'Courier New'";
        ctx.fillText("- Presiona ESPACIO para salir -", this.gameWidth / 2, this.gameHeight / 2 + 120);
    }
}