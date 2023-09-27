"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { message } from "antd";
import { redirect, useRouter } from "next/navigation";
import { set } from "zod";

interface JoinServerModalProps {
  serverName: string | undefined;
  ImageUrl: string | undefined;
  inviteCode: string | undefined;
}

export const JoinServerModal = ({
  serverName,
  ImageUrl,
  inviteCode,
}: JoinServerModalProps) => {
  
  const [isJoining, setIsJoining] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (!serverName) {
    return null;
  }

  if (!ImageUrl) {
    return null;
  }

  const onJoin = async () => {
    try {
      setIsJoining(true);
      const responce = await axios.post(`/api/servers/join`, { inviteCode });
      
      router.push(`/servers/${responce.data.serverId}`);
      setIsJoining(false);

    } catch (error) {
      console.log(error);
      message.error( "Failed to join server");
      setIsJoining(false);
    };
  };

  if (!isMounted) {
    return null;
  }

  return(
    <Dialog open={true}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            <div className="flex justify-center items-center">
              <div className='relative w-20 h-20'>
                <Image 
                  fill
                  src={ImageUrl}
                  alt="Server Image"
                />
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You where invited to join
            <div className="font-bold text-xl">{serverName}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 px-6 py-4">
          {isJoining ? (
            <div className="flex justify-center items-center">
              <div className="w-6 h-6 border-2 border-primary rounded-full animate-spin" />
            </div>
          ) : (
            <Button variant="primary" className="w-full" onClick={() => onJoin()} disabled={isJoining}>
              Join
            </Button>
          )}
            
          </div>
      </DialogContent>
    </Dialog>
  )
};