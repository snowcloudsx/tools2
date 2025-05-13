const form = document.getElementById("form");
const userNameInput = document.getElementById("firstname-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const errorMessage = document.getElementById("error-message");

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Helper function to validate password strength
function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let errors = [];
    let isSignupForm = userNameInput !== null;

    // Clear previous error highlights
    [userNameInput, emailInput, passwordInput, repeatPasswordInput].forEach(input => {
        if (input && input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
    });

    if (isSignupForm) {
        errors = getSignupFormErrors(
            userNameInput.value.trim(),
            emailInput.value.trim(),
            passwordInput.value,
            repeatPasswordInput.value
        );
    } else {
        errors = getLoginFormErrors(
            emailInput.value.trim(),
            passwordInput.value
        );
    }

    if (errors.length > 0) {
        errorMessage.innerText = errors.join("\n");
        return;
    }

    try {
        const url = isSignupForm ? 'http://localhost:3001/signup' : 'http://localhost:3001/login';
        const data = isSignupForm ? {
            username: userNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        } : {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        // Successful login/signup
        errorMessage.innerText = '';
        errorMessage.style.color = 'green';
        errorMessage.innerText = result.message;
        
        // Store user data in localStorage after successful login
        localStorage.setItem('userData', JSON.stringify({
            username: result.user.username,
            email: result.user.email
        }));

        // Redirect after successful login/signup
        setTimeout(() => {
            if (!isSignupForm) {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'login.html';
            }
        }, 1500);
    } catch (error) {
        errorMessage.style.color = 'red';
        errorMessage.innerText = error.message;
    }
});

function getSignupFormErrors(firstname, email, password, repeatPassword) {
    let errors = [];

    // Username validation
    if (!firstname) {
        errors.push('Username is required!');
        userNameInput.parentElement.classList.add('incorrect');
    } else if (firstname.length < 3) {
        errors.push('Username must be at least 3 characters long!');
        userNameInput.parentElement.classList.add('incorrect');
    }

    // Email validation
    if (!email) {
        errors.push('Email is required!');
        emailInput.parentElement.classList.add('incorrect');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address!');
        emailInput.parentElement.classList.add('incorrect');
    }

    // Password validation
    if (!password) {
        errors.push('Password is required!');
        passwordInput.parentElement.classList.add('incorrect');
    } else if (!isStrongPassword(password)) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number!');
        passwordInput.parentElement.classList.add('incorrect');
    }

    // Repeat password validation
    if (!repeatPassword) {
        errors.push('Please repeat your password!');
        repeatPasswordInput.parentElement.classList.add('incorrect');
    } else if (password !== repeatPassword) {
        errors.push("Passwords don't match!");
        passwordInput.parentElement.classList.add('incorrect');
        repeatPasswordInput.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];

    // Email validation
    if (!email) {
        errors.push('Email is required!');
        emailInput.parentElement.classList.add('incorrect');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address!');
        emailInput.parentElement.classList.add('incorrect');
    }

    // Password validation
    if (!password) {
        errors.push('Password is required!');
        passwordInput.parentElement.classList.add('incorrect');
    }

    return errors;
}

// Real-time validation feedback
const allInputs = [userNameInput, emailInput, passwordInput, repeatPasswordInput].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
            errorMessage.innerText = '';
        }
        
        // Real-time password strength indicator (optional)
        if (input === passwordInput && input.value.length > 0) {
            const strength = isStrongPassword(input.value) ? 'strong' : 'weak';
            // You could add visual feedback here
        }
    });
});