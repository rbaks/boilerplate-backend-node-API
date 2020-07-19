import { getRepository, Repository, DeleteResult } from "typeorm";
import { User } from "./user.model";
import { HTTP404Error } from "../../utils/httpErrors";

export const getUsers = async (): Promise<User[]> => {
   const users = await getRepository(User).find();
   return users;
};

export const getUser = async (id: number): Promise<User | undefined> => {
   const results = await getRepository(User).findOne(id);
   if (!results) throw new HTTP404Error("User not found");
   return results;
};

export const createUser = async (user: User): Promise<User> => {
   const newUser = await getRepository(User).create(user);
   const results = await getRepository(User).save(newUser);
   return results;
};

export const updateUser = async (id: number, user: object): Promise<User> => {
   const foundUser = await getRepository(User).findOne(id);
   if (foundUser) {
      getRepository(User).merge(foundUser, user);
      const results = await getRepository(User).save(foundUser);
      return results;
   }
   throw new HTTP404Error("User not found");
};

export const deleteUser = async (id: number): Promise<DeleteResult> => {
   const results = await getRepository(User).delete(id);
   if (!results) throw new HTTP404Error("User not found");
   return results;
};
