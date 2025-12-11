// (Order determines the color: 0=yellow, 1=green, 2=blue, 3=purple)

const GROUPS = [
    { name: "Christmas Symbols", words: ["HOLLY", "REINDEER", "SANTA CLAUS", "STOCKING"] },
    { name: "Christmas ___", words: ["CARD", "CAROL", "EVE", "TREE"] },
    { name: "Some of Santa's Reindeers", words: ["COMET", "CUPID", "RUDOLPH", "VIXEN"] },
    { name: "Parts of a Santa Costume", words: ["BEARD", "BELT", "BOOTS", "HAT"] }
];

let cards = GROUPS.map(g => g.words).flat();
cards.sort(() => Math.random() - 0.5);
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
        fitText(div);
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
        // If all groups are solved, show clue button
        if (solved.length === GROUPS.length) {
            showClueButton();
        }
    }, 250);
}

function showClueButton() {
    if (document.getElementById('clue-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'clue-btn';
    btn.textContent = 'To The Egg!';
    btn.style.display = 'block';
    btn.style.margin = '0 auto 18px auto';
    btn.style.fontSize = '20px';
    btn.style.background = '#a0c35a';
    btn.style.color = '#b22222';
    btn.style.fontWeight = 'bold';
    btn.style.border = '4px solid';
    btn.style.borderRadius = '32px';
    btn.style.cursor = 'pointer';
    btn.style.padding = '16px 36px';
    btn.style.letterSpacing = '1px';
    btn.onclick = () => {
        window.location.href = 'connections-clue.html';
    };
    const controls = document.querySelector('.controls');
    controls.parentNode.insertBefore(btn, controls);
}

function fitText(card) {
    let size = 18; // starting size
    card.style.fontSize = size + "px";

    // shrink if text is too wide for the box
    while (card.scrollWidth > card.clientWidth && size > 6) {
        size -= 1;
        card.style.fontSize = size + "px";
    }

    // shrink if text is too tall after wrapping
    while (card.scrollHeight > card.clientHeight && size > 6) {
        size -= 1;
        card.style.fontSize = size + "px";
    }

    // Always shrink 2 more if above 14px
    if (size > 12) {
        size = Math.max(12, size - 4);
        card.style.fontSize = size + "px";
    }
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
