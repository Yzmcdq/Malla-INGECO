// --- JavaScript from script.js ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mensajes de felicitación genéricos ---
    const semesterMessages = [
        "¡Semestre completado! Un gran paso adelante.",
        "¡Felicidades! Has terminado este semestre con éxito.",
        "¡Lo lograste! Cada ramo aprobado te acerca a tu meta.",
        "¡Impresionante! Tu constancia ha dado frutos.",
        "¡Adelante! Este semestre ya es historia. ¡A por el siguiente!",
        "¡Bien hecho! Sigue demostrando tu gran capacidad.",
        "¡Misión cumplida! Un nuevo logro desbloqueado.",
        "¡Un semestre menos! Continúa con esa energía.",
        "¡Victoria! Tu dedicación es la clave del éxito.",
        "¡Excelente! El esfuerzo de hoy construye tu futuro."
    ];

    const yearMessages = [
        "¡Año completado! Tu perseverancia es admirable.",
        "¡Increíble! Has finalizado un año entero. ¡Sigue así!",
        "¡Felicidades por este gran hito! Un año de mucho aprendizaje.",
        "¡Dominaste el año! Tu dedicación es notable. ¡Celebra tu logro!",
        "¡Un gran avance! Estás construyendo un futuro brillante.",
        "¡Qué gran progreso! Has superado todos los desafíos de este año.",
        "¡Felicidades! Un año más de experiencia y conocimiento.",
        "¡Un brindis por ti! Has cerrado un capítulo importante.",
        "¡Lo has logrado de nuevo! Un año completo de éxitos.",
        "¡La meta está un año más cerca! Sigue con esa pasión."
    ];

    const ramos = document.querySelectorAll('.ramo');
    
    loadCompletedRamos();
    
    ramos.forEach(ramo => {
        ramo.addEventListener('click', function() {
            toggleRamoCompletion(this);
        });
    });
    
    function toggleRamoCompletion(ramoElement) {
        const wasCompleted = ramoElement.classList.contains('completado');
        
        if (wasCompleted) {
            ramoElement.classList.remove('completado');
            removeCompletedRamo(ramoElement.dataset.ramo);
            ramoElement.closest('.column').dataset.celebrated = 'false';
        } else {
            ramoElement.classList.add('completado');
            saveCompletedRamo(ramoElement.dataset.ramo);
            checkCompletionStatus(ramoElement);
        }
    }

    // --- LÓGICA CORREGIDA ---
    function checkCompletionStatus(ramoElement) {
        const semesterColumn = ramoElement.closest('.column');
        // Salir si la columna ya fue celebrada en esta sesión
        if (!semesterColumn || semesterColumn.dataset.celebrated === 'true') {
            return;
        }

        // Salir si no se han completado todos los ramos del semestre
        if (!areAllRamosComplete(semesterColumn)) {
            return;
        }

        // Marcar como celebrado para no repetir la animación
        semesterColumn.dataset.celebrated = 'true';
        const semesterIndex = parseInt(semesterColumn.dataset.semesterIndex, 10);
        let yearComplete = false;

        // --- Lógica para Años 1-4 (Semestres) ---
        if (semesterIndex < 8) {
            const isEndOfYear = semesterIndex % 2 !== 0;
            if (isEndOfYear) {
                const partnerColumn = document.querySelector(`.column[data-semester-index="${semesterIndex - 1}"]`);
                if (areAllRamosComplete(partnerColumn)) {
                    yearComplete = true;
                }
            }
        } 
        // --- Lógica para Año 5 (Trimestres) ---
        else {
            const isEndOfYear = semesterIndex === 10;
            if (isEndOfYear) {
                const partnerColumn1 = document.querySelector(`.column[data-semester-index="8"]`);
                const partnerColumn2 = document.querySelector(`.column[data-semester-index="9"]`);
                if (areAllRamosComplete(partnerColumn1) && areAllRamosComplete(partnerColumn2)) {
                    yearComplete = true;
                }
            }
        }

        // --- Decidir qué mensaje mostrar ---
        if (yearComplete) {
            showMilestoneNotification('¡Año Completado!', yearMessages[Math.floor(Math.random() * yearMessages.length)], 'year');
        } else {
            const messageTitle = semesterIndex < 8 ? '¡Semestre Superado!' : '¡Trimestre Superado!';
            showMilestoneNotification(messageTitle, semesterMessages[Math.floor(Math.random() * semesterMessages.length)], 'semester');
        }
    }

    function areAllRamosComplete(column) {
        if (!column) return false;
        const total = column.querySelectorAll('.ramo').length;
        if (total === 0) return false; // Una columna sin ramos no está completa
        const completed = column.querySelectorAll('.ramo.completado').length;
        return total === completed;
    }

    function showMilestoneNotification(title, message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'milestone-overlay';
        
        const modal = document.createElement('div');
        modal.className = `milestone-modal ${type}`;
        
        modal.innerHTML = `
            <div class="effects-container"></div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="close-button">¡Continuar!</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const effectsContainer = modal.querySelector('.effects-container');
        launchFireworks(effectsContainer);
        launchConfetti(effectsContainer);

        const close = () => {
            overlay.style.animation = 'fadeOut 0.3s forwards';
            overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
        };

        modal.querySelector('.close-button').onclick = close;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }
    
    function launchFireworks(container) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'particle firework';
                const x = Math.random() * 80 + 10;
                const y = Math.random() * 50 + 20;
                const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
                firework.style.left = `${x}%`;
                firework.style.top = `${y}%`;
                firework.style.backgroundColor = color;
                
                const beforeStyle = document.createElement('style');
                const randomId = `fw-${Math.random().toString(36).substr(2, 9)}`;
                firework.id = randomId;
                beforeStyle.innerHTML = `
                    #${randomId}::before {
                        box-shadow: 0 0 15px 5px ${color}, 0 0 0 10px ${color}22;
                    }
                `;
                document.head.appendChild(beforeStyle);
                
                container.appendChild(firework);

                firework.addEventListener('animationend', () => {
                    firework.remove();
                    beforeStyle.remove();
                }, { once: true });
            }, Math.random() * 1000);
        }
    }

    function launchConfetti(container) {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ffeb3b', '#ffc107', '#ff9800'];
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
            container.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove(), { once: true });
        }
    }

    function saveCompletedRamo(ramoId) {
        let completedRamos = JSON.parse(localStorage.getItem('completedRamosIngComercial') || '[]');
        if (!completedRamos.includes(ramoId)) {
            completedRamos.push(ramoId);
            localStorage.setItem('completedRamosIngComercial', JSON.stringify(completedRamos));
        }
    }
    
    function removeCompletedRamo(ramoId) {
        let completedRamos = JSON.parse(localStorage.getItem('completedRamosIngComercial') || '[]');
        localStorage.setItem('completedRamosIngComercial', JSON.stringify(completedRamos.filter(id => id !== ramoId)));
    }
    
    function loadCompletedRamos() {
        const completedRamos = JSON.parse(localStorage.getItem('completedRamosIngComercial') || '[]');
        completedRamos.forEach(ramoId => {
            const ramoElement = document.querySelector(`[data-ramo="${ramoId}"]`);
            if (ramoElement) {
                ramoElement.classList.add('completado');
            }
        });
    }
})();
