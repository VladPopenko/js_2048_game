class e{#e;#t;constructor(e,t,l){this.cellElement=e,this.x=t,this.y=l}set tile(e){this.#e=e,e&&(this.tile.x=+this.x,this.tile.y=+this.y)}get tile(){return this.#e}get mergeTile(){return this.#t}set mergeTile(e){this.#t=e,e&&(this.#t.x=this.x,this.#t.y=this.y)}canAcceptTile(e){return!this.tile||this.tile.value===e.value&&!this.mergeTile}mergeTiles(){this.tile&&this.#t&&(this.tile.value=+this.tile.value+ +this.#t.value,this.#t.remove(),this.#t=null)}}class t{#l;#i;#s;constructor(e,t){let l=document.createElement("div"),{cellElement:i,x:s,y:r}=e;l.style.setProperty("--coord-y",r),l.style.setProperty("--coord-x",s),l.textContent=t,l.className=`field-cell game-cell field-cell--${t}`,this.tileElement=l,this.#l=s,this.#i=r,this.#s=+t,i.append(l)}set x(e){this.#l=+e,this.tileElement.style.setProperty("--coord-x",+e)}get x(){return this.#l}set y(e){this.#i=+e,this.tileElement.style.setProperty("--coord-y",+e)}get y(){return this.#i}set value(e){e&&(this.#s=+e,this.tileElement.textContent=e.toString(),this.tileElement.className=`field-cell game-cell field-cell--${e}`)}get value(){return this.#s}remove(){this.tileElement.remove()}waitForTransition(){return new Promise(e=>{this.tileElement.addEventListener("transitionend",e,{once:!0})})}}const l=new class{constructor(e){e?(this.initialState=e,this.board=JSON.parse(JSON.stringify(e))):this.board=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],this.gameIsStarted=!1,this.mergedTiles=[],this.mergedTilesValues=[],this.cellState=this.createCellState(e),this.highScore=localStorage.getItem("highScore")||0}updateHighScore(){let e=this.getScore();e>this.highScore&&(this.highScore=e,localStorage.setItem("highScore",this.highScore))}moveLeft(){if(!this.gameIsStarted||!this.canMoveLeft())return;this.moveCells(this.board);let{cell:e,randomValue:l}=this.newTile();return this.slideTiles(this.cellState).finally(()=>{e&&(e.tile=new t(e,l))})}moveRight(){if(!this.gameIsStarted||!this.canMoveRight())return;let e=this.getReversed(this.board),l=this.moveCells(e);this.board=this.getReversed(l);let{cell:i,randomValue:s}=this.newTile();return this.slideTiles(this.cellState.map(e=>[...e].reverse())).finally(()=>{i&&(i.tile=new t(i,s))})}moveUp(){if(!this.gameIsStarted||!this.canMoveUp())return;let e=this.getElementsByColumn(this.board),l=this.moveCells(e);this.board=this.getElementsByColumn(l);let{cell:i,randomValue:s}=this.newTile();return this.slideTiles(this.cellsByColumn).finally(()=>{i&&(i.tile=new t(i,s))})}moveDown(){if(!this.gameIsStarted||!this.canMoveDown())return;let e=this.getElementsByColumn(this.board),l=this.getReversed(e),i=this.moveCells(l),s=this.getReversed(i);this.board=this.getElementsByColumn(s);let{cell:r,randomValue:a}=this.newTile();return this.slideTiles(this.cellsByColumn.map(e=>[...e].reverse())).finally(()=>{r&&(r.tile=new t(r,a))})}getScore(){return this.mergedTilesValues.reduce((e,t)=>e+t,0)}getState(){return this.board}getStatus(){return this.isWinner()?(this.updateHighScore(),"win"):this.gameIsStarted&&this.noMovesPossible?(this.updateHighScore(),"lose"):this.gameIsStarted?"playing":"idle"}start(){let{cell:e,randomValue:l}=this.newTile();e&&(e.tile=new t(e,l));let{cell:i,randomValue:s}=this.newTile();i&&(i.tile=new t(i,s)),this.gameIsStarted=!0}restart(){this.initialState?this.board=JSON.parse(JSON.stringify(this.initialState)):this.board.forEach(e=>{for(let t=0;t<e.length;t++)e[t]&&(e[t]=0)}),this.mergedTiles=[],this.mergedTilesValues=[],this.gameIsStarted=!1,this.cellState&&this.cellState.forEach(e=>{for(let t=0;t<e.length;t++){let l=e[t];l.tile&&(l.tile.remove(),l.tile=null),l.mergeTile&&(l.mergeTile.remove(),l.tile=null)}}),this.cellState=this.createCellState(this.initialState)}createCellState(l=[]){return[...document.querySelectorAll(".field-row")].map((i,s)=>{let r=[...i.children],a=[];for(let i=0;i<r.length;i++){let n=new e(r[i],i,s);if(l.length>0){let e=l[s][i];if(0!==e){let l=new t(n,e);n.tile=l}}a.push(n)}return a})}get randomCell(){let e=[];if(this.board.forEach((t,l)=>{for(let i=0;i<t.length;i++)t[i]&&0!==t[i]||e.push([i,l])}),0===e.length)return;let t=Math.floor(Math.random()*e.length);return e[t]}newTile(){let e;let t=this.randomCell;if(!t)return;let[l,i]=t,s=.1>=Math.random()?4:2;return this.board[i][l]=s,this.cellState[i]&&(e=this.cellState[i][l]),{cell:e,randomValue:s}}getCoords(e){return{x:+e.dataset.x,y:+e.dataset.y}}moveCells(e){this.mergedTiles=[];for(let t=0;t<e.length;t++){let l=e[t];for(let e=1;e<l.length;e++){let i;let s=l[e];if(0!==s){for(let r=e-1;r>=0;r--){let e=l[r],a=this.mergedTiles.length>0&&this.mergedTiles.find(([e,l])=>r===e&&t===l);if(!this.canCellAcceptTile(e,s,a))break;i=r}(i||0===i)&&(l[i]===l[e]&&(this.mergedTiles.push([i,t]),l[i]=2*l[e],this.mergedTilesValues.push(2*l[e])),0===l[i]&&(l[i]=l[e]),l[e]=0)}}}return e}canCellAcceptTile(e,t,l){return!e||e===t&&!l}get cellsByColumn(){let e=this.cellState,t=[];for(let l=0;l<e.length;l++){let i=e.map(e=>e[l]);t.push(i)}return t}get tableByColumn(){let e=this.cellState,t=[];for(let l=0;l<e.length;l++){let i=e.map(e=>e[l]);t.push(i)}return t}slideTiles(e){return Promise.all(e.flatMap(e=>{let t=[];for(let l=1;l<e.length;l++){let i;let s=e[l].tile,r=e[l];if(s){for(let t=l-1;t>=0;t--){let l=e[t];if(!l.canAcceptTile(s))break;i=l}i&&(i.tile?(t.push(s.waitForTransition()),i.mergeTile||(i.mergeTile=s)):(i.tile=s,t.push(s.waitForTransition())),r.tile=null)}}return t}))}canMove(e){return e.some((e,t)=>e.some((t,l)=>0!==l&&0!==t&&this.canCellAcceptTile(e[l-1],t,!1)))}getElementsByColumn(e){let t=[];for(let l=0;l<e.length;l++){let i=e.map(e=>e[l]);t.push(i)}return t}getReversed(e){return e.map(e=>[...e].reverse())}canMoveLeft(){return this.canMove(this.board)}canMoveRight(){let e=this.getReversed(this.board);return this.canMove(e)}canMoveUp(){let e=this.getElementsByColumn(this.board);return this.canMove(e)}canMoveDown(){let e=this.getElementsByColumn(this.board),t=this.getReversed(e);return this.canMove(t)}get noMovesPossible(){return!this.canMoveDown()&&!this.canMoveUp()&&!this.canMoveLeft()&&!this.canMoveRight()}isWinner(){return this.mergedTilesValues.some(e=>2048===e)}},i=document.querySelector("button"),s=document.querySelectorAll(".message"),r=document.querySelector(".message-start"),a=document.querySelector(".game-score"),n=document.querySelector(".best .game-score"),h=parseInt(localStorage.getItem("highScore"))||0;function o(){document.addEventListener("keydown",c,{once:!0})}async function c(e){var t;switch(e.key){case"ArrowLeft":await l.moveLeft();break;case"ArrowRight":await l.moveRight();break;case"ArrowUp":await l.moveUp();break;case"ArrowDown":await l.moveDown();break;default:o();return}l.cellState.flat().forEach(e=>{e.mergeTiles()}),t=l.getStatus(),s.forEach(e=>{e.classList.contains(`message-${t}`)&&e.classList.remove("hidden")}),m(l.getScore()),l.isWinner()&&l.noMovesPossible()||o()}function m(e){a.textContent=e,e>h&&(n.textContent=e,localStorage.setItem("highScore",e))}n.textContent=h,i.addEventListener("click",()=>{let e=i.classList.contains("start");i.textContent=e?"Restart":"Start",e?(l.start(),i.classList.replace("start","restart")):(l.restart(),m(0),i.classList.replace("restart","start"),s.forEach(e=>{e.classList.contains("hiiden")||e.classList.add("hidden")})),r.classList.toggle("hidden")}),o();
//# sourceMappingURL=index.b331b32c.js.map
