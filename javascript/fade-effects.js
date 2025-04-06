// Placer denne kode i en separat fil, f.eks. fade-effects.js
document.addEventListener('DOMContentLoaded', function() {
    // Opsæt fade-in sekvensen
    const startFadeIn = setupFadeInSequence();
    
    // Start fade-in 300ms efter siden er fuldt indlæst
    window.addEventListener('load', function() {
        setTimeout(() => {
            startFadeIn(0);
        }, 300);
    });
    
    // Alternativt kan du bruge en specifik knap eller event til at starte fade-in
    // Eksempel:
    // document.querySelector('#start-button').addEventListener('click', () => {
    //     startFadeIn(0);
    // });
});

function setupFadeInSequence() {
    // Kode for fade-in setup som tidligere...
}