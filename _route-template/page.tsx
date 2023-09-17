const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <div>
      <h1>Title here</h1>
      <p>Content here</p>
    </div>
  );
};

export default Page;
