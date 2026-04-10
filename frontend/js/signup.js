document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');
    const signupBtn = document.getElementById('signupBtn');
    
    // Toggle phone field if vendor
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const phoneGroup = document.getElementById('phoneGroup');
    const phoneInput = document.getElementById('phone');

    roleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'vendor') {
                phoneGroup.style.display = 'block';
                phoneInput.required = true;
            } else {
                phoneGroup.style.display = 'none';
                phoneInput.required = false;
            }
        });
    });

    if(signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;
            const phone = document.getElementById('phone').value;
            
            signupBtn.textContent = 'Creating account...';
            signupBtn.disabled = true;
            signupError.style.display = 'none';

            try {
                const userData = { name, email, password, role };
                if (role === 'vendor') userData.phone = phone;

                const res = await AuthAPI.signup(userData);
                
                // Save user data
                localStorage.setItem('token', res.token);
                localStorage.setItem('userRole', res.role);
                localStorage.setItem('userData', JSON.stringify(res));

                // Redirect based on role or to home
                if (res.role === 'vendor') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                signupError.textContent = error.message || 'Signup failed. Please try again.';
                signupError.style.display = 'block';
                signupBtn.textContent = 'Sign Up';
                signupBtn.disabled = false;
            }
        });
    }
});
