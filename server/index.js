const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const {Neo4jGraphQLAuthJWKSPlugin} = require("@neo4j/graphql-plugin-auth");
require('dotenv').config();

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "52525011"));

driver.verifyConnectivity().then(() => {
    console.log("Connected to Neo4j database");
}).catch(error => {
    console.error("Failed to connect to Neo4j:", error);
});


const typeDefs = /* GraphQL */ `
  type Query {
      fuzzyBusinessByName(searchString: String): [Business!]!
        @cypher(
          statement: """
          CALL db.index.fulltext.queryNodes( 'businessNameIndex', $searchString+'~')
          YIELD node RETURN node
          """
        ) 
    }

  type Business {
    businessId: ID!
    waitTime: Int! @customResolver
    averageStars: Float
      
      @cypher(
        statement: "MATCH (this)<-[:REVIEWS]-(r:Review) RETURN avg(r.stars)"
      )
    recommended(first: Int=1): [Business!]!
      @cypher(
        statement: """
        match(this)<-[:REVIEWS]-(:Review)<-[:WROTE]-(u:User)
        match(u)-[:WROTE]->(:Review)-[:REVIEWS]->(rec:Business)
        WITH rec, COUNT(*) AS score
        RETURN rec order by score DESC LIMIT $first
        """
      )
    name: String!
    city: String!
    state: String!
    address: String!
    location: Point!
    reviews: [Review!]! @relationship(type: "REVIEWS", direction: IN)
    categories: [Category!]! @relationship(type: "IN_CATEGORY", direction: OUT)
  }

  type User {
    userId: ID!
    name: String!
    reviews: [Review!]! @relationship(type: "WROTE", direction: OUT)
  }

  #extend type User @auth(rules: [{operations: [READ], allow: {userId: "$jwt.sub"}}, {roles: ["admin"]}])
  extend type User
    @auth(
      rules: [
        { operations: [READ], where: { userId: "$jwt.sub" } }
        { operations: [CREATE, UPDATE, DELETE], roles: ["admin"] }
      ]
    )

type Review {
  reviewId: ID!
  stars: Float!
  date: Date!
  text: String
  user: User! @relationship(type: "WROTE", direction: IN)
  business: Business! @relationship(type: "REVIEWS", direction: OUT)
}

  extend type Review
    @auth(
      rules: [
      {
        operations: [CREATE, UPDATE]
        bind: {user: {userId: "$jwt.sub"}}
      }
      ]
    )


  type Category {
    name: String!
    businesses: [Business!]! @relationship(type: "IN_CATEGORY", direction: IN)
    businessCount: Int!
      @cypher(statement: "MATCH (this)<-[:IN_CATEGORY]-(b:Business) RETURN count(b)")
  }
`;

 const resolvers = {
   Business: {
    waitTime: (obj, args, context, info) => {
       const options = [0,5,10,15,30,45];
       return options[Math.floor(Math.random() * options.length)]
     }
   }
 }

const neoSchema = new Neo4jGraphQL({ typeDefs,resolvers, driver, plugins: {
  auth: new Neo4jGraphQLAuthJWKSPlugin({
    jwksEndpoint: "https://dev-332ybztd8aifgjxm.us.auth0.com/.well-known/jwks.json",
  })
}});

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema,
        context: ({req}) => {
          return {req}
        },
    })

    server.listen().then(({url}) => {
        console.log(`GraphQL server ready at ${url}`);
    })
});
