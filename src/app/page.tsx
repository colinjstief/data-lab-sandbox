import Header from "./components/shared/Header";

export default function Home() {
  return (
    <main className="bg-blue-100 flex flex-col flex-1 overflow-auto">
      <Header
        title="Welcome!"
        description="This is a place to try out the cool things the Data Lab APIs offer."
      />
    </main>
  );
}
