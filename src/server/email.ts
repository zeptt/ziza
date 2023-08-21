import type { NextApiRequest, NextApiResponse } from "next";

export function POST(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ message: "Email sent" });
}
