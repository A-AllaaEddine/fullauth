import { getServerSession } from "@fullauth/next/helpers";
import { authOptions } from "../../lib/auth-options";

const Server = async () => {
  const session = await getServerSession(authOptions.secret!);
  return (
    <div>
      <div>
        <p>user: {session?.user?.name ?? 'Signed out'}</p>
        <p>status: {session?.user?.status ?? '—'}</p>
      </div>
    </div>
  );
};

export default Server;
