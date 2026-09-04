document.querySelectorAll('[data-app]').forEach(btn=>{
  btn.addEventListener('click', ()=> document.getElementById('app-'+btn.dataset.app).classList.add('open'));
});
document.querySelectorAll('[data-back]').forEach(btn=>{
  btn.addEventListener('click', ()=> btn.closest('.app-screen').classList.remove('open'));
});

/* Tombol Home Indicator bawah untuk menutup semua aplikasi aktif kembali ke Beranda */
document.getElementById('home-indicator').addEventListener('click', () => {
  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.remove('open');
  });
  document.getElementById('control-center').classList.remove('open');
});

function toggleControlCenter() {
  document.getElementById('control-center').classList.toggle('open');
}
document.getElementById('cc-torch').addEventListener('click', function() {
  this.textContent = this.textContent.includes('Mati') ? '🔦 Senter: Hidup' : '🔦 Senter: Mati';
});

/* Insight */
let count = 0;
document.getElementById('btn-plus').addEventListener('click', ()=> { count++; document.getElementById('counter').textContent = count; });
document.getElementById('btn-minus').addEventListener('click', ()=> { count--; document.getElementById('counter').textContent = count; });

/* Profil */
document.getElementById('btn-edit-name').addEventListener('click', ()=>{
  const n = prompt('Nama baru:', 'faqih');
  if(n){ document.querySelector('.profile-name').textContent = n; document.getElementById('avatar').textContent = n.charAt(0).toUpperCase(); }
});
document.getElementById('btn-logout').addEventListener('click', ()=> alert('Keluar akun (simulasi)'));

/* Kalkulator */
let calcExpr = '';
const calcDisplay = document.getElementById('calc-display');
document.querySelectorAll('#app-kalkulator [data-n]').forEach(b=>{
  b.addEventListener('click', ()=> { calcExpr += b.dataset.n; calcDisplay.textContent = calcExpr; });
});
document.querySelectorAll('#app-kalkulator [data-c]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const c = b.dataset.c;
    if(c === 'clear'){ calcExpr=''; calcDisplay.textContent='0'; return; }
    if(c === '='){
      try{
        const safe = calcExpr.replace(/[^0-9+\-*/.]/g,'');
        const res = Function('"use strict";return ('+safe+')')();
        calcDisplay.textContent = Number.isFinite(res) ? res : 'Error';
        calcExpr = calcDisplay.textContent === 'Error' ? '' : calcDisplay.textContent;
      }catch(e){ calcDisplay.textContent = 'Error'; calcExpr = ''; }
      return;
    }
    calcExpr += c; calcDisplay.textContent = calcExpr;
  });
});

/* Catatan */
let notes = [];
function renderNotes(){
  const list = document.getElementById('note-list');
  if(notes.length === 0){ list.innerHTML = '<p style="color:#777; font-size:12px;">Belum ada catatan</p>'; return; }
  list.innerHTML = notes.map((n,i)=> `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #333; font-size:13px;"><span>${n}</span><button data-i="${i}" style="background:none; border:none; color:#ff453a; cursor:pointer;">✕</button></div>`).join('');
  list.querySelectorAll('button[data-i]').forEach(b=> b.addEventListener('click', ()=> { notes.splice(+b.dataset.i,1); renderNotes(); }));
}
document.getElementById('note-add').addEventListener('click', ()=>{
  const input = document.getElementById('note-text');
  if(input.value.trim() === '') return;
  notes.unshift(input.value.trim()); input.value = ''; renderNotes();
});
renderNotes();

/* WhatsApp */
document.getElementById('wa-send').addEventListener('click', ()=>{
  const input = document.getElementById('wa-input');
  const chatBox = document.getElementById('wa-chat-box');
  if(input.value.trim() === '') return;
  const myB = document.createElement('div'); myB.className = 'chat-me'; myB.textContent = input.value;
  chatBox.appendChild(myB); input.value = '';
  setTimeout(() => {
    const reply = document.createElement('div'); reply.className = 'chat-other'; reply.textContent = "Pesan telah dikirim!";
    chatBox.appendChild(reply); chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
});
document.getElementById('btn-save-contact').addEventListener('click', ()=>{
  alert('✅ Kontak berhasil disimpan!');
  this.textContent = 'Tersimpan';
});

/* Safari Browser */
const safariInput = document.getElementById('safari-url-input');
const safariFrame = document.getElementById('safari-frame');
safariInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    let url = this.value.trim();
    if (!url.startsWith('http')) url = 'https://' + url;
    safariFrame.src = url;
  }
});

/* Sosmed Like */
document.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', function() {
  this.textContent = this.textContent === '🤍' ? '❤️' : '🤍';
}));

/* Kamera */
document.getElementById('btn-shoot').addEventListener('click', ()=>{
  const vf = document.getElementById('viewfinder');
  vf.style.backgroundColor = '#fff';
  setTimeout(() => { vf.style.backgroundColor = '#000'; alert('📸 Foto berhasil disimpan!'); }, 150);
});

/* Spotify Audio Engine */
let audioCtx = null; let audioTimer = null; let isSpotifyPlaying = false;
let spotifyPlaylist = [
  { title: "DVRST - Close Eyes", artist: "Phonk Style", freq: 110, type: "sawtooth" },
  { title: "Kordhell - Murder in My Mind", artist: "Aggressive Phonk", freq: 90, type: "square" },
  { title: "DXRK - RAVE", artist: "Cyber Phonk", freq: 130, type: "sawtooth" },
  { title: "TikTok Viral Beat", artist: "Viral Remix", freq: 150, type: "triangle" }
];
let currentSpotifyIndex = 0;

function playSpotifyBeat() {
  if (!audioCtx) return;
  const song = spotifyPlaylist[currentSpotifyIndex];
  const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
  osc.type = song.type; osc.frequency.setValueAtTime(song.freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function renderSpotifyPlaylist() {
  document.getElementById('spotify-playlist').innerHTML = spotifyPlaylist.map((s, i) => 
    `<div class="spotify-song-item ${i === currentSpotifyIndex ? 'active' : ''}" onclick="selectSpotifySong(${i})">
       <span>${s.title}</span><span>${i === currentSpotifyIndex && isSpotifyPlaying ? 'Playing' : '▶'}</span>
     </div>`
  ).join('');
}
function selectSpotifySong(i) {
  currentSpotifyIndex = i;
  document.getElementById('spotify-song-title').textContent = spotifyPlaylist[i].title;
  document.getElementById('spotify-song-artist').textContent = spotifyPlaylist[i].artist;
  renderSpotifyPlaylist();
}
document.getElementById('spotify-play-btn').addEventListener('click', function() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  isSpotifyPlaying = !isSpotifyPlaying;
  document.getElementById('spotify-disc').classList.toggle('playing', isSpotifyPlaying);
  this.textContent = isSpotifyPlaying ? '⏸ Jeda' : '▶ Putar';
  renderSpotifyPlaylist();
  if (isSpotifyPlaying) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playSpotifyBeat(); audioTimer = setInterval(playSpotifyBeat, 320);
  } else { clearInterval(audioTimer); }
});
renderSpotifyPlaylist();

/* Snake Game */
const canvas = document.getElementById('snake-canvas'); const ctx = canvas.getContext('2d');
const gridSize = 10; const tileCount = canvas.width / gridSize;
let snake = []; let apple = { x: 5, y: 5 }; let dx = 1; let dy = 0; let score = 0; let gameInterval = null; let isGameOver = false;

function resetSnake() {
  snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
  dx = 1; dy = 0; score = 0; isGameOver = false;
  document.getElementById('snake-score').textContent = score;
  document.getElementById('snake-status').textContent = "Main";
  document.getElementById('snake-status').style.color = "#34C759";
  spawnApple();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateSnake, 130);
}
function spawnApple() {
  apple.x = Math.floor(Math.random() * tileCount); apple.y = Math.floor(Math.random() * tileCount);
}
function updateSnake() {
  if (isGameOver) return;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) { triggerGameOver(); return; }
  for (let part of snake) { if (head.x === part.x && head.y === part.y) { triggerGameOver(); return; } }
  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) { score += 10; document.getElementById('snake-score').textContent = score; spawnApple(); }
  else { snake.pop(); }
  
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FF3B30"; ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
  snake.forEach((p, i) => { ctx.fillStyle = i === 0 ? "#34C759" : "#28A745"; ctx.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 1, gridSize - 1); });
}
function triggerGameOver() {
  isGameOver = true; clearInterval(gameInterval);
  document.getElementById('snake-status').textContent = "Game Over!";
  document.getElementById('snake-status').style.color = "#FF3B30";
}
document.getElementById('btn-up').addEventListener('click', ()=> { if(dy===0){dx=0;dy=-1;} });
document.getElementById('btn-down').addEventListener('click', ()=> { if(dy===0){dx=0;dy=1;} });
document.getElementById('btn-left').addEventListener('click', ()=> { if(dx===1){dx=0;dy=-1;} else if(dx===-1){dx=0;dy=1;} else if(dy===1){dx=1;dy=0;} else if(dy===-1){dx=-1;dy=0;} });
document.getElementById('btn-right').addEventListener('click', ()=> { if(dx===1){dx=0;dy=1;} else if(dx===-1){dx=0;dy=-1;} else if(dy===1){dx=-1;dy=0;} else if(dy===-1){dx=1;dy=0;} });
document.getElementById('btn-restart').addEventListener('click', resetSnake);
resetSnake();
