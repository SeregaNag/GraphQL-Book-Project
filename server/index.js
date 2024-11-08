const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const { Neo4jGraphQL } = require("@neo4j/graphql");

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "52525011"));

driver.verifyConnectivity().then(() => {
    console.log("Connected to Neo4j database");
}).catch(error => {
    console.error("Failed to connect to Neo4j:", error);
});


const typeDefs = /* GraphQL */ `
type Business {
    businessId: ID!
    name: String!
    city: String!
    state: String!
    address: String!
    location: Point!
    reviews: [Review!]! @relationship(type: "REVIEWS", direction: IN)
    categories: [Category!]! @relationship(type: "IN_CATEGORY", direction: OUT)
  }

type User {
    userID: ID!
    name: String!
    reviews: [Review!]! @relationship(type: "WROTE", direction: OUT)
  }

  type Review {
    reviewId: ID!
    stars: Float!
    date: Date!
    text: String
    user: User! @relationship(type: "WROTE", direction: IN)
    business: Business! @relationship(type: "REVIEWS", direction: OUT)
  }

  type Category {
    name: String!
    businesses: [Business!]! @relationship(type: "IN_CATEGORY", direction: IN)
  }
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver});

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema
    })

    server.listen().then(({url}) => {
        console.log(`GraphQL server ready at ${url}`);
    })
});

