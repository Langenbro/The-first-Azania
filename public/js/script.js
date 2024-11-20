// Script to handle form toggle between Login and Register
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginBtn').classList.add('active');
    document.getElementById('registerBtn').classList.remove('active');
});

document.getElementById('registerBtn').addEventListener('click', function() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerBtn').classList.add('active');
    document.getElementById('loginBtn').classList.remove('active');
});

// Switch from form links
document.getElementById('toRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerBtn').click();
});

document.getElementById('toLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginBtn').click();
});

// Password validation
function validatePasswords() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        document.getElementById('passwordError').style.display = 'block';
        return false;
    }
    return true;
}
