'use strict';

function transfIdentica() {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
}

function transfZero() {
    return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
}

function transfTranslatie(deplasareX, deplasareY) {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [deplasareX, deplasareY, 1]
    ];
}

function transfScalare(scalareX, scalareY) {
    return [
        [scalareX, 0, 0],
        [0, scalareY, 0],
        [0, 0, 1]
    ];
}

function transfSimetrieX() {
    /*return [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];*/
    return transfScalare(1, -1);
}

function transfSimetrieY() {
    /*return [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];*/
    return transfScalare(-1, 1);
}

function transfSimetrieO() {
    /*return [
        [-1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];*/
    return transfScalare(-1, -1);
}

// rotatia unui punct aflat in origine
function transfRotatie(theta) {
    return [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ];
}

function transfRotatiePunct(x, y, theta) {
    return compunere(
        transfTranslatie(-x, -y),
        transfRotatie(theta),
        transfTranslatie(x, y)
    );
}

function inmultireRezultat(A, B) {
    let rezultat = transfZero();

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                rezultat[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return rezultat;
}

function compunere() {
    let rezultat = transfIdentica();

    for (let transformare of arguments) {
        rezultat = inmultireRezultat(rezultat, transformare);
    }

    return rezultat;
}

function aplica(transform, x, y) {
    return {
        x: transform[0][0] * x + transform[1][0] * y + transform[2][0] * 1,
        y: transform[0][1] * x + transform[1][1] * y + transform[2][1] * 1,
        w: transform[0][2] * x + transform[1][2] * y + transform[2][2] * 1
    };
}
