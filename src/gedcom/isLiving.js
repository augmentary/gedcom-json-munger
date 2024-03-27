module.exports = function isLiving(ind) {
  const birth = ind.nodes.find(n => n.tag === 'BIRT');
  if(birth === undefined) {
    return false;
  }

  const birthDate = birth.nodes.find(n => n.tag === 'DATE')
  if(birthDate === undefined) {
    return false;
  }

  const birthYear = birthDate.val.match(/[0-9]{4}/)[0];

  console.log('testing living ', ind.nodes.find(n => n.tag === 'NAME').val, birthDate, birthYear, ind.nodes.find(n => n.tag === 'DEAT') === undefined,
    ind.nodes.find(n => n.tag === 'DEAT') === undefined
    && birthYear && birthYear > 1900
  );
  return ind.nodes.find(n => n.tag === 'DEAT') === undefined
    && birthYear && birthYear > 1900;
}
