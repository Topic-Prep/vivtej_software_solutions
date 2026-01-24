# Integration Guide: Email Verification & Account Deletion with VivTej HTML Project

## Overview

This document explains how to integrate the newly implemented email verification and account deletion features with the VivTej Software Solutions HTML frontend.

## API Base URL

```javascript
const API_BASE_URL = "http://localhost:1710/api/v1"; // Development
// const API_BASE_URL = 'https://api.topicprep.com/api/v1'; // Production
```

## Integration Points

### 1. Email Verification Page

Create `verify-email.html` in the `vivtej_software_solutions` folder:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Email | Topic Prep</title>
    <link rel="stylesheet" href="styles.css" />
    <style>
      .verification-container {
        max-width: 600px;
        margin: 100px auto;
        padding: 40px;
        text-align: center;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .success {
        color: #27ae60;
      }
      .error {
        color: #e74c3c;
      }
    </style>
  </head>
  <body>
    <div class="verification-container">
      <h1>Email Verification</h1>
      <div id="loading">
        <div class="spinner"></div>
        <p>Verifying your email...</p>
      </div>
      <div id="success" style="display: none;">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          class="success"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="success">Email Verified Successfully!</h2>
        <p>Your email has been verified. You can now access all features.</p>
        <button onclick="window.location.href='index.html'" class="cta-button">
          Go to Home
        </button>
      </div>
      <div id="error" style="display: none;">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          class="error"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="error">Verification Failed</h2>
        <p id="error-message">Invalid or expired verification link.</p>
        <button onclick="resendVerification()" class="cta-button">
          Resend Verification Email
        </button>
      </div>
    </div>

    <script>
      const API_BASE_URL = "http://localhost:1710/api/v1";

      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = window.location.pathname.split("/").pop();

      async function verifyEmail() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/verify-email/${token}`,
          );
          const data = await response.json();

          document.getElementById("loading").style.display = "none";

          if (data.success) {
            document.getElementById("success").style.display = "block";
          } else {
            document.getElementById("error").style.display = "block";
            document.getElementById("error-message").textContent =
              data.error.message;
          }
        } catch (error) {
          document.getElementById("loading").style.display = "none";
          document.getElementById("error").style.display = "block";
          document.getElementById("error-message").textContent =
            "Network error. Please try again.";
        }
      }

      async function resendVerification() {
        // This requires the user to be logged in
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          alert("Please log in to resend verification email");
          window.location.href = "index.html";
          return;
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/resend-verification`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );
          const data = await response.json();

          if (data.success) {
            alert("Verification email sent! Please check your inbox.");
          } else {
            alert(data.error.message);
          }
        } catch (error) {
          alert("Failed to resend email. Please try again.");
        }
      }

      // Auto-verify on page load
      verifyEmail();
    </script>
  </body>
</html>
```

### 2. Account Deletion Page

Create `delete-account.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Delete Account | Topic Prep</title>
    <link rel="stylesheet" href="styles.css" />
    <style>
      .delete-container {
        max-width: 700px;
        margin: 50px auto;
        padding: 40px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .warning-box {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 20px 0;
      }
      .danger-box {
        background: #f8d7da;
        border-left: 4px solid #e74c3c;
        padding: 15px;
        margin: 20px 0;
      }
      .otp-input {
        font-size: 24px;
        text-align: center;
        letter-spacing: 10px;
        padding: 15px;
        width: 200px;
        margin: 20px auto;
        display: block;
      }
      .btn-danger {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
      .btn-danger:hover {
        background: #c0392b;
      }
      #step2 {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="delete-container">
      <h1>Delete Account</h1>

      <div id="step1">
        <div class="danger-box">
          <h3>⚠️ Warning: This action cannot be undone</h3>
          <p>Deleting your account will:</p>
          <ul>
            <li>Permanently remove all your personal information</li>
            <li>Delete your profile, preferences, and saved content</li>
            <li>Remove access to all your quiz history and statistics</li>
          </ul>
        </div>

        <div class="warning-box">
          <h3>📋 What we keep:</h3>
          <p>
            Transaction records and payment history will be retained for legal
            and tax purposes as required by law.
          </p>
        </div>

        <p>
          If you're sure you want to proceed, click the button below. We'll send
          a verification code to your email.
        </p>

        <button class="btn-danger" onclick="requestDeletion()">
          Send Verification Code
        </button>
      </div>

      <div id="step2">
        <p>
          We've sent a 6-digit verification code to your email. Please enter it
          below:
        </p>
        <input
          type="text"
          id="otp"
          class="otp-input"
          maxlength="6"
          placeholder="------"
          pattern="[0-9]{6}"
        />
        <p style="text-align: center; color: #666;">
          Code expires in 15 minutes
        </p>
        <button class="btn-danger" onclick="verifyAndDelete()">
          Confirm Deletion
        </button>
        <button onclick="location.reload()" style="margin-left: 10px;">
          Cancel
        </button>
      </div>

      <div id="loading" style="display: none; text-align: center;">
        <p>Processing...</p>
      </div>
    </div>

    <script>
      const API_BASE_URL = "http://localhost:1710/api/v1";
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Please log in to delete your account");
        window.location.href = "index.html";
      }

      async function requestDeletion() {
        document.getElementById("loading").style.display = "block";

        try {
          const response = await fetch(
            `${API_BASE_URL}/users/request-deletion`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          const data = await response.json();

          if (data.success) {
            document.getElementById("step1").style.display = "none";
            document.getElementById("step2").style.display = "block";
            alert(
              "Verification code sent to your email. Please check your inbox.",
            );
          } else {
            alert(data.error.message || "Failed to send verification code");
          }
        } catch (error) {
          alert("Network error. Please try again.");
        } finally {
          document.getElementById("loading").style.display = "none";
        }
      }

      async function verifyAndDelete() {
        const otp = document.getElementById("otp").value;

        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
          alert("Please enter a valid 6-digit code");
          return;
        }

        document.getElementById("loading").style.display = "block";

        try {
          const response = await fetch(
            `${API_BASE_URL}/users/verify-deletion`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ otp }),
            },
          );

          const data = await response.json();

          if (data.success) {
            localStorage.removeItem("authToken");
            alert(
              "Your account has been deleted successfully. We're sorry to see you go!",
            );
            window.location.href = "index.html";
          } else {
            alert(data.error.message || "Invalid verification code");
          }
        } catch (error) {
          alert("Network error. Please try again.");
        } finally {
          document.getElementById("loading").style.display = "none";
        }
      }
    </script>
  </body>
</html>
```

### 3. Update Registration Flow

In your registration page JavaScript, update the success handler:

```javascript
async function register(email, password, name, phoneNumber) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phoneNumber }),
    });

    const data = await response.json();

    if (data.success) {
      // Store auth token
      localStorage.setItem("authToken", data.data.token);

      // Show verification message
      alert(
        "Registration successful! Please check your email to verify your account.",
      );

      // Redirect to dashboard or home
      window.location.href = "dashboard.html";
    } else {
      alert(data.error.message);
    }
  } catch (error) {
    alert("Registration failed. Please try again.");
  }
}
```

### 4. Add Links to Navigation

Update your navigation menu in `index.html` or user profile page:

```html
<!-- In user dropdown menu -->
<nav>
  <a href="profile.html">Profile</a>
  <a href="settings.html">Settings</a>
  <a href="delete-account.html" style="color: #e74c3c;">Delete Account</a>
</nav>
```

## Testing

### Test Email Verification:

1. Register a new user
2. Check console/logs for verification email (or check email inbox)
3. Click verification link: `http://localhost:1710/api/v1/auth/verify-email/{token}`
4. Should redirect to verify-email.html and show success

### Test Account Deletion:

1. Log in to the app
2. Navigate to delete-account.html
3. Click "Send Verification Code"
4. Check email for OTP
5. Enter OTP and confirm
6. Account should be deleted and redirected to home page

## Environment Variables

Add to `.env` file:

```env
FRONTEND_URL=http://localhost:3000
EMAIL_USER=support@topicprep.com
EMAIL_PASSWORD=sxezqbefmmdmsetw
```

## Notes

- The verification link format is: `{FRONTEND_URL}/verify-email/{token}`
- Make sure to update FRONTEND_URL for production
- Email templates use Topic Prep branding
- All emails are sent from support@topicprep.com
