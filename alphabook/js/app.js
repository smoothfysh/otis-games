function showView(view) {
  if (view === 'book') renderBook();
  document.querySelectorAll('.ab-view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1));
  if (el) el.classList.add('active');
  document.querySelector('.game-header').style.display = view === 'home' ? '' : 'none';
}
window.showView = showView;

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}
window.closeModal = closeModal;

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (!document.getElementById('modal').classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') navAnimal(-1);
  if (e.key === 'ArrowRight') navAnimal(1);
});