import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth";

import { pusherServer } from "~/lib/pusher";
import { authOptions } from "~/server/auth";
import cors from "cors"; // Import the cors package

const corsHandler = cors({
  origin: "http://localhost:3000", // Specify the domain of your Pusher client
  methods: ["POST"], // Allow only POST requests
});

export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  console.log("called")
  // await corsHandler(request, response, next);
  // if (request.method !== "POST") {
  //   return response.status(406).end(); // Method Not Allowed
  // }

  const session = await getServerSession(request, response, authOptions);

  if (!session?.user?.email) {
    return response.status(401);
  }

  console.log("body", request.body)
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return response.send(authResponse);
};
