// (Order determines the color: 0=yellow, 1=green, 2=blue, 3=purple)

const GROUPS = [
    { name: "Christmas ___", words: ["CARD", "EVE", "TREE", "CAROL"] },
    { name: "Ways to sing", words: ["CHANT", "WARBLE", "LILT", "PIPE"] },
    { name: "Christmas Symbols", words: ["REINDEER", "HOLLY", "SANTA CLAUS", "PRESENTS"] },
    { name: "Parts of a Santa Costume", words: ["HAT", "BEARD", "BELT", "BOOTS"] }
];

let cards = GROUPS.map(g => g.words).flat();
let selected = [];
let solved = [];

const board = document.getElementById("board");
const solvedContainer = document.getElementById("solved-container");
const message = document.getElementById("message");

// main card grid
function renderBoard() {
    board.innerHTML = "";

    // Only display words NOT in any solved group
    const unsolvedCards = cards.filter(word =>
        !solved.some(group => group.words.includes(word))
    );

    unsolvedCards.forEach(word => {
        const div = document.createElement("div");
        div.className = "card";
        div.textContent = word;

        div.addEventListener("click", () => toggleSelect(word, div));

        board.appendChild(div);
    });
}


function toggleSelect(word, div) {
    if (div.classList.contains("locked")) return;

    if (selected.includes(word)) {
        selected = selected.filter(x => x !== word);
        div.classList.remove("selected");
    } else if (selected.length < 4) {
        selected.push(word);
        div.classList.add("selected");
    }
}

document.getElementById("deselect").onclick = () => {
    selected = [];
    renderBoard();
};

document.getElementById("shuffle").onclick = () => {
    cards.sort(() => Math.random() - 0.5);
    renderBoard();
};

document.getElementById("submit").onclick = () => {
    if (selected.length !== 4) {
        message.textContent = "Select exactly four!";
        return;
    }

    // Check each group
    for (let i = 0; i < GROUPS.length; i++) {
        const g = GROUPS[i];

        if (g.words.every(w => selected.includes(w))) {
            handleCorrectGroup(g, i);
            return;
        }
    }

    message.textContent = "Not a correct grouping.";
};

function handleCorrectGroup(group, level) {
    message.textContent = `Correct! ${group.name}`;
    solved.push(group);

    document.querySelectorAll(".card").forEach(card => {
        if (group.words.includes(card.textContent)) {
            card.classList.add("locked");
        }
    });

    setTimeout(() => {
        addSolvedCategory(group, level);
        selected = [];
        renderBoard(); 
    }, 250); // matches CSS transition
}



function addSolvedCategory(group, level) {
    const block = document.createElement("section");
    block.className = `solved-category level-${level}`;

    const title = document.createElement("h3");
    title.className = "solved-title";
    title.textContent = group.name;

    const line = document.createElement("p");
    line.className = "solved-words";
    line.textContent = group.words.join(", ");

    block.appendChild(title);
    block.appendChild(line);

    solvedContainer.appendChild(block);
}


renderBoard();
