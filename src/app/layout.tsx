import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPIA Agent - Automated GDPR Assessments",
  description: "Create, manage and export GDPR-compliant Data Protection Impact Assessments with AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
