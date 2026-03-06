import { Request, Response } from "express";
import { ProfileAPIRes, UserRole } from "../models";
import { getPrismaErrorMessage, prisma } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
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

/*
 * Admin can get any profile by user id, regular users can only get their own profile
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ProfileAPIRes>,
) => {
  const requestedUserId = req.params.id as string;
  const loggedInUserId = req.user?.user_id;
  const requesterRole = req.user?.role;
  if (requesterRole !== UserRole.ADMIN && loggedInUserId !== requestedUserId) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Access denied" });
  }
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: requestedUserId,
      },
    });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile with id ${requestedUserId} not found`,
      });
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
