import React, {useState} from 'react';
import Board from './board';
import Difficulty from './difficulty';
import Message from './message';
import Refresh from './refresh';


function collinear(x1,  y1,  x2, y2,  x3,  y3)
{    let a = x1 * (y2 - y3) +
            x2 * (y3 - y1) +
            x3 * (y1 - y2);
 
    if (a === 0)
       return true;
    else
       return false;
}

const getCombinations = (a,n,s=[],t=[])=>{
    return a.reduce((p,c,i,a) => { n > 1 ? getCombinations(a.slice(i+1), n-1, p, (t.push(c),t))
                                         : p.push((t.push(c),t).slice(0));
                                   t.pop();
                                   return p},s)
  }
function toMatrix(arr, width) {
    return arr.reduce(function (rows, key, index) { 
      return (index % width === 0 ? rows.push([key]) 
        : rows[rows.length-1].push(key)) && rows;
    }, []);
  }

function getIndexOfK(arr, k) {
  for (let i = 0; i < arr.length; i++) {
    let index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
}

function getMatrixFromMatrix(m,n){
	let q1 = [];
  let q2 = [];
  let q3 = [];
  let q4 = [];
	for (let i = 0; i < n; i++) {
  	for (let j = 0; j < n; j++) {
  	 	q1.push(m[i][j]);
  	} 
  }

  for (let i = 1; i < n+1; i++) {
  	for (let j = 0; j < n; j++) {
  	 	q2.push(m[i][j]);
  	} 
  }
  for (let i = 0; i < n; i++) {
  	for (let j = 1; j < n+1; j++) {
  	 	q3.push(m[i][j]);
  	} 
  }
  for (let i = 1; i < n+1; i++) {
  	for (let j = 1; j < n+1; j++) {
  	 	q4.push(m[i][j]);
  	} 
  }

  console.log(q1)
  let c1 = getCombinations(q1,4);
  let c2 = getCombinations(q2,4);
  let c3 = getCombinations(q3,4);
  let c4 = getCombinations(q4,4);
  return c1.concat(c2,c3,c4);

}

function getWinCombination(level){
  let x1,y1,x2,y2,x3,y3,x4,y4
	if (level === "easy"){
    let MyArray = toMatrix(Array.from(Array(9).keys()),3);
    let conbinations = getCombinations(Array.from(Array(9).keys()),3);
    let result = [];
    for (let i = 0; i < conbinations.length; i++) {
      [x1,y1] = getIndexOfK(MyArray,conbinations[i][0]);
      [x2,y2] = getIndexOfK(MyArray,conbinations[i][1]);
      [x3,y3] = getIndexOfK(MyArray,conbinations[i][2]);
      //console.log(x1,y1,x2,y2,x3,y3);
      if (collinear(x1,y1,x2,y2,x3,y3)){
        result.push(conbinations[i])
      }
    }
    console.log(result);
  	return result;
  }
  else{
  	let MyArray = toMatrix(Array.from(Array(25).keys()),5);
    let conbinations = getMatrixFromMatrix(MyArray,4);
    let result = [];
    for (let i = 0; i < conbinations.length; i++) {
      [x1,y1] = getIndexOfK(MyArray,conbinations[i][0]);
      [x2,y2] = getIndexOfK(MyArray,conbinations[i][1]);
      [x3,y3] = getIndexOfK(MyArray,conbinations[i][2]);
      [x4,y4] = getIndexOfK(MyArray,conbinations[i][3]);
      //console.log(x1,y1,x2,y2,x3,y3);
      if (collinear(x1,y1,x2,y2,x3,y3) && collinear(x2,y2,x3,y3,x4,y4)){
        result.push(conbinations[i])
      }
    }
    console.log(result);
  	return result;
  
  }  
}

const winCondition = (board,level)=>{
    const strikes = getWinCombination(level);
    console.log(strikes);
/*
    const strikes = [
        [0,1,2],
        [0,4,8],
        [0,3,6],
        [1,4,7],
        [2,4,6],
        [2,5,8],
        [3,4,5],
        [6,7,8]
    ];
*/
    if (level === "easy"){
        for (let i=0; i< strikes.length; i++) {
            let [a, b, c] = strikes[i];
            if (board[a]!=="" &&board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }
    else{
        for (let i=0; i< strikes.length; i++) {
            let [a, b, c, d] = strikes[i];
            console.log(a,b,c,d);
            if (board[a]!=="" &&board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
                return true;
            }
        }
        return false;

    }
        
}

const Game =()=>{
    const [level, setLevel] = useState('easy');
    const [boardSize, setBoardSize] = useState(9);
    const [board, setBoard] = useState(Array(boardSize).fill(""));
    const [player, setPlayer] = useState("X");
    const [message, setMessage] = useState("Start the Game!!!");
    


    const refresh = () => {
        setBoardSize(level ==="hard" ? 25 : 9);
        setBoard(Array(boardSize).fill(""));
        setPlayer("X");
        setMessage("Start the Game!!!");
    }

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
        setBoardSize(event.target.value ==="hard" ? 25 : 9);
        setBoard(Array(event.target.value ==="hard" ? 25 : 9).fill(""));
        setPlayer("X");
        setMessage("Start the Game!!!");
      };

    const handleInput = (pos) => {    
        if (player === "" || board[pos] !== "") {
            return;
        }
       
        const boardCopy = [...board];
        boardCopy[pos] = player;
        setBoard(boardCopy); 
        

        if (winCondition(boardCopy,level)){
            setMessage(`WON: ${player}`)
            setPlayer("");
            return;
        }

        if (boardCopy.indexOf("")=== -1){ 
            setMessage("DRAW")
            setPlayer("");
        } else {
            let nextPlayer = (player === "X") ? "O" : "X"
            setPlayer(nextPlayer); 
            setMessage(`TURN: ${nextPlayer}`)
        }
    }

    return (<div>
            <h1 className='game-header'>Tic Tac Toe</h1>
            <Difficulty onChange={handleLevelChange}/>
            <Message value={message} />
            <Board onClick={handleInput} value={board} size={boardSize} level={level} /> 
            <Refresh onClick={refresh} value={'Refresh'} />
        </div>)
}

export default Game