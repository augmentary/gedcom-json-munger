//given an object, get it's "natural" key
export default function getDbIdFromNoteField(grouped) {
    const dbId = /^(\$[a-zA-Z]+(\([a-zA-Z]+\))?#[0-9]+[A-Z])(\/|$)/;
    const name = grouped.NAME[0]?.Value ?? grouped.NAME?.Value ?? grouped.NAME ?? '###';
    if (grouped.NOTE === undefined) {
        console.warn(`${name} has no Notes field`)
        return null;
    }
    const notes = Array.isArray(grouped.NOTE)
        ? grouped.NOTE
        : [grouped.NOTE];
    for (let i of notes) {
        const noteVal = i.Value ?? i;
        const matches = noteVal.match(dbId);
        if (matches) {
            const birth = grouped?.BIRT?.DATE ?? '###';
            return `${matches[1]}:${name}:${birth}`;
        }
    }

    console.warn(`${name} has no valid ID in Notes field`)
    return null;
}