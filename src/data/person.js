export default function getPersonCsvData(data) {
    return Object.entries(data).map(([ref, record]) => {
        return {
            db_id: ref.split(':')[0],
            ancestry_id: record.ancestryId ?? '',
            name: record.NAME[0]?.Value ?? record.NAME?.Value ?? record.NAME ?? '',
            family_ref: record.FAMC ?? '',
            sex: record.SEX?.Value ?? record.SEX ?? '',
            birth_date: record.BIRT?.DATE ?? '',
            birth_place: record.BIRT?.PLAC ?? '',
            baptism_date: record.BAPM?.DATE ?? '',
            baptism_place: record.BAPM?.PLAC ?? '',
            death_date: record.DEAT?.DATE ?? '',
            death_place: record.DEAT?.PLAC ?? '',
            burial_date: record.BURI?.DATE ?? '',
            burial_place: record.BURI?.PLAC ?? '',
            probate_date: record.PROB?.DATE ?? '',
            probate_place: record.PROB?.PLAC ?? '',
        };
    });
}
