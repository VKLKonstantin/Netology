#!/usr/bin/env node

const readline = require('readline');
const inputConsole = readline.createInterface(process.stdin);
let start = 0;
let end = 0;
let hiddenNumber;

const generatorRandom = () => {
    start = Math.floor(Math.random() * 10) + 1; // (1 до 10]
    end = Math.floor(Math.random() * 10) + 11; // (10 до 20]
    hiddenNumber = Math.floor(Math.random() * (end - start + 1)) + start;
    console.log(`Угадай число в диапазоне от ${start} до ${end}`);
    return start, end, hiddenNumber;
}

generatorRandom();

inputConsole.on('line', (entered_number) => {
    if (+entered_number === hiddenNumber) {
        console.log("Поздравляю, Вы угадали число!!!")
        inputConsole.close();
        return;
    } else {
        console.log("Сожалею, Вы не угадали число")
        console.log('entered_number', entered_number)
        generatorRandom();
    }
});