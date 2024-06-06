const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5506;

const driverConfig = {
  encrypted: 'ENCRYPTION_ON',
  trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
};

const driver = neo4j.driver(
    process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
  driverConfig
);

app.use(cors({
  origin: 'http://localhost:5174', // Update this with your Vite development server address
}));

app.get('/api/graph', async (req, res) => {
  const { mlId } = req.query;

  const session = driver.session();
  try {
    let result;
    if (mlId) {
      result = await session.run(
        `MATCH (n1)-[t:Transaction {ML_ID: $mlId}]->(n2:NAME)
         OPTIONAL MATCH (company1:COMPANY)
         WHERE toLower(trim(company1.company_name)) = toLower(trim(n1.NAME))
         OPTIONAL MATCH (company2:COMPANY)
         WHERE toLower(trim(company2.company_name)) = toLower(trim(n2.NAME))
         RETURN 
           apoc.map.setKey(properties(n1), 'flag_company', CASE WHEN company1 IS NOT NULL THEN 1 ELSE 0 END) AS n1_company_flag,
           t,
           apoc.map.setKey(properties(n2), 'flag_company', CASE WHEN company2 IS NOT NULL THEN 1 ELSE 0 END) AS n2_company_flag`,
        { mlId }
      );
    } else {
      result = await session.run(
        `MATCH (n1)-[t:Transaction]->(n2:NAME)
         OPTIONAL MATCH (company1:COMPANY)
         WHERE toLower(trim(company1.company_name)) = toLower(trim(n1.NAME))
         OPTIONAL MATCH (company2:COMPANY)
         WHERE toLower(trim(company2.company_name)) = toLower(trim(n2.NAME))
         RETURN 
           apoc.map.setKey(properties(n1), 'flag_company', CASE WHEN company1 IS NOT NULL THEN 1 ELSE 0 END) AS n1_company_flag,
           t,
           apoc.map.setKey(properties(n2), 'flag_company', CASE WHEN company2 IS NOT NULL THEN 1 ELSE 0 END) AS n2_company_flag`
      );
    }

    const nodes = new Map();
    const links = [];

    result.records.forEach(record => {
      const n1 = record.get('n1_company_flag');
      const n2 = record.get('n2_company_flag');
      const transaction = record.get('t');

      nodes.set(n1.NAME, n1);
      nodes.set(n2.NAME, n2);

      links.push({
        source: n1.NAME,
        target: n2.NAME,
        label: transaction.type,
        ...transaction.properties
      });
    });

    res.json({
      nodes: Array.from(nodes.values()),
      links: links
    });
  } catch (error) {
    console.error('Error fetching data from Neo4j', error);
    res.status(500).send('Error fetching data');
  } finally {
    await session.close();
  }
});

app.get('/api/mlids', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run('MATCH ()-[t:Transaction]->() WHERE t.ML_ID IS NOT NULL RETURN DISTINCT t.ML_ID AS mlId');
    const mlIds = result.records.map(record => record.get('mlId'));
    res.json(mlIds);
  } catch (error) {
    console.error('Error fetching ML_IDs from Neo4j', error);
    res.status(500).send('Error fetching ML_IDs');
  } finally {
    await session.close();
  }
});

app.get('/api/mlcase', async (req, res) => {
  const { mlId } = req.query;
  if (!mlId) {
    return res.status(400).send('Missing mlId parameter');
  }

  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (m:ML_CASE {ML_ID: $mlId}) RETURN m',
      { mlId }
    );

    if (result.records.length === 0) {
      return res.status(404).send('ML case not found');
    }

    res.json(result.records[0].get('m').properties);
  } catch (error) {
    console.error('Error fetching ML case from Neo4j', error);
    res.status(500).send('Error fetching ML case');
  } finally {
    await session.close();
  }
});

app.post('/api/chat', (req, res) => {
  res.json({ response: 'test' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
