import { Request, Response } from "express";
import { ProfileAPIRes } from "../models";
import { getPrismaErrorMessage, prisma } from "../utils/prisma";
export const getProfiles = async (
  req: Request,
  res: Response<ProfileAPIRes>,
) => {
  try {
    const profiles = await prisma.profile.findMany();
    res.status(200).json({
      success: true,
      data: profiles.map((profile) => {
        return {
          userId: profile.user_id,
          name: profile.name,
          email: profile.email,
          dob: profile.dob,
          phone: profile.phone,
          address: profile.address,
        };
      }),
    });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    const { status, message } = getPrismaErrorMessage(err);
    res.status(status).json({ success: false, message });
  }
};

export const getProfile = async (
  req: Request<{ id: string }>,
  res: Response<ProfileAPIRes>,
) => {
  const { id } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: `Profile with id ${id} not found` });
    }
    res.json({
      success: true,
      data: {
        userId: profile.user_id,
        name: profile.name,
        email: profile.email,
        dob: profile.dob,
        phone: profile.phone,
        address: profile.address,
      },
    });
  } catch (err) {
    console.error(`Error fetching profile`, err);
    const { status, message } = getPrismaErrorMessage(err);
    res.status(status).json({ success: false, message });
  }
};
