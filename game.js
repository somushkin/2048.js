const size = 4;
var table = [];

document.addEventListener('DOMContentLoaded', function () {

    init();
	game();

});

/**
 * подготовит главную матрицу для вычислений и вызовет отрисовку сетки на экране
 */
function init() {
    for (let i = 0; i < size; i++) {
        table[i] = [];
        for (let j = 0; j < size; j++) {
            table[i][j] = 0;
        }    
    }
    gameFieldRender();
}

/**
 * отрисовка игрового поля
 */
function gameFieldRender() {
    var table = document.getElementById('main-table');
    for (let i = 0; i < size; i++) {
        var row = table.insertRow(i);
        for (let j = 0; j < size; j++) {
            var cell = row.insertCell(j);
            cell.className = 'cell with-border';
        }
    }
}

/**
 * вернет одномерный массив, состоящий из пар координат свободных ячеек
 * в случае отсутствия таковых массив будет пустой
 */
function getFreeCells() {
    var index = 0;
    result = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!table[i][j]) {
                result[index] = {
                    "x": j,
                    "y": i
                };
                index++;
            }
        }
    }
    return result;
}

/**
 * @returns [x, y] or false
 * позволяет получить координаты случайной свободной ячейки
 */
async function getRandomFreeCell() {
    var freeCells = await getFreeCells();
    if (freeCells.length == 0) {
        return false;
    }

    // случайный индекс в пределах массива
    var index = Math.floor(Math.random() * freeCells.length);
    return freeCells[index];
}

/**
 * отрисовка чисел главной матрицы на игровом поле
 */
function tableView() {
    var rows = document.getElementById('main-table').rows;
    result = [];

    for (let i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
            var value = table[i][j] ? table[i][j] : '';
            var opacity = value ? Math.log2(value) / 20 : 0;
            cells[j].innerText = value;
            cells[j].style.backgroundColor = "rgba(0, 0, 255, "+ opacity +")";
        }
    }
}

/**
 * 
 * @param String direction - направление движения
 * @returns Boolean true|false - было ли выполнено перемещение
 */
function move(direction) {
    var isMoved = false;
    switch (direction) {
        case 'left':
            for (let i = 0; i < size; i++) {
                for (let j = 1; j < size; j++) {
                    if (!table[i][j]) {
                        continue;
                    }
                    for (let k = j - 1; k >= 0; k--) {
                        if (!table[i][k]) {
                            table[i][k] = table[i][k + 1];
                            table[i][k + 1] = 0;
                            isMoved = true;
                        }
                        if (table[i][k] && table[i][k] == table[i][k + 1]) {
                            table[i][k] += table[i][k + 1];
                            table[i][k + 1] = 0;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
            break;
        
        case 'right':
            for (let i = 0; i < size; i++) {
                for (let j = size - 2; j >= 0; j--) {
                    if (!table[i][j]) {
                        continue;
                    }
                    for (let k = j + 1; k < size; k++) {
                        if (!table[i][k]) {
                            table[i][k] = table[i][k - 1];
                            table[i][k - 1] = 0;
                            isMoved = true;
                        }
                        if (table[i][k] && table[i][k] == table[i][k - 1]) {
                            table[i][k] += table[i][k - 1];
                            table[i][k - 1] = 0;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
            break;

        case 'up':
            for (let i = 0; i < size; i++) {
                for (let j = 1; j < size; j++) {
                    if (!table[j][i]) {
                        continue;
                    }
                    for (let k = j - 1; k >= 0; k--) {
                        if (!table[k][i]) {
                            table[k][i] = table[k + 1][i];
                            table[k + 1][i] = 0;
                            isMoved = true;
                        }
                        if (table[k][i] && table[k][i] == table[k + 1][i]) {
                            table[k][i] += table[k + 1][i];
                            table[k + 1][i] = 0;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
            break;

        case 'down':
            for (let i = 0; i < size; i++) {
                for (let j = size - 2; j >= 0; j--) {
                    if (!table[j][i]) {
                        continue;
                    }
                    for (let k = j + 1; k < size; k++) {
                        if (!table[k][i]) {
                            table[k][i] = table[k - 1][i];
                            table[k - 1][i] = 0;
                            isMoved = true;
                        }
                        if (table[k][i] && table[k][i] == table[k - 1][i]) {
                            table[k][i] += table[k - 1][i];
                            table[k - 1][i] = 0;
                            isMoved = true;
                            break;
                        }
                    }
                }
            }
            break;
            
        default:
            break;
    }
    return isMoved;
}

function isGameOver() {
    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            if (
                table[i][j] == table[i][j + 1] ||
                table[i][j] == table[i][j - 1] ||
                table[i][j] == table[i + 1][j] ||
                table[i][j] == table[i - 1][j] ||
                getFreeCells().length   
               ) {
                   return false;
               }
        }        
    }
    return true;
}

async function game() {

    var cell = await getRandomFreeCell();
    table[cell.y][cell.x] = 2;    
    tableView();
    
    document.onkeydown = async function (event) {
        var direction = event.key.replace('Arrow', '').toLowerCase();
        var isMoved = move(direction);
        if (isMoved) {
            var cell = await getRandomFreeCell();
            table[cell.y][cell.x] = 2;
            tableView();
        } else {
            if (isGameOver()) {
                alert('Game over');
            }
        }
    }
}
