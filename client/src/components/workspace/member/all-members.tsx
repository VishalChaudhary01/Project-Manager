/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { ChevronDown, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Permissions } from "@/constants";
import type { Member } from "@/types/workspace.type";
import { useGetMembersInWorkspace } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/contexts/auth.context";
import { getAvatarColor, getAvatarText } from "@/lib/utils";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const AllMembers = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { user, hasPermission } = useAuthContext();
  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);
  const { data, isPending } = useGetMembersInWorkspace({ workspaceId });

  const members = data?.data?.members || [];
  const roles = data?.data?.roles || [];

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;

    mutate(
      { workspaceId, inputs: { roleId, memberId } },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ["members", workspaceId],
          });
          toast.success(result.message);
        },
        onError: (error: any) => {
          toast(
            error?.response?.data?.message ??
              "Failed to change workspace member",
          );
        },
      },
    );
  };

  return (
    <div className='grid gap-6 pt-2'>
      {isPending ? (
        <Loader className='w-8 h-8 animate-spin place-self-center flex' />
      ) : null}

      {members?.map((member: Member) => {
        const name = member.userId?.name;
        const initials = getAvatarText(name);
        const avatarColor = getAvatarColor(name);
        return (
          <div
            key={member._id}
            className='flex items-center justify-between space-x-4'
          >
            <div className='flex items-center space-x-4'>
              <div
                className={`flex items-center justify-center rounded-full p-2 size-8 text-sm ${avatarColor}`}
              >
                {initials}
              </div>
              <div>
                <p className='text-sm font-medium leading-none'>{name}</p>
                <p className='text-sm text-muted-foreground'>
                  {member.userId.email}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none'
                    disabled={
                      isLoading ||
                      !canChangeMemberRole ||
                      member.userId._id === user?._id
                    }
                  >
                    {member.role.name?.toLowerCase()}{" "}
                    {canChangeMemberRole && member.userId._id !== user?._id && (
                      <ChevronDown className='text-muted-foreground' />
                    )}
                  </Button>
                </PopoverTrigger>
                {canChangeMemberRole && (
                  <PopoverContent className='p-0' align='end'>
                    <Command>
                      <CommandInput
                        placeholder='Select new role...'
                        disabled={isLoading}
                        className='disabled:pointer-events-none'
                      />
                      <CommandList>
                        {isLoading ? (
                          <Loader className='w-8 h-8 animate-spin place-self-center flex my-4' />
                        ) : (
                          <>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roles?.map(
                                (role) =>
                                  role.name !== "OWNER" && (
                                    <CommandItem
                                      key={role._id}
                                      disabled={isLoading}
                                      className='disabled:pointer-events-none gap-1 mb-1  flex flex-col items-start px-4 py-2 cursor-pointer'
                                      onSelect={() => {
                                        handleSelect(
                                          role._id,
                                          member.userId._id,
                                        );
                                      }}
                                    >
                                      <p className='capitalize'>
                                        {role.name?.toLowerCase()}
                                      </p>
                                      <p className='text-sm text-muted-foreground'>
                                        {role.name === "ADMIN" &&
                                          `Can view, create, edit tasks, project and manage settings .`}

                                        {role.name === "MEMBER" &&
                                          `Can view,edit only task created by.`}
                                      </p>
                                    </CommandItem>
                                  ),
                              )}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
};
