import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import Header from "@/app/components/layout/Header";

interface ProfileProps {}

const Profile = async (props: ProfileProps) => {
  const session = await getServerSession(options);

  console.log("session (in server component) =>", session);

  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title="Profile" description="Your MyGFW profile" />
    </main>
  );
};

export default Profile;
