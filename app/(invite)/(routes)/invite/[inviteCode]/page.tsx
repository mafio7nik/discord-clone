
import { JoinServerModal } from "@/components/modals/join-server-modal";
import { Button } from "@/components/ui/button";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect('/')
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    }
  });

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  return (
    <JoinServerModal serverName={server?.name} ImageUrl={server?.imageUrl} inviteCode={params.inviteCode}/>
  );
};

export default InviteCodePage;