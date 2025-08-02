/**
 * Spilanimation med brugerstyring
 * Denne fil bruger world.js, character.js og dialog.js for at skabe en interaktiv præsentation
 * af Hans-Peters kompetencer, hvor brugeren styrer karakteren
 */

// Tilstandsvariabel for at sikre spillet kun startes én gang
let gameStarted = false;

// Vent på at DOM er indlæst
document.addEventListener('DOMContentLoaded', function() {
    console.log("Animation-game script loaded");
});

/**
 * Funktion til at vise animationen
 * Denne funktion vil blive kaldt fra boot sekvensen
 */
function showSimpleGame() {
    // Undgå at starte spillet flere gange
    if (gameStarted) {
        console.log("Game already started - ignoring duplicate call");
        return;
    }
    
    gameStarted = true;
    console.log("Starting animation game");
    
    // Hent farver fra world-modulet
    const COLORS = window.worldModule ? window.worldModule.colors : {
        amigaBlue: '#0055aa',        // Amiga blå baggrund
        amigaLightBlue: '#0077cc',   // Lysere blå til accenter
        amigaOrange: '#ff8800',      // Amiga orange til accenter
        amigaWhite: 'rgb(255, 255, 255)', // Hvid til text og kontrast
        amigaBlack: '#000000',       // Sort til kontrast
        groundColor: 'rgb(108, 251, 5)',  // Grøn jordfarve
        groundAccent: 'rgba(228, 131, 61, 0.86)', // Brun accent
        amigaGrid: 'rgba(232, 234, 235, 0.2)', // Grid-linjer
        groundGrid: 'rgba(218, 199, 199, 0.2)', // Grid-linjer på jorden
        cloudColor: 'rgba(255, 255, 255, 0.8)' // Sky farve
    };
    
    // Skjul boot animation
    const bootAnimation = document.getElementById('boot-animation');
    if (bootAnimation) bootAnimation.style.display = 'none';
    
    // Skjul hovedindhold og navigation 
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    
    if (mainContent) mainContent.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
    
    // Opret animation-container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = COLORS.amigaBlue;
    gameContainer.style.zIndex = '1000';
    gameContainer.style.display = 'flex';
    gameContainer.style.justifyContent = 'center';
    gameContainer.style.alignItems = 'center';
    gameContainer.style.overflow = 'hidden';
    
    // Tilføj container til body
    document.body.appendChild(gameContainer);

    // Opret lydsystem, hvis det findes
    let audioSystem = null;
    if (window.audioModule && window.audioModule.createAudioSystem) {
        audioSystem = window.audioModule.createAudioSystem();
        audioSystem.createAudioControl(gameContainer);
    }
    
    // Opret verden ved hjælp af world-modulet
    let world = null;
    let character = null;
    let dialogSystem = null;
    
    if (window.worldModule && window.worldModule.createWorld) {
        const worldWidth = 6000;
        world = window.worldModule.createWorld(worldWidth, gameContainer);
        
        // Opret karakter ved hjælp af character-modulet
        if (window.characterModule && window.characterModule.createCharacter) {
            character = window.characterModule.createCharacter(world.element, {
                startX: 100,
                eyeColor: COLORS.amigaBlue
            });
        }
        
        // Opret dialog-system ved hjælp af dialog-modulet
        if (window.dialogModule && window.dialogModule.createDialogSystem) {
            dialogSystem = window.dialogModule.createDialogSystem(gameContainer, {
                backgroundColor: COLORS.amigaBlack,
                borderColor: COLORS.amigaLightBlue,
                textColor: COLORS.amigaWhite,
                highlightColor: COLORS.amigaOrange
            });
        }
    }
    
    // Fejlhåndtering: Returnér tidligt hvis nødvendige moduler mangler
    if (!world || !character || !dialogSystem) {
        console.error("Missing required modules for game");
        alert("Der opstod en fejl ved indlæsning af spillet. Prøv at opdatere siden.");
        return;
    }
    
    const gameWorld = world.element;
    
    // Definér kompetencer til at vise i bobler
    const competenceData = [
        {
            position: 400,
            title: "10 ÅRS PÆDAGOGISK FRONTLINJE-ERFARING",
            description: "Solidt didaktisk fundament fra 10 års undervisning i gymnasiet, med speciale i at differentiere undervisning og skabe motivation for en mangfoldig gruppe af unge voksne.",
            requireJump: false
        },
        {
            position: 1200,
            title: "PRAKSISNÆR AI-FORMIDLING",
            description: "Transformerende teknisk AI-viden til engagerende og letforståelige læringsoplevelser gennem visuel og interaktiv formidling.",
            requireJump: true // Dette punkt kræver et hop!
        },
        {
            position: 2000,
            title: "INNOVATIVT LÆRINGSDESIGN",
            description: "Erfaring med at udvikle nye, digitale læringsformater – fra koncept til implementering – med fokus på gamification og brugerengagement.",
            requireJump: false
        },
        {
            position: 2800,
            title: "PROCES- & PROJEKTFACILITERING",
            description: "Vant til at drive kreative udviklingsprocesser fra idé til færdigt produkt og samarbejde på tværs af fagligheder for at nå et fælles mål.",
            requireJump: true // Dette punkt kræver også et hop!
        },
        {
            position: 3600,
            title: "KOMPETENCEUDVIKLING FOR UNDERVISERE",
            description: "Designer og faciliterer skræddersyede workshops og forløb, der klæder kolleger på til at anvende ny teknologi pædagogisk meningsfuldt.",
            requireJump: false
        }
    ];
    
    // Opret info-punkter med world-modulet
    const infoPoints = [];
    competenceData.forEach((data, index) => {
        // Justér højden baseret på om punktet kræver et hop
        const pointHeight = data.requireJump ? 180 : 140; // Højere op hvis det kræver hop
        
        // Informationspunkt-farve baseret på type (hop vs almindeligt)
        const pointColor = data.requireJump ? '#ff33ff' : COLORS.amigaOrange;
        
        const infoPoint = world.addInfoPoint(
            data.position, 
            pointColor, 
            'pulse 1.5s infinite',
            pointHeight // Tilføj højdeparameter til world.addInfoPoint
        );
        
        if (infoPoint) {
            infoPoint.setAttribute('data-index', index);
            infoPoints.push(infoPoint);
        }
    });
    
    // Skip-knap
    const skipButton = document.createElement('div');
    skipButton.id = 'skip-button';
    skipButton.style.position = 'fixed';
    skipButton.style.bottom = '20px';
    skipButton.style.right = '20px';
    skipButton.style.padding = '10px 20px';
    skipButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    skipButton.style.border = `2px solid rgb(251, 5, 235)`;
    skipButton.style.color = 'rgb(251, 5, 235)';
    skipButton.style.fontFamily = 'monospace';
    skipButton.style.fontSize = '14px';
    skipButton.style.cursor = 'pointer';
    skipButton.style.zIndex = '1002';
    skipButton.textContent = 'SPRING OVER';
    gameContainer.appendChild(skipButton);
    
    // Spring over knap funktionalitet
    skipButton.addEventListener('click', function() {
        if (audioSystem) {
            audioSystem.stopAllSounds();
        }
        showCompletion();
    });
    
    // ================= BRUGERSTYRING =================
    
    // Tilføj instruktioner
    const instructions = document.createElement('div');
    instructions.id = 'game-instructions';
    instructions.style.position = 'fixed';
    instructions.style.top = '20px';
    instructions.style.left = '20px';
    instructions.style.padding = '15px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    instructions.style.border = `2px solid ${COLORS.amigaLightBlue}`;
    instructions.style.color = COLORS.amigaWhite;
    instructions.style.fontFamily = 'monospace';
    instructions.style.fontSize = '14px';
    instructions.style.zIndex = '1002';
    instructions.style.maxWidth = '300px';
    instructions.style.borderRadius = '5px';
    instructions.innerHTML = `
        <h3 style="color: ${COLORS.amigaLightBlue}; margin-top: 0;">KONTROL</h3>
        <ul style="padding-left: 20px; margin-bottom: 5px;">
            <li>← / A: Gå til venstre</li>
            <li>→ / D: Gå til højre</li>
            <li>↑ / W / Mellemrum: Hop</li>
             <li style="color: ${COLORS.amigaOrange};">ESC: Spring spillet over</li>
        </ul>
        <p style="margin-top: 10px;">Indsaml alle kompetence-punkter for at gennemføre præsentationen!</p>
    `;
    gameContainer.appendChild(instructions);
    
    // Opret mobile kontroller hvis det er en touch-enhed
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let mobileControls;
    
    if (isTouchDevice) {
        // Container til mobile kontroller
        mobileControls = document.createElement('div');
        mobileControls.id = 'mobile-controls';
        mobileControls.style.position = 'fixed';
        mobileControls.style.bottom = '20px';
        mobileControls.style.left = '20px';
        mobileControls.style.zIndex = '1003';
        mobileControls.style.display = 'flex';
        mobileControls.style.gap = '20px';
        
        // Opret knapper til kontrol
        const leftBtn = createMobileButton('←', 'left-btn');
        const rightBtn = createMobileButton('→', 'right-btn');
        const jumpBtn = createMobileButton('↑', 'jump-btn');
        
        mobileControls.appendChild(leftBtn);
        mobileControls.appendChild(rightBtn);
        mobileControls.appendChild(jumpBtn);
        
        gameContainer.appendChild(mobileControls);
        
        // Tilføj event listeners til mobile knapper
        leftBtn.addEventListener('touchstart', () => { inputState.left = true; });
        leftBtn.addEventListener('touchend', () => { inputState.left = false; });
        
        rightBtn.addEventListener('touchstart', () => { inputState.right = true; });
        rightBtn.addEventListener('touchend', () => { inputState.right = false; });
        
        jumpBtn.addEventListener('touchstart', () => { inputState.jump = true; });
        jumpBtn.addEventListener('touchend', () => { inputState.jump = false; });
    }
    
    // Hjælpefunktion til at oprette en mobil kontrol-knap
    function createMobileButton(label, id) {
        const btn = document.createElement('div');
        btn.id = id;
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        btn.style.border = `2px solid ${COLORS.amigaLightBlue}`;
        btn.style.borderRadius = '50%';
        btn.style.color = COLORS.amigaLightBlue;
        btn.style.fontFamily = 'monospace';
        btn.style.fontSize = '24px';
        btn.style.display = 'flex';
        btn.style.justifyContent = 'center';
        btn.style.alignItems = 'center';
        btn.style.userSelect = 'none';
        btn.style.cursor = 'pointer';
        btn.textContent = label;
        return btn;
    }
    
    // Input-tilstand
    let inputState = {
        left: false,
        right: false,
        jump: false
    };
    
    // Tastatur event handlers
    function handleKeyDown(e) {
        // Check for ESC-tast
        if (e.key === 'Escape') {
            // Stop alle lyde før vi afslutter spillet
            if (audioSystem) {
                audioSystem.stopAllSounds();
            }
            showCompletion();
            return;
        }
        // Hvis en dialog er åben, ignorer input
        if (animationState.hasReachedInfoPoint || animationState.isComplete) {
            return;
        }
        
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            inputState.left = true;
        }
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            inputState.right = true;
        }
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key === ' ') {
            inputState.jump = true;
        }
    }
    
    function handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            inputState.left = false;
        }
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            inputState.right = false;
        }
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key === ' ') {
            inputState.jump = false;
        }
    }
    
    // Tilføj event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Animation tilstand
    let animationState = {
        currentPoint: 0,
        hasReachedInfoPoint: false,
        isComplete: false,
        isJumping: false,
        facingDirection: 'right', // Karakterens retning (venstre/højre)
        movementSpeed: 5, // Pixels pr. frame
        animationFrameId: null, // Gemmer ID'et for den aktuelle animationsramme
        jumpPhase: 0 // 0 = ikke hopper, 1 = op, 2 = top, 3 = ned
    };
    
    // Funktion til at vise slutbesked
    async function showCompletion() {
        // Annullér eventuelle igangværende animationsframes
        if (animationState.animationFrameId) {
            cancelAnimationFrame(animationState.animationFrameId);
            animationState.animationFrameId = null;
        }

        // Afspil succeslyd og stop baggrundsmusik
        if (audioSystem) {
            audioSystem.stopSound('background');
            audioSystem.playSound('success');
        }
        
        // Stop karakter animation
        character.stopRunning();
        
        // Markér animation som færdig
        animationState.isComplete = true;
        
        // Skjul instruktioner og mobile kontroller
        instructions.style.display = 'none';
        if (mobileControls) {
            mobileControls.style.display = 'none';
        }
        
        // Vis færdig-besked ved hjælp af dialog-modulet
        try {
            const result = await dialogSystem.showCompletionBox({
                title: "MISSION GENNEMFØRT!",
                text: "Du har indsamlet alle Hans-Peters kvalifikationer og låst op for præsentationsvideoen.",
                buttonText: "SE VIDEO"
            });
            
            // Når brugeren klikker på knappen
            if (result === 'continue') {
                if (audioSystem) {
                    audioSystem.stopAllSounds();
                }
                // Fjern alle event listeners
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                
                // Vis video sektion
                showVideoSection();
            }
        } catch (error) {
            console.error("Error showing completion dialog:", error);
            // Fallback hvis dialogsystemet fejler
            showVideoSection();
        }
    }

    // Funktion til at vise videosektionen
function showVideoSection() {
    // Skjul spil container
    gameContainer.style.opacity = '0';
    gameContainer.style.transition = 'opacity 1s ease';

    setTimeout(function () {
        // Fjern gameContainer
        if (gameContainer.parentNode) {
            gameContainer.parentNode.removeChild(gameContainer);
        }

        // Nulstil gameStarted flag så spillet kan startes igen hvis nødvendigt
        gameStarted = false;

        // Tjek om videoHandler er tilgængelig
        if (window.videoHandler && window.videoHandler.showVideo) {
            // Brug videoHandler til at vise video
            window.videoHandler.showVideo('https://www.youtube.com/embed/sZaSN6WpwsA', function () {
                window.location.href = 'ai-projekter.html';
            });
        } else {
            console.error("videoHandler not found");
            // Fallback: Redirect direkte til AI-projekter siden
            window.location.href = 'ai-projekter.html';
        }
    }, 1000);
}
    
    // FORBEDRET: Tjek om karakteren er i kollision med et infopunkt
    function checkInfoPointCollision(isJumping = false) {
        const currentX = character.getX();
        
        // Gå igennem alle infopunkter
        for (let i = 0; i < infoPoints.length; i++) {
            // Spring over allerede besøgte punkter
            if (!infoPoints[i] || infoPoints[i].style.display === 'none') {
                continue;
            }
            
            const pointData = competenceData[i];
            const pointX = pointData.position;
            
            // Tjek om vi er tæt nok på infopunktet (større kollisionszone)
            if (Math.abs(currentX - pointX) < 30) {
                // Hvis punktet kræver et hop, skal vi tjekke om vi er i hop-tilstand
                if (pointData.requireJump) {
                    // Hvis vi ikke hopper og punktet kræver hop, ignorér kollisionen
                    if (!isJumping && !animationState.isJumping) {
                        continue;
                    }
                }
                
                // Vi har ramt et punkt!
                handleInfoPointReached(i);
                return true;
            }
        }
        
        return false;
    }
    
    // FORBEDRET: Funktion til at håndtere hop
    function handleJump() {
        if (animationState.isJumping || animationState.hasReachedInfoPoint) {
            return;
        }
        
        animationState.isJumping = true;
        animationState.jumpPhase = 1; // Starter hop-fasen

        // Afspil hoplyd
        if (audioSystem) {
            audioSystem.playSound('jump');
        }
        
        // Før hop: Tjek om der er kollision med højtliggende punkter
        // Dette gør at vi kan tjekke for kollision både i begyndelsen, under, og i slutningen af hoppet
        checkInfoPointCollision(true);
        
        // Udfør hop
        character.jump(() => {
            // Under hop: Tjek igen for kollision med højtliggende punkter
            setTimeout(() => {
                if (!animationState.hasReachedInfoPoint) {
                    animationState.jumpPhase = 2; // Top af hop
                    checkInfoPointCollision(true);
                }
            }, 350); // Tjek på vej op
            
            setTimeout(() => {
                if (!animationState.hasReachedInfoPoint) {
                    checkInfoPointCollision(true);
                }
            }, 400); // Tjek i toppen
            
            // Efter hop: Når hoppet er færdigt
            setTimeout(() => {
                animationState.jumpPhase = 3; // På vej ned
                if (!animationState.hasReachedInfoPoint) {
                    checkInfoPointCollision(true);
                }
            }, 600); // Tjek på vej ned
            
            setTimeout(() => {
                animationState.isJumping = false;
                animationState.jumpPhase = 0;
                
                // Hvis vi ikke allerede har ramt et punkt, tjek igen
                if (!animationState.hasReachedInfoPoint) {
                    checkInfoPointCollision(false);
                }
            }, 800); // Hop færdigt
        });
    }
    
    // Funktion til at håndtere når en informationspunkt nås
    async function handleInfoPointReached(index) {
        // Tjek om punktet eksisterer
        if (!infoPoints[index]) return;

        // Annullér den aktuelle animations-loop for at undgå multiple loops
        if (animationState.animationFrameId) {
            cancelAnimationFrame(animationState.animationFrameId);
            animationState.animationFrameId = null;
        }
        
        // Stop karakter animation
        character.stopRunning();
        
        // Marker at vi har nået info-punktet
        animationState.hasReachedInfoPoint = true;
        
        // Skjul info-punktet
        infoPoints[index].style.display = 'none';

        // Afspil indsamlingslyd
        if (audioSystem) {
            audioSystem.playSound('collect');
        }
        
        // Lad karakteren blinke for reaktion
        character.blink(2);
        
        // Forbered dialog-data
        const data = competenceData[index];
        
        try {
            // Vis dialog med kompetenceinformation
            await dialogSystem.showBubble({
                title: data.title,
                text: data.description,
                actionText: "KLIK FOR AT FORTSÆTTE"
            });
            
            // Nulstil input-tilstand når dialogen lukkes
            // Dette forhindrer at karakteren fortsætter med at bevæge sig efter dialog
            inputState.left = false;
            inputState.right = false;
            inputState.jump = false;
            
            // Nulstil hop-tilstand
            animationState.isJumping = false;
            animationState.jumpPhase = 0;
            
            // Hvis vi har samlet alle punkter, vis afslutning
            let allPointsCollected = true;
            for (let i = 0; i < infoPoints.length; i++) {
                if (infoPoints[i] && infoPoints[i].style.display !== 'none') {
                    allPointsCollected = false;
                    break;
                }
            }
            
            if (allPointsCollected) {
                setTimeout(function() {
                    showCompletion();
                }, 1000);
            } else {
                // Ellers fortsæt spillet
                animationState.hasReachedInfoPoint = false;
                
                // VIGTIGT: Genstart animations-loop eksplicit her
                startGameLoop();
            }
        } catch (error) {
            console.error("Error in dialog system:", error);
            // Nulstil tilstand ved fejl
            animationState.hasReachedInfoPoint = false;
            startGameLoop();
        }
    }
    
    // Funktion til at starte eller genstarte spil-loop
    function startGameLoop() {
        // Definer updateAnimation funktionen
        function updateAnimation() {
            // Hvis animationen er færdig eller en dialog er åben, stop opdatering
            if (animationState.isComplete || animationState.hasReachedInfoPoint) {
                return;
            }
            
            // Håndtér brugerinput
            let isMoving = false;
            let newDirection = animationState.facingDirection; // Gem nuværende retning
            
            // Venstre/højre bevægelse
            if (inputState.left) {
                const newPos = character.getX() - animationState.movementSpeed;
                // Forhindre at gå ud af venstre side
                if (newPos > 50) {
                    character.setX(newPos);
                    isMoving = true;
                    newDirection = 'left';
                }
            }
            
            if (inputState.right) {
                character.setX(character.getX() + animationState.movementSpeed);
                isMoving = true;
                newDirection = 'right';
            }
            
            // Opdater karakterens retning hvis den har ændret sig
            if (newDirection !== animationState.facingDirection) {
                animationState.facingDirection = newDirection;
                character.setDirection(newDirection);
            }
            
            // Start/stop løbe-animation baseret på bevægelse
            if (isMoving && !animationState.isJumping) {
                character.startRunning();
            } else if (!animationState.isJumping) {
                character.stopRunning();
            }
            
            // Håndtér hop
            if (inputState.jump && !animationState.isJumping) {
                handleJump();
            }
            
            // FORBEDRET: Hvis vi hopper, tjek konstant for kollision med hop-punkter
            if (animationState.isJumping) {
                // Vi gør dette ved hver frame under et hop
                checkInfoPointCollision(true);
            }
            
            // Få nuværende position
            const currentX = character.getX();
            
            // Kamerafølgning - når karakteren er kommet et stykke til højre, begynder verden at scrolle
            if (currentX > window.innerWidth / 3) {
                // Beregn verden-offset for at lave scroll-effekt
                const worldOffset = -(currentX - window.innerWidth / 3);
                
                // Brug world-modulets funktion til at opdatere positionen
                world.updatePosition(worldOffset);
            }
            
            // Tjek for kollision med infopunkter
            if (!animationState.hasReachedInfoPoint) {
                checkInfoPointCollision(animationState.isJumping);
            }
            
            // Fortsæt animation - gem reference så vi kan annullere den hvis nødvendigt
            animationState.animationFrameId = requestAnimationFrame(updateAnimation);
        }
        
        // Start animations-loop
        animationState.animationFrameId = requestAnimationFrame(updateAnimation);
    }
    
    // Start spillet
    function startGame() {
        // Start spil-loop
        startGameLoop();
    }
    
    // Start spillet efter kort forsinkelse
    setTimeout(startGame, 500);
    
    console.log("Player-controlled animation game started successfully");
}

// Eksportér til det globale scope
window.showSimpleGame = showSimpleGame;
