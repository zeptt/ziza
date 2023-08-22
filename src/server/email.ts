import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export function POST(req: NextApiRequest, res: NextApiResponse) {
  NextResponse.redirect("/");
  return res.status(200).json({ message: "Email sent" });
}
