/**
 * video-handler.js - Optimeret modul til håndtering af præsentationsvideoen
 */

/**
 * Initialiser video-systemet
 * @returns {Object} - Video controller objekt
 */
function createVideoHandler() {
    // Status-variabler
    let videoContainer = null;
    let videoElement = null;
    let isVideoShowing = false;
    let videoCallback = null;
    
    /**
     * Opret og vis video-sektion
     * @param {string} videoSrc - Sti til videofil eller embed URL
     * @param {function} onComplete - Callback der køres når brugeren fortsætter
     */
    function showVideo(videoSrc, onComplete) {
        console.log("Showing video presentation");
        
        // Hvis video allerede vises, afbryd
        if (isVideoShowing) {
            console.log("Video already showing - ignoring duplicate call");
            return;
        }
        
        isVideoShowing = true;
        videoCallback = onComplete;
        
        // Opret video container
        videoContainer = document.createElement('div');
        videoContainer.id = 'video-presentation';
        videoContainer.style.position = 'fixed';
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';
        videoContainer.style.width = '100%';
        videoContainer.style.height = '100%';
        videoContainer.style.backgroundColor = 'var(--main-bg)';
        videoContainer.style.zIndex = '9997';
        videoContainer.style.display = 'flex';
        videoContainer.style.flexDirection = 'column';
        videoContainer.style.justifyContent = 'center';
        videoContainer.style.alignItems = 'center';
        videoContainer.style.padding = '20px';
        videoContainer.style.opacity = '0';
        videoContainer.style.transition = 'opacity 1s ease';
        
        // Bestem om det er en YouTube/embed URL eller en lokal videofil
        let videoContent = '';
        
        if (isYouTubeUrl(videoSrc) || videoSrc.includes('iframe')) {
            // For YouTube eller anden embed kode
            videoContent = `
                <div style="position: relative; width: 90%; max-width: 800px; overflow: hidden; border-radius: 5px;">
                    <iframe 
                        width="100%" 
                        height="450" 
                        src="${videoSrc}" 
                        title="Præsentation" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="display: block;">
                    </iframe>
                </div>
            `;
        } else {
            // For lokal videofil
            videoContent = `
                <div style="position: relative; width: 90%; max-width: 800px; overflow: hidden; border-radius: 5px; border: 3px solid var(--terminal-green); box-shadow: 0 0 20px rgba(51, 255, 51, 0.3);">
                    <video 
                        id="presentation-video"
                        width="100%" 
                        height="auto" 
                        controls
                        style="display: block;">
                        <source src="${videoSrc}" type="video/mp4">
                        Din browser understøtter ikke HTML5 video.
                    </video>
                </div>
            `;
        }
        
        // Indhold til video sektionen
        videoContainer.innerHTML = `
            <h1 style="color: var(--terminal-green); margin-bottom: 30px; text-align: center; font-family: var(--pixel-font);">
                HANS-PETER PRÆSENTERER
            </h1>
            ${videoContent}
            <button id="continue-from-video" class="btn btn-primary" style="margin-top: 40px; font-size: 18px; padding: 15px 30px;">
                FORTSÆT TIL AI-PROJEKTER
            </button>
        `;
        
        // Tilføj til body
        document.body.appendChild(videoContainer);
        
        // Gem reference til video-elementet hvis det er lokalt
        videoElement = document.getElementById('presentation-video');
        
        // Fade ind
        setTimeout(function() {
            videoContainer.style.opacity = '1';
        }, 100);
        
        // Sikrer at vi kun har én event listener
        const continueButton = document.getElementById('continue-from-video');
        if (continueButton) {
            // Brug en navngivet funktion så vi kan fjerne den senere hvis nødvendigt
            const handleContinueClick = function() {
                closeVideo();
                // Fjern event listener for at undgå memory leaks
                continueButton.removeEventListener('click', handleContinueClick);
            };
            
            continueButton.addEventListener('click', handleContinueClick);
        }
        
        // Lyt efter afslutning af video hvis det er lokalt
        if (videoElement) {
            const handleVideoEnd = function() {
                // Fremhæv fortsæt-knappen når videoen er slut
                const continueButton = document.getElementById('continue-from-video');
                if (continueButton) {
                    continueButton.style.animation = 'pulse 1.5s infinite';
                    continueButton.style.boxShadow = '0 0 25px rgba(51, 255, 51, 0.6)';
                }
                // Fjern event listener
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
            
            videoElement.addEventListener('ended', handleVideoEnd);
        }
        
        // Tilføj pulse-animation hvis den ikke allerede findes
        if (!document.getElementById('video-animations')) {
            const style = document.createElement('style');
            style.id = 'video-animations';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Luk video-sektionen og kald callback
     */
    function closeVideo() {
        if (!videoContainer) return;
        
        // Fade ud video sektion
        videoContainer.style.opacity = '0';
        
        setTimeout(function() {
            // Stop video hvis det er lokalt
            if (videoElement) {
                videoElement.pause();
            }
            
            // Fjern video sektion
            if (videoContainer.parentNode) {
                videoContainer.parentNode.removeChild(videoContainer);
            }
            
            videoContainer = null;
            videoElement = null;
            
            // Kald callback efter video er lukket
            if (typeof videoCallback === 'function') {
                videoCallback();
            }
            
            // Nulstil flags og callback
            videoCallback = null;
            isVideoShowing = false;
        }, 1000);
    }
    
    /**
     * Kontroller om en URL er en YouTube URL
     * @param {string} url - URL at tjekke
     * @returns {boolean} - true hvis det er en YouTube URL
     */
    function isYouTubeUrl(url) {
        return url && (
            url.includes('youtube.com/embed/') || 
            url.includes('youtu.be/') ||
            url.includes('youtube.com/watch')
        );
    }
    
    // Returner public API
    return {
        showVideo: showVideo,
        closeVideo: closeVideo,
        isVideoActive: function() {
            return isVideoShowing;
        }
    };
}

// Eksportér funktionen med sikkerhed mod gentagne initialiseringer
if (!window.videoHandler) {
    window.videoHandler = createVideoHandler();
}