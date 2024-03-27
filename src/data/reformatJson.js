import { IndividualExtractor } from "../gedcom/IndividualExtractor.js";

export default function reformatJson(gedcomJson) {
  const individualExtractor = new IndividualExtractor(gedcomJson)
  const reformatted = individualExtractor.buildIndividualsNested();
  individualExtractor.addFamilyDataToIndividuals(reformatted);

  //sort file by DB No
  const keys = Object.keys(reformatted);
  const rgx = /^\$[a-zA-Z]+(\([a-zA-Z]+\))?#(?<DBNo>[0-9]+)/;
  keys.sort(function (a, b) {
    const DBNoA = a.match(rgx).groups.DBNo;
    const DBNoB = b.match(rgx).groups.DBNo;
    return DBNoA - DBNoB;
  })

  const sortedIndividuals = {}
  for (const key of keys) {
    sortedIndividuals[key] = reformatted[key];
  }

  return sortedIndividuals;
}

