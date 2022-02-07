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
    count: 0,
    countWonGames: 0,
    countLostGames: 0,
    percent: 0
};

function processingFile(result) {
    fs.stat(pathFile, (err, stat) => {
        if(err == null) {
            // console.log('File exists');
            let contentFile = JSON.parse(readContentFile());
            contentFile = updateContentFile(contentFile, result);
            writeContentFile(contentFile);
        } else if(err.code === 'ENOENT') {
            let contentFile = updateContentFile(data, result);
            writeContentFile(contentFile);
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

function updateContentFile(data, result) {
    if(data) {
        data.count += 1;

        if(result) {
            data.countWonGames += 1;
        } else {
            data.countLostGames += 1;
        }
        
        if(data.countWonGames !== 0) {
            data.percent = `${Math.round(data.countWonGames / data.count  * 100)}%`;
        } else {
            data.percent = '0%';
        }

        console.log('Количество игр:', data.count);
        console.log('Количество побед:', data.countWonGames);
        console.log('Количество поражений:', data.countLostGames);
        console.log('Процент выигранных игр:', data.percent);

        return data;
    }
}

function writeContentFile(data) {
    // console.log('Write');
    const writerStream = fs.createWriteStream(pathFile);

    writerStream.write(JSON.stringify(data));
    writerStream.on('error', err => {
        console.log('Error:', err);
    });
    writerStream.end();
}

function readContentFile() {
    // console.log('Read');
    let contentFile = fs.readFileSync(pathFile, {encoding: 'utf-8'});
    return contentFile;
}

function checkNumber(num) {
    let result;

    if(+num === number) {
        console.log('Вы угадали число', num);
        result = true;
    } else {
        console.log('Вы не угадали число');
        result = false;
    }

    return result;
}

async function main() {
    let answer = await guessNumber('Загадано число 1 или 2 \n');
    let result = checkNumber(answer);
    rl.close();
    processingFile(result);
}

main();