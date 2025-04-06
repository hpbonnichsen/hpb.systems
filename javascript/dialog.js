/**
 * dialog.js - Modul til håndtering af spildialog og tekstbobler
 * Denne modul skaber og styrer tekstbobler, dialoger og informationsbokse
 */

/**
 * Opret et dialog-system
 * @param {HTMLElement} container - Container hvor dialogbokse skal tilføjes
 * @param {Object} options - Tilpasningsindstillinger for dialogen
 * @returns {Object} - Dialog-controller objekt med metoder til at vise dialoger
 */
function createDialogSystem(container, options = {}) {
    // Standard indstillinger
    const settings = {
        bubbleWidth: 600,
        backgroundColor: '#000000',
        borderColor: '#0077cc',
        textColor: '#ffffff',
        highlightColor: '#ff8800',
        fontFamily: 'monospace',
        fontSize: 18,
        padding: 20,
        zIndex: 1001,
        ...options
    };
    
    // Container til alle dialog-elementer
    const dialogsContainer = document.createElement('div');
    dialogsContainer.id = 'dialogs-container';
    dialogsContainer.style.position = 'absolute';
    dialogsContainer.style.top = '0';
    dialogsContainer.style.left = '0';
    dialogsContainer.style.width = '100%';
    dialogsContainer.style.height = '100%';
    dialogsContainer.style.pointerEvents = 'none'; // Tillad klik gennem container
    dialogsContainer.style.zIndex = settings.zIndex;
    container.appendChild(dialogsContainer);
    
    // Reference til aktiv dialog (hvis der er en)
    let activeDialog = null;
    let activePromiseResolve = null;
    
    // Tilføj nødvendige animationer
    if (!document.getElementById('dialog-animations')) {
        const style = document.createElement('style');
        style.id = 'dialog-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%); }
                to { opacity: 0; transform: translate(-50%, -40%); }
            }
            
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Metode til at lukke alle aktive dialoger
    function closeActiveDialog() {
        if (activeDialog) {
            activeDialog.style.animation = 'fadeOut 0.3s forwards';
            
            setTimeout(() => {
                if (activeDialog && activeDialog.parentNode) {
                    activeDialog.parentNode.removeChild(activeDialog);
                }
                activeDialog = null;
                
                // Hvis der er en promise, resolv den
                if (activePromiseResolve) {
                    activePromiseResolve();
                    activePromiseResolve = null;
                }
            }, 300);
        }
    }
    
    // Dialog controller objekt
    const dialogController = {
        /**
         * Vis en simpel tekstbobbel
         * @param {Object} options - Indstillinger for boblen
         * @returns {Promise} - Promise der resolver når boblen lukkes
         */
        showBubble: function(options) {
            // Luk evt. aktiv dialog først
            closeActiveDialog();
            
            return new Promise(resolve => {
                // Gem resolve function til senere
                activePromiseResolve = resolve;
                
                // Opret bobbel element
                const bubble = document.createElement('div');
                bubble.className = 'dialog-bubble';
                bubble.style.width = `${options.width || settings.bubbleWidth}px`;
                bubble.style.padding = `${settings.padding}px`;
                bubble.style.backgroundColor = options.bgColor || settings.backgroundColor;
                bubble.style.border = `4px solid ${options.borderColor || settings.borderColor}`;
                bubble.style.borderRadius = '10px';
                bubble.style.color = options.textColor || settings.textColor;
                bubble.style.fontFamily = settings.fontFamily;
                bubble.style.fontSize = `${settings.fontSize}px`;
                bubble.style.textAlign = 'center';
                bubble.style.position = 'absolute';
                bubble.style.top = '50%';
                bubble.style.left = '50%';
                bubble.style.transform = 'translate(-50%, -50%)';
                bubble.style.zIndex = settings.zIndex;
                bubble.style.pointerEvents = 'auto'; // Gør boblen klikbar
                bubble.style.animation = 'fadeIn 0.3s forwards';
                
                // Opdatér bobbel indhold til at have en fremhævet knap
                bubble.innerHTML = `
                    <h3 style="color: ${options.titleColor || settings.borderColor}; margin-bottom: 15px;">
                        ${options.title || ''}
                    </h3>
                    <p style="color: ${options.textColor || settings.textColor}; margin-bottom: 25px;">
                        ${options.text || ''}
                    </p>
                    <button class="continue-btn" style="
                        background: ${options.highlightColor || settings.highlightColor}; 
                        color: ${options.backgroundColor || settings.backgroundColor}; 
                        border: none; 
                        padding: 10px 20px; 
                        font-family: ${settings.fontFamily}; 
                        font-size: 16px;
                        cursor: pointer;
                        border-radius: 4px;
                        box-shadow: 0 0 8px rgba(255,255,255,0.3);
                        transition: transform 0.2s, box-shadow 0.2s;
                    ">FORTSÆT (Enter)</button>
                `;
                
                // Tilføj hover-effekt til knappen
                const continueBtn = bubble.querySelector('.continue-btn');
                continueBtn.addEventListener('mouseover', () => {
                    continueBtn.style.transform = 'scale(1.05)';
                    continueBtn.style.boxShadow = '0 0 12px rgba(255,255,255,0.5)';
                });
                continueBtn.addEventListener('mouseout', () => {
                    continueBtn.style.transform = 'scale(1)';
                    continueBtn.style.boxShadow = '0 0 8px rgba(255,255,255,0.3)';
                });
                
                // Tilføj klik-handler til knappen
                continueBtn.addEventListener('click', () => {
                    closeActiveDialog();
                });
                
                // Tilføj tastatur-lytter kun for Enter-tasten
                const keyHandler = function(e) {
                    if (e.key === 'Enter') {
                        closeActiveDialog();
                        document.removeEventListener('keydown', keyHandler);
                    }
                };
                document.addEventListener('keydown', keyHandler);
                
                // Tilføj boblen til container
                dialogsContainer.appendChild(bubble);
                activeDialog = bubble;
            });
        },
        
        /**
         * Vis en komplet dialog med titel, tekst og knapper
         * @param {Object} options - Dialog indstillinger
         * @returns {Promise<string>} - Resolves med knap-ID'et der blev klikket på
         */
        showDialog: function(options) {
            // Luk evt. aktiv dialog først
            closeActiveDialog();
            
            return new Promise(resolve => {
                // Opret dialog element
                const dialog = document.createElement('div');
                dialog.className = 'dialog-box';
                dialog.style.width = `${options.width || settings.bubbleWidth}px`;
                dialog.style.padding = `${settings.padding}px`;
                dialog.style.backgroundColor = options.bgColor || settings.backgroundColor;
                dialog.style.border = `4px solid ${options.borderColor || settings.borderColor}`;
                dialog.style.borderRadius = '10px';
                dialog.style.color = options.textColor || settings.textColor;
                dialog.style.fontFamily = settings.fontFamily;
                dialog.style.fontSize = `${settings.fontSize}px`;
                dialog.style.textAlign = 'center';
                dialog.style.position = 'absolute';
                dialog.style.top = '50%';
                dialog.style.left = '50%';
                dialog.style.transform = 'translate(-50%, -50%)';
                dialog.style.zIndex = settings.zIndex;
                dialog.style.pointerEvents = 'auto';
                dialog.style.animation = 'fadeIn 0.3s forwards';
                
                // Opbyg dialog indhold
                let dialogHTML = `
                    <h3 style="color: ${options.titleColor || settings.borderColor}; margin-bottom: 15px;">
                        ${options.title || ''}
                    </h3>
                    <div style="color: ${options.textColor || settings.textColor}; margin-bottom: 25px;">
                        ${options.text || ''}
                    </div>
                `;
                
                // Tilføj knapper hvis defineret
                if (options.buttons && options.buttons.length > 0) {
                    dialogHTML += '<div class="dialog-buttons" style="display: flex; justify-content: center; gap: 15px;">';
                    
                    options.buttons.forEach(button => {
                        dialogHTML += `
                            <button 
                                class="dialog-button" 
                                data-id="${button.id || ''}"
                                style="
                                    background: ${button.bgColor || settings.borderColor}; 
                                    color: ${button.textColor || settings.backgroundColor}; 
                                    border: none; 
                                    padding: 10px 20px; 
                                    font-family: ${settings.fontFamily}; 
                                    cursor: pointer;
                                    min-width: 100px;
                                "
                            >
                                ${button.text || 'OK'}
                            </button>
                        `;
                    });
                    
                    dialogHTML += '</div>';
                } else {
                    // Standardknap hvis ingen knapper er defineret
                    dialogHTML += `
                        <button 
                            class="dialog-button"
                            data-id="ok" 
                            style="
                                background: ${settings.borderColor}; 
                                color: ${settings.backgroundColor}; 
                                border: none; 
                                padding: 10px 20px; 
                                font-family: ${settings.fontFamily}; 
                                cursor: pointer;
                                min-width: 100px;
                            "
                        >
                            OK
                        </button>
                    `;
                }
                
                dialog.innerHTML = dialogHTML;
                
                // Tilføj klik-handlers til knapper
                setTimeout(() => {
                    const buttons = dialog.querySelectorAll('.dialog-button');
                    buttons.forEach(button => {
                        button.addEventListener('click', () => {
                            const buttonId = button.getAttribute('data-id');
                            activeDialog = null;
                            dialog.style.animation = 'fadeOut 0.3s forwards';
                            
                            setTimeout(() => {
                                if (dialog.parentNode) {
                                    dialog.parentNode.removeChild(dialog);
                                }
                                resolve(buttonId);
                            }, 300);
                        });
                    });
                }, 0);
                
                // Tilføj dialog til container
                dialogsContainer.appendChild(dialog);
                activeDialog = dialog;
            });
        },
        
        /**
         * Vis en succesbokse (som ved gennemførelse)
         * @param {Object} options - Indstillinger for succes-boksen
         * @returns {Promise<string>} - Resolves når boksen lukkes
         */
        showCompletionBox: function(options) {
            // Boks til visning af spilgennemførelse
            const completionOptions = {
                width: 400,
                title: options.title || 'GENNEMFØRT!',
                text: options.text || 'Du har gennemført dette niveau.',
                titleColor: options.titleColor || settings.borderColor,
                buttons: [
                    {
                        id: 'continue',
                        text: (options.buttonText || 'FORTSÆT') + ' (Enter)',
                        bgColor: options.buttonColor || settings.borderColor,
                        textColor: options.buttonTextColor || settings.backgroundColor
                    }
                ]
            };
            
            return new Promise(resolve => {
                // Opret dialog element
                const dialog = document.createElement('div');
                dialog.className = 'dialog-box';
                dialog.style.width = `${completionOptions.width}px`;
                dialog.style.padding = `${settings.padding}px`;
                dialog.style.backgroundColor = options.bgColor || settings.backgroundColor;
                dialog.style.border = `4px solid ${completionOptions.titleColor}`;
                dialog.style.borderRadius = '10px';
                dialog.style.color = options.textColor || settings.textColor;
                dialog.style.fontFamily = settings.fontFamily;
                dialog.style.fontSize = `${settings.fontSize}px`;
                dialog.style.textAlign = 'center';
                dialog.style.position = 'absolute';
                dialog.style.top = '50%';
                dialog.style.left = '50%';
                dialog.style.transform = 'translate(-50%, -50%)';
                dialog.style.zIndex = settings.zIndex;
                dialog.style.pointerEvents = 'auto';
                dialog.style.animation = 'fadeIn 0.3s forwards';
                
                // Opbyg dialog indhold
                dialog.innerHTML = `
                    <h3 style="color: ${completionOptions.titleColor}; margin-bottom: 15px;">
                        ${completionOptions.title}
                    </h3>
                    <div style="color: ${options.textColor || settings.textColor}; margin-bottom: 25px;">
                        ${completionOptions.text}
                    </div>
                    <button 
                        class="continue-btn"
                        data-id="continue" 
                        style="
                            background: ${completionOptions.buttons[0].bgColor}; 
                            color: ${completionOptions.buttons[0].textColor}; 
                            border: none; 
                            padding: 12px 25px; 
                            font-family: ${settings.fontFamily}; 
                            cursor: pointer;
                            font-size: 16px;
                            border-radius: 4px;
                            box-shadow: 0 0 8px rgba(255,255,255,0.3);
                            transition: transform 0.2s, box-shadow 0.2s;
                        "
                    >
                        ${completionOptions.buttons[0].text}
                    </button>
                `;
                
                // Tilføj hover-effekt til knappen
                const continueBtn = dialog.querySelector('.continue-btn');
                continueBtn.addEventListener('mouseover', () => {
                    continueBtn.style.transform = 'scale(1.05)';
                    continueBtn.style.boxShadow = '0 0 12px rgba(255,255,255,0.5)';
                });
                continueBtn.addEventListener('mouseout', () => {
                    continueBtn.style.transform = 'scale(1)';
                    continueBtn.style.boxShadow = '0 0 8px rgba(255,255,255,0.3)';
                });
                
                // Tilføj klik-handlers til knappen
                continueBtn.addEventListener('click', () => {
                    dialog.style.animation = 'fadeOut 0.3s forwards';
                    
                    setTimeout(() => {
                        if (dialog.parentNode) {
                            dialog.parentNode.removeChild(dialog);
                        }
                        resolve('continue');
                    }, 300);
                });
                
                // Tilføj tastatur-lytter for Enter-tasten
                const keyHandler = function(e) {
                    if (e.key === 'Enter') {
                        dialog.style.animation = 'fadeOut 0.3s forwards';
                        
                        setTimeout(() => {
                            if (dialog.parentNode) {
                                dialog.parentNode.removeChild(dialog);
                            }
                            resolve('continue');
                        }, 300);
                        
                        document.removeEventListener('keydown', keyHandler);
                    }
                };
                document.addEventListener('keydown', keyHandler);
                
                // Tilføj dialog til container
                dialogsContainer.appendChild(dialog);
            });
        },
        
        /**
         * Vis en hjælpe-tooltip
         * @param {Object} options - Tooltip indstillinger
         */
        showTooltip: function(options) {
            const tooltip = document.createElement('div');
            tooltip.className = 'game-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = options.bgColor || 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = options.textColor || '#ffffff';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '14px';
            tooltip.style.fontFamily = settings.fontFamily;
            tooltip.style.zIndex = settings.zIndex + 1;
            tooltip.style.pointerEvents = 'none';
            tooltip.style.maxWidth = '200px';
            tooltip.style.textAlign = 'center';
            tooltip.style.animation = 'fadeIn 0.3s forwards';
            
            tooltip.textContent = options.text || '';
            
            // Placer tooltip
            tooltip.style.top = `${options.top || 0}px`;
            tooltip.style.left = `${options.left || 0}px`;
            
            // Tilføj pil hvis ønsket
            if (options.showArrow) {
                const arrow = document.createElement('div');
                arrow.style.position = 'absolute';
                arrow.style.width = '0';
                arrow.style.height = '0';
                arrow.style.borderLeft = '8px solid transparent';
                arrow.style.borderRight = '8px solid transparent';
                arrow.style.borderTop = `8px solid ${options.bgColor || 'rgba(0, 0, 0, 0.8)'}`;
                arrow.style.bottom = '-8px';
                arrow.style.left = 'calc(50% - 8px)';
                tooltip.appendChild(arrow);
            }
            
            dialogsContainer.appendChild(tooltip);
            
            // Automatisk fjern tooltip efter timeout hvis defineret
            if (options.timeout) {
                setTimeout(() => {
                    tooltip.style.animation = 'fadeOut 0.3s forwards';
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 300);
                }, options.timeout);
            }
            
            // Returnér tooltip element så den kan fjernes manuelt
            return tooltip;
        },
        
        /**
         * Fjern en tooltip
         * @param {HTMLElement} tooltip - Tooltip element der skal fjernes
         */
        removeTooltip: function(tooltip) {
            if (tooltip && tooltip.parentNode) {
                tooltip.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        },
        
        /**
         * Luk alle aktive dialoger
         */
        closeAll: closeActiveDialog
    };
    
    return dialogController;
}

// Eksportér modul
window.dialogModule = {
    createDialogSystem: createDialogSystem
};