import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Game = () => {
	const [gameState, setGameState] = useState(null);
	const [winnerMessage, setWinnerMessage] = useState('');

	useEffect(() => {
		// fetch initial game state when the component mounts
		axios.post('http://localhost:5000/game/start')
			.then(response => setGameState(response.data))
			.catch(error =>
				console.error('Error starting a new game:', error));
	}, []);

	const handleHit = () => {
		// logic for the player to hit
		axios.post('http://localhost:5000/game/hit',
			{ gameId: gameState._id })
			.then(response => {
				setGameState(response.data);
				checkWinner(response.data.winner);
			})
			.catch(error => console.error('Error hitting:', error));
	};

	const handleStand = () => {
		// logic for the player to stand
		axios.post('http://localhost:5000/game/stand',
			{ gameId: gameState._id })
			.then(response => {
				setGameState(response.data);
				checkWinner(response.data.winner);
			})
			.catch(error =>
				console.error('Error standing:', error));
	};

	const startNewGame = () => {
		// logic to start a new game
		setWinnerMessage(''); // clear the winner message
		axios.post('http://localhost:5000/game/start')
			.then(response => setGameState(response.data))
			.catch(error =>
				console.error('Error starting a new game:', error));
	};

	const checkWinner = (winner) => {
		// display winner message and start a new game
		setWinnerMessage(`Winner: ${winner}`);
		setTimeout(() => {
			startNewGame();
		}, 5000); // auto start a new game after 3 seconds
	};

	return (
		<div className="kl">
			{gameState ? (
				<>
					<h1>Blackjack Game</h1>
					{winnerMessage && <p className="winner-message">
						{winnerMessage} </p>}
					<div className="ma">

						<div className="playerside">
							<h2>Player Hand:</h2>
							<ul>
								{gameState.player.hand.map((card, index) => (
									<li key={index}>{card.rank} 
										&nbsp;of {card.suit}</li>
								))}
							</ul>
							<p>Score: {gameState.player.score}</p>
						</div>
						<div className="dealerside">
							<h2>Dealer Hand:</h2>
							<ul>
								{gameState.dealer.hand.map((card, index) => (
									<li key={index}>{card.rank} 
										&nbsp;of {card.suit}</li>
								))}
							</ul>
							<p>Score: {gameState.dealer.score}</p>
						</div>
					</div>
					<div className="buttons">
						<button onClick={handleHit}>Hit</button>
						<button onClick={handleStand}>Stand</button>
						<button onClick={startNewGame}>
							Start New Game
						</button>
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default Game;
