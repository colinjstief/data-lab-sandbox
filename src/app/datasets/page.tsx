import Header from "@/app/components/layout/Header";

const Datasets = () => {
  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header
        title="Datasets"
        description="All that the GFW Data API has to offer"
      />
      <div className="p-5 mx-auto">
        {/* <PaginatedTable
          api={"gfw"}
          dataUrl={dataUrl}
          defaultSize={5}
          fields={fields}
        /> */}
      </div>
    </main>
  );
};

export default Datasets;
