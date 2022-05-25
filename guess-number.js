#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

let start = 0;
let end = 0;
let hiddenNumber = 0;

const generatorRandom = () => {

    start = Math.floor(Math.random() * 10) + 1 // (1 до 10]
    end = Math.floor(Math.random() * 10) + 11 // (10 до 20]
    hiddenNumber = Math.floor(Math.random() * (end - start + 1)) + start

    console.log('start', start)
    console.log('end', end)
    console.log('hiddenNumber', hiddenNumber)

    console.log(`Угадай число в диапазоне от ${start} до ${end}`)
    return start, end, hiddenNumber
}

if (argv.luckyNumber === hiddenNumber) {
    console.log("Поздравляю, Вы угадали число")
} else {
    console.log("Сожалею, Вы не угадали число")
}

module.exports = generatorRandom()