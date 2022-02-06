const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});
const number = Math.ceil(Math.random() * 2);
const pathFile = path.join(__dirname, 'results.json');
console.log(number);

let data = {
    'Количество партий': 0,
    'Количество выигранных партий': 0,
    'Количество проигранных партий': 0,
    'Процентное соотношение выиграных партий': 0
};

function processingFile() {
    fs.stat(pathFile, (err, stat) => {
        if(err == null) {
            console.log('File exists');

            let contentFile = JSON.parse(readContentFile());
            contentFile['Количество партий'] += 1;

            fs.writeFile(pathFile, JSON.stringify(contentFile), err => {
                console.log(err);
            });
        } else if(err.code === 'ENOENT') {
            data['Количество партий'] += 1;

            fs.writeFile(pathFile, JSON.stringify(data), err => {
                console.log(err);
            });
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}

function guessNumber(query) {
    return new Promise((resolve, reject) => {
        rl.question(query, (input) => {
            resolve(input);
        });
    });
}

function readContentFile() {
    let contentFile = fs.readFileSync(pathFile, 'utf8');
    return contentFile;
}

async function checkNumber(result) {
    if(+result === number) {
        console.log('Вы угадали число', result);
    } else {
        console.log('Вы не угадали число');
    }
}

async function main() {
    let result = await guessNumber('Загадано число 1 или 2 \n');
    await checkNumber(result);
    processingFile();

    rl.close();
}

main();