import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className={"square " +(props.isWinning ? "square--winning" : null) }
     onClick={props.onClick} >
      {props.value}
    </button>
  );
}
// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square"
//         onClick={() => this.props.onClick()} >
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  
  // handleClick(i){
  //   const squares = this.state.squares.slice();
  //   if(calculateWinner(squares) || squares[i]){
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    return (
      <Square 
        isWinning = {this.props.winningSquares.includes(i)}
        key={"square:"+i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
      
      );
  }

  render() {
    let boardSquares = [];
    for(let row = 0; row < 3; row++){
      let boardRow = [];
      for(let col = 0; col < 3; col++){
        boardRow.push(<span key={(row*3)+col}>{this.renderSquare((row*3)+col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>)
    }
    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const locations = [
      [1,1],
      [2,1],
      [3,1],
      [1,2],
      [2,2],
      [3,2],
      [1,3],
      [2,3],
      [3,3]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: locations[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #'+move +' (col,row): '+history[move].location :
      'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc }
          </button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: '+winner;
    }else if (!current.squares.includes(null)) {
      status = "DRAW GAME";
    }else{
      status = 'Next player: ' +(this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares = {winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {player: squares[a], line: [a,b,c]};
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
