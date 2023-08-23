import Header from "@/app/components/layout/Header";

interface ProfileProps {}

const Profile = (props: ProfileProps) => {
  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title="Profile" description="Your MyGFW profile" />
    </main>
  );
};

export default Profile;
