// Bulk inserts all new items with different property value
// ONLY AVAILABLE FOR POSTGRES:
//   using bulk query().insert()
//   using returning('*')
export default async function bulkGetInsert(Model, property, arr) {
  if (!arr.length) return [];

  // Object with property as key
  const byProperties = arr.reduce((acc, data) => {
    acc[data[property]] = data;
    return acc;
  }, {});
  const byPropertiesKeys = Object.keys(byProperties);

  // Grab all instances already in database
  const instancesInDb = await byPropertiesKeys.reduce((acc, value, i) => {
    if (i === 0) return acc;
    return acc.orWhere({ [property]: value });
  }, Model.query().where({ [property]: byPropertiesKeys[0] }));

  if (instancesInDb.length === arr.length) return instancesInDb;

  // Remove from byProperties all already in database
  instancesInDb
    .map((data) => data[property])
    .forEach((value) => {
      delete byProperties[value];
    });

  // Insert in database
  // Batch insert ONLY AVAILABLE WITH POSTGRES
  const newInstances = await Model.query()
    .insert(Object.values(byProperties))
    .returning('*');

  return instancesInDb.concat(newInstances);
}
