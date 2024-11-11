const {toGraphQLTypeDefs} = require("@neo4j/introspector");
const neo4j = require("neo4j-driver");
const fs = require("fs");
const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "52525011"))
const sessionFactory = () => 
    driver.session({defaultAccessMode:neo4j.session.READ});

async function main() {
    const typeDefs = await toGraphQLTypeDefs(sessionFactory);
    fs.writeFileSync("schema.graphql", typeDefs);
    await driver.close()
}



main()