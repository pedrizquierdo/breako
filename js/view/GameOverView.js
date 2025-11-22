export default class GameOverView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    draw(ctx, score, level) {
        // --- CORRECCIÓN DE SEGURIDAD ---
        // Aseguramos que el pincel esté en modo "Pintar" y no "Borrar"
        // (Esto arregla el problema si moriste con el efecto de Oscuridad activo)
        ctx.globalCompositeOperation = 'source-over';
        
        // Fondo Negro semi-transparente (bajé la opacidad a 0.85 para ver un poco el juego detrás)
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Título GAME OVER
        ctx.font = "bold 60px 'Courier New'";
        ctx.fillStyle = "white"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Asegura que el texto esté centrado verticalmente
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2 - 50);

        // Línea decorativa
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.gameWidth / 2 - 120, this.gameHeight / 2 - 10);
        ctx.lineTo(this.gameWidth / 2 + 120, this.gameHeight / 2 - 10);
        ctx.stroke();

        // Estadísticas
        ctx.font = "24px 'Courier New'";
        ctx.fillStyle = "#cccccc"; 
        
        const finalScore = score !== undefined ? score : 0;
        const finalLevel = level !== undefined ? level : 1;

        ctx.fillText(`Puntuación: ${finalScore}`, this.gameWidth / 2, this.gameHeight / 2 + 30);
        ctx.fillText(`Nivel Alcanzado: ${finalLevel}`, this.gameWidth / 2, this.gameHeight / 2 + 60);

        // Instrucción
        ctx.fillStyle = "rgba(255, 255, 255, 1)"; 
        ctx.font = "bold 20px 'Courier New'";
        ctx.fillText("[ ESPACIO para Reiniciar ]", this.gameWidth / 2, this.gameHeight / 2 + 120);
    }
}