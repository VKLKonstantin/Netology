#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const readline = require('readline');

let entered_number = 0; //вводимое число
let round = 1; //номер роунда
let result = 'los'; //результат раунда
let start = 0; //граница диапазона
let end = 0; //граница диапазона
let hiddenNumber; //загаданное число

const inputConsole = readline.createInterface(process.stdin);

/**
 * Генерация случайного числа в диапазоне от 1 до 10
 */
const generatorRandom = () => {
    start = Math.floor(Math.random() * 5) + 1; // (1 до 5]
    end = Math.floor(Math.random() * 5) + 6; // (5 до 10]
    hiddenNumber = Math.floor(Math.random() * (end - start + 1)) + start;
    console.log(`Угадай число в диапазоне от ${start} до ${end}`);
    return start, end, hiddenNumber;
}

generatorRandom();

inputConsole.on('line', (_entered_number) => {

    entered_number = +_entered_number;

    if (entered_number > end || entered_number < start) { // проверка на принадлежность числа к диапазону
        console.log("Вы ввели число вне диапазона. Пожалуйста, попробуйте еще раз")
        return;
    }
    if (entered_number === hiddenNumber) {
        console.log("Поздравляю, Вы угадали число!!!")
        writeInFile(); // запись результата в файл
        inputConsole.close();
        return;
    } else {
        console.log("Сожалею, Вы не угадали число")
        generatorRandom();
        writeInFile(); // запись результата в файл
    }
});
/**
 * Данные результата одного раунда
 */
const record_results = (_entered_number) => {
    const date = new Date().toISOString();
    if (_entered_number === hiddenNumber) {
        result = 'victory'
    }
    else {
        round++;
        result = 'los'
    }
    return { date, round, entered_number, result }
}
/**
 * Функция записи в файл 
 */
const writeInFile = () => {
    const dir = path.join(__dirname, 'Game');
    fs.mkdir(dir, (err) => {
        if (err.code === 'EEXIST') return
    })
    const file = path.join(__dirname, 'Game', 'resultGame.txt')
    const content = JSON.stringify(record_results(entered_number)) + '\n';
    fs.appendFile(file, content, (err) => {
        if (err) {
            throw Error(err)
        }
    })
}


