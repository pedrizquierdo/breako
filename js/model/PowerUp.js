export const POWERUP_TYPES = {
    // BUFFS
    MEGA_PADDLE: 'MEGA',
    EXPLOSIVE: 'BOOM',
    MULTIBALL: 'MULTI',
    LOOT_RAIN: 'RAIN',
    SHIELD: 'SHIELD',

    // DEBUFFS
    MINI_PADDLE: 'MINI',
    HEAVY_BALL: 'HEAVY',
    INVERTED: 'CONFUSE',
    ARMORED_BRICKS: 'ARMOR',
    DARKNESS: 'DARK'
};

export default class PowerUp {
    constructor(position) {
        this.position = { x: position.x, y: position.y };
        
        // Dimensiones grandes para que se vean bien
        this.width = 32;
        this.height = 32;
        
        // Seleccionar tipo aleatorio
        const keys = Object.values(POWERUP_TYPES);
        this.type = keys[Math.floor(Math.random() * keys.length)];
        
        // --- AQUÍ ESTÁ EL TRUCO ---
        
        // 1. Definimos explícitamente la lista de malos usando los valores reales
        const debuffs = [
            POWERUP_TYPES.MINI_PADDLE,
            POWERUP_TYPES.HEAVY_BALL,
            POWERUP_TYPES.INVERTED,
            POWERUP_TYPES.ARMORED_BRICKS,
            POWERUP_TYPES.DARKNESS
        ];

        // Verificamos si el tipo actual está en la lista de malos
        this.isDebuff = debuffs.includes(this.type);

        // 2. Velocidad Drástica
        // Buenos: Velocidad 3 (Lento y seguro)
        // Malos: Velocidad 7 (Caída en picada)
        this.speed = this.isDebuff ? 7 : 3; 
        

        this.markedForDeletion = false;
        
        // Duración del efecto (10s)
        this.duration = 10000; 
        if (this.type === POWERUP_TYPES.SHIELD || this.type === POWERUP_TYPES.MULTIBALL) {
            this.duration = 0;
        }
    }

    update(deltaTime) {
        // Movimiento Vertical
        this.position.y += this.speed;

        if (this.position.y > 800) this.markedForDeletion = true;
    }
}