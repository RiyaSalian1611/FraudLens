// Create unique constraints
CREATE CONSTRAINT IF NOT EXISTS ON (c:Customer) ASSERT c.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS ON (m:Merchant) ASSERT m.id IS UNIQUE;

// Load CSV and create nodes
LOAD CSV WITH HEADERS FROM $csvFile AS line
WITH line,
     SPLIT(line.customer, "'") AS customerID,
     SPLIT(line.merchant, "'") AS merchantID,
     SPLIT(line.age, "'") AS customerAge,
     SPLIT(line.gender, "'") AS customerGender,
     SPLIT(line.category, "'") AS transCategory
MERGE (customer:Customer {id: customerID[1], age: customerAge[1], gender: customerGender[1]})
MERGE (merchant:Merchant {id: merchantID[1]})
CREATE (transaction:Transaction {amount: line.amount, fraud: line.fraud, category: transCategory[1], step: line.step})-[:WITH]->(merchant)
CREATE (customer)-[:PERFORMS]->(transaction);

// Create Placeholder nodes and relationships
MATCH (c1:Customer)-[:PERFORMS]->(t1:Transaction)-[:WITH]->(m1:Merchant)
WITH m1.id AS merchantID, c1.id AS customerID, count(*) AS cnt
MERGE (p1:Placeholder {id: merchantID})
MERGE (p2:Placeholder {id: customerID})
CREATE (p2)-[:PAYS {cnt: cnt}]->(p1)
CREATE (p1)-[:PAYS {cnt: cnt}]->(p2);

// Compute PageRank for Placeholder nodes
CALL algo.pageRank('Placeholder', 'PAYS', {writeProperty: 'pagerank'});

// Compute degree for Placeholder nodes
MATCH (p:Placeholder)
SET p.degree = apoc.node.degree(p, 'PAYS');

// Perform community detection using label propagation
CALL algo.beta.labelPropagation('Placeholder', 'PAYS', {write:true, writeProperty: "community", weightProperty: "cnt"});

// Compute node similarity
CALL algo.nodeSimilarity('Placeholder', 'PAYS', {writeProperty: 'similarity'});

// Query to obtain the relationships of a particular customer node
MATCH (c1:Customer {id: $customerId})-[:PERFORMS]->(t1:Transaction)-[:WITH]->(m1:Merchant)
RETURN c1, t1, m1;
