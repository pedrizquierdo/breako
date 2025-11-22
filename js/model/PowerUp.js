export const POWERUP_TYPES = {
    // BUFFS
    MEGA_PADDLE: 'MEGA',         // 1. Grande
    EXPLOSIVE: 'BOOM',           // 2. Explosiva
    MULTIBALL: 'MULTI',          // 3. Duplicación
    LOOT_RAIN: 'RAIN',           // 4. Lluvia
    SHIELD: 'SHIELD',            // 5. Escudo

    // DEBUFFS
    MINI_PADDLE: 'MINI',         // 6. Pequeño
    HEAVY_BALL: 'HEAVY',         // 7. Pesada/Rápida
    INVERTED: 'CONFUSE',         // 8. Controles Invertidos
    ARMORED_BRICKS: 'ARMOR',     // 9. Ladrillos Duros
    DARKNESS: 'DARK'             // 10. Oscuridad
};

export default class PowerUp {
    constructor(position) {
        this.position = { x: position.x, y: position.y };
        
        // AJUSTE DE TAMAÑO PARA SPRITES CUADRADOS
        this.width = 32;
        this.height = 32;
        
        this.speed = 3;
        this.markedForDeletion = false;
        
        // Seleccionar tipo... (resto del código igual)
        const keys = Object.values(POWERUP_TYPES);
        this.type = keys[Math.floor(Math.random() * keys.length)];
        
        this.duration = 10000; 
        if (this.type === POWERUP_TYPES.SHIELD || this.type === POWERUP_TYPES.MULTIBALL) {
            this.duration = 0;
        }
    }

    update(deltaTime) {
        this.position.y += this.speed;
        if (this.position.y > 800) this.markedForDeletion = true;
    }
}