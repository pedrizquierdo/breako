export const UPGRADE_TYPES = {
    MAX_LIVES: 'MAX_LIVES',
    PADDLE_WIDTH: 'PADDLE_WIDTH',
    BALL_SPEED: 'BALL_SPEED',
    BUFF_CHANCE: 'BUFF_CHANCE'
};

export const UPGRADES_CONFIG = [
    {
        id: 'EXTRA_LIFE',
        nombre: 'Vida Extra',
        descripcion: '+1 vida maxima al iniciar partida',
        costo: 50,
        tipo: UPGRADE_TYPES.MAX_LIVES,
        valor: 1
    },
    {
        id: 'WIDE_PADDLE',
        nombre: 'Paddle Ancho',
        descripcion: '+10% de ancho base en la pala',
        costo: 75,
        tipo: UPGRADE_TYPES.PADDLE_WIDTH,
        valor: 0.10
    },
    {
        id: 'SLOW_BALL',
        nombre: 'Bola Controlada',
        descripcion: '-10% velocidad inicial de la bola',
        costo: 60,
        tipo: UPGRADE_TYPES.BALL_SPEED,
        valor: -0.10
    },
    {
        id: 'LUCKY_DROP',
        nombre: 'Buena Suerte',
        descripcion: '+15% probabilidad de power-up positivo',
        costo: 100,
        tipo: UPGRADE_TYPES.BUFF_CHANCE,
        valor: 0.15
    }
];
