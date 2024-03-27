let people = {
  1: { name: 'John Smith', parent_id: 4, },
  1: { name: 'John Smith', parent_id: 4, },
  1: { name: 'John Smith', parent_id: 4, },
  1: { name: 'John Smith', parent_id: 4, },
  1: { name: 'John Smith', parent_id: 4, },
};

function getRelationship(id1, id2) {
  let gca = findCommonAncestor(id1, id2);
  if(!gca) {
    return;
  }
  let older = gca.depth1 > gca.depth2;
  let minDepth = Math.min(gca.depth1, gca.depth2);
  let removedness = Math.abs(gca.depth1 - gca.depth2)

  if(minDepth >= 2) {
    return minDepth - 1 + ' cousins' + (removedness > 0 ? `${toOrdinal(removedness)} removed` : '');
  }
  if(minDepth === 1) {
    if(removedness === 0) {
      return 'sibling';
    }
    let str = older ? 'Aunt/Uncle' : 'Nephew/Niece';
    if(removedness > 1) {
      str = `${toOrdinal(removedness - 1)} Great` + str;
    }
    return str;
  }
  if(minDepth === 0) {
    let str = older ? 'Parent' : 'Child';
    if(removedness > 1) {
      str = 'Grand' + str;
    }
    if(removedness > 2) {
      str = `${toOrdinal(removedness - 2)} Great` + str;
    }
    return str;
  }
}

function findCommonAncestor(id1, id2) {
  let ancestors1 = getAncestorsAndDepth(id1);
  let ancestors2 = getAncestorsAndDepth(id2);

  let minDepth = undefined, gcaId = undefined;

  Object.entries(ancestors1).forEach((id, depth) => {
    if(ancestors2 !== undefined && (depth < minDepth || minDepth === undefined)) {
      gcaId = id;
    }
  });

  if(gcaId === undefined) {
    return undefined;
  }

  return {
    id: gcaId,
    depth1: ancestors1[gcaId],
    depth2: ancestors2[gcaId],
  }
}

function getAncestorsAndDepth(id, depth) {
  let ancestors = {};
  if(people[id].father_id === null) {
    ancestors[father_id] = depth;
    Object.assign(ancestors, findCommonAncestor(people[id].father_id, depth + 1));

  }
  if(people[id].mother_id === null) {
    ancestors[mother_id] = depth;
    Object.assign(ancestors, findCommonAncestor(people[id].mother_id, depth + 1));
  }
  return ancestors;
}

function toOrdinal(n) {
  let mod_10 = n % 10,
    mod_100 = n % 100;

  if(mod_10 === 1 && mod_100 !== 11) {
    return `${n}st`;
  }
  if(mod_10 === 2 && mod_100 !== 12) {
    return `${n}nd`;
  }
  if(mod_10 === 3 && mod_100 !== 13) {
    return `${n}rd`;
  }

  return `${n}th`;
}