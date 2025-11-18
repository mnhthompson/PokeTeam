
const startBtn = document.getElementById('start-building');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    window.location.href = './team/index.html';
  });
}

const saveBtn = document.getElementById('load-saved-team');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    window.location.href = './save/index.html';
  });
}