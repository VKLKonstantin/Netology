#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv
if (argv.month | argv.m) {
  console.log(`Current month: ${new Date().getMonth()}`)
}

console.log('argv', argv)


if (argv) {
  console.log(`Current date and time in ISO format: ${new Date().toISOString()}`)
}

if (argv.year) {
  console.log(`Current year: ${new Date().getFullYear()}`)
}
if (argv.date | argv.d) {
  console.log(`Current date: ${new Date().getDate()}`)
}

