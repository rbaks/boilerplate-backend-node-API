import "reflect-metadata";
import { logger } from "./logger";
import { createConnection } from "typeorm";
import { User } from "../services/User/user.model";
import dotenv from "dotenv";

dotenv.config();

const init = async () => {
   try {
      await createConnection({
         type: "postgres",
         host: "localhost",
         port: 5432,
         username: "postgres",
         password: "123456",
         database: "test",
         entities: [User],
         synchronize: true,
         logging: false,
      });
      logger.info({
         message: `Postgres client connected`,
      });
   } catch (error) {
      logger.info({
         message: `Postgres client connection failed `,
         extra: error,
      });
   }
};

export { init };
