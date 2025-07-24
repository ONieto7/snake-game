document.addEventListener("DOMContentLoaded", function () {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const volumeSlider = document.getElementById('volumeSlider');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');

  if (settingsBtn && settingsModal && volumeSlider && closeSettingsBtn) {
    settingsBtn.onclick = () => {
      settingsModal.style.display = 'flex';
    };

    closeSettingsBtn.onclick = () => {
      settingsModal.style.display = 'none';
    };

    volumeSlider.oninput = function () {
      localStorage.setItem('snakeVolume', this.value);
    };

    const savedVolume = localStorage.getItem('snakeVolume');
    if (savedVolume !== null) {
      volumeSlider.value = savedVolume;
    }
  }
});