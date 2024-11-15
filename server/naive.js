const { ApolloServer } = require("apollo-server");

const peopleArray = [
    {
      name: "Bob",
    },
    {
      name: "Lindsey",
    },
  ];
  
  const typeDefs = /* GraphQL */ `
    type Query {
      people: [Person]
    }
  
    type Person {
      name: String
    }
  `;

  const resolvers = {
    Query: {
        people: (obj, args, context, info) => {
            if (context && context.headers && context.headers.authorization === "Bearer authorized123") {
                return peopleArray;
            } else throw new Error("You are not authorized")
        }
    }
  }

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({req}) => {
        return { headers: req.headers};
    }
  })

  server.listen().then(({url}) => {
    console.log({url});
  })