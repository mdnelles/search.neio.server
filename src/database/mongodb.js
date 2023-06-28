import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from "dotenv";
const env = dotenv.config().parsed;

const client = new MongoClient(env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

export const dbmongo = client.db("neio-search");

client.connect((err) => {
   console.log(err);

   client.close();
});

// export const connectToDB = async () => {
//   mongoose.set('strictQuery', true);

//   if(isConnected) {
//     console.log('MongoDB is already connected');
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "share_prompt",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })

//     isConnected = true;

//     console.log('MongoDB connected')
//   } catch (error) {
//     console.log(error);
//   }
// }
