const readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});
const number = Math.floor(Math.random() * 100) + 1;
console.log(number);

function guessNumber(query) {
    return new Promise((resolve, reject) => {
        rl.question(query, (input) => {
            resolve(input);
        });
    });
}

async function checkNumber(result) {
    if(+result === number) {
        console.log('Отгадано число', result);
        rl.close();
    } else if(result > number) {
        result = await guessNumber('Меньше \n');
        checkNumber(result);
    } else {
        result = await guessNumber('Больше \n');
        checkNumber(result);
    }
}

async function main() {
    let result = await guessNumber('Загадано число от 0 до 100 \n');
    await checkNumber(result);
}

main();


