import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  // Safely filter out users who don't have a valid email
  const usersWithValidEmails = users.filter((user: User) => user?.email);

  const usersData = usersWithValidEmails.map((user: User) => {
    const email = user?.email || ''; // Fallback to an empty string if email is null
    const userType = email && room.usersAccesses[email]?.includes('room:write')
      ? 'editor'
      : 'viewer';

    return {
      ...user,
      userType,
    };
  });

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')
    ? 'editor'
    : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
