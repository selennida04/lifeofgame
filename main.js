const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resolution = 5; //グリッドのサイズ
canvas.width = 1000;
canvas.height = 1000;
const rows = canvas.height/ resolution;
const cols = canvas.width / resolution;

let grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

function drawGrid(){
    ctx.clearRect(0,0,canvas.height,canvas.width)
    for (let row=0;row < rows;row++){
        for (let col=0;col < cols;col++){
            const cell = grid[row][col];
            ctx.fillStyle = cell ?"green":"black";
            ctx.fillRect(col*resolution,row*resolution,resolution,resolution);
        }
    }
}

function updateGrid(){
    const nextGrid = grid.map(ary => [...ary]);

    for (let row=0;row<rows;row++){
        for (let col=0;col<cols;col++){
            const neighbors = countNeighbors(row,col);
            if (grid[row][col] ===1){
                nextGrid[row][col] = neighbors <=3 && neighbors >=2 ? 1:0;
            }
            else{
                if (neighbors === 3) nextGrid[row][col] = 1;
            }
        }
    }
    grid = nextGrid;
}

function countNeighbors(row,col){
    let count = 0;
    for (let x=-1;x<=1;x++){
        for (let y=-1;y<=1;y++){
            if (x === 0 && y === 0) continue;
            const newRow = row + x;
            const newCol = col + y;
            if (newRow >= 0 && newRow < rows && newCol >=0 && newCol < cols){ //画面末端のセルはカウントしない
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

function gridrandom(){
    for (let row=0;row<rows;row++){  //初期条件の作成
        for (let col=0;col<cols;col++){
            const randomnumber = Math.random();
            if (randomnumber <= 0.1){
                grid[row][col] = 1;
            }
        }
    }
}

function step(){
    updateGrid();
    drawGrid();
    //requestAnimationFrame(step);
}

gridrandom();
drawGrid();
//requestAnimationFrame(step);

// クリックされたら緑にする
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Canvasの位置とサイズを取得
    const scaleX = canvas.width / rect.width;   // X方向のスケール
    const scaleY = canvas.height / rect.height; // Y方向のスケール

    // スケールを考慮してクリック位置を計算
    const mousex = Math.floor((event.clientX - rect.left) * scaleX / resolution);
    const mousey = Math.floor((event.clientY - rect.top) * scaleY / resolution);

    // 範囲チェック
    if (mousex >= 0 && mousex < cols && mousey >= 0 && mousey < rows) {
        grid[mousey][mousex] = grid[mousey][mousex] === 0 ? 1 : 0; // セルの状態を切り替え
        drawGrid(); // グリッドを再描画
    }
});


const reset = document.getElementById("resetButton");
reset.addEventListener("click",()=>{
    clearInterval(intervalID);
    let grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
    gridrandom();
    drawGrid();
    intervalID = setInterval(step, speed); // リセット後に再開
});
    
const slider = document.getElementById("speedSlider");
let speed = parseInt(slider.value);
slider.addEventListener("input",()=>{
    speed = parseInt(slider.value);
    clearInterval(intervalID);
    intervalID = setInterval(step,speed);
});

const startStopButton = document.getElementById("startStopButton");
let isRunning = false; // ゲームが実行中かどうかを管理するフラグ

startStopButton.addEventListener("click", () => {
    if (isRunning) {
        // ゲームを停止
        clearInterval(intervalID);
        startStopButton.textContent = "スタート"; // ボタンのテキストを変更
    } else {
        // ゲームを開始
        clearInterval(intervalID); // 念のため既存のタイマーをクリア
        intervalID = setInterval(step, speed);
        startStopButton.textContent = "ストップ"; // ボタンのテキストを変更
    }
    isRunning = !isRunning; // 実行状態を切り替え
});

let intervalID = setInterval(step,speed);


