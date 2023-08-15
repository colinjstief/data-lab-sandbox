import Header from "./components/layout/Header";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header
        title="Welcome!"
        description="This is a place to try out the cool things the Data Lab APIs offer."
      />
    </main>
  );
}
