import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { inviteCode } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!inviteCode) {
      return new NextResponse("Invite Code Missing", { status: 400 });
    }
    const existingServer = await db.server.findFirst({
      where: {
        inviteCode: inviteCode,
        members: {
          some: {
            profileId: profile.id
          }
        }
      }
    });

    if (existingServer) {
      return new NextResponse("Already in server", { status: 204 });
    }

    const server = await db.server.update({
      where: {
        inviteCode: inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
  
            }
          ]
        }
      }
    })

    return new NextResponse("Joined Server", { status: 200 });

  }catch (error) {
    console.log("[SERVERS_JOIN_POST]", error);
    return new NextResponse("500", { status: 500 });
  }
};