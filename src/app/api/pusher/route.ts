import { getServerSession } from "next-auth";

import { pusherServer } from "~/lib/pusher";
import { authOptions } from "~/server/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id");
  const channelName = params.get("channel_name");

  const data = {
    user_id: session.user.id,
    user_info: {
      image: session.user.image,
      name: session.user.name
    }
  };

  if (!socketId || !channelName) {
    return new Response("Invalid request", { status: 400 });
  }

  const authResponse = pusherServer.authorizeChannel(
    socketId,
    channelName,
    data,
  );
  return new Response(JSON.stringify(authResponse), {
    headers: { "Content-Type": "application/json" },
  });
}
