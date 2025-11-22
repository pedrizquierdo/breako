export default class GameOverView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // Opciones disponibles
        this.options = ["NUEVA PARTIDA", "MENU"];
        this.selectedIndex = 0;
    }

    moveUp() {
        this.selectedIndex--;
        if (this.selectedIndex < 0) this.selectedIndex = this.options.length - 1;
    }

    moveDown() {
        this.selectedIndex++;
        if (this.selectedIndex >= this.options.length) this.selectedIndex = 0;
    }

    getSelection() {
        return this.options[this.selectedIndex];
    }

    // Método para reiniciar el cursor al abrirse (opcional, pero recomendado)
    resetSelection() {
        this.selectedIndex = 0;
    }

    draw(ctx, score, level) {
        ctx.globalCompositeOperation = 'source-over';
        
        // Fondo oscuro
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Título GAME OVER
        ctx.font = "bold 60px 'Courier New'";
        ctx.fillStyle = "white"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2 - 80);

        // Estadísticas (Texto más pequeño)
        ctx.font = "20px 'Courier New'";
        ctx.fillStyle = "#ccc"; 
        const finalScore = score !== undefined ? score : 0;
        const finalLevel = level !== undefined ? level : 1;
        ctx.fillText(`Score: ${finalScore} | Nivel: ${finalLevel}`, this.gameWidth / 2, this.gameHeight / 2 - 20);

        // --- DIBUJAR OPCIONES ---
        ctx.font = "bold 30px 'Courier New'";
        
        this.options.forEach((option, index) => {
            const yPos = (this.gameHeight / 2) + 50 + (index * 60);
            
            if (index === this.selectedIndex) {
                // Seleccionado: Blanco con corchetes
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(`[ ${option} ]`, this.gameWidth / 2, yPos);
            } else {
                // No seleccionado: Gris oscuro
                ctx.fillStyle = "#555555";
                ctx.fillText(option, this.gameWidth / 2, yPos);
            }
        });

        // Instrucciones pie de página
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#666";
        ctx.fillText("FLECHAS: Mover | ESPACIO: Seleccionar", this.gameWidth / 2, this.gameHeight - 40);
    }
}