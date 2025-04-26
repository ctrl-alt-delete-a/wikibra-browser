function showProfile() {
    document.getElementById('profile-section').style.display = 'block';
  
    const savedProfile = localStorage.getItem('wikibra_profile');
    if (savedProfile) {
      document.getElementById('profile-text').value = savedProfile;
    }
  }
  
  function saveProfile() {
    const profileText = document.getElementById('profile-text').value.trim();
    localStorage.setItem('wikibra_profile', profileText);
    alert('✅ Din profil är sparad!');
  }
  