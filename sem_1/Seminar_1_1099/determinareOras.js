"use strict";

canvas.addEventListener("mouseup", function (e) {
    const mx = e.clientX - canvas.getBoundingClientRect().left;
    const my = e.clientY - canvas.getBoundingClientRect().top;

    var oras = obtineOrasApropiat(mx, my);
    marcheazaOras(oras);
    console.log(oras.denumire);
});

function obtineOrasApropiat(xe, ye) {

    const { x: long, y: lat } = aplica(inversa(transformare), xe, ye);

    let rezultat = null, distantaRezultat = Infinity;
    for (let oras of orase) {
        let distanta = Math.sqrt(
            (oras.long - long) * (oras.long - long)
            + (oras.lat - lat) * (oras.lat - lat));

        if (distanta < distantaRezultat) {
            rezultat = oras;
            distantaRezultat = distanta;
        }
    }

    return rezultat;
}

function marcheazaOras(oras) {
    desenare();
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let i = x * 4 + y * canvas.width * 4;

            if (obtineOrasApropiat(x, y) === oras) {
                imageData.data[i + 0] -= 55;
                imageData.data[i + 1] -= 55;
                imageData.data[i + 2] -= 55;
            }
        }
    }
    context.putImageData(imageData, 0, 0);
}