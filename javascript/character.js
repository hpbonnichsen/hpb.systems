/**
 * character.js - Modul til håndtering af spilkarakteren
 * Dette modul skaber, animerer og styrer karakteren i spillet
 */

/**
 * Opret en spilkarakter
 * @param {HTMLElement} container - Element, hvor karakteren skal tilføjes
 * @param {Object} options - Tilpasningsindstillinger (farve, startposition, osv)
 * @returns {Object} - Karakterobjekt med metoder til bevægelse og animation
 */
function createCharacter(container, options = {}) {
    // Indstillinger med standardværdier
    const settings = {
        color: 'rgb(251, 5, 235)', // Magenta standard
        startX: 100,
        startY: 120, // Fra bunden
        eyeColor: '#0055aa', // Blå øjne
        zIndex: 10,
        ...options
    };

    // Opret karakter-container
    const character = document.createElement('div');
    character.id = 'game-character';
    character.style.width = '32px';
    character.style.height = '48px';
    character.style.position = 'absolute';
    character.style.bottom = `${settings.startY}px`;
    character.style.left = `${settings.startX}px`;
    character.style.zIndex = settings.zIndex;
    character.style.transition = 'left 0.1s linear';
    
    // Opbyg karakter-dele
    const parts = {
        // Karakter-krop
        body: document.createElement('div'),
        // Karakter-øje
        eye: document.createElement('div'),
        // Karakter-arm
        arm: document.createElement('div'),
        // Karakter-ben 1
        leg1: document.createElement('div'),
        // Karakter-ben 2
        leg2: document.createElement('div')
    };
    
    // Krop
    parts.body.style.width = '16px';
    parts.body.style.height = '32px';
    parts.body.style.backgroundColor = settings.color;
    parts.body.style.position = 'absolute';
    parts.body.style.left = '8px';
    parts.body.style.top = '0';
    character.appendChild(parts.body);
    
    // Øje
    parts.eye.style.width = '4px';
    parts.eye.style.height = '4px';
    parts.eye.style.backgroundColor = settings.eyeColor;
    parts.eye.style.position = 'absolute';
    parts.eye.style.left = '18px';
    parts.eye.style.top = '8px';
    character.appendChild(parts.eye);
    
    // Arm
    parts.arm.style.width = '8px';
    parts.arm.style.height = '8px';
    parts.arm.style.backgroundColor = settings.color;
    parts.arm.style.position = 'absolute';
    parts.arm.style.left = '24px';
    parts.arm.style.top = '10px';
    character.appendChild(parts.arm);
    
    // Ben 1
    parts.leg1.style.width = '8px';
    parts.leg1.style.height = '16px';
    parts.leg1.style.backgroundColor = settings.color;
    parts.leg1.style.position = 'absolute';
    parts.leg1.style.left = '8px';
    parts.leg1.style.top = '32px';
    character.appendChild(parts.leg1);
    
    // Ben 2
    parts.leg2.style.width = '8px';
    parts.leg2.style.height = '16px';
    parts.leg2.style.backgroundColor = settings.color;
    parts.leg2.style.position = 'absolute';
    parts.leg2.style.left = '16px';
    parts.leg2.style.top = '32px';
    character.appendChild(parts.leg2);
    
    // Tilføj karakter til container
    container.appendChild(character);
    
    // Tilføj CSS animation til dokument for løb og hop
    if (!document.getElementById('character-animations')) {
        const style = document.createElement('style');
        style.id = 'character-animations';
        style.textContent = `
            @keyframes run-legs {
                0% { height: 16px; }
                50% { height: 12px; }
                100% { height: 16px; }
            }
            
            @keyframes jump {
                0% { transform: translateY(0); }
                50% { transform: translateY(-80px); }
                100% { transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animationsstatus
    let isRunning = false;
    let currentPosition = settings.startX;
    
    // Metoder til at kontrollere karakteren
    const characterController = {
        element: character,
        parts: parts,
        
        /**
         * Start løbe-animation
         */
        startRunning: function() {
            if (!isRunning) {
                isRunning = true;
                parts.leg1.style.animation = 'run-legs 0.4s infinite';
                parts.leg2.style.animation = 'run-legs 0.4s infinite 0.2s'; // Lidt forsinket for at se mere naturligt ud
            }
        },
        
        /**
         * Stop løbe-animation
         */
        stopRunning: function() {
            isRunning = false;
            parts.leg1.style.animation = 'none';
            parts.leg2.style.animation = 'none';
        },
        
        /**
         * Få karakterens nuværende X-position
         * @returns {number} - Nuværende X position
         */
        getX: function() {
            return currentPosition;
        },
        
        /**
         * Sæt karakterens X-position
         * @param {number} x - Ny X position
         */
        setX: function(x) {
            currentPosition = x;
            character.style.left = `${x}px`;
        },
        
        /**
         * Få karakter-element
         * @returns {HTMLElement} - Karakter DOM element
         */
        getElement: function() {
            return character;
        },
        
        /**
         * Udfør hop-animation
         * @param {function} callback - Funktion der kaldes når hop er færdigt
         */
        jump: function(callback) {
            // Stop løbe-animation midlertidigt
            const wasRunning = isRunning;
            if (wasRunning) {
                this.stopRunning();
            }
            
            // Tilføj hop-animation
            character.style.animation = 'jump 0.8s ease-out';
            
            // Tilføj animation til benene for et mere naturligt hop
            parts.leg1.style.animation = 'none';
            parts.leg2.style.animation = 'none';
            
            // Først sammenbøj ben for at forberede hop
            setTimeout(() => {
                parts.leg1.style.height = '10px';
                parts.leg1.style.top = '38px';
                parts.leg2.style.height = '10px';
                parts.leg2.style.top = '38px';
            }, 50);
            
            // Så stræk ben i hop-fasen
            setTimeout(() => {
                parts.leg1.style.height = '18px';
                parts.leg1.style.top = '32px';
                parts.leg2.style.height = '18px';
                parts.leg2.style.top = '32px';
            }, 300);
            
            // Sammenbøj igen ved landing
            setTimeout(() => {
                parts.leg1.style.height = '10px';
                parts.leg1.style.top = '38px';
                parts.leg2.style.height = '10px';
                parts.leg2.style.top = '38px';
            }, 600);
            
            // Gendan normal størrelse efter landing
            setTimeout(() => {
                parts.leg1.style.height = '16px';
                parts.leg1.style.top = '32px';
                parts.leg2.style.height = '16px';
                parts.leg2.style.top = '32px';
                
                character.style.animation = 'none';
                
                // Genstart løbe-animation hvis den var i gang før
                if (wasRunning) {
                    this.startRunning();
                }
                
                if (callback) {
                    callback();
                }
            }, 800);
        },
        
        /**
         * Skift øjenfarve (kan bruges til forskellige tilstande)
         * @param {string} color - Ny øjenfarve
         */
        setEyeColor: function(color) {
            parts.eye.style.backgroundColor = color;
        },
        
        /**
         * Blink med øjnene
         * @param {number} times - Antal blink (standard: 1)
         */
        blink: function(times = 1) {
            let blinkCount = 0;
            
            const doBlink = () => {
                parts.eye.style.opacity = '0';
                
                setTimeout(() => {
                    parts.eye.style.opacity = '1';
                    blinkCount++;
                    
                    if (blinkCount < times) {
                        setTimeout(doBlink, 150);
                    }
                }, 150);
            };
            
            doBlink();
        }
    };
    
    return characterController;
}

// Eksportér modul
window.characterModule = {
    createCharacter: createCharacter
};