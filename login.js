let verificationCode = '';
let expirationTime = null;
let userEmail = '';

// 🚀 Initiera EmailJS
(function() {
  emailjs.init("gSOnCZTkXS_dz7Brj"); // Din riktiga Public Key
})();

function sendVerificationCode() {
  userEmail = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!userEmail || !password) {
    alert("⚠️ Fyll i både e-post och lösenord!");
    return;
  }

  verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Slumpa kod
  expirationTime = Date.now() + 5 * 60 * 1000; // Koden är giltig i 5 minuter

  const templateParams = {
    to_email: userEmail,
    code: verificationCode
  };

  emailjs.send('wikibra_service', 'template_eua8vxi', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      document.getElementById('status').innerText = "✅ Kod skickad! Kolla din e-post!";
      document.getElementById('verify-section').style.display = 'block';
    }, function(error) {
      console.log('FAILED...', error);
      document.getElementById('status').innerText = "❌ Kunde inte skicka kod.";
    });
}

function verifyCode() {
  const inputCode = document.getElementById('code-input').value.trim();

  if (Date.now() > expirationTime) {
    document.getElementById('status').innerText = "⏰ Koden har gått ut! Skicka en ny.";
    return;
  }

  if (inputCode === verificationCode) {
    document.getElementById('status').innerText = "✅ Inloggning lyckades! Välkommen till Wikibra! 🚀";

    // 🚀 Automatiskt flytta användaren till index.html efter lyckad login
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000); // Vänta 1 sekund innan redirect för att visa lyckad inloggning
  } else {
    document.getElementById('status').innerText = "❌ Fel kod! Försök igen.";
  }
}

function resendCode() {
  sendVerificationCode(); // Skicka en ny kod
}
