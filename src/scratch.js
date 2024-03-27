// create a map from GEDCOM ID to name/birthdate natural key
let indMap = Object.fromEntries(data.filter(n => n.tag === 'INDI').map(ind => {
  const ptr = ind.ptr;
  const name = ind.nodes.find(n => n.tag === 'NAME').val;
  // const birthday = ind.nodes.find(n => n.tag === 'BIRT')
  //   .find(n => n.nodes.find(n => n.tag === 'DATE'))
  //   .val;
  return [ptr, `${name}:${birthday}`];
}));

function isLiving(ind) {
  const birt = ind.nodes.find(n => n.tag === 'BIRT');
  if(birt === undefined) {
    return false;
  }

  const birtYear = birth.val.match(/[0-9]{4}/);

  return ind.nodes.find(n => n.tag === 'DEAT') === 'undefined'
    && birtYear.length && birthYear[0] < 1900;
}

// converts a { tag: "###", val: "@P52@" } record to P52's name/birthdate natural key
function extractPtr(ref) {
  if(ref && ref.val) {
    let val = ref.val.replace(/@/g, '');
    if(indMap[val] !== undefined) {
      return indMap[val];
    }
  }
  return null;
}

let families = Object.fromEntries(data.filter(n => n.tag === 'FAM').map(fam => [fam.ptr, {
  HUSB: extractPtr(fam.nodes.find(n => n.tag === 'HUSB') || null),
  WIFE: extractPtr(fam.nodes.find(n => n.tag === 'WIFE') || null),
}]));

let individuals = Object.fromEntries(data.filter(n => n.tag === 'INDI').map(ind => [ind.ptr, {
  NAME: ind.nodes.filter(n => n.tag === 'NAME').map(n => n.val),
  BIRTHDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  BIRTHPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  PARENT: ind.nodes.filter(n => n.tag === "FAMC").map(n => families[extractPtr(n)]),
}]));


indMap = Object.fromEntries(data.filter(n => n.tag === 'INDI').map(ind => {
  const ptr = ind.ptr;
  const nodes = ind.nodes || [];
  const name = nodes.find(n => n.tag === 'NAME');
  const birthNodes = nodes.find(n => n.tag === 'BIRT');
  const birthDates = (birthNodes ? birthNodes.nodes : []).find(n => n.tag === 'DATE');
  return [ptr, `${name ? name.val : '###'}:${birthday ? birthday.val : '###'}`];
}));

individuals = Object.fromEntries(data.filter(n => n.tag === 'INDI').map(ind => [ind.ptr, {
  NAME: ind.nodes.filter(n => n.tag === 'NAME').map(n => n.val),
  BIRTHDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  BIRTHPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  BAPDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  BAPPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  MARRDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  MARRPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  DEATHDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  DEATHPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  BURRDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  BURRPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  PROBDAY: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'DATE').map(n => n.val)),
  PROBPLACE: ind.nodes.filter(n => n.tag === 'BIRT').map(n => n.nodes.filter(n => n.tag === 'PLAC').map(n => n.val)),
  PARENT: ind.nodes.filter(n => n.tag === "FAMC").map(n => families[extractPtrTrue(n)]),
}]));