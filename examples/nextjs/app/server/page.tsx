import { getSession } from '@fullauth/next/helpers';
import { authOptions } from '../api/auth/[...fullauth]/route';

const Server = () => {
  const session = getSession(authOptions);
  return (
    <div>
      <div>
        <p>user: {session?.user?.name}</p>
      </div>
    </div>
  );
};

export default Server;
