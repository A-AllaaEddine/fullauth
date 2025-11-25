import { getServerSession } from "@fullauth/next/helpers";
import { authOptions } from "../api/auth/[...fullauth]/route";

const Server = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div>
        <p>user: {session?.user?.name}</p>
        <p>status: {session?.user?.status}</p>
      </div>
    </div>
  );
};

export default Server;
