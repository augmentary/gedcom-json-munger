export default function getResidenceCsvData(data) {
    const simplified = [];
    Object.entries(data).forEach(([ref, record]) => {
        const recresi = record.RESI ?? [];
        const resi = Array.isArray(recresi) ? recresi : [recresi];
        resi.forEach((resid) => {
            simplified.push({
                db_id: ref.split(':')[0],
                ancestry_id: record.ancestryId ?? '',
                name: record.NAME?.[0]?.Value ?? record.NAME?.Value ?? record.NAME ?? '',
                residence_desc: resid?.Value ?? '',
                residence_date: resid?.DATE ?? '',
                residence_place: resid?.PLAC ?? '',
                residence_source: resid?.SOUR?.[0]?.Value ?? resid?.SOUR?.Value ?? resid?.SOUR ?? '',
                residence_page: resid?.SOUR?.[0]?.PAGE ?? resid?.SOUR?.PAGE ?? '',
                residence_apid: resid?.SOUR?.[0]?._APID ?? resid?.SOUR?._APID ?? '',
            });
        });
    });

    return simplified;
}