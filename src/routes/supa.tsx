import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '#/utils/supabase';

export const Route = createFileRoute('/supa')({
  // loader: async () => {
  //   const { data: users } = await supabase.from('users').select();
  //   return { users };
  // },
  component: Supa,
});

function Supa() {
  // const { users } = Route.useLoaderData();

  // console.debug('>>> users', users);

  // return (
  //   <>
  //     **{users?.length}**
  //     <ul>
  //       {users?.map((user) => (
  //         <li key={user.id}>{user.name}</li>
  //       ))}
  //     </ul>
  //   </>
  // );

  return <>HELLO</>;
}
