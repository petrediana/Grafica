"use strict";

// I. Transformari sisteme de coordonate 
// (cartezian -> sferic si sferic -> cartezian)

function cartLaSferice(cart) {
    const sferice = { r: 0, phi: 0, theta: 0 };

    // calcul raza
    sferice.r = Math.sqrt(cart.x * cart.x + cart.y * cart.y + cart.z * cart.z);

    // calcul theta
    if (cart.x === 0) {
        if (cart.y > 0) {
            sferice.theta = Math.PI / 2;
        } else {
            sferice.theta = 3 * Math.PI / 2;
        }
    } else {
        let k = 0;
        if (cart.x < 0) {
            k = 1;
        } else if (cart.x > 0 && cart.y < 0) {
            k = 2;
        }
        sferice.theta = Math.atan(cart.y / cart.x + k * Math.PI);
    }

    // calcul phi
    if (cart.x * cart.x + cart.y * cart.y === 0) {
        sferice.phi = cart.z < 0 ? -Math.PI / 2 : Math.PI / 2;
    } else {
        sferice.phi = Math.atan(cart.z / Math.sqrt(cart.x * cart.x + cart.y * cart.y));
    }

    return sferice;
}

function sfericeLaCart(sferice) {
    return {
        x: sferice.r * Math.cos(sferice.theta) * Math.cos(sferice.phi),
        y: sferice.r * Math.sin(sferice.theta) * Math.cos(sferice.phi),
        z: sferice.r * Math.sin(sferice.phi)
    };
}

// II. Transformari 3D

function tZero3D() {
    return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}

function tIdentica3D() {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function tTranslatie3D(dx, dy, dz) {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [dx, dy, dz, 1]
    ];
}

function tScalare3D(sx, sy, sz) {
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ];
}

function tSimetrieX3D() {
    return tScalare3D(1, -1, -1);
}

function tSimetrieY3D() {
    return tScalare3D(-1, 1, -1);
}

function tSimetrieZ3D() {
    return tScalare3D(-1, -1, 1);
}

function tSimetrieO3D() {
    return tScalare3D(-1, -1, -1);
}

function tRotatieX3D(theta) {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(theta), Math.sin(theta), 0],
        [0, -Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 0, 1]
    ]
}

function tRotatieY3D(theta) {
    return [
        [Math.cos(theta), 0, -Math.sin(theta), 0],
        [0, 1, 0, 0],
        [Math.sin(theta), 0, Math.cos(theta), 0],
        [0, 0, 0, 1]
    ]
}

function tRotatieZ3D(theta) {
    return [
        [Math.cos(theta), Math.sin(theta), 0, 0],
        [-Math.sin(theta), Math.cos(theta), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function inmultireMatrice3D(A, B) {
    let rezultat = tZero3D();

    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            for (let k = 0; k < 4; ++k) {
                rezultat[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return rezultat;
}

// Compune prin inmultire transformarile
// primite ca parametru
function compunere3D() {
    let rezultat = tIdentica3D();

    for (let transformare of arguments) {
        rezultat = inmultireMatrice3D(rezultat, transformare);
    }

    return rezultat;
}

// aplica matricea de transformare pentru un punct 
// (inmultire vector (x, y, z, 1) cu matricea de transformare)
function aplica3D(transformare, x, y, z) {
    return {
        x: transformare[0][0] * x + transformare[1][0] * y + transformare[2][0] * z + transformare[3][0] * 1,
        y: transformare[0][1] * x + transformare[1][1] * y + transformare[2][1] * z + transformare[3][1] * 1,
        z: transformare[0][2] * x + transformare[1][2] * y + transformare[2][2] * z + transformare[3][2] * 1,
        w: transformare[0][3] * x + transformare[1][3] * y + transformare[2][3] * z + transformare[3][3] * 1
    };
}

// Calculul inversei pentru o matrice de 
// transformare 4x4 folosind transformari Laplace
// vezi: https://www.geometrictools.com/Documentation/LaplaceExpansionTheorem.pdf
// vezi: https://stackoverflow.com/questions/2624422/efficient-4x4-matrix-inverse-affine-transform/7596981#7596981
function inversa3D(a) {
    const s0 = a[0][0] * a[1][1] - a[1][0] * a[0][1];
    const s1 = a[0][0] * a[1][2] - a[1][0] * a[0][2];
    const s2 = a[0][0] * a[1][3] - a[1][0] * a[0][3];
    const s3 = a[0][1] * a[1][2] - a[1][1] * a[0][2];
    const s4 = a[0][1] * a[1][3] - a[1][1] * a[0][3];
    const s5 = a[0][2] * a[1][3] - a[1][2] * a[0][3];

    const c5 = a[2][2] * a[3][3] - a[3][2] * a[2][3];
    const c4 = a[2][1] * a[3][3] - a[3][1] * a[2][3];
    const c3 = a[2][1] * a[3][2] - a[3][1] * a[2][2];
    const c2 = a[2][0] * a[3][3] - a[3][0] * a[2][3];
    const c1 = a[2][0] * a[3][2] - a[3][0] * a[2][2];
    const c0 = a[2][0] * a[3][1] - a[3][0] * a[2][1];

    const invdet = 1.0 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

    const r = tZero3D();

    r[0][0] = (a[1][1] * c5 - a[1][2] * c4 + a[1][3] * c3) * invdet;
    r[0][1] = (-a[0][1] * c5 + a[0][2] * c4 - a[0][3] * c3) * invdet;
    r[0][2] = (a[3][1] * s5 - a[3][2] * s4 + a[3][3] * s3) * invdet;
    r[0][3] = (-a[2][1] * s5 + a[2][2] * s4 - a[2][3] * s3) * invdet;

    r[1][0] = (-a[1][0] * c5 + a[1][2] * c2 - a[1][3] * c1) * invdet;
    r[1][1] = (a[0][0] * c5 - a[0][2] * c2 + a[0][3] * c1) * invdet;
    r[1][2] = (-a[3][0] * s5 + a[3][2] * s2 - a[3][3] * s1) * invdet;
    r[1][3] = (a[2][0] * s5 - a[2][2] * s2 + a[2][3] * s1) * invdet;

    r[2][0] = (a[1][0] * c4 - a[1][1] * c2 + a[1][3] * c0) * invdet;
    r[2][1] = (-a[0][0] * c4 + a[0][1] * c2 - a[0][3] * c0) * invdet;
    r[2][2] = (a[3][0] * s4 - a[3][1] * s2 + a[3][3] * s0) * invdet;
    r[2][3] = (-a[2][0] * s4 + a[2][1] * s2 - a[2][3] * s0) * invdet;

    r[3][0] = (-a[1][0] * c3 + a[1][1] * c1 - a[1][2] * c0) * invdet;
    r[3][1] = (a[0][0] * c3 - a[0][1] * c1 + a[0][2] * c0) * invdet;
    r[3][2] = (-a[3][0] * s3 + a[3][1] * s1 - a[3][2] * s0) * invdet;
    r[3][3] = (a[2][0] * s3 - a[2][1] * s1 + a[2][2] * s0) * invdet;

    return r;
}