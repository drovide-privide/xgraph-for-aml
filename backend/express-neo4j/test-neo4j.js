var neo4j = require('neo4j-driver');
(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = 'neo4j://16dae76e.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = '1AgotL93xWBqW6GPJK7NI9EfqNuUNu2zQuD-ljfHIew'
  const driverConfig = {
    encrypted: 'ENCRYPTION_ON',
    trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
};
  let driver ,result
  

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD),driverConfig)
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
    
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    await driver.close()
  }
  result = await driver.executeQuery(`
    MATCH (c:Character {name: $name})-[:INTERACTS]->(c2:Character)
    RETURN c2.name as name
    LIMIT 25
    `, { name: 'Addam-Marbrand'},
    { database: 'neo4j' }
  )
  for(let person of result.records) {
    // `person.friend` is an object of type `Node`
    console.log(person.get('name'))
  }
  try{
    const session = driver.session();
    const result2 = await session.run('MATCH (n)-[r]->(m) WHERE n.name <> m.name RETURN n, r, m limit 50');
    // console.log(result2.records);
    for(let n of result2.records) {
        // `person.friend` is an object of type `Node`
        console.log(n.get('n').properties.name)

      }
  }catch(err){
    console.log(err);
    // res.status(500).send('Error fetching graph data');
  }
  


  await driver.close()
})();