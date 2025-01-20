const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hi! Enter text to save it to the file. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye! Have a great day!');
    rl.close();
    return;
  }
  writeStream.write(`${input}\n`);
});

process.on('SIGINT', () => {
  console.log('\nGoodbye! Have a great day!');
  rl.close();
});

rl.on('close', () => {
  writeStream.end();
  process.exit();
});
