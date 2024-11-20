import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type roleType = "Admin" | "Cashier";

const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user_name: string = req.body.user_name;
    const user_email: string = req.body.user_email;
    const user_password: string = req.body.user_password;
    const user_role: roleType = req.body.user_role;

    const findEmail = await prisma.users.findFirst({
      where: {
        user_email,
      },
    });

    if (findEmail) {
      return res.status(400).json({
        message: `Email has exists, please try another email!`,
      });
    }

    const hashPassword = await bcrypt.hash(user_password, 12);

    const newUser = await prisma.users.create({
      data: {
        user_name,
        user_email,
        user_password: hashPassword,
        user_role,
      },
    });

    return res.status(200).json({
      message: `New user has been created`,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allUsers = await prisma.users.findMany({
      where: {
        OR: [
          {
            user_name: {
              contains: search?.toString() || "",
            },
          },
        ],
      },
    });

    return res.status(200).json({
      message: `Materials has been retrieved`,
      data: allUsers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findUser = await prisma.users.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUser) {
      return res.status(200).json({
        message: `User is not found!`,
      });
    }

    const { user_name, user_email, user_password, user_role } = req.body;

    const saveUser = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        user_name: user_name ? user_name : findUser.user_name,
        user_email: user_email ? user_email : findUser.user_email,
        user_password: user_password ? await bcrypt.hash(user_password, 12) : findUser.user_password,
        user_role: user_role ? user_role : findUser.user_role,
      },
    });

    return res.status(200).json({
      message: `User has been updated`,
      data: saveUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findUsers = await prisma.users.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUsers) {
      return res.status(200).json({
        message: `Users are not found`,
      });
    }

    const saveUser = await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Users have been removed`,
      data: saveUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const authentication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_email, user_password } = req.body;
    const findUser = await prisma.users.findFirst({ where: { user_email } });
    if (!findUser) {
      return res.status(200).json({ message: "Email not registered" });
    }
    const isMatchPassword = await bcrypt.compare(user_password, findUser.user_password);
    if (!isMatchPassword) {
      return res.status(200).json({ message: "Invalid Password" });
    }
    // prepare to generate token using JWT \\
    const payload = {
      user_name: findUser.user_name,
      user_email: findUser.user_email,
    };
    const signature = process.env.SECRET || ``;

    const token = jwt.sign(payload, signature);

    return res.status(200).json({ logged: true, token, id: findUser.id, user_name: findUser.user_name, email: findUser.user_email });
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

export { createUser, readUser, updateUser, deleteUser, authentication };
