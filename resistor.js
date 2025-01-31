
const colorCode = {
    0: "black",
    1: "brown",
    2: "red",
    3: "orange",
    4: "yellow",
    5: "green",
    6: "blue",
    7: "violet",
    8: "gray",
    9: "white",
    0.1: "gold",
    0.01: "silver"
};

const toleranceCode = {
    1: "brown",
    2: "red",
    5: "gold",
    10: "silver"
};

const colorToValue = {
    black: 0,
    brown: 1,
    red: 2,
    orange: 3,
    yellow: 4,
    green: 5,
    blue: 6,
    violet: 7,
    gray: 8,
    white: 9,
    gold: 0.1,
    silver: 0.01
};

function updateResistor() {
    const value = document.getElementById("resistanceValue").value;
    const tolerance = document.getElementById("tolerance").value;
    const errorMessage = document.getElementById("errorMessage");

    if (!value || isNaN(value) || value < 1) {
        errorMessage.textContent = "Por favor, insira um valor válido (maior ou igual a 1).";
        return;
    } else {
        errorMessage.textContent = "";
    }

    let resistance = parseFloat(value);
    let digits = [];
    let multiplier = 1;

    // Extrai os dois primeiros dígitos significativos
    if (resistance < 10) {
        // Caso especial para valores menores que 10
        digits.push(Math.floor(resistance));
        digits.push(0); // Segundo dígito é 0
        multiplier = 1; // Multiplicador é 10^0
    } else {
        // Para valores maiores ou iguais a 10
        let numDigits = Math.floor(Math.log10(resistance)) + 1; // Conta o número de dígitos
        let firstTwoDigits = Math.floor(resistance / Math.pow(10, numDigits - 2)); // Extrai os dois primeiros dígitos
        digits.push(Math.floor(firstTwoDigits / 10)); // Primeiro dígito
        digits.push(firstTwoDigits % 10); // Segundo dígito
        multiplier = Math.pow(10, numDigits - 2); // Calcula o multiplicador

        // Ajusta o multiplicador para um valor válido no código de cores
        if (multiplier > 1e9) {
            multiplier = 1e9; // Limite máximo suportado (10^9)
        }
    }

    // Define as cores das faixas
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band4 = document.getElementById("band4");

    band1.style.backgroundColor = colorCode[digits[0]] || "white";
    band2.style.backgroundColor = colorCode[digits[1]] || "white";
    band3.style.backgroundColor = colorCode[multiplier] || "white";
    band4.style.backgroundColor = toleranceCode[tolerance] || "gold";

    // Atualiza o valor calculado
    updateCalculatedValue();
}

function selectColor(color, value) {
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band4 = document.getElementById("band4");

    if (!band1.style.backgroundColor) {
        band1.style.backgroundColor = color;
    } else if (!band2.style.backgroundColor) {
        band2.style.backgroundColor = color;
    } else if (!band3.style.backgroundColor) {
        band3.style.backgroundColor = color;
    } else if (!band4.style.backgroundColor) {
        band4.style.backgroundColor = color;
    }

    // Atualiza o valor calculado
    updateCalculatedValue();
}

function updateCalculatedValue() {
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band4 = document.getElementById("band4");

    const color1 = band1.style.backgroundColor;
    const color2 = band2.style.backgroundColor;
    const color3 = band3.style.backgroundColor;
    const color4 = band4.style.backgroundColor;

    const value1 = colorToValue[color1] || 0;
    const value2 = colorToValue[color2] || 0;
    const value3 = colorToValue[color3] || 1;
    const value4 = colorToValue[color4] || 5;

    const resistance = (value1 * 10 + value2) * value3;
    const tolerance = value4;

    document.getElementById("calculatedValue").textContent = `${resistance} Ω ±${tolerance}%`;

    // Conversão para kΩ e MΩ
    const kiloOhms = (resistance / 1000).toFixed(2);
    const megaOhms = (resistance / 1000000).toFixed(2);
    document.getElementById("convertedValue").textContent = `${kiloOhms} kΩ | ${megaOhms} MΩ`;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
