import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const UpdateProfile = async () => {
  const profile = await currentUser();

  if (!profile) {
    return null;
  }

  const updateprofile = await db.profile.update({
    where: { 
      userId: profile.id 
    },
    data: {
      imageUrl: profile.imageUrl,
      name: profile.lastName + " " + profile.firstName,
      email: profile.emailAddresses[0].emailAddress,
    }
  });

  return updateprofile;

};