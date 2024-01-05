import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth";

import { pusherServer } from "~/lib/pusher";
import { authOptions } from "~/server/auth";

const handler = async (
  request: NextApiRequest, 
  response: NextApiResponse
) => {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  if (!session) {
    return response.status(401);
  }

  const { socket_id, channel_name } = request.body;
  console.log("body", request.body)
  console.log("socket_id", socket_id);
  const data = {
    user_id: session.user.id,
  };

  // const authResponse = pusherServer.authenticateUser(socket_id, session.user);
  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, data);
  return response.send(authResponse);
};

export { handler as POST };