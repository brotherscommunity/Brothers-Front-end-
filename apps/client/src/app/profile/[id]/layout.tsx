import Header from "./_components/header";
import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export default function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  return (
    <main>
      <Header params={params} />
      {children}
    </main>
  );
}
