'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
    return inputString[currentLine++];
}

function electricist(arr) {
    const dim = {
        x: arr[0].length,
        y: arr.length,
        total: arr[0].length * arr.length,
        wall: 0
    }
    const total = dim.x+dim.y;
    const op = {
        maxy: dim.y-1,
        maxx: dim.x-1,
        pondx: (dim.x*100)/total,
        pondy: (dim.y*100)/total,
    }
    let lightRange = [];
    let newArr = JSON.parse(JSON.stringify(arr));
    arr.map((line, currentY) => {
        line.map((val, currentX) => {
            if(val === 1) {
                dim.wall++;
                return null
            };
            const illuminated = {
                x: 0,
                y: 0,
                x1: 0,
                y1:0,
            }
            //X-Right
            for (let index = currentX + 1; index < dim.x; index++) {
                const element = arr[currentY][index];
                if(element === 1) break;
                illuminated.x++;
            }
            //X-Left
            for (let index = currentX - 1; index >= 0; index--) {
                const element = arr[currentY][index];
                if(element === 1) break;
                illuminated.x1++;
            }
            //Y-Bottom
            for (let index = currentY + 1; index < dim.y; index++) {
                const element = arr[index][currentX];
                if(element === 1) break;
                illuminated.y++;
            }
            //Y-TOP
            for (let index = currentY - 1; index >= 0; index--) {
                const element = arr[index][currentX];
                if(element === 1) break;
                illuminated.y1++;
            }
            const totalIlluminated = Object.values(illuminated).reduce((a, b) => a + b);
            const pon = 
                (op.maxx !== 0 ? (illuminated.x  * op.pondx)/op.maxx : 0)  + 
                (op.maxx !== 0 ? (illuminated.x1 * op.pondx)/op.maxx : 0)  +
                (op.maxy !== 0 ? (illuminated.y  * op.pondy)/op.maxy : 0)  +
                (op.maxy !== 0 ? (illuminated.y1 * op.pondy)/op.maxy : 0) 
            lightRange.push({
                posx: currentX,
                posy: currentY,
                range: totalIlluminated,
                prom: totalIlluminated/4,
                pon,
                ...illuminated,
            });           
        })
    }); 
    lightRange = lightRange.sort((a, b )=> b.range - a.range);
    const posibleLigths = lightRange.length;
    const maxPond = (lightRange.sort((a, b )=> b.pon - a.pon))[0].pon;
    //TODO: falta calcular valor para ponderacion
    lightRange.filter(a => a.pon > 70).map(coord => newArr[coord.posy][coord.posx] = '💡');
    return newArr;
}

function main() {
    const ws = fs.createWriteStream('./output.txt');
    let arr = [];
    inputString.map(l => {
        const line = readLine().replace(/\s+$/g, '').split(' ').map(arrTemp => parseInt(arrTemp, 10));
        arr.push(line)
    })
    const result = electricist(arr);
    ws.write(result.join('\n').replace(/,/g, ' '));
    ws.end();
}