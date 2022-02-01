#!/usr/bin/env node

const yargs = require('yargs');
const argv = yargs
    .alias('y', 'year')
    .alias('m', 'month')
    .alias('d', 'date')
    .argv;

const currentDate = new Date();

yargs.command({
    command: "current",
    describe: "Output date in ISO",
    builder: {
        year: {
            describe: "Output year",
        },
        month: {
            describe: "Output month",
        },
        date: {
            describe: "Output date",
        }
    },
    handler: () => {
        if(!argv.year && !argv.month && !argv.date) {
            console.log(currentDate.toISOString());
        } else if(argv.year) {
            console.log(currentDate.getFullYear()); 
        } else if(argv.month) {
            console.log(getNameMonth(currentDate.getMonth()));
        } else if(argv.date) {
            console.log(currentDate.getDate());
        }
    }
});

yargs.command({
    command: "add",
    describe: "Add date",
    builder: {
        year: {
            type: "String",
            describe: "Add year",
        },
        month: {
            type: "String",
            describe: "Add month",
        },
        date: {
            type: "String",
            describe: "Add date",
        },
        value: {
            type: "Number",
        },
    },
    handler: () => {
        if(!argv.year && !argv.month && !argv.date) {
            console.log('Error!');
        } else {
            let newDate;

            if(argv.year > 0) {
                newDate = new Date(currentDate.getFullYear() + argv.year, currentDate.getMonth(), currentDate.getDate());
            } else if(argv.month > 0) {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + argv.month, currentDate.getDate());
            } else if(argv.date > 0) {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + argv.date);
            }

            console.log(newDate.toISOString());
        } 
    }
});

yargs.command({
    command: "sub",
    describe: "Sub date",
    builder: {
        year: {
            type: "String",
            describe: "Sub year",
        },
        month: {
            type: "String",
            describe: "Sub month",
        },
        date: {
            type: "String",
            describe: "Sub date",
        },
        value: {
            type: "Number",
        },
    },
    handler: () => {
        if(!argv.year && !argv.month && !argv.date) {
            console.log('Error!');
        } else {
            let newDate;

            if(argv.year > 0) {
                newDate = new Date(currentDate.getFullYear() - argv.year, currentDate.getMonth(), currentDate.getDate());
            } else if(argv.month > 0) {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - argv.month, currentDate.getDate());
            } else if(argv.date > 0) {
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - argv.date);
            }

            console.log(newDate.toISOString());

        }
    }
});

yargs.parse();

function getNameMonth(num) {
    let name;

    switch (num) {
        case 0: name = "Январь"; break;
        case 1: name = "Февраль"; break;
        case 2: name = "Март"; break;
        case 3: name = "Апрель"; break;
        case 4: name = "Май"; break;
        case 5: name = "Июнь"; break;
        case 6: name = "Июль"; break;
        case 7: name = "Август"; break;
        case 8: name = "Сентябрь"; break;
        case 9: name = "Октябрь"; break;
        case 10: name = "Ноябрь"; break;
        case 11: name = "Декабрь"; break;
    }

    return name;
}

