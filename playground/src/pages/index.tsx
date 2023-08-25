import { Inter } from "next/font/google";
import { createEmailClient } from "@/utils/client";
import { template } from "@/utils/template";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const mailClient = createEmailClient(template);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={async () => {
          const res = await mailClient.sendEmail(
            "welcome",
            { email: "geoffreyanto12@gmail.com", name: "Geoffrey" },
            {
              from: "geoffreyantoignatius@gmail.com",
              to: "geoffreyanto12@gmail.com",
              subject: "Testing New Client",
            }
          );
          console.log(res);
        }}
      >
        Send Email
      </button>
    </main>
  );
}
