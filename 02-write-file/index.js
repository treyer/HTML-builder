const fs = require('fs');
const path = require('path');
const process = require('process');
const os = require('os');
var readline = require('readline');

const filePath = path.join(__dirname, "input.txt");
const writeableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.stdout.write(`Hi! Type something! (CTRL + C or type "exit" to exit the programm) ${os.EOL}`);

rl.on("line", line => {
    if (line.trim() === "exit"){
        rl.close();
    } else {
        writeableStream.write(line + "\n");
    }
})

rl.on("close", () => {
    process.stdout.write("Thank you! Good bye!");
    writeableStream.end();
})

rl.on('SIGINT', () => {
    rl.close();
    writeableStream.end();
});