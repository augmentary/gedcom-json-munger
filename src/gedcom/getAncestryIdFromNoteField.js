export default function getAncestryIdFromNoteField(grouped) {
    const ancestryId = /\/\@\@?([0-9]+)$/;
    const name = grouped.NAME.Value ?? grouped.NAME ?? '###';
    if (grouped.NOTE === undefined) {
        console.warn(`${name} has no Notes field`)
        return null;
    }
    const notes = Array.isArray(grouped.NOTE)
        ? grouped.NOTE
        : [grouped.NOTE];
    for (let i of notes) {
        const noteVal = i.Value ?? i;
        const matches = noteVal.match(ancestryId);
        if (matches) {
            return matches[1];
        }
    }

    return null;
}