/**
 * Grow and multiply your organisms to end up larger than your opponent.
 **/
 
var inputs = readline().split(' ');
const width = parseInt(inputs[0]); // columns in the game grid
const height = parseInt(inputs[1]); // rows in the game grid
 
function chooseTargetProteinSide(source, targets) { // targets[0] -> yakın nokta, targets[1] -> bir sonraki yakın nokta
    let closest = targets[0];
    let sideOfSource = whichSideOfTheTarget(source, targets[0]);
    let chosenSideOfTarget;
    if (sideOfSource[0] == 0) {
        chosenSideOfTarget = {
            x: closest.x,
            y: closest.y + sideOfSource[1]
        }
        return chosenSideOfTarget;
    }
    if (sideOfSource[1] == 0) {
        chosenSideOfTarget = {
            x: closest.x + sideOfSource[0],
            y: closest.y
        }
        return chosenSideOfTarget;
    }
    let sidePositions = [
        {
            x: closest.x + sideOfSource[0],
            y: closest.y
        },
        {
            x: closest.x,
            y: closest.y + sideOfSource[1]
        }
    ]
    let firstDistance = distance(sidePositions[0], targets[1]);
    let secondDistance = distance(sidePositions[1], targets[1]);
    if (firstDistance <= secondDistance) {
        return sidePositions[0];
    } else {
        return sidePositions[1];
    }
}

function whichSideOfTheTarget(source, target) {
    let position = [-1,-1];
    if (source.x > target.x) {
        position[0] = 1;
    }
    else if (source.x == target.x) {
        position[0] = 0;
    }
 
    if (source.y > target.y) {
        position[1] = 1;
    }
    else if (source.y == target.y) {
        position[1] = 0;
    }
    return position;
}

function directionDetect(position) {
    if (position[0] === 0 && position[1] === -1) {
        return "S";
    } else if (position[0] === 0 && position[1] === 1) {
        return "N";
    } else if (position[0] === -1 && position[1] === 0) {
        return "E";
    } else if (position[0] === 1 && position[1] === 0) {
        return "W";
    } else if (position[0] === -1 && position[1] === -1) {
        return "SE";
    } else if (position[0] === 1 && position[1] === -1) {
        return "SW";
    } else if (position[0] === -1 && position[1] === 1) {
        return "NE";
    } else if (position[0] === 1 && position[1] === 1) {
        return "NW";
    }
    return null; // Eğer yön tanımlı değilse null döndür
}

function distance(source, target) {
    //var distance = Math.sqrt((Math.pow(source.x-target.x,2))+(Math.pow(source.y-target.y,2)))
    return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
}

function wayFinder(cells,other) {
    let closestF = {distance:10000};
    for (let j = 0; j < other.length; j++) {
        for (let k = 0; k < cells.length; k++) {
            const a = distance(cells[k], {x: other[j].x, y: other[j].y});
            if (closestF.distance > a) {
                closestF = {x: other[j].x, y: other[j].y, cellId: cells[k].id, distance:a, cell: cells[k]};
            }
        }
    }
    return closestF;
}
function findClosestCell(cells, target) {
    let min = 10000;
    let cell;
    for(let i = 0; i < cells.length; i++) {
        if(min > distance(cells[i], target)) {
            min = distance(cells[i], target);
            cell = cells[i];
        }
    }
    return cell;
}
let harvestedProteins = [];
let flag = 0;
let go = 1;
let sporerFlag = true;
var tentacleFlag = false;
let allyRoots = [];
let enemyRoots = [];
// game loop
while (true) {
    const entityCount = parseInt(readline());
    let cells = [];
    let emptyGrid = [];
    let proteinA = [];
    let sporer;
    let closest = {distance:10000};
    let closestEmpty = {distance:1000};
    let fullGrids = [];
    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        var x = parseInt(inputs[0]);
        var y = parseInt(inputs[1]); // grid coordinate
        const type = inputs[2]; // WALL, allyRoots, BASIC, TENTACLE, HARVESTER, SPORER, A, B, C, D
        const owner = parseInt(inputs[3]); // 1 if your organ, 0 if enemy organ, -1 if neither
        var organId = parseInt(inputs[4]); // id of this entity if it's an organ, 0 otherwise
        const organDir = inputs[5]; // N,E,S,W or X if not an organ
        const organParentId = parseInt(inputs[6]);
        const organallyRootsId = parseInt(inputs[7]);
        //console.error(x + ' ' + y + ' ' + entityCount)
        fullGrids.push({x:x, y:y});
        if ((type == 'ROOT' || type == 'BASIC') && owner == 1) {
            cells.push({x : x, y: y, id: organId})
        }
        
        if (type == 'A') {
            proteinA.push({x:x, y:y})
        }
        if (type == 'C') {
            proteinC.push({x:x, y:y})
        }
        if (type == 'D') {
            proteinC.push({x:x, y:y})
        }
        if ( type == 'ROOT') {
            if(owner == 0) {
                enemyRoots.push({x:x, y:y})
            } else if(owner == 1) {
                allyRoots.push({x:x, y:y})
            }
        }
        if (type == 'SPORER' && owner == 1) {
            sporer = ({x:x, y:y, id:organId});
        }

    }
    var inputs = readline().split(' ');
    const myA = parseInt(inputs[0]);
    const myB = parseInt(inputs[1]);
    const myC = parseInt(inputs[2]);
    const myD = parseInt(inputs[3]); // your protein stock
    var inputs = readline().split(' ');
    const oppA = parseInt(inputs[0]);
    const oppB = parseInt(inputs[1]);
    const oppC = parseInt(inputs[2]);
    const oppD = parseInt(inputs[3]); // opponent's protein stock
    const requiredActionsCount = parseInt(readline()); // your number of organisms, output an action for each one in any order
    // Add all grid positions to emptyGrid initially
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            emptyGrid.push({ x: x, y: y });
        }
    }

    // Remove positions from emptyGrid that are occupied in fullGrids
    emptyGrid = emptyGrid.filter(grid => 
        !fullGrids.some(full => full.x === grid.x && full.y === grid.y)
    );

    for (let i = 0; i < requiredActionsCount; i++) {
        for (let m = 0; m < allyRoots.length; m++) {
            if (!go) {
                if (!tentacleFlag) {
                    closest.cell = findClosestCell(cells, enemyRoots[0]);
                    closest.cellId = closest.cell.id;
                    closest.x = Math.ceil(Math.abs(((allyRoots[m].x - enemyRoots[0].x))/2)) + 1
                    closest.y = allyRoots[m].y;
                    if(Math.abs(closest.cell.x-closest.x) == 1) {
                        tentacleFlag = true;
                    }
                } else{
                    closest.cell = findClosestCell(cells, enemyRoots[0]);
                    closest.cellId = closest.cell.id;
                    closest.x = Math.ceil(Math.abs(((allyRoots[m].x - enemyRoots[0].x))/2)) + 1
                    let verticalEmptyCells = emptyGrid.filter(grid => grid.x == closest.x);
                    /*for (let j = 0; j < verticalEmptyCells.length; j++) {
                        closest.y = verticalEmptyCells[j].y;               
                    }*/
                    if (verticalEmptyCells.length > 0) {
                        closest.y = verticalEmptyCells[0].y
                    }
                    else if (verticalEmptyCells.length == 0) {
                        go = false;
                        tentacleFlag = false;
                        closest = wayFinder(cells,emptyGrid);
                        flag++;
                    }
                }
            }
            else if (flag) {
                closest = wayFinder(cells,emptyGrid);
            } else {
                closest = wayFinder(cells, proteinA);
            }
    
            if (myC>0 && myD > 0 && closest.distance == 2){
                harvestedProteins.push([{x:closest.x, y:closest.y}]);
                const direction = directionDetect(whichSideOfTheTarget(closest.cell,closest));
                console.log('GROW ' + closest.cellId + ' ' + closest.x + ' ' + closest.y + ' HARVESTER '+ direction);
                flag++;
            } else if (myB>0 && myC > 0 && tentacleFlag) {
                const direction = directionDetect(whichSideOfTheTarget(closest.cell,closest));
                console.log('GROW ' + closest.cellId + ' ' + closest.x + ' ' + closest.y + ' TENTACLE '+ direction);
            } else if (sporerFlag) {
                const direction = directionDetect(whichSideOfTheTarget(closest.cell,closest));
                if (direction == "E") {
                    if (!sporer?.id) {
                        console.log('GROW ' + closest.cellId + ' ' + closest.cell.x+1 + ' ' + (closest.cell.y) + ' SPORER '+ direction);
                    } else {
                        console.log('SPORE '+sporer.id+' '+(closest.x-2)+' '+closest.y)
                        sporerFlag = false;
                    }
                } else if (direction == "NE") {
                    if (!sporer?.id) {
                        console.log('GROW ' + closest.cellId + ' ' + closest.cell.x + ' ' + (closest.cell.y-1) + ' SPORER '+ "E");
                    } else {
                        console.log('SPORE '+sporer.id+' '+(closest.x-2)+' '+closest.y)
                        sporerFlag = false;
                    }
                } else if (direction == "SE") {
                    if (!sporer?.id) {
                        console.log('GROW ' + closest.cellId + ' ' + closest.cell.x + ' ' + (closest.cell.y+1) + ' SPORER '+ "E");
                    } else {
                        console.log('SPORE '+sporer.id+' '+(closest.x-2)+' '+closest.y)
                        sporerFlag = false;
                    }
                } else {
                    console.error("yönler hatalı!")
                }

            } else {
                console.log('GROW ' + closest.cellId + ' ' + closest.x + ' ' + closest.y + ' BASIC' );
            }
        }
    }
}
 