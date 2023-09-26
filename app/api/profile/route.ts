import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, ) {

  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateprofile = await db.profile.update({
      where: { 
        userId: user.id 
      },
      data: {
        imageUrl: user.imageUrl,
        name: user.lastName + " " + user.firstName,
        email: user.emailAddresses[0].emailAddress,
      }
    });
    
    return NextResponse.json(updateprofile);
  }
  catch(error){
    return new NextResponse(`Internal serber Error ${error}`, { status: 500 },);
  }
  

  

};