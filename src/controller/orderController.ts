import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type statusType = "Process" | "Delivered";

type orderDetailType = {
  cake_id: number;
  qty: number;
};

const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const user_id: number = Number(req.body.user_id);
    const order_date: Date = new Date(req.body.order_date);
    const status: statusType = req.body.status;
    const detail_order: orderDetailType[] = req.body.detail_order;

    const arrCakeId: number[] = detail_order.map((item) => item.cake_id);

    const findCake = await prisma.cakes.findMany({
      where: {
        id: {
          in: arrCakeId,
        },
      },
    });

    const notFoundCake = arrCakeId.filter((item) => !findCake.map((kue) => kue.id).includes(item));

    if (notFoundCake.length > 0) {
      return res.status(200).json({ message: `There are no cakes` });
    }

    const newOrder = await prisma.orders.create({
      data: {
        user_id,
        order_date,
        status,
      },
    });

    let newDetail = [];
    for (let index = 0; index < detail_order.length; index++) {
      const { cake_id, qty } = detail_order[index];
      // find price at each other \\
      const cakeItems = findCake.find((item) => item.id === cake_id);
      //\\
      newDetail.push({
        order_id: newOrder.id,
        cake_id,
        qty,
        cake_price: cakeItems?.cake_price || 0,
      });
    }

    await prisma.detail_orders.createMany({
      data: newDetail,
    });

    return res.status(201).json({ message: "New order has been created successfully", data: newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const readOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        detail_orders: {
          include: { cake_details: true },
        },
        user_detail: true,
      },
      orderBy: { order_date: "desc" },
    });

    const ordersWithTotal = orders.map((order) => {
      const total = order.detail_orders.reduce((sum, detail) => sum + detail.cake_price * detail.qty, 0);
      return { ...order, total };
    });

    return res.status(200).json({
      message: `All orders have been retrieved`,
      data: ordersWithTotal,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const updateOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const findOrder = await prisma.orders.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        detail_orders: true,
      },
    });

    if (!findOrder) {
      return res.status(400).json({
        message: `Order is not found`,
      });
    }

    const user_id: number = Number(req.body.user_id) || findOrder.user_id;
    const order_date: Date = new Date(req.body.order_date) || findOrder.order_date;
    const status: statusType = req.body.status || findOrder.status;
    const detail_order: orderDetailType[] = req.body.detail_order || findOrder.detail_orders;

    await prisma.detail_orders.deleteMany({
      where: {
        order_id: Number(id),
      },
    });

    const arrCakeId: number[] = detail_order.map((item) => item.cake_id);

    const findCake = await prisma.cakes.findMany({
      where: {
        id: {
          in: arrCakeId,
        },
      },
    });

    const notFoundCake = arrCakeId.filter((item) => !findCake.map((cake) => cake.id).includes(item));

    if (notFoundCake.length > 0) {
      return res.status(200).json({ message: `There are no cakes` });
    }

    const saveOrder = await prisma.orders.update({
      where: {
        id: Number(id),
      },
      data: {
        user_id,
        order_date,
        status,
      },
    });

    let newDetail = [];
    for (let index = 0; index < detail_order.length; index++) {
      const { cake_id, qty } = detail_order[index];
      // find price at each other \\
      const cakeItems = findCake.find((item) => item.id === cake_id);
      //\\
      newDetail.push({
        order_id: saveOrder.id,
        cake_id,
        qty,
        cake_price: cakeItems?.cake_price || 0,
      });
    }

    await prisma.detail_orders.createMany({
      data: newDetail,
    });

    return res.status(200).json({ message: "New order has been updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const deleteOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const findOrder = await prisma.orders.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findOrder) {
      return res.status(400).json({
        message: `Order is not found`,
      });
    }

    await prisma.detail_orders.deleteMany({
      where: {
        order_id: Number(id),
      },
    });

    await prisma.orders.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: `Order has been removed`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export { createOrder, readOrder, updateOrder, deleteOrder };
