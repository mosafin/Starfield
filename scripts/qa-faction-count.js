const fs=require('fs');
const s=fs.readFileSync('Starmap - Fav v3 .html','utf8');
const m=s.match(/const SYSTEM_FACTION_LISTS = Object\.freeze\(\{([\s\S]*?)\}\);/)[1];
const lists=eval('({' + m + '})');
const ids=[...s.match(/const starSystemsData = \[([\s\S]*?)\];\s*\n\s*const SYSTEM_FACTION_LISTS/)[1].matchAll(/id: '([^']+)'/g)].map(x=>x[1]);
const a={};
Object.entries(lists).forEach(([f,t])=>{
  t.major.forEach(id=>a[id]={faction:f,influence:'major'});
  t.minor.forEach(id=>{ if(!a[id]||a[id].influence!=='major') a[id]={faction:f,influence:'minor'}; });
});
ids.forEach(id=>{ if(!a[id]) a[id]={faction:'Unknown',influence:'minor'}; });
const counts={};
Object.values(a).forEach(v=>counts[v.faction]=(counts[v.faction]||0)+1);
console.log('Faction distribution (120 systems):', counts);
console.log('Total assigned:', Object.keys(a).length);
