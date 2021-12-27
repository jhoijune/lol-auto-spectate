import { DB } from '../types';

export default async (db: DB) => {
  const instances = await db.Pro.findAll({});
  const nameMap = new Map<string, string[]>();
  for (const instance of instances) {
    let name = instance.name.toLowerCase();
    const bracketIndex = name.indexOf('(');
    if (bracketIndex !== -1) {
      name = name.slice(0, bracketIndex - 1);
    }
    const names = nameMap.get(name) || [];
    names.push(instance.name);
    nameMap.set(name, names);
  }
  for (const [, names] of nameMap) {
    if (names.length > 1) {
      console.log(names.join(', '));
    }
  }
};
