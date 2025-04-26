// 🚀 Kolla om dark mode redan är påslagen
if (localStorage.getItem('wikibra_darkmode') === 'on') {
    document.body.classList.add('dark-mode');
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('wikibra_darkmode', 'on');
    } else {
      localStorage.setItem('wikibra_darkmode', 'off');
    }
  }
  