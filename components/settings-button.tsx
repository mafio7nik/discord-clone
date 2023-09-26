"use client";
import { UserCog2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateProfile } from "@/lib/update-profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import axios from "axios";
import { message } from "antd";

export const UserSettingsButton = () =>{
  const updateprofile =async () => {
    try {
      const responde  = axios.patch('/api/profile');
      const data = await responde;
      if(data.status == 200){
        message.success('Profile Updated');
      }
      else{
        message.error('Error Updating Profile');
      }
    } catch (error) {
      message.error('Error Updating Profile');
    }
    
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent border-0">
          <UserCog2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem onClick={() => updateprofile()}>
          <RefreshCcw className="mr-2"/>
          Update User Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};