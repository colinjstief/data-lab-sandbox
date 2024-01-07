import QueryWizard from "@/app/components/query-wizard/QueryWizard";

const QueryWizardPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <QueryWizard />;
};

export default QueryWizardPage;
