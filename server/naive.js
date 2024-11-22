const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken")

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
            if (context.user) {
                return peopleArray;
            } else throw new Error("You are not authorized")
        }
    }
  }

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({req}) => {
        let decoded;
        if(req && req.headers && req.headers.authorization) {
          try {
            decoded = jwt.verify(
              req.headers.authorization.slice(7),
              "rNdmStrSrg5159Jbt8lapBinGi"
            )
          } catch (e) {
            console.log(e);
          }
        }
        return {
          user: decoded
        }
    }
  })

  server.listen().then(({url}) => {
    console.log({url});
  })