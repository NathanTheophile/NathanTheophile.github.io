// === CONFIG VISUELLE ET TECHNIQUE DU CANVAS ===
const CONFIG = 
{
    screenMultiplierX: 2,        // % largeur écran (2 = 200%)
    screenMultiplierY: 1,        // % hauteur écran (1 = 100%)
    lineSpacing: 20,             // espace entre lignes (px)
    yStep: 20,                   // espacement vertical (px)
    curveAmplitude: 10,          // amplitude de la courbe
    curveFrequency: 0.01,        // fréquence de la courbe
    curveScrollOffset: 0.01,     // variation entre les lignes
    lineBaseColor: [255, 255, 255], // couleur des lignes (r, g, b)
    lineBaseOpacity: 0.05,       // opacité des lignes normales
    linePulseOpacity: 0.25,      // opacité des impulsions
    pulseChance: 0.0002,         // probabilité qu’une ligne pulse (par frame)
    pulseHeight: 50,             // hauteur visible de l’impulsion
    pulseDuration: 6,            // durée (en frames) d’une impulsion
    offsetSpeed: 0.5,            // vitesse d’ondulation
};

export { CONFIG };