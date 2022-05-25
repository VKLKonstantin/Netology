#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

console.log('argv', argv)

const arg = argv._[0];

console.log('arg', arg)

if (arg === 'current') {
  if (process.argv.length === 2) {
    console.log(`Current date and time in ISO format: ${new Date().toISOString()}`)
  }
  if (argv.month | argv.m) {
    console.log(`Current month: ${new Date().getMonth()}`)
  }
  if (argv.year) {
    console.log(`Current year: ${new Date().getFullYear()}`)
  }
  if (argv.date | argv.d) {
    console.log(`Current date: ${new Date().getDate()}`)
  }
}
if (arg === 'add') {
  if (argv.d) {
    console.log(`Date + 2 days ahead: ${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()}`)
  }
}

if (arg === 'sub') {
  if (argv.month) {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const countDays = month % 2 === 0 && month !== 2
      ? 30 : month === 2 && year % 4 === 0
        ? 29 : month === 2 && year % 4 !== 0
          ? 28 : 31;
    console.log(`Date - month ago: ${new Date(new Date().getTime() - countDays * 24 * 60 * 60 * 1000).toISOString()}`)
  }
}
