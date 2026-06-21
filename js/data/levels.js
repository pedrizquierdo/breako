// Patrones de nivel hechos a mano.
// 0 = vacio, 1 = ladrillo normal (resistencia 1), 2 = ladrillo reforzado (resistencia 2)
export const LEVEL_PATTERNS = [
    // Nivel 1: filas simples, solo ladrillos normales, introduce el juego
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

    // Nivel 2: introduce huecos y algunos ladrillos reforzados
    [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    ],

    // Nivel 3: patron de diamante con ladrillos reforzados en el centro
    [
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
        [0, 1, 1, 2, 2, 2, 2, 1, 1, 0],
        [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    ],

    // Nivel 4: marco reforzado y fortaleza central
    [
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 1, 1, 2, 2, 1, 2],
        [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
        [2, 1, 2, 2, 1, 1, 2, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 2]
    ],

    // Nivel 5: laberinto denso de ladrillos reforzados
    [
        [1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
        [1, 2, 2, 2, 1, 1, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 2, 2, 2, 2, 2, 2, 1, 1],
        [0, 1, 1, 2, 2, 2, 2, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0]
    ]
];
