const API_URL = "https://freelancerhub-production-2295.up.railway.app/api";


// GOOGLE CLIENT ID
const GOOGLE_CLIENT_ID = "1088384084828-t7o2vc316g2sajvq4p797dr45hbvsule.apps.googleusercontent.com";


// SHOW LOGIN
function showLogin() {

    const modal = document.getElementById("authModal");
    const content = document.getElementById("authContent");

    content.innerHTML = `

        <h2>Welcome Back</h2>

        <p class="auth-subtitle">
            Login to your FreelancerHub account
        </p>


        <!-- Normal Login -->

        <form id="loginForm">

            <label>Email</label>

            <input
                type="email"
                id="loginEmail"
                required
            >


            <label>Password</label>

            <input
                type="password"
                id="loginPassword"
                required
            >


            <button
                type="submit"
                class="btn btn-primary auth-submit"
            >
                Login
            </button>

        </form>


        <!-- Divider -->

        <div class="auth-divider">
            <span>OR</span>
        </div>


        <!-- Role for new Google users -->

        <label>
            Account Type
        </label>

        <select id="googleRole">

            <option value="">
                Select account type
            </option>

            <option value="CUSTOMER">
                Customer
            </option>

            <option value="FREELANCER">
                Freelancer
            </option>

        </select>


        <!-- Google Login Button -->

        <div
            id="googleLoginButton"
            style="margin-top: 15px;"
        ></div>


        <p class="auth-switch">

            Don't have an account?

            <button onclick="showRegister()">
                Register
            </button>

        </p>

    `;


    // Show modal

    modal.classList.remove("hidden");


    // Normal login

    document
        .getElementById("loginForm")
        .addEventListener(
            "submit",
            loginUser
        );


    // Render Google button

    renderGoogleButton();
}


// RENDER GOOGLE BUTTON
function renderGoogleButton() {

    // Google library has not loaded yet
    if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
    ) {

        setTimeout(
            renderGoogleButton,
            500
        );

        return;
    }


    google.accounts.id.initialize({

        client_id: GOOGLE_CLIENT_ID,

        callback: handleGoogleLogin

    });


    google.accounts.id.renderButton(

        document.getElementById(
            "googleLoginButton"
        ),

        {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            width: 300
        }

    );
}

// HANDLE GOOGLE LOGIN
async function handleGoogleLogin(response) {

    const role =
        document
            .getElementById("googleRole")
            .value;


    try {

        const result = await fetch(
            `${API_URL}/auth/google`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    credential:
                        response.credential,

                    role: role

                })
            }
        );


        const data =
            await result.json();


        // Login failed

        if (!result.ok) {

            alert(
                data.message ||
                "Google login failed"
            );

            return;
        }


        // Store JWT

        localStorage.setItem(
            "token",
            data.token
        );


        // Store role

        localStorage.setItem(
            "role",
            data.user.role
        );


        // Store user ID

        localStorage.setItem(
            "user_id",
            data.user.user_id
        );


        // Store user name

        localStorage.setItem(
            "user_name",
            data.user.name
        );


        alert(
            "Google login successful!"
        );


        closeModal();


        // Redirect according to role

        redirectToDashboard(
            data.user.role
        );


    } catch (error) {

        console.error(
            "Google login error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}

// SHOW REGISTER
function showRegister() {

    const modal = document.getElementById("authModal");
    const content = document.getElementById("authContent");

    content.innerHTML = `
        <h2>Create Account</h2>

        <p class="auth-subtitle">
            Join FreelancerHub 2.0
        </p>

        <form id="registerForm">

            <label>Name</label>

            <input
                type="text"
                id="registerName"
                required
            >

            <label>Email</label>

            <input
                type="email"
                id="registerEmail"
                required
            >

            <label>Password</label>

            <input
                type="password"
                id="registerPassword"
                minlength="6"
                required
            >

            <label>Role</label>

            <select id="registerRole">

                <option value="CUSTOMER">
                    Customer
                </option>

                <option value="FREELANCER">
                    Freelancer
                </option>

            </select>

            <button
                type="submit"
                class="btn btn-primary auth-submit"
            >
                Create Account
            </button>

        </form>

        <p class="auth-switch">
            Already have an account?
            <button onclick="showLogin()">
                Login
            </button>
        </p>
    `;

    modal.classList.remove("hidden");

    document
        .getElementById("registerForm")
        .addEventListener("submit", registerUser);
}


// CLOSE MODAL
function closeModal() {

    document
        .getElementById("authModal")
        .classList.add("hidden");
}


// LOGIN
async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message || "Login failed"
            );

            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.user.role
        );

        localStorage.setItem(
            "user_id",
            data.user.user_id
        );

        localStorage.setItem(
            "user_name",
            data.user.name
        );

        alert("Login successful!");

        closeModal();

        redirectToDashboard(
            data.user.role
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// REGISTER
async function registerUser(event) {

    event.preventDefault();

    const name =
        document
            .getElementById("registerName")
            .value
            .trim();

    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("registerPassword")
            .value;

    const role =
        document
            .getElementById("registerRole")
            .value;

    try {

        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed"
            );

            return;
        }

        alert(
            "Registration successful! Please login."
        );

        showLogin();

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// REDIRECT BASED ON ROLE
function redirectToDashboard(role) {

    if (role === "CUSTOMER") {

        window.location.href =
            "customer-dashboard.html";

        return;
    }

    if (role === "FREELANCER") {

        window.location.href =
            "freelancer-dashboard.html";

        return;
    }

    if (role === "ADMIN") {

        window.location.href =
            "admin-dashboard.html";

        return;
    }

    alert("Unknown user role.");
}


// SCROLL TO FEATURES
function scrollToFeatures() {

    document
        .getElementById("features")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// LOGOUT
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");

    window.location.href = "index.html";
}