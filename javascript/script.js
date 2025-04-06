// script.js - Optimeret
// Tracker for at sikre at hver funktion kun kaldes én gang
const appState = {
    bootSequenceCompleted: false,
    gameStarted: false,
    startScreenShown: false,
    characterInitialized: false
};

// Vent på at DOM er indlæst
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded");
    
    // Kør boot sekvens
    runBootSequence();
    
    // Vi opsætter ikke spilstart her mere - det gøres efter boot sekvensen
});

/**
 * Kør den Amiga-inspirerede boot sekvens
 */
function runBootSequence() {
    if (appState.bootSequenceCompleted) return;
    appState.bootSequenceCompleted = true;
    
    console.log("Starting boot sequence");
    const bootAnimation = document.getElementById('boot-animation');
    const kickstartScreen = document.querySelector('.kickstart');
    const gameStartScreen = document.getElementById('game-start-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    
    // Skjul navigation, startskærm og hovedindhold først
    if (bottomNav) bottomNav.style.display = 'none';
    if (gameStartScreen) gameStartScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    
    // Skjul workbench skærmen helt
    const workbenchScreen = document.querySelector('.workbench');
    if (workbenchScreen) {
        workbenchScreen.style.display = 'none';
    }
    
    // Trin 1: Vis Kickstart skærm i 3 sekunder
    setTimeout(function() {
        // Tilføj hoppende diskette animation
        const disketteIcon = document.querySelector('.diskette-icon');
        if (disketteIcon) {
            disketteIcon.style.animation = 'bounce 0.5s infinite alternate';
            
            // Tilføj CSS animation for bounce hvis den ikke findes
            if (!document.getElementById('bounce-animation')) {
                const style = document.createElement('style');
                style.id = 'bounce-animation';
                style.textContent = `
                    @keyframes bounce {
                        from { transform: translateY(0); }
                        to { transform: translateY(-10px); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Trin 2: Efter 3 sekunder, vis startskærmen
        setTimeout(function() {
            if (kickstartScreen) kickstartScreen.style.display = 'none';
            
            if (bootAnimation) {
                bootAnimation.style.opacity = '0';
                bootAnimation.style.transition = 'opacity 1s';
            }
            
            setTimeout(function() {
                if (bootAnimation) bootAnimation.style.display = 'none';
                
                // Vis startskærmen
                showGameStartScreen();
            }, 1000);
        }, 3000);
    }, 500);
}

/**
 * Vis spil-startskærmen og initialiser karakteren
 */
function showGameStartScreen() {
    if (appState.startScreenShown) return;
    appState.startScreenShown = true;
    
    const gameStartScreen = document.getElementById('game-start-screen');
    
    if (gameStartScreen) {
        gameStartScreen.style.display = 'block';
        initStartScreenCharacter();
        setupGameStart(); // Opsæt event listeners for spilstart
    }
}

/**
 * Initialiser karakter på startskærmen
 */
function initStartScreenCharacter() {
    if (appState.characterInitialized) return;
    appState.characterInitialized = true;
    
    console.log("Initializing start screen character");
    
    // Find karaktercontaineren på startskærmen
    const characterContainer = document.getElementById('start-character-container');
    
    if (characterContainer && typeof window.createStartScreenCharacter === 'function') {
        window.createStartScreenCharacter(characterContainer);
    } else {
        console.error("Start screen character function not found or container missing");
    }
}

/**
 * Opsæt håndtering af spilstart
 */
function setupGameStart() {
    const startButton = document.getElementById('start-game-button');
    
    if (startButton) {
        // Fjern eventuelle eksisterende event listeners (sikkerhedsforanstaltning)
        const newStartButton = startButton.cloneNode(true);
        startButton.parentNode.replaceChild(newStartButton, startButton);
        
        // Tilføj ny event listener
        newStartButton.addEventListener('click', startGame);
    }
    
    // Sikrer at knapperne i hovedmenuen også opsættes korrekt
    setupMainMenuButtons();
}

/**
 * Start spillet
 */
function startGame() {
    console.log("Start game button clicked");
    
    // Forhindrer multiple kald til startGame
    if (appState.gameStarted) return;
    appState.gameStarted = true;
    
    // Skjul startskærmen med en fade-out
    const gameStartScreen = document.getElementById('game-start-screen');
    if (gameStartScreen) {
        gameStartScreen.style.transition = 'opacity 0.5s ease';
        gameStartScreen.style.opacity = '0';
        
        setTimeout(function() {
            gameStartScreen.style.display = 'none';
            
            // Start spillet
            if (typeof window.showSimpleGame === 'function') {
                window.showSimpleGame();
            } else {
                console.error("Game function not found");
                
                // Fallback til at vise hovedindhold
                const mainContent = document.getElementById('main-content');
                const bottomNav = document.getElementById('bottom-nav');
                
                if (mainContent) mainContent.style.display = 'block';
                if (bottomNav) bottomNav.style.display = 'block';
            }
        }, 500);
    }
}

/**
 * Viser en dialog ved tryk på quit-knappen
 * Med interesse for jobbet og uden afslut-knap
 */
function showQuitDialog() {
    // Opret dialog boks
    const dialogModal = document.createElement('div');
    dialogModal.id = 'dialog-modal';
    dialogModal.className = 'modal';
    dialogModal.style.display = 'block';
    dialogModal.style.position = 'fixed';
    dialogModal.style.top = '0';
    dialogModal.style.left = '0';
    dialogModal.style.width = '100%';
    dialogModal.style.height = '100%';
    dialogModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    dialogModal.style.zIndex = '9999'; // Højere z-index for at sikre overlejring
    dialogModal.style.opacity = '0';
    dialogModal.style.transition = 'opacity 0.3s';
    dialogModal.style.backdropFilter = 'blur(5px)';
    
    // Opret dialog indhold
    dialogModal.innerHTML = `
        <div class="modal-content" style="background-color: #000000; margin: 15% auto; width: 90%; max-width: 600px; border: 3px solid #33ff33; box-shadow: 0 0 20px rgba(51, 255, 51, 0.5); animation: modal-appear 0.3s ease-out;">
            <div class="modal-header" style="padding: 20px; border-bottom: 2px solid #33ff33; text-align: center;">
                <h3 style="color: #33ff33; margin: 0; font-size: 24px;">TAK FOR DIT BESØG!</h3>
            </div>
            <div class="modal-body" style="padding: 30px 20px; text-align: center;">
                <div class="thanks-icon" style="font-size: 50px; color: #ff3366; margin-bottom: 20px; animation: pulse 2s infinite;">
                    <i class="fas fa-heart"></i>
                </div>
                <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 20px;">Jeg er meget interesseret i rollen som AI-underviser hos Københavns Kommune og mener, at min kombination af undervisningserfaring og teknisk formidlingsevne gør mig til en ideel kandidat.</p>
                <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 20px;">Med mine 10 års erfaring som gymnasielærer har jeg specialiseret mig i at gøre komplekst stof forståeligt og engagerende. Gennem min erfaring med e-learning, videobaseret undervisning og visuel historiefortælling kan jeg bidrage til at skabe effektive og motiverende kurser om AI.</p>
                <p style="font-size: 18px; line-height: 1.6; color: #ffffff;">Jeg ser frem til at høre fra jer og fortsætte dialogen.</p>
                <p style="font-size: 16px; font-style: italic; color: #8888ff; margin-top: 25px;">Klik hvor som helst for at lukke denne besked.</p>
            </div>
        </div>
    `;
    
    // Tilføj dialog stil hvis den ikke findes
    if (!document.getElementById('dialog-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'dialog-animation-styles';
        style.textContent = `
            @keyframes modal-appear {
                from { opacity: 0; transform: translateY(-50px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Tilføj til body
    document.body.appendChild(dialogModal);
    
    // Fade ind
    setTimeout(() => {
        dialogModal.style.opacity = '1';
    }, 10);
    
    // Luk ved klik hvor som helst på modal
    dialogModal.addEventListener('click', function() {
        // Fade ud
        dialogModal.style.opacity = '0';
        
        // Fjern efter animation
        setTimeout(() => {
            if (dialogModal.parentNode) {
                dialogModal.parentNode.removeChild(dialogModal);
            }
        }, 300);
    });
    
    // Luk ved Escape
    const keyHandler = function(e) {
        if (e.key === 'Escape') {
            // Fade ud
            dialogModal.style.opacity = '0';
            
            // Fjern efter animation
            setTimeout(() => {
                if (dialogModal.parentNode) {
                    dialogModal.parentNode.removeChild(dialogModal);
                }
            }, 300);
            
            // Fjern event listener
            document.removeEventListener('keydown', keyHandler);
        }
    };
    document.addEventListener('keydown', keyHandler);
}

/**
 * Opsætter knapper i hovedmenuen
 * Dette erstatter den inline script i index.html
 */
function setupMainMenuButtons() {
    // Knapper og funktionalitet
    const videoBtn = document.getElementById('video-button');
    const aiProjectsBtn = document.getElementById('ai-projects-button');
    const contactBtn = document.getElementById('contact-button');
    const quitBtn = document.getElementById('quit-button');
    
    // Vi behøver ikke igen at håndtere startGameBtn, da det er gjort i setupGameStart
    
    // Håndter Videopræsentation knap
    if (videoBtn) {
        // Fjern eventuelle eksisterende event listeners
        const newVideoBtn = videoBtn.cloneNode(true);
        videoBtn.parentNode.replaceChild(newVideoBtn, videoBtn);
        
        newVideoBtn.addEventListener('click', function() {
            console.log("Video button clicked");
            
            // Skjul startskærmen
            const gameStartScreen = document.getElementById('game-start-screen');
            if (gameStartScreen) {
                gameStartScreen.style.display = 'none';
            }
            
            // Vis videoen
if (window.videoHandler && window.videoHandler.showVideo) {
    window.videoHandler.showVideo('https://www.youtube.com/embed/sZaSN6WpwsA', function() {
        console.log("Video færdig callback - sender videre til AI-projekter");
        // Eksplicit redirect til AI-projekter siden
        window.location.href = 'ai-projekter.html';
    });
} else {
    alert("Video funktion ikke fundet. Går direkte til AI-projekter.");
    window.location.href = 'ai-projekter.html';
}
        });
    }
    
    // Håndter AI-Projekter knap
    if (aiProjectsBtn) {
        // Fjern eventuelle eksisterende event listeners
        const newAiProjectsBtn = aiProjectsBtn.cloneNode(true);
        aiProjectsBtn.parentNode.replaceChild(newAiProjectsBtn, aiProjectsBtn);
        
        newAiProjectsBtn.addEventListener('click', function() {
            console.log("AI Projects button clicked");
            window.location.href = 'ai-projekter.html';
        });
    }
    
    // Håndter Kontakt knap
    if (contactBtn) {
        // Fjern eventuelle eksisterende event listeners
        const newContactBtn = contactBtn.cloneNode(true);
        contactBtn.parentNode.replaceChild(newContactBtn, contactBtn);
        
        newContactBtn.addEventListener('click', function() {
            console.log("Contact button clicked");
            window.location.href = 'kontakt.html';
        });
    }
    
    // Håndter Quit knap
    if (quitBtn) {
        // Fjern eventuelle eksisterende event listeners
        const newQuitBtn = quitBtn.cloneNode(true);
        quitBtn.parentNode.replaceChild(newQuitBtn, quitBtn);
        
        newQuitBtn.addEventListener('click', function() {
            console.log("Quit button clicked");
            
            // Vis dialog tilsvarende den på kontaktsiden
            showQuitDialog();
        });
    }
}