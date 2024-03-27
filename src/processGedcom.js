import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { mkdirSync, readFileSync, writeFileSync, createWriteStream } from 'fs';
import { stringify } from 'csv-stringify'
import reformatJson from "./data/reformatJson.js";
import getPersonCsvData from "./data/person.js";
import getFamilyCsvData from "./data/family.js";
import getResidenceCsvData from "./data/residence.js";
import getSourceCsvData from "./data/source.js";

const argv = yargs(hideBin(process.argv))
    .scriptName('node ./processGedcom.js')
    .usage('Usage: $0 --input=input.json --outdir=./out')
    .alias('i', 'input')
    .demandOption('input')
    .describe('i', 'Converted Gedcom > JSON file')
    .alias('o', 'outdir')
    .default('o', 'out')
    .describe('o', 'Output directory')
    .help('h')
    .alias('h', 'help')
    .argv;

const rawData = readFileSync(argv.input);
const data = JSON.parse(rawData);
const reformatted = reformatJson(data);

mkdirSync(argv.outdir, { recursive: true });

const fName = `./${argv.outdir}/data.json`
writeFileSync(
    fName,
    JSON.stringify(reformatted, null, 2),
);
console.log(`Wrote ${Object.keys(reformatted).length} individuals to ${fName}`);

const csvs = {
    person: (() => getPersonCsvData(reformatted)),
    marriage: (() => getFamilyCsvData(reformatted)),
    residence: (() => getResidenceCsvData(reformatted)),
    source: (() => getSourceCsvData(data)),
};

Object.entries(csvs).forEach(([type, cb]) => {
    const fName = `./${argv.outdir}/${type}.csv`;
    const data = cb();
    const fh = createWriteStream(fName);
    const columns = data.length ? Object.keys(data[0]) : [];

    stringify(data, { header: true, columns }).pipe(fh);
    console.log(`Wrote ${data.length} rows to ${fName}`);
});
