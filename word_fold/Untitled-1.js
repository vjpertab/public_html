const BOARDS = [ // all good!
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

function make_cell_list() { /* all good! */
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let index = 0; index < 25; index += 5) {
        cell_board.push(cells.slice(index, index + 5));
    }
    return cell_board;
}
/* all good! */
const CELLS = make_cell_list();
console.log(CELLS);

function setup_game(board) { /* all good! */
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = board[y][x];
        }
    }
}
/* all good! */
setup_game(BOARDS[0].cells);
document.getElementById("words").innerHTML = "Words to spell: " + BOARDS[0].words.join(", ");

let selected_x = -1;
let selected_y = -1;

function select(x, y) { /* all good! */
    let cell = CELLS[y][x];
    if (cell.innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0) {
            CELLS[selected_y][selected_x].classList.remove("selected");
        }
        selected_x = x;
        selected_y = y;
        cell.classList.add("selected");
    }
}

function move(x, y) { /* all good! */
    if (CELLS[y][x].innerHTML.length < 7) {
        CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
        CELLS[selected_y][selected_x].innerHTML = "";
        select(x, y);
    }
    else {
        // Cannot break here, it's not inside a loop or switch.
    }
}

function unselect(x, y) {  /* all good! */
    let cell = CELLS[y][x];
    selected_x = -1;
    selected_y = -1;
    CELLS[y][x].classList.remove("selected");
}

function can_move(x, y) {
    let is_next_to = Math.abs(selected_x - x) + Math.abs(selected_y - y) == 1;
    return (CELLS[y][x].innerHTML.length > 0) && ((selected_x >= 0) && (selected_y >= 0)) && is_next_to;
}

function on_click(x, y) { /* all good! */
    if (selected_x == x && selected_y == y) {
        unselect(x, y);
    }
    else if (can_move(x, y)) {
        move(x, y);
    }
    else {
        select(x, y);
    }
}