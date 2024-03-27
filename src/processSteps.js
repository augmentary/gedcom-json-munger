import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readdirSync, readFileSync, createWriteStream } from 'fs';
import { stringify } from 'csv-stringify'

const argv = yargs(hideBin(process.argv))
    .scriptName('node ./processSteps.js')
    .usage('Usage: $0 --input=. --outfile=./steps.json')
    .alias('i', 'input')
    .demandOption('input')
    .describe('i', 'Converted folder of step jsons > CSV file')
    .alias('o', 'outfile')
    .default('o', './steps.json')
    .describe('o', 'Output file path')
    .help('h')
    .alias('h', 'help')
    .argv;

const files = readdirSync(argv.input);
const days = {};

const toInt = (n => parseInt(n, 10));

for(let f of files) {
    const rawData = readFileSync(`${argv.input}/${f}`);
    const data = JSON.parse(rawData);
    for(let r of data) {
        const [date, time] = r.dateTime.split(' ');
        const [m, d, y] = date.split('/').map(toInt)
        const [h, i, s] = time.split(':').map(toInt);

        const local = new Date(Date.UTC(`20${y}`,m,d,h,i,s));
        const key = [local.getFullYear(), local.getMonth(), local.getDate()]
            .map(n => n.toString().padStart(2,'0'))
            .join('-');

        days[key] = days[key] ?? 0;
        days[key] += toInt(r.value);
    }
}

const fName = argv.outfile;
console.log(fName);
const fh = createWriteStream(fName);
const columns = ['date','steps'];
const data = Object.entries(days);

stringify(data, { header: true, columns }).pipe(fh);
console.log(`Wrote ${data.length} rows to ${fName}`);
