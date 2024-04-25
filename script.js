function startTournament() {
    const input = document.getElementById('players').value.trim();
    let players = input.split('\n').filter(p => p.trim() !== '');

    if (players.length < 2 || players.length > 32) {
        alert('Liczba zawodników musi wynosić od 2 do 32.');
        return;
    }

    const bracketContainer = document.getElementById('bracket');
    bracketContainer.innerHTML = ''; // Clear previous bracket

    generateMatches(players, bracketContainer);
}

function generateMatches(players, container, round = 1) {
    if (players.length === 1) {
        container.innerHTML += `<div class="match">${players[0]} wins the tournament!</div>`;
        return;
    }

    let roundContainer = document.createElement('div');
    roundContainer.className = 'round';
    roundContainer.innerHTML = `<h2>Round ${round}</h2>`;
    container.appendChild(roundContainer);

    let nextRoundPlayers = [];

    for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
            let player1 = players[i];
            let player2 = players[i + 1];
            let matchId = player1 + "_vs_" + player2;
            let matchElement = document.createElement('div');
            matchElement.className = 'match';
            matchElement.innerHTML = `<div>${player1} vs ${player2}</div>
                                      <input type="text" placeholder="Winner" id="winner_${matchId}">
                                      <button onclick="submitResult('${player1}', '${player2}', '${matchId}', ${round}, '${container.id}')">Submit</button>`;
            roundContainer.appendChild(matchElement);
            nextRoundPlayers.push(matchId);
        } else {
            nextRoundPlayers.push(players[i]); // last player automatically moves to the next round
        }
    }

    // Only create the next round if all matches are decided
    setTimeout(() => {
        if (document.querySelectorAll(`#${container.id} .round:nth-child(${round}) .match input[type='text']:not([disabled])`).length === 0) {
            let winners = nextRoundPlayers.map(id => document.getElementById('winner_' + id) ? document.getElementById('winner_' + id).value : id);
            generateMatches(winners, container, round + 1);
        }
    }, 100); // delay to allow for last input
}

function submitResult(player1, player2, matchId, round, containerId) {
    const winnerInput = document.getElementById('winner_' + matchId);
    const winner = winnerInput.value.trim();
    if (winner !== player1.trim() && winner !== player2.trim()) {
        alert("Please enter a valid winner name exactly as listed in the match.");
        return;
    }

    winnerInput.disabled = true;
}
