/**
 * world.js - Håndterer skabelse og rendering af spilverdenen
 * Dette modul håndterer verdensobjekter, baggrund, platforme og skyer
 */

// Definer farver (så de er tilgængelige alle steder)
const COLORS = {
    amigaBlue: '#0055aa',        // Amiga blå baggrund
    amigaLightBlue: '#0077cc',   // Lysere blå til accenter
    amigaWhite: 'rgb(255, 255, 255)', // Hvid til text og kontrast
    amigaBlack: '#000000',       // Sort til kontrast
    amigaOrange: '#ff8800',      // Amiga orange til accenter
    groundColor: 'rgb(108, 251, 5)',  // Grøn jordfarve
    groundAccent: 'rgba(228, 131, 61, 0.86)', // Brun accent
    
    // Grid farver
    amigaGrid: 'rgba(232, 234, 235, 0.2)', // Grid-linjer (lyseblå med transparens)
    groundGrid: 'rgba(218, 199, 199, 0.2)', // Grid-linjer på jorden
    cloudColor: 'rgba(255, 255, 255, 0.8)' // Sky farve
};

/**
 * Opret verden hvor spillet foregår
 * @param {number} width - Bredden af verdenen i pixels
 * @param {HTMLElement} container - Container element hvor verdenen skal tilføjes
 * @returns {Object} - Objekter og funktioner relateret til verdenen
 */
function createWorld(width, container) {
    const worldWidth = width || 6000; // Standard bredde hvis ikke angivet
    
    // Opret verden (så vi kan scrolle den)
    const gameWorld = document.createElement('div');
    gameWorld.id = 'game-world';
    gameWorld.style.position = 'absolute';
    gameWorld.style.width = `${worldWidth}px`;
    gameWorld.style.height = '100%';
    gameWorld.style.left = '0';
    gameWorld.style.top = '0';
    gameWorld.style.backgroundColor = COLORS.amigaBlue;
    
    // Tilføj grid baggrund
    gameWorld.style.backgroundImage = `linear-gradient(${COLORS.amigaGrid} 1px, transparent 1px), 
                                      linear-gradient(90deg, ${COLORS.amigaGrid} 1px, transparent 1px)`;
    gameWorld.style.backgroundSize = '32px 32px';
    
    // Tilføj verden til container
    container.appendChild(gameWorld);
    
    // Opret platform
    const platform = document.createElement('div');
    platform.style.width = `${worldWidth}px`;
    platform.style.height = '120px';
    platform.style.backgroundColor = COLORS.groundColor;
    platform.style.position = 'absolute';
    platform.style.bottom = '0';
    platform.style.left = '0';
    
    // Tilføj grid mønster til platform
    platform.style.backgroundImage = `linear-gradient(90deg, ${COLORS.groundGrid} 1px, transparent 1px)`;
    platform.style.backgroundSize = '32px 100%';
    
    // Tilføj platform til verden
    gameWorld.appendChild(platform);
    
    // Tilføj jordtekstur (små prikker/pixels for tekstur)
    addGroundTexture(platform, worldWidth);
    
    // Tilføj skyer til verdenen
    addClouds(gameWorld, worldWidth);
    
    // Funktion til at opdatere verdens position (scroll)
    function updateWorldPosition(offset) {
        gameWorld.style.transform = `translateX(${offset}px)`;
    }
    
    // Returnér verden og relevante funktioner
    return {
        element: gameWorld,
        platform: platform,
        width: worldWidth,
        updatePosition: updateWorldPosition,
        addInfoPoint: function(position, color, animation, height) {
            return addInfoPoint(gameWorld, position, color, animation, height);
        }
    };
}

/**
 * Tilføjer jordtekstur (små prikker) til en platform
 * @param {HTMLElement} platform - Platform element
 * @param {number} width - Platformens bredde
 */
function addGroundTexture(platform, width) {
    const dotCount = Math.floor(width / 20); // Ca. en prik for hver 20px
    
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.backgroundColor = COLORS.groundAccent;
        dot.style.position = 'absolute';
        dot.style.bottom = `${Math.floor(Math.random() * 80)}px`;
        dot.style.left = `${Math.floor(Math.random() * width)}px`;
        dot.style.borderRadius = '50%';
        platform.appendChild(dot);
    }
}

/**
 * Tilføj skyer til verdenen
 * @param {HTMLElement} world - Verdens element
 * @param {number} width - Verdens bredde
 */
function addClouds(world, width) {
    // Antal skyer baseret på verdens størrelse
    const cloudCount = Math.floor(width / 800) + 5;
    
    // Tilføj CSS animation for skyer - BEMÆRK: Vi definerer nu animationen dynamisk for hver sky
    const cloudAnimation = document.createElement('style');
    cloudAnimation.textContent = `
        @keyframes float-cloud-base {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 10px); }
        }
    `;
    document.head.appendChild(cloudAnimation);
    
    // Opret skyer
    for (let i = 0; i < cloudCount; i++) {
        // Bestem placering
        const xPos = Math.random() * width;
        const yPos = 50 + Math.random() * 150; // Skyer i forskellige højder
        
        // Opret sky-container
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.position = 'absolute';
        cloud.style.left = `${xPos}px`;
        cloud.style.top = `${yPos}px`;
        cloud.style.zIndex = '2';
        
        // Bestem skyens størrelse (variér størrelsen for mere naturligt udseende)
        const cloudScale = 0.5 + Math.random() * 1.0;
        cloud.style.transform = `scale(${cloudScale})`;
        
        // Sammensæt skyen af flere cirkler
        const cloudParts = Math.floor(3 + Math.random() * 3); // 3-5 dele
        
        for (let j = 0; j < cloudParts; j++) {
            const cloudPart = document.createElement('div');
            cloudPart.style.position = 'absolute';
            cloudPart.style.backgroundColor = COLORS.cloudColor;
            
            // Tilfældig størrelse for hver del
            const size = 30 + Math.random() * 40;
            cloudPart.style.width = `${size}px`;
            cloudPart.style.height = `${size}px`;
            cloudPart.style.borderRadius = '50%';
            
            // Tilfældig placering indenfor sky-området
            const partX = j * 20;
            const partY = Math.random() * 10;
            cloudPart.style.left = `${partX}px`;
            cloudPart.style.top = `${partY}px`;
            
            // Tilføj del til skyen
            cloud.appendChild(cloudPart);
        }
        
        // Tilføj animation til skyerne - unik for hver sky
        const animationSpeed = 50 + Math.random() * 200; // Varierende hastigheder
        const animationDistance = 20 + Math.random() * 50;
        const animationHeight = Math.random() * 20 - 10;
        
        const uniqueAnimationName = `float-cloud-${i}`;
        const uniqueAnimation = document.createElement('style');
        uniqueAnimation.textContent = `
            @keyframes ${uniqueAnimationName} {
                0% { transform: translate(0, 0) scale(${cloudScale}); }
                100% { transform: translate(${animationDistance}px, ${animationHeight}px) scale(${cloudScale}); }
            }
        `;
        document.head.appendChild(uniqueAnimation);
        
        cloud.style.animation = `${uniqueAnimationName} ${animationSpeed}s infinite alternate ease-in-out`;
        
        // Tilføj sky til verdenen
        world.appendChild(cloud);
    }
}

/**
 * Tilføj et informationspunkt til verdenen
 * @param {HTMLElement} world - Verdens element
 * @param {number} position - X position for infopunktet
 * @param {string} color - Farve på infopunktet
 * @param {string} animation - CSS animation navn
 * @param {number} height - Højde fra bunden (standard 140px)
 * @returns {HTMLElement} - Det oprettede infopunkt
 */
function addInfoPoint(world, position, color, animation, height = 140) {
    const infoPoint = document.createElement('div');
    infoPoint.style.width = '20px';
    infoPoint.style.height = '20px';
    infoPoint.style.borderRadius = '50%';
    infoPoint.style.backgroundColor = color || COLORS.amigaOrange;
    infoPoint.style.position = 'absolute';
    infoPoint.style.bottom = `${height}px`; // Variabel højde
    infoPoint.style.left = `${position}px`;
    infoPoint.style.zIndex = '5';
    infoPoint.style.boxShadow = `0 0 10px ${color || COLORS.amigaOrange}`;
    
    // Tilføj animation hvis angivet
    if (animation) {
        infoPoint.style.animation = animation;
    }
    
    // Tilføj infopunkt til verdenen
    world.appendChild(infoPoint);
    
    return infoPoint;
}

// Eksportér funktioner, så de er tilgængelige fra andre scripts
window.worldModule = {
    createWorld: createWorld,
    colors: COLORS
};