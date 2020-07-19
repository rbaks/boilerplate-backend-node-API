import { Request, Response, NextFunction } from "express";
import { getUsers, getUser, deleteUser, updateUser } from "./user.controller";
import { authenticate } from "../../middlewares/authenticate";
import { HTTP403Error } from "../../utils/httpErrors";

export default [
   {
      path: "/v1/user",
      method: "get",
      handler: [list],
   },
   {
      path: "/v1/user/:id",
      method: "get",
      handler: [getOne],
   },
   {
      path: "/v1/user/:id",
      method: "delete",
      handler: [authenticate, deleteById],
   },
   {
      path: "/v1/user/:id",
      method: "patch",
      handler: [authenticate, update],
   },
];

async function list(_: Request, res: Response) {
   const data = await getUsers();
   res.status(200).send(data);
}

async function getOne(req: Request, res: Response) {
   const id = Number(req.params.id);
   const data = await getUser(id);
   res.status(200).send(data);
}

async function deleteById(req: Request, res: Response) {
   const id = Number(req.params.id);
   if ((req as any).sub !== id)
      throw new HTTP403Error("Only Allowed to modify you own info");
   const data = await deleteUser(id);
   res.status(200).send(data);
}

async function update(req: Request, res: Response) {
   const id = Number(req.params.id);
   if ((req as any).sub !== id)
      throw new HTTP403Error("Only Allowed to modify you own info");
   const data = await updateUser(id, req.body);
   res.status(200).send(data);
}
