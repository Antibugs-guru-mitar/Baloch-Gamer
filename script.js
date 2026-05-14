let tiles = [], selected = [], score = 0, level = 1;
let best = localStorage.getItem('best') || 0;
let timer = 0, timerInterval, gameState = JSON.parse(localStorage.getItem('gameState'));
const fruits = ['🍇','🍐','🍌','🍒','🍑','🥝','🍎','🍉','🍍','🍓','🥭'];

function startGame() {
  document.getElementById('home').classList.remove('active');
  document.getElementById('game').classList.add('active');
  generateTiles();
  startTimer();
}

function continueGame() {
  if(gameState) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('game').classList.add('active');
    tiles = gameState.tiles;
    score = gameState.score;
    level = gameState.level;
    timer = gameState.timer;
    renderTiles();
    startTimer();
    updateUI();
  } else {
    alert('No saved game!');
  }
}

function generateTiles() {
  tiles = [];
  let pairs = 8 + level*2;
  let chosen = fruits.slice(0, pairs);

  chosen.forEach(f => {
    tiles.push({f, matched:false});
    tiles.push({f, matched:false});
  });

  tiles.sort(()=>Math.random()-0.5);
  renderTiles();
  score=0;
  timer=0;
  updateUI();
}

function renderTiles() {
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  tiles.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='tile'+(t.matched?' matched':'');
    div.innerHTML=t.matched?'':t.f;
    div.onclick=()=>selectTile(i);
    grid.appendChild(div);
  });
}

function selectTile(i){
  if(tiles[i].matched || selected.includes(i)) return;
  selected.push(i);
  document.getElementsByClassName('tile')[i].classList.add('selected');
  if(selected.length===2) setTimeout(checkMatch,300);
}

function checkMatch(){
  const [a,b]=selected;
  if(tiles[a].f===tiles[b].f){
    tiles[a].matched=tiles[b].matched=true;
    score+=100;
    if(tiles.every(t=>t.matched)){
      level++;
      setTimeout(()=>{
        alert('Level Complete! 🎉');
        generateTiles();
      },500);
    }
  } else {
    score=Math.max(0,score-20);
  }
  selected=[];
  renderTiles();
  updateUI();
  saveGame();
}

function updateUI(){
  document.getElementById('score').textContent=score;
  document.getElementById('level').textContent=level;
  document.getElementById('best').textContent=Math.max(best,score);
  document.getElementById('timer').textContent=timer+'s';
  if(score>best){
    best=score;
    localStorage.setItem('best',best);
  }
}

function startTimer(){
  clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    timer++;
    document.getElementById('timer').textContent=timer+'s';
  },1000);
}

function shuffle(){
  let u=tiles.filter(t=>!t.matched);
  u.sort(()=>Math.random()-0.5);
  let i=0;
  tiles=tiles.map(t=>t.matched?t:u[i++]);
  renderTiles();
  score=Math.max(0,score-50);
  updateUI();
}

function hint(){
  for(let i=0;i<tiles.length;i++){
    if(tiles[i].matched) continue;
    for(let j=i+1;j<tiles.length;j++){
      if(!tiles[j].matched && tiles[i].f===tiles[j].f){
        document.getElementsByClassName('tile')[i].style.boxShadow='0 0 20px #00ff00';
        document.getElementsByClassName('tile')[j].style.boxShadow='0 0 20px #00ff00';
        setTimeout(renderTiles,1000);
        return;
      }
    }
  }
}

function saveGame(){
  localStorage.setItem('gameState',JSON.stringify({tiles,score,level,timer}));
}

function resetProgress(){
  if(confirm('Reset all progress?')){
    localStorage.clear();
    location.reload();
  }
}

function goHome(){
  clearInterval(timerInterval);
  document.getElementById('game').classList.remove('active');
  document.getElementById('home').classList.add('active');
}

function showStats(){
  alert(`Best Score: ${best}\nCurrent Level: ${level}`);
}
