import Header from "@/app/components/layout/Header";

export default function Dataset({ params }: { params: { dataset: string } }) {
  const { dataset } = params;

  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title={`Dataset: ${dataset}`} description="Something specific" />
    </main>
  );
}
