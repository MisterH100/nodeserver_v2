import { createClient } from "redis";

const connectToRedis = async () => {
  const client = createClient({
    url: process.env.REDIS_STRING,
  });

  client.on("error", (err) => {
    throw new Error(`redis client error ${err}`);
  });

  await client.connect();

  return client;
};

export default connectToRedis;
