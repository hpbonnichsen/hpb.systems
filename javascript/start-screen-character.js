/**
 * start-screen-character.js - Optimeret modul til karakter på spil-startskærmen
 * Med pulserende effekt på startknappen
 */

// Tilstandsvariabel for at undgå gentagne initialiseringer
let isCharacterCreated = false;

/**
 * Opret og animer karakter på startskærmen
 * @param {HTMLElement} container - Container element til karakteren
 */
function createStartScreenCharacter(container) {
    if (isCharacterCreated || !container) {
        console.log("Character already created or container missing - skipping");
        return;
    }
    
    console.log("Creating start screen character");
    isCharacterCreated = true;
    
    // Tilføj pulserende effekt til startknappen med det samme
    addPulseEffectToButton();
    
    // Rens først containeren for eventuelle effekter fra tidligere kørsel
    container.innerHTML = '';
    
    // Opret en dedikeret container til selve karakter-animationen
    const animationContainer = document.createElement('div');
    animationContainer.className = 'animation-container';
    animationContainer.style.position = 'absolute';
    animationContainer.style.top = '0';
    animationContainer.style.left = '0';
    animationContainer.style.width = '100%';
    animationContainer.style.height = '100%';
    animationContainer.style.overflow = 'hidden';
    animationContainer.style.pointerEvents = 'none';
    animationContainer.style.zIndex = '5';
    container.appendChild(animationContainer);
    
    // Opret en separat container til lys/effekter
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'effects-container';
    effectsContainer.style.position = 'absolute';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.zIndex = '6';
    container.appendChild(effectsContainer);
    
    // Opret karakter
    const character = document.createElement('div');
    character.id = 'start-screen-character';
    character.style.position = 'absolute';
    character.style.width = '48px';
    character.style.height = '72px';
    character.style.bottom = '-60px'; // Hold dette positivt
    character.style.left = '-100px'; // Start uden for skærmen
    character.style.transform = 'scale(2.5)';
    character.style.transformOrigin = 'bottom center';
    character.style.zIndex = '10';
    
    // Opbyg karakter-dele
    const body = document.createElement('div');
    body.style.width = '16px';
    body.style.height = '32px';
    body.style.backgroundColor = 'rgb(251, 5, 235)'; // Magenta
    body.style.position = 'absolute';
    body.style.left = '8px';
    body.style.top = '0';
    
    const eye = document.createElement('div');
    eye.style.width = '4px';
    eye.style.height = '4px';
    eye.style.backgroundColor = '#0055aa'; // Blå
    eye.style.position = 'absolute';
    eye.style.left = '18px';
    eye.style.top = '8px';
    
    const arm = document.createElement('div');
    arm.style.width = '8px';
    arm.style.height = '8px';
    arm.style.backgroundColor = 'rgb(251, 5, 235)';
    arm.style.position = 'absolute';
    arm.style.left = '24px';
    arm.style.top = '10px';
    
    const leg1 = document.createElement('div');
    leg1.id = 'start-char-leg1';
    leg1.style.width = '8px';
    leg1.style.height = '16px';
    leg1.style.backgroundColor = 'rgb(251, 5, 235)';
    leg1.style.position = 'absolute';
    leg1.style.left = '8px';
    leg1.style.top = '32px';
    
    const leg2 = document.createElement('div');
    leg2.id = 'start-char-leg2';
    leg2.style.width = '8px';
    leg2.style.height = '16px';
    leg2.style.backgroundColor = 'rgb(251, 5, 235)';
    leg2.style.position = 'absolute';
    leg2.style.left = '16px';
    leg2.style.top = '32px';
    
    // Tilføj dele til karakteren
    character.appendChild(body);
    character.appendChild(eye);
    character.appendChild(arm);
    character.appendChild(leg1);
    character.appendChild(leg2);
    
    // Tilføj karakteren til den isolerede container
    animationContainer.appendChild(character);
    
    // Opret punkter i samme container som karakteren
    createInfoPoints(animationContainer);
    
    // Definér keyframes for ben-animation hvis de ikke findes allerede
    if (!document.getElementById('char-animation-keyframes')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'char-animation-keyframes';
        styleEl.textContent = `
            @keyframes run-leg {
                0% { height: 16px; }
                50% { height: 12px; }
                100% { height: 16px; }
            }
            
            @keyframes pulse-point {
                0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
                50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
                100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
            }
            
            @keyframes collect-flash {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    // Start animation
    animateCharacter(character, animationContainer, effectsContainer);
    
    // Opdater pulsering hver 3 sekunder
    const pulseInterval = setInterval(addPulseEffectToButton, 3000);
    
    // Returner funktion til at stoppe animationen og rengøre
    return function cleanup() {
        clearInterval(pulseInterval);
        isCharacterCreated = false;
    };
}

/**
 * Tilføj pulserende effekt til Start spillet knappen
 */
function addPulseEffectToButton() {
    const startButton = document.getElementById('start-game-button');
    if (!startButton) return;
    
    // Først, tilføj et pulserende animations-stilark hvis det ikke findes
    if (!document.getElementById('pulse-animation-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-style';
        style.innerHTML = `
            @keyframes button-pulse {
                0% { transform: scale(1); box-shadow: 0 0 20px rgba(51, 255, 51, 0.4); }
                50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(51, 255, 51, 0.6); }
                100% { transform: scale(1); box-shadow: 0 0 20px rgba(51, 255, 51, 0.4); }
            }
            
            .pulse-animation {
                animation: button-pulse 2s infinite ease-in-out !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Sikre at knappen har de rigtige stil-egenskaber
    startButton.style.position = 'relative';
    startButton.style.zIndex = '200';
    
    // Fjern eventuel eksisterende animation
    startButton.style.animation = 'none';
    
    // Tilføj vores pulserende klasse
    startButton.classList.add('pulse-animation');
    
    // Bevar hover-effekten - gør det kun én gang for at undgå flere listeners
    if (!startButton.dataset.hoverInitialized) {
        startButton.dataset.hoverInitialized = "true";
        
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 30px rgba(51, 255, 51, 0.6)';
        });
        
        startButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
}

/**
 * Opret infopunkter på start-scenen - simplificeret
 * @param {HTMLElement} container - Scene container
 */
function createInfoPoints(container) {
    // Opret infopunkter
    const colors = ['#33ff33', '#ff33ff', '#0099ff'];
    const positions = [0.25, 0.5, 0.75]; // Positioner som andel af containerens bredde
    
    positions.forEach((pos, index) => {
        const infoPoint = document.createElement('div');
        infoPoint.className = 'start-info-point';
        infoPoint.style.position = 'absolute';
        infoPoint.style.width = '25px';
        infoPoint.style.height = '25px';
        infoPoint.style.borderRadius = '50%';
        infoPoint.style.backgroundColor = colors[index % colors.length];
        infoPoint.style.bottom = '30px'; // Match charakterens position
        infoPoint.style.left = `${pos * 100}%`;
        infoPoint.style.transform = 'translateX(-50%)';
        infoPoint.style.boxShadow = `0 0 15px ${colors[index % colors.length]}`;
        infoPoint.style.animation = 'pulse-point 1.5s infinite';
        infoPoint.style.zIndex = '5';
        infoPoint.style.pointerEvents = 'none';
        
        // Gem index på punktet
        infoPoint.dataset.index = index;
        
        container.appendChild(infoPoint);
    });
}

// Gemmer animation ID'er for at kunne annullere dem
let animationIntervals = [];
let animationFrameId = null;

/**
 * Animer karakteren på en sikker måde
 * @param {HTMLElement} character - Karakter element
 * @param {HTMLElement} container - Animations container
 * @param {HTMLElement} effectsContainer - Container til visuelle effekter
 */
function animateCharacter(character, container, effectsContainer) {
    // Ryd eventuelt tidligere animationsframe
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Ryd eventuelle intervaller
    animationIntervals.forEach(clearInterval);
    animationIntervals = [];
    
    const containerWidth = container.offsetWidth;
    const leg1 = document.getElementById('start-char-leg1');
    const leg2 = document.getElementById('start-char-leg2');
    
    // Start ben-animation
    if (leg1 && leg2) {
        leg1.style.animation = 'run-leg 0.4s infinite';
        leg2.style.animation = 'run-leg 0.4s infinite 0.2s';
    }
    
    // Start bevægelse
    character.style.transition = 'left 8s linear';
    character.style.left = `${containerWidth + 100}px`;
    
    // Håndtér kollision med infopunkter - meget simplificeret version
    const checkCollisions = setInterval(() => {
        // Stop hvis karakter er fjernet
        if (!character || !character.isConnected) {
            clearInterval(checkCollisions);
            return;
        }
        
        const characterRect = character.getBoundingClientRect();
        const characterX = characterRect.x + characterRect.width / 2;
        
        // Tjek alle punkter
        const points = container.querySelectorAll('.start-info-point');
        
        points.forEach(point => {
            // Skip if already collected
            if (point.dataset.collected === 'true') return;
            
            const pointRect = point.getBoundingClientRect();
            const pointX = pointRect.x + pointRect.width / 2;
            
            // Hvis kollision
            if (Math.abs(characterX - pointX) < 20) {
                // Marker som indsamlet
                point.dataset.collected = 'true';
                
                // Skift animation på punktet uden at ændre DOM struktur
                point.style.animation = 'none';
                point.style.opacity = '0';
                
                // Blink med øjet
                const eye = character.querySelector('div:nth-child(2)');
                if (eye) {
                    eye.style.opacity = '0';
                    setTimeout(() => { eye.style.opacity = '1'; }, 150);
                    setTimeout(() => { eye.style.opacity = '0'; }, 300);
                    setTimeout(() => { eye.style.opacity = '1'; }, 450);
                }
                
                // Tilføj flash-effekt i den separate container
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.width = '35px';
                flash.style.height = '35px';
                flash.style.borderRadius = '50%';
                flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                
                const absX = pointX;
                const absY = pointRect.top;
                
                flash.style.left = `${absX}px`;
                flash.style.top = `${absY}px`;
                flash.style.transform = 'translate(-50%, -50%)';
                flash.style.opacity = '1';
                
                // Simpel forsvinde-animation med CSS transitions
                flash.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                effectsContainer.appendChild(flash);
                
                // Start forsvinde-animation efter et lille delay
                setTimeout(() => {
                    flash.style.transform = 'translate(-50%, -50%) scale(2)';
                    flash.style.opacity = '0';
                }, 10);
                
                // Fjern efter animation
                setTimeout(() => {
                    if (flash.parentNode) {
                        flash.parentNode.removeChild(flash);
                    }
                }, 510);
            }
        });
    }, 100);
    
    // Gem interval ID for senere oprydning
    animationIntervals.push(checkCollisions);
    
    // Genstart animation efter karakteren er nået til enden - men kun hvis containeren stadig eksisterer
    const restartTimeout = setTimeout(() => {
        // Stop kollisionstjek
        clearInterval(checkCollisions);
        
        // Start forfra med en hel ny karakter hvis containeren stadig findes
        if (container && container.parentNode) {
            // Fjern alle listeners og gentagne start
            isCharacterCreated = false;
            createStartScreenCharacter(container.parentNode);
        }
    }, 8000);
    
    // Gem timeout ID for senere oprydning
    animationIntervals.push(restartTimeout);
}

// Eksporter funktion
window.createStartScreenCharacter = createStartScreenCharacter;