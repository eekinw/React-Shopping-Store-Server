import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  type Query {
    Products: [Product]
    Product(id: ID!): Product
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    thumbnail: String
  }
`;

interface ProductArgs {
  id: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

// Resolvers define how to fetch the types defined in your schema.
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
        },
        
        Product: async (parent: any, args: ProductArgs): Promise<Product | undefined> => {
          const { id } = args;
          const response = await axios.get("https://dummyjson.com/products");
          const productsData: Product[] = response.data.products;
          const product = productsData.find((product: Product) => Number(product.id) === Number(id));
          
          return product;
        }
    },
  };


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4101 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);