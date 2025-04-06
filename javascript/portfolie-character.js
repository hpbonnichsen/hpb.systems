// portfolie-character.js - Optimeret version
// Til at styre visning af karakteren på hovedsiden

// Tilstandsvariabel for at undgå gentagne initialiseringer
let isPortfolioCharacterCreated = false;
let characterAnimation = null; // Reference til animation-stopfunktion

document.addEventListener('DOMContentLoaded', function() {
    console.log("Portfolio karakter script indlæst");
    
    // Vent til hovedindholdet er synligt før vi viser karakteren
    const mainContent = document.getElementById('main-content');
    
    // Opsæt en observer for at se hvornår hovedindholdet bliver synligt
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "style" && 
                mainContent.style.display === "block") {
                
                console.log("Hovedindhold er synligt, starter karakter");
                // Stop observering når vi har fundet det vi leder efter
                observer.disconnect();
                
                // Start karakter efter kort pause for at give siden tid til at rendere
                setTimeout(createPortfolioCharacter, 100);
            }
        });
    });
    
    // Observér ændringer i style attributten på mainContent, hvis elementet findes
    if (mainContent) {
        observer.observe(mainContent, { attributes: true });
        
        // Check om det allerede er synligt (i tilfælde af at vi går glip af mutations)
        if (mainContent.style.display === "block") {
            console.log("Hovedindhold allerede synligt, starter karakter");
            observer.disconnect();
            setTimeout(createPortfolioCharacter, 100);
        }
    } else {
        console.error("Hovedindhold element ikke fundet");
    }
    
    // Fallback hvis vi af en eller anden grund ikke fanger style ændringen
    setTimeout(function() {
        if (mainContent && mainContent.style.display === "block" && 
            !isPortfolioCharacterCreated) {
            console.log("Fallback: Starter karakter animation");
            createPortfolioCharacter();
        }
    }, 3000);
});

/**
 * Hovedfunktion til at oprette og vise portfolio-karakteren
 */
function createPortfolioCharacter() {
    // Undgå at oprette karakteren flere gange
    if (isPortfolioCharacterCreated) {
        console.log("Portfolio karakter allerede oprettet - springer over");
        return;
    }
    
    // Marker at karakteren nu bliver oprettet
    isPortfolioCharacterCreated = true;
    
    // Tjek om vi har en hero section at tilføje karakteren til
    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
        console.error("Hero section ikke fundet");
        isPortfolioCharacterCreated = false; // Nulstil flag så vi kan prøve igen senere
        return;
    }
    
    // Opret karakter direkte uden at afhænge af character.js
    characterAnimation = createAndAnimateCharacter(heroSection);
}

/**
 * Opret og animer karakteren i den angivne container
 * @param {HTMLElement} container - Container element til karakteren
 * @returns {Object} - Funktioner til at kontrollere karakteren
 */
function createAndAnimateCharacter(container) {
    console.log("Opretter simpel karakter til portfolio");
    
    // Opret container til karakteren
    const characterContainer = document.createElement('div');
    characterContainer.id = 'portfolio-character-container';
    characterContainer.style.position = 'absolute';
    characterContainer.style.top = '0';
    characterContainer.style.left = '0';
    characterContainer.style.width = '100%';
    characterContainer.style.height = '100%';
    characterContainer.style.overflow = 'hidden';
    characterContainer.style.pointerEvents = 'none';
    characterContainer.style.zIndex = '5';
    
    // Tilføj container til hero section
    container.appendChild(characterContainer);
    
    // Opret karakter
    const character = document.createElement('div');
    character.id = 'portfolio-character';
    character.style.position = 'absolute';
    character.style.width = '48px';
    character.style.height = '72px';

    // Funktion til at beregne og opdatere position
    function updateCharacterPosition() {
        const windowHeight = window.innerHeight;
        
        // På små skærme (under 600px højde)
        if (windowHeight < 600) {
            character.style.bottom = '15%'; // Fast afstand fra bunden
        } 
        // På mellemstore skærme
        else if (windowHeight < 900) {
            character.style.bottom = '15%'; // Procentvis placering
        } 
        // På store skærme
        else {
            character.style.bottom = `${Math.min(225, windowHeight * 0.3)}px`; // Begræns maksimal afstand
        }
    }

    // Sæt initial position
    updateCharacterPosition();

    // Opdater position ved resize - men fjern først tidligere listener hvis den findes
    window.removeEventListener('resize', updateCharacterPosition);
    window.addEventListener('resize', updateCharacterPosition);

    character.style.left = '-100px'; // Start uden for skærmen
    character.style.transform = 'scale(3)';
    character.style.transformOrigin = 'bottom left';
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
    leg1.id = 'char-leg1';
    leg1.style.width = '8px';
    leg1.style.height = '16px';
    leg1.style.backgroundColor = 'rgb(251, 5, 235)';
    leg1.style.position = 'absolute';
    leg1.style.left = '8px';
    leg1.style.top = '32px';
    
    const leg2 = document.createElement('div');
    leg2.id = 'char-leg2';
    leg2.style.width = '8px';
    leg2.style.height = '16px';
    leg2.style.backgroundColor = 'rgb(251, 5, 235)';
    leg2.style.position = 'absolute';
    leg2.style.left = '16px';
    leg2.style.top = '32px';
    
    // Tilføj style for animation hvis den ikke allerede findes
    if (!document.getElementById('portfolio-character-animations')) {
        const style = document.createElement('style');
        style.id = 'portfolio-character-animations';
        style.textContent = `
            @keyframes run-leg {
                0% { height: 16px; }
                50% { height: 12px; }
                100% { height: 16px; }
            }
            
            @keyframes blink {
                0%, 45%, 55%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 0.8; }
            }
            
            @keyframes dissolve {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Tilføj dele til karakteren
    character.appendChild(body);
    character.appendChild(eye);
    character.appendChild(arm);
    character.appendChild(leg1);
    character.appendChild(leg2);
    
    // Opret infopunkt
    const infoPoint = document.createElement('div');
    infoPoint.id = 'info-point';
    infoPoint.style.position = 'absolute';
    infoPoint.style.width = '50px';  // 50px bredde
    infoPoint.style.height = '50px'; // 50px højde
    infoPoint.style.borderRadius = '50%';
    infoPoint.style.backgroundColor = '#33ff33'; // Grøn farve
    infoPoint.style.boxShadow = '0 0 15px rgba(51, 255, 51, 0.7)';
    infoPoint.style.animation = 'pulse 1.5s infinite';
    infoPoint.style.zIndex = '9';
    
    // Placer infopunktet i midten af skærmen
    function updateInfoPointPosition() {
        // Vandret centrering
        const viewportWidth = window.innerWidth;
        const pointX = viewportWidth / 2 - 25; // 25 = halvdelen af bredden (50px)
        infoPoint.style.left = `${pointX}px`;
        
        // Hent karakterens bottom værdi
        let characterBottom = character.style.bottom;
        if (characterBottom) {
            // Konverter til numerisk værdi hvis det er en streng med 'px' eller '%'
            characterBottom = characterBottom.replace('px', '').replace('%', '');
            characterBottom = parseFloat(characterBottom);
            
            // Få karakterens højde
            const characterRect = character.getBoundingClientRect();
            const characterHeight = characterRect.height || 72 * 3; // Fallback til ca højde
            
            // Beregn position for infopunktet, så det er på niveau med karakterens midte
            // Hvis karakteren er 72px høj (før skalering) og infopunktet er 50px højt
            // vi vil placere infopunktet så dets midte flugter med karakterens midte
            
            // Beregn half-height af både karakter og infopunkt
            const characterHalfHeight = characterHeight / 2;
            const infoPointHalfHeight = 25; // 50px / 2
            
            // Beregn forskellen for at justere infopunktets bottom position
            // Hvis characterBottom er i px
            if (character.style.bottom.includes('px')) {
                // Tilføj lidt højde for at placere infopunktet i midten af karakteren
                const infoPointBottom = characterBottom + (characterHalfHeight - infoPointHalfHeight);
                infoPoint.style.bottom = `${infoPointBottom}px`;
            } 
            // Hvis characterBottom er i %
            else if (character.style.bottom.includes('%')) {
                // Brug samme procent plus en justering
                infoPoint.style.bottom = `${characterBottom}%`;
                // Tilføj en pixel-baseret justering for at centrere
                infoPoint.style.marginBottom = `${characterHalfHeight - infoPointHalfHeight}px`;
            }
        } else {
            // Fallback hvis vi ikke kan få karakterens position
            infoPoint.style.bottom = '60px'; // Standard værdi
        }
    }
    
    // Tilføj karakteren og infopunktet til container
    characterContainer.appendChild(character);
    characterContainer.appendChild(infoPoint);
    
    // Opdater infopunktets position
    updateInfoPointPosition();
    
    // Animation variabler
    let isAnimating = true; // Flag til at kontrollere loopet
    let animationIntervals = []; // Gem interval IDs
    
    // Beregn positioner for animation
    function calculateInfoPointPosition() {
        const infoPointRect = infoPoint.getBoundingClientRect();
        return infoPointRect.left;
    }
    
    function calculateEndPosition() {
        return window.innerWidth + 100; // 100px uden for højre kant
    }
    
    // Funktion til at køre én omgang af animationen
    function runAnimation() {
        // Hvis animationen er stoppet, afbryd funktionen
        if (!isAnimating) return;
        
        // Vis container hvis den er skjult
        characterContainer.style.display = '';
        
        // Genopsæt infopunktet
        infoPoint.style.opacity = '1';
        infoPoint.style.animation = 'pulse 1.5s infinite';
        
        // Placer karakteren uden for skærmen til venstre
        character.style.transition = 'none';
        character.style.left = '-100px';
        
        // Opdater infopunktets position
        updateInfoPointPosition();
        
        // Beregn positioner
        const infoPointPosition = calculateInfoPointPosition();
        const endPosition = calculateEndPosition();
        
        // Beregn timing for bevægelsen
        const startPosition = -100;
        const totalDistance = endPosition - startPosition;
        const infoPointDistance = infoPointPosition - startPosition;
        const totalTime = 4000; // 4 sekunder
        const timeToInfoPoint = (infoPointDistance / totalDistance) * totalTime;
        
        console.log(`Time to info point: ${timeToInfoPoint}ms`);
        
        // Start karakterens løb efter kort forsinkelse
        setTimeout(() => {
            // Start ben-animation
            leg1.style.animation = 'run-leg 0.4s infinite';
            leg2.style.animation = 'run-leg 0.4s infinite 0.2s';
            
            // Start animation
            character.style.transition = `left ${4}s linear`;
            character.style.left = `${endPosition}px`;
        }, 10);
        
        // Når karakteren rammer infopunktet
        const collisionTimeout = setTimeout(() => {
            // Få infopunktet til at forsvinde
            infoPoint.style.animation = 'none'; // Stop pulsering
            infoPoint.style.transition = 'opacity 0.1s';
            infoPoint.style.opacity = '0';
            
            // Tilføj flash-effekt
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.width = '70px';
            flash.style.height = '70px';
            flash.style.borderRadius = '50%';
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            flash.style.left = infoPoint.style.left;
            flash.style.bottom = infoPoint.style.bottom; 
            flash.style.transform = 'translate(-10px, -70px)';
            flash.style.zIndex = '20';
            flash.style.opacity = '1';
            flash.style.transition = 'all 0.4s ease-out';
            flash.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.6)';

            characterContainer.appendChild(flash);

            // Animér flashet
            setTimeout(() => {
                flash.style.transform = 'translate(-10px, -70px) scale(2)';
                flash.style.opacity = '0';
                
                // Fjern flash efter animation
                setTimeout(() => {
                    if (characterContainer.contains(flash)) {
                        characterContainer.removeChild(flash);
                    }
                }, 500);
            }, 100);
            
        }, timeToInfoPoint);
        
        // Gem timeout ID for senere oprydning
        animationIntervals.push(collisionTimeout);
        
        // Når karakteren forlader skærmen, start en ny animation
        const restartTimeout = setTimeout(() => {
            console.log("Animation færdig, starter ny runde");
            // Kort pause før vi starter næste loop
            const nextLoopTimeout = setTimeout(() => {
                if (isAnimating) {
                    runAnimation(); // Start næste loop
                }
            }, 1000); // 1 sekund pause mellem loops
            
            // Gem timeout ID for senere oprydning
            animationIntervals.push(nextLoopTimeout);
        }, totalTime + 100);
        
        // Gem timeout ID for senere oprydning
        animationIntervals.push(restartTimeout);
    }
    
    // Start den første animation
    runAnimation();
    
    // Funktion til at stoppe loopet og rydde op
    function stopAnimation() {
        isAnimating = false;
        
        // Ryd alle intervaller og timeouts
        animationIntervals.forEach(clearTimeout);
        animationIntervals = [];
        
        // Fjern resize listener
        window.removeEventListener('resize', updateCharacterPosition);
        
        // Nulstil flag så karakteren kan oprettes igen hvis nødvendigt
        isPortfolioCharacterCreated = false;
    }
    
    // Funktion til at starte fade-in sekvensen (hvis du har brug for den)
    function triggerFadeIn(delay = 0) {
        const subtitle = document.querySelector('.subtitle');
        const description = document.querySelector('.description');
        const buttons = document.querySelector('.hero-buttons');
        
        // Første element - subtitle
        setTimeout(() => {
            if (subtitle) {
                subtitle.classList.add('fade-in');
            }
            
            // Andet element - beskrivelse
            setTimeout(() => {
                if (description) {
                    description.classList.add('fade-in');
                }
                
                // Tredje element - knapper
                setTimeout(() => {
                    if (buttons) {
                        buttons.classList.add('fade-in');
                    }
                }, 400);
            }, 400);
        }, delay);
    }
    
    // Returner funktioner til at kontrollere karakteren
    return {
        stopAnimation: stopAnimation,
        triggerFadeIn: triggerFadeIn
    };
}

// Eksporter til globalt scope
window.createPortfolioCharacter = createPortfolioCharacter;