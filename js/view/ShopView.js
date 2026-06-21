import { UPGRADES_CONFIG } from '../model/Upgrade.js';

export default class ShopView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.upgrades = UPGRADES_CONFIG;
        this.selectedIndex = 0;
    }

    moveUp() {
        this.selectedIndex--;
        if (this.selectedIndex < 0) this.selectedIndex = this.upgrades.length - 1;
    }

    moveDown() {
        this.selectedIndex++;
        if (this.selectedIndex >= this.upgrades.length) this.selectedIndex = 0;
    }

    getCurrentUpgrade() {
        return this.upgrades[this.selectedIndex];
    }

    draw(ctx, puntosMejora, purchasedUpgrades) {
        // 1. Fondo
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // 2. Título
        ctx.font = "bold 40px 'Courier New'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("TIENDA", this.gameWidth / 2, 70);

        ctx.font = "20px 'Courier New'";
        ctx.fillStyle = "#fa0";
        ctx.fillText(`MONEDAS: ${puntosMejora}`, this.gameWidth / 2, 110);

        // 3. Dibujar cada mejora
        this.upgrades.forEach((upgrade, index) => {
            const isSelected = index === this.selectedIndex;
            const isPurchased = purchasedUpgrades.includes(upgrade.id);
            const canAfford = puntosMejora >= upgrade.costo;

            const yPos = 170 + (index * 90);

            let titleColor = "#555555";
            if (isPurchased) {
                titleColor = "#3a3";
            } else if (isSelected) {
                titleColor = canAfford ? "#FFFFFF" : "#888888";
            } else if (!canAfford) {
                titleColor = "#333333";
            }

            ctx.font = "24px 'Courier New'";
            ctx.fillStyle = titleColor;
            let label = upgrade.nombre;
            if (isSelected) label = `> ${label}`;
            ctx.fillText(label, this.gameWidth / 2, yPos);

            ctx.font = "16px 'Courier New'";
            ctx.fillStyle = "#888";
            ctx.fillText(upgrade.descripcion, this.gameWidth / 2, yPos + 25);

            ctx.font = "18px 'Courier New'";
            if (isPurchased) {
                ctx.fillStyle = "#3a3";
                ctx.fillText("COMPRADO", this.gameWidth / 2, yPos + 50);
            } else {
                ctx.fillStyle = canAfford ? "#fa0" : "#a55";
                ctx.fillText(`COSTO: ${upgrade.costo}`, this.gameWidth / 2, yPos + 50);
            }
        });

        // 4. Footer
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#888";
        ctx.fillText("FLECHAS: Mover | ESPACIO: Comprar | ESC: Volver", this.gameWidth / 2, this.gameHeight - 30);
    }
}
