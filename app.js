let currentAudio = null;
let currentBtn = null;

const nowPlaying = document.getElementById('now-playing');
const nowPlayingText = document.getElementById('now-playing-text');

document.querySelectorAll('.sound-btn').forEach(btn => {
  const soundPath = btn.dataset.sound;

  // Vérifie si le fichier audio existe (via fetch HEAD)
  fetch(soundPath, { method: 'HEAD' })
    .catch(() => btn.classList.add('no-audio'));

  btn.addEventListener('click', () => {
    const label = btn.querySelector('.label').textContent;

    // Stop le son en cours si c'est le même bouton
    if (currentAudio && currentBtn === btn) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      resetBtn(btn);
      return;
    }

    // Stop le son en cours si c'est un autre bouton
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      resetBtn(currentBtn);
    }

    const audio = new Audio(soundPath);

    audio.addEventListener('error', () => {
      btn.classList.add('no-audio');
      resetBtn(btn);
      showNowPlaying('🔇 Pas encore de son pour ça…');
      setTimeout(hideNowPlaying, 2000);
    });

    audio.addEventListener('ended', () => {
      resetBtn(btn);
      hideNowPlaying();
    });

    audio.play().then(() => {
      currentAudio = audio;
      currentBtn = btn;
      btn.classList.add('playing');
      showNowPlaying('▶ ' + label);
    }).catch(() => {
      btn.classList.add('no-audio');
    });
  });
});

function resetBtn(btn) {
  if (btn) btn.classList.remove('playing');
  currentAudio = null;
  currentBtn = null;
}

function showNowPlaying(text) {
  nowPlayingText.textContent = text;
  nowPlaying.classList.remove('hidden');
}

function hideNowPlaying() {
  nowPlaying.classList.add('hidden');
}
