import getDbIdFromNoteField from "./getDbIdFromNoteField.js";
import getAncestryIdFromNoteField from "./getAncestryIdFromNoteField.js";

export class IndividualExtractor {
    constructor(data) {
        this.data = data;
        this.individualsMap = {};
        data
            .filter(rec => rec.Tag === 'INDI')
            .forEach(ind => {
                this.individualsMap['@' + ind.Pointer + '@'] = getDbIdFromNoteField(this.groupBy(ind.Nodes));
            });
    }

    getValue(node) {
        let val;
        if (node.Value !== undefined) {
            //if .Value is an individual id pull the natural key out of indMap instead
            val = typeof node.Value === 'string' && node.Value.match(/^@I[0-9]+@$/) && this.individualsMap[node.Value] !== undefined
                ? this.individualsMap[node.Value] : node.Value;
        }

        //.Value exists and .Nodes is a non-empty array, so we need to include both
        if (val !== undefined && node.Nodes && node.Nodes.length) {
            return {
                Value: val,
                ...this.groupBy(node.Nodes),
            }
        }
        //.Value exists and .Nodes doesn't
        if (val !== undefined) {
            return val
        }

        //.Value does not exist and .Nodes does
        if (node.Nodes && node.Nodes.length) {
            return this.groupBy(node.Nodes);
        }

        //none of the above is true, probably shouldn't happen
        return node;
    }

    //insert a value into our output data structure, updating it as necessary if there's already one there with that key
    putValueAtPosition(data, pos, value) {
        //new key, just insert
        if (data[pos] === undefined) {
            data[pos] = value;
        }
        //key already points to an array, add the new value to the end
        else if (Array.isArray(data[pos])) {
            data[pos].push(value);
        }
        //key is a simple value, convert it to an array containing both the old and new values
        else {
            data[pos] = [data[pos], value];
        }
    }

    //reformat an array of input nodes to our preferred format
    groupBy(arr) {
        let out = {};
        arr.forEach(node => {
            let value = this.getValue(node);
            this.putValueAtPosition(out, node.Tag, value);
        });
        return out;
    }

    buildIndividualsFlat() {
        const individuals = {};
        this.data
            .filter(rec => rec.Tag === 'INDI'/* && !isLiving(rec)*/)
            .forEach(ind => {
                const grouped = {};
                ind.Nodes.forEach(n => {
                    if (n.Value) {
                        this.putValueAtPosition(grouped, n.Tag, n.Value);
                    }
                    if (n.Nodes ?? false) {
                        n.Nodes.forEach(sn => {
                            this.putValueAtPosition(grouped, `${n.Tag}_${sn.Tag}`, retValue(sn));
                        });
                    }
                });
                //console.log(grouped); process.exit();
                const key = getDbIdFromNoteField(grouped);
                if (key !== null) {
                    individuals[key] = grouped;
                }
            });

        return individuals;
    }

    //original function to generate nested format output
    buildIndividualsNested() {
        const individuals = {};
        this.data
            //filter the input data so we only have individuals
            .filter(rec => rec.Tag === 'INDI'/* && !isLiving(rec)*/)
            .forEach(ind => {
                //get this individuals output data and natural key
                const grouped = this.groupBy(ind.Nodes);
                const key = getDbIdFromNoteField(grouped);

                //we need special case handling for ind.Pointer, since it's not under a val or nodes key
                if (ind.Pointer) {
                    grouped.Pointer = '@' + ind.Pointer + '@';
                }
                const ancestryId = getAncestryIdFromNoteField(grouped);
                if (ancestryId !== null) {
                    grouped.ancestryId = ancestryId;
                }
                //insert our data at the right place in the output object
                if (key !== null) {
                    individuals[key] = grouped;
                }
            });

        return individuals;
    }

    //build a map from family ptr to output family data
    addFamilyDataToIndividuals(individuals) {
        const families = {};
        this.data
            .filter(rec => rec.Tag === 'FAM')
            .forEach(fam => {
                const toWrite = this.groupBy(fam.Nodes);
                toWrite.ref = fam.Pointer;
                families['@' + fam.Pointer + '@'] = toWrite;
            });


        //replace the FAMS values in our output object with full objects
        Object.keys(individuals).forEach(id => {
            if (Array.isArray(individuals[id].FAMS)) {
                individuals[id].FAMS = individuals[id].FAMS.map(f => families[f]);
            } else if (individuals[id].FAMS !== undefined) {
                individuals[id].FAMS = families[individuals[id].FAMS];
            }
        });
    }
}