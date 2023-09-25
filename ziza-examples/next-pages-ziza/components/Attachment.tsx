import { Inter } from "next/font/google";
import { createEmailClient } from "ziza/client";
import { template } from "@/template/template";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Attachment() {
  const emailClient = createEmailClient(template);
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader?.result as string).split(",")[1]; // Extract base64 data
      setBase64Data(base64);
      setFileName(file.name);
    };

    if (file) {
      if (true) {
        reader.readAsDataURL(file); // Read the file as base64
      } else {
        alert("Unsupported file type. Please select a PDF, DOCX, or TXT file.");
      }
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <input type="file" onChange={handleFileUpload} />
      <button
        onClick={async () => {
          const res = await emailClient.sendEmail(
            "bills",
            { price: 100, noOfItems: 1234128 },
            {
              to: "youremailaddress@gmail.com",
              cc: "youremailaddress@vitstudent.ac.in",
              attachments: [
                {
                  filename: fileName,
                  encoding: "base64",
                  content: base64Data,
                },
              ],
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
