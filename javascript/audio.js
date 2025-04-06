/**
 * audio.js - Modul til håndtering af lyd i spillet
 * Dette modul styrer baggrundsmusik og lydeffekter
 */

/**
 * Opret et lydsystem til spillet
 * @returns {Object} - Lydsystem med metoder til at afspille og kontrollere lyd
 */
function createAudioSystem() {
    // Lydtilstand
    let isMuted = false;
    let volume = 0.5;
    let isInitialized = false;
    let audioControl = null;
    
    // Container til alle lyde (indlæses først når de skal bruges)
    const sounds = {};
    
    // Definér lydstier (du kan justere filnavne efter behov)
    const soundPaths = {
        background: 'sounds/background.wav',
        collect: 'sounds/collect.wav',  // eller .wav - din coin-lyd
        jump: 'sounds/jump.wav',        // hvis du har en hop-lyd
        success: 'sounds/success.wav'   // hvis du har en success-lyd
    };
    
    /**
     * Lazy-loading af lydene - indlæser kun når de skal bruges første gang
     * Dette hjælper med at undgå autoplay-begrænsninger i browsere
     */
    function loadSound(name) {
        if (!sounds[name] && soundPaths[name]) {
            sounds[name] = new Audio(soundPaths[name]);
            
            // Konfigurer lyde
            if (name === 'background') {
                sounds[name].loop = true;
                sounds[name].volume = volume * 0.4; // Baggrundsmusik lidt lavere
            } else {
                sounds[name].volume = volume;
            }
        }
        return sounds[name];
    }
    
    /**
     * Afspil en lyd med det angivne navn
     * @param {string} name - Navnet på lyden der skal afspilles
     */
    function playSound(name) {
        if (isMuted) return;
        
        const sound = loadSound(name);
        if (sound) {
            // For ikke-loopende lyde, reset afspilning
            if (name !== 'background') {
                sound.currentTime = 0;
            }
            
            // Forsøg at afspille, men håndtér eventuelle fejl (autoplay-begrænsninger)
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Kunne ikke afspille lyd automatisk. Bruger skal interagere først:", error);
                    
                    // Vi kunne gøre brugeren opmærksom på at aktivere lyd
                    if (!isInitialized) {
                        showSoundActivationMessage();
                    }
                });
            }
        }
    }
    
    /**
     * Stop en specifik lyd
     * @param {string} name - Navnet på lyden der skal stoppes
     */
    function stopSound(name) {
        if (sounds[name]) {
            sounds[name].pause();
            sounds[name].currentTime = 0;
        }
    }
    
    /**
     * Stop alle lyde
     */
    function stopAllSounds() {
        for (let key in sounds) {
            if (sounds[key]) {
                sounds[key].pause();
                sounds[key].currentTime = 0;
            }
        }
    }
    
    /**
     * Vis besked om at aktivere lyd
     * Vises når browseren blokerer autoplay
     */
    function showSoundActivationMessage() {
        const messageBox = document.createElement('div');
        messageBox.style.position = 'fixed';
        messageBox.style.top = '60px';
        messageBox.style.right = '20px';
        messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageBox.style.color = '#fff';
        messageBox.style.padding = '10px 15px';
        messageBox.style.borderRadius = '5px';
        messageBox.style.fontFamily = 'monospace';
        messageBox.style.fontSize = '14px';
        messageBox.style.zIndex = 1003;
        messageBox.style.opacity = '0';
        messageBox.style.transition = 'opacity 0.5s';
        messageBox.style.pointerEvents = 'none';
        messageBox.textContent = 'Klik et sted i spillet for at aktivere lyd';
        
        document.body.appendChild(messageBox);
        
        // Fade ind
        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 100);
        
        // Fade ud efter 5 sekunder
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                if (messageBox.parentNode) {
                    messageBox.parentNode.removeChild(messageBox);
                }
            }, 500);
        }, 5000);
    }
    
    /**
     * Initialiser lydsystemet med brugerinteraktion
     * Dette hjælper med at omgå browsernes autoplay-begrænsninger
     */
    function initializeAudio() {
        if (isInitialized) return;
        
        // Indlæs og afspil baggrund med brugerinteraktion
        loadSound('background');
        if (!isMuted) {
            playSound('background');
        }
        
        // Forudindlæs de andre lyde
        loadSound('collect');
        loadSound('jump');
        loadSound('success');
        
        isInitialized = true;
    }
    
    /**
     * Opret lydkontrol-knap
     * @param {HTMLElement} container - Container element hvor knappen skal tilføjes
     */
    function createAudioControl(container) {
        audioControl = document.createElement('div');
        audioControl.classList.add('audio-control');
        audioControl.style.position = 'fixed';
        audioControl.style.top = '20px';
        audioControl.style.right = '20px';
        audioControl.style.zIndex = '1002';
        audioControl.style.cursor = 'pointer';
        audioControl.style.width = '40px';
        audioControl.style.height = '40px';
        audioControl.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        audioControl.style.borderRadius = '50%';
        audioControl.style.display = 'flex';
        audioControl.style.justifyContent = 'center';
        audioControl.style.alignItems = 'center';
        audioControl.style.border = '2px solid #0077cc';
        audioControl.style.transition = 'transform 0.2s';
        
        // Ikoner for lyd til/fra
        updateAudioIcon();
        
        // Toggle mute på klik
        audioControl.addEventListener('click', () => {
            // Initialiser lyd ved første klik
            if (!isInitialized) {
                initializeAudio();
            }
            
            isMuted = !isMuted;
            updateAudioIcon();
            
            if (isMuted) {
                for (let key in sounds) {
                    if (sounds[key]) {
                        sounds[key].pause();
                    }
                }
            } else {
                playSound('background');
            }
        });
        
        // Hover-effekt
        audioControl.addEventListener('mouseover', () => {
            audioControl.style.transform = 'scale(1.1)';
        });
        
        audioControl.addEventListener('mouseout', () => {
            audioControl.style.transform = 'scale(1)';
        });
        
        container.appendChild(audioControl);
        
        // Sæt en klik-handler på hele containeren for at initialise lyd
        container.addEventListener('click', function initClick() {
            if (!isInitialized) {
                initializeAudio();
            }
            // Fjern handler efter første klik
            container.removeEventListener('click', initClick);
        });
    }
    
    /**
     * Opdater lydikon baseret på mute-status
     */
    function updateAudioIcon() {
        if (!audioControl) return;
        
        // Brug Unicode symboler i stedet for Font Awesome som måske ikke er tilgængeligt
        audioControl.innerHTML = isMuted ? 
            '<span style="color: #ff8800; font-size: 24px;">🔇</span>' : // Muted icon
            '<span style="color: #0077cc; font-size: 24px;">🔊</span>';  // Unmuted icon
    }
    
    // Return public API
    return {
        playSound,
        stopSound,
        stopAllSounds,
        createAudioControl,
        setMute: function(mute) {
            isMuted = mute;
            updateAudioIcon();
            
            if (isMuted) {
                for (let key in sounds) {
                    if (sounds[key]) {
                        sounds[key].pause();
                    }
                }
            } else if (isInitialized) {
                playSound('background');
            }
        },
        setVolume: function(newVolume) {
            volume = newVolume;
            for (let key in sounds) {
                if (sounds[key]) {
                    sounds[key].volume = key === 'background' ? volume * 0.4 : volume;
                }
            }
        },
        initialize: initializeAudio
    };
}

// Eksportér modul
window.audioModule = {
    createAudioSystem
};