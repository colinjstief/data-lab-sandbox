import Header from "@/app/components/layout/Header";
import Profile from "@/app/components/other/Profile";

interface ProfilePageProps {}

const ProfilePage = async (props: ProfilePageProps) => {
  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title="Profile" description="Your MyGFW profile" />
      <div className="p-5">
        <Profile />
      </div>
    </main>
  );
};

export default ProfilePage;
