export default function getFamilyCsvData(data) {
    const simplified = [];
    Object.entries(data).forEach(([ref, record]) => {
        const recfams = record.FAMS ?? [];
        const fams = Array.isArray(recfams) ? recfams : [recfams];
        fams.forEach((fam) => {
            simplified.push({
                db_id: ref.split(':')[0],
                ancestry_id: record.ancestryId ?? '',
                name: record.NAME[0]?.Value ?? record.NAME?.Value ?? record.NAME ?? '',
                family_ref: fam.ref,
                husband: fam.HUSB ?? '',
                wife: fam.WIFE ?? '',
                marriage_date: fam.MARR?.DATE ?? '',
                marriage_place: fam.MARR?.PLAC ?? '',
            });
        });
    });
    return simplified;
}