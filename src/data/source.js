export default function getSourceCsvData(data) {
    return data.filter((record) => record.Tag === 'SOUR').map((record) => {
        return {
            source_id: record.Pointer ?? '',
            source_desc: record.Nodes.find(n=>n.Tag==="TITL").Value ?? '',
        };
    });
}