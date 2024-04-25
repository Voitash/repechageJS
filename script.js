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
        container.innerHTML = `<div class="match">${players[0]} wins the tournament!</div>`;
        return;
    }

    let roundContainer = document.createElement('div');
    roundContainer.className = 'round';
    roundContainer.innerHTML = `<h2>Round ${round}</h2>`;
    container.appendChild(roundContainer);

    let nextRoundPlayers = [];
    while (players.length > 1) {
        let player1 = players.shift();
        let player2 = players.shift();
        let matchId = player1 + "_vs_" + player2;
        let matchElement = document.createElement('div');
        matchElement.className = 'match';
        matchElement.innerHTML = `<div>${player1} vs ${player2}</div>
                                  <input type="text" placeholder="Winner" id="winner_${matchId}">
                                  <button onclick="submitResult('${player1}', '${player2}', '${matchId}', ${round})">Submit</button>`;
        roundContainer.appendChild(matchElement);
        nextRoundPlayers.push(matchId);
    }

    // If odd number of players, pass the last player directly to the next round
    if (players.length === 1) {
        nextRoundPlayers.push(players[0]);
    }

    // Handle next round
    setTimeout(() => {
        if (nextRoundPlayers.length > 0) {
            generateMatches(nextRoundPlayers.map(id => document.getElementById('winner_' + id).value), container, round + 1);
        }
    }, 10);
}

function submitResult(player1, player2, matchId, round) {
    const winnerInput = document.getElementById('winner_' + matchId);
    const winner = winnerInput.value;
    if (winner !== player1 && winner !== player2) {
        alert("Please enter a valid winner name exactly as listed in the match.");
        return;
    }

    winnerInput.disabled = true;
    winnerInput.nextElementSibling.disabled = true;

    let matches = document.getElementsByClassName('match');
    for (let i = 0; i < matches.length; i++) {
        let inputs = matches[i].getElementsByTagName('input');
        if (inputs.length > 0 && inputs[0].disabled === false) {
            return;
        }
    }

    // If all matches in the current round have been resolved, move to the next round
    let nextRoundPlayers = Array.from(document.querySelectorAll('.round:nth-child(' + round + ') .match input'))
                                .map(input => input.value);
    const bracketContainer = document.getElementById('bracket');
    generateMatches(nextRoundPlayers, bracketContainer, round + 1);
}
