import { Request, Response } from "express";
import { CreateProfileDto, ProfileAPIRes, ProfileEntity } from "../models";
import data from "../profiles.json";
import { validateCreateProfile } from "../utils/validation-utils";
export const getProfiles = (req: Request, res: Response<ProfileAPIRes>) => {
  const profiles = data.profiles;
  res.status(200).json({
    success: true,
    data: profiles.map((profile) => {
      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        dob: profile.dob,
        phone: profile.phone,
        address: profile.address,
      };
    }),
  });
};

export const getProfile = (
  req: Request<{ id: string }>,
  res: Response<ProfileAPIRes>,
) => {
  const { id } = req.params;
  const profiles = data.profiles;
  const profile = profiles.find((profile) => profile.user_id === id);
  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: `Profile with id ${id} not found` });
  }
  res.json({
    success: true,
    data: {
      id: profile.user_id,
      name: profile.name,
      email: profile.email,
      dob: profile.dob,
      phone: profile.phone,
      address: profile.address,
    },
  });
};

export const CreateProfile = (
  req: Request<never, never, CreateProfileDto>,
  res: Response<ProfileAPIRes>,
) => {
  const reqBody = req.body;
  const validationResult = validateCreateProfile(reqBody);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
    });
  }
  const profiles = data.profiles as ProfileEntity[];
  const newProfile: ProfileEntity = {
    user_id: String(profiles.length + 1),
    email: reqBody.email,
    name: reqBody.name,
    dob: reqBody.dob,
    phone: reqBody.phone,
    address: reqBody.address,
  };
  profiles.push(newProfile);
  res.status(201).json({
    success: true,
    data: {
      id: newProfile.user_id,
      email: newProfile.email,
      name: newProfile.name,
      dob: newProfile.dob,
      phone: newProfile.phone,
      address: newProfile.address,
    },
  });
};
