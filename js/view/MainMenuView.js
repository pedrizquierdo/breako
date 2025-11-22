export default class MainMenuView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.options = ["NUEVA PARTIDA", "CONTINUAR", "OPCIONES", "SALIR"];
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

    draw(ctx) {
        // Fondo Negro sólido
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Título BREAKO (Blanco grande)
        ctx.font = "bold 80px 'Courier New'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        // Efecto de sombra simple (gris)
        ctx.fillStyle = "#444"; 
        ctx.fillText("BREAKO", this.gameWidth / 2 + 4, 154);
        ctx.fillStyle = "white";
        ctx.fillText("BREAKO", this.gameWidth / 2, 150);

        // Opciones
        ctx.font = "30px 'Courier New'";
        
        this.options.forEach((option, index) => {
            const yPos = 300 + (index * 60);

            if (index === this.selectedIndex) {
                // SELECCIONADO: Blanco brillante con corchetes
                ctx.fillStyle = "#FFFFFF"; 
                ctx.fillText(`[ ${option} ]`, this.gameWidth / 2, yPos);
            } else {
                // NO SELECCIONADO: Gris oscuro
                ctx.fillStyle = "#555555"; 
                ctx.fillText(option, this.gameWidth / 2, yPos);
            }
        });

        // Footer
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#888"; // Gris medio
        ctx.fillText("FLECHAS: Mover | ESPACIO: Seleccionar", this.gameWidth / 2, this.gameHeight - 30);
    }
}