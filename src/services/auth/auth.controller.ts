import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import randtoken from "rand-token";
import { HTTP400Error, HTTP401Error } from "../../utils/httpErrors";
import { createUser } from "../User/user.controller";
import { User } from "../User/user.model";
import { getRepository } from "typeorm";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const registerNewUser = async (email: string, password: string) => {
   if (!email || !password) {
      throw new HTTP400Error();
   }

   let hashPassword = bcrypt.hashSync(password, 10);
   let refreshToken = randtoken.uid(256);

   try {
      let user = new User();
      user.email = email;
      user.hashPassword = hashPassword;
      user.refreshToken = refreshToken;

      let createdUser = await createUser(user);

      const accessToken = jwt.sign(
         { sub: createdUser.id.toString() },
         JWT_SECRET,
         {
            algorithm: "HS256",
            expiresIn: 15 * 60,
         }
      );
      return { accessToken, refreshToken };
   } catch (e) {
      console.log(e);
      throw new HTTP400Error("This email already exists");
   }
};

export const authenticate = async (email: string, password: string) => {
   if (!email || !password) {
      throw new HTTP400Error();
   }

   let user = await getRepository(User).findOne({ where: { email: email } });

   if (!user || !bcrypt.compareSync(password, user.hashPassword)) {
      throw new HTTP401Error(
         "Email and Password doesn't match or user doesn't exist"
      );
   }

   const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: 15 * 60,
   });

   return { accessToken, refreshToken: user.refreshToken };
};

export const generateAccessToken = async (refreshToken: string) => {
   let user = await getRepository(User).findOne({
      where: { refreshToken: refreshToken },
   });

   if (!user) {
      throw new HTTP401Error();
   }

   const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: 15 * 60,
   });

   return accessToken;
};
