document.addEventListener('DOMContentLoaded', () => {
    
    // Si estamos en la página de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await handleAuth('login', { email, password });
        });
    }

    // Si estamos en la página de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await handleAuth('register', { email, password });
        });
    }
});

async function handleAuth(action, credentials) {
    const errorMsg = document.getElementById('error-msg');
    try {
        const response = await fetch(`http://localhost:3000/api/auth/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            errorMsg.textContent = data.msg || 'Ocurrió un error.';
            return;
        }

        // ¡Éxito! Guardamos el token y redirigimos
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirigir al catálogo

    } catch (err) {
        console.error(`Error en ${action}:`, err);
        errorMsg.textContent = 'No se pudo conectar al servidor.';
    }
}