import { Request, Response, NextFunction } from "express";
import {
   authenticate,
   registerNewUser,
   generateAccessToken,
} from "./auth.controller";

export default [
   {
      path: "/v1/signup",
      method: "post",
      handler: [signup],
   },
   {
      path: "/v1/signin",
      method: "post",
      handler: [signin],
   },
   {
      path: "/v1/refresh/token",
      method: "get",
      handler: [refreshToken],
   },
];

const options = {
   path: "/v1/refresh",
   maxAge: 1000 * 60 * 60 * 24 * 90, // expires after 90 days
   httpOnly: true,
   secure: false,
   signed: false,
};

async function signup(req: Request, res: Response) {
   const { email, password } = req.body;
   let { accessToken, refreshToken } = await registerNewUser(email, password);
   res.cookie("refreshToken", refreshToken, options)
      .status(201)
      .send({ auth: true, accessToken });
}

async function signin(req: Request, res: Response) {
   const { email, password } = req.body;
   let { accessToken, refreshToken } = await authenticate(email, password);
   res.cookie("refreshToken", refreshToken, options)
      .status(200)
      .send({ auth: true, accessToken });
}

async function refreshToken(req: Request, res: Response) {
   const { refreshToken } = req.cookies;
   let accessToken = generateAccessToken(refreshToken);
   res.status(200).send({ auth: true, accessToken });
}
