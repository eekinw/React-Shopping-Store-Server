import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  type Query {
    Products: [Product]
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    thumbnail: String
  }


`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        Products: async () => {
            const response = await axios.get("https://dummyjson.com/products");
            const productsData = response.data.products;
            const products = productsData.map(({ id, title, price, description, thumbnail}) => ({
                id,
                title,
                price,
                description,
                thumbnail
            }))
            return products;
        }
    },
  };


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4100 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);