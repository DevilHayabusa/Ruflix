document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Proteger la página: si no hay token, fuera al login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar los videos si estamos en index.html
    if (document.getElementById('video-grid')) {
        loadVideos(token);
    }
    
    // Cargar el video si estamos en player.html
    if (document.getElementById('video-player')) {
        loadPlayer(token);
    }

    // Botón de Logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});

async function loadVideos(token) {
    const grid = document.getElementById('video-grid');
    try {
        const response = await fetch('http://localhost:3000/api/videos', {
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            // Si el token expiró o es inválido
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
            throw new Error('Error al cargar videos');
        }

        const videos = await response.json();
        
        grid.innerHTML = ''; // Limpiar
        videos.forEach(video => {
            const videoEl = document.createElement('div');
            videoEl.className = 'video-thumbnail';
            // Guardamos el ID del video para saber cuál reproducir
            videoEl.setAttribute('data-video-id', video.id); 
            videoEl.innerHTML = `
                <img src="http://localhost:3000${video.ruta_thumbnail}" alt="${video.titulo}">
                <h3>${video.titulo}</h3>
            `;
            
            // ¡IMPORTANTE! Al hacer clic, te manda a la OTRA página
            videoEl.addEventListener('click', () => {
                window.location.href = `player.html?id=${video.id}`;
            });
            
            grid.appendChild(videoEl);
        });

    } catch (err) {
        console.error(err);
    }
}

async function loadPlayer(token) {
    //Obtener el ID del video desde la URL (ej: ?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        window.location.href = 'index.html'; // Si no hay ID, volver al inicio
        return;
    }

    try {
        //Pedir al backend la info de ESE video
        const response = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) window.location.href = 'login.html';
            throw new Error('Error al cargar el video');
        }
        
        const video = await response.json();

        //Poner la información en la página
        document.getElementById('video-title').textContent = video.titulo;
        document.getElementById('video-description').textContent = video.descripcion;
        
        const videoPlayer = document.getElementById('video-player');
        
        // ¡Aquí está la magia!
        // Le decimos al tag <video> que su fuente es la ruta que está en la BD
        // El servidor (server.js) se encarga de servir ese archivo estático
        videoPlayer.src = `http://localhost:3000${video.ruta_video}`;

    } catch (err) {
        console.error(err);
    }
}