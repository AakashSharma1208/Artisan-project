document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            loginError.style.display = 'none';

            try {
                const res = await AuthAPI.login({ email, password });
                
                // Save user data
                localStorage.setItem('token', res.token);
                localStorage.setItem('userRole', res.role);
                localStorage.setItem('userData', JSON.stringify(res));

                // Redirect based on role or to home
                if (res.role === 'admin' || res.role === 'vendor') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                loginError.textContent = error.message || 'Login failed. Please try again.';
                loginError.style.display = 'block';
                loginBtn.textContent = 'Log In';
                loginBtn.disabled = false;
            }
        });
    }
});
