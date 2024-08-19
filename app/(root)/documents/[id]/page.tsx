import CollaborativeRoom from '@/components/CollaborativeRoom'
import { Editor } from '@/components/editor/Editor'
import { getDocument } from '@/lib/actions/room.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import React from 'react'

const Documents = async({params:{id}}:SearchParamProps) => {
  const clerkUser =await currentUser();
  if (!clerkUser) redirect('/sign-in')

    const room = await getDocument ({
      roomId:id,
      userId:clerkUser.emailAddresses[0].emailAddress,
    });

    if (!room)  redirect('/')
  return (
    <main className='flex w-full flex-col items-center'>
     <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata} users={[]} currentUserType={'creator'}     />
      
    </main>
  )
}

export default Documents