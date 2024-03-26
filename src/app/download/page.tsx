import Downloader from "@/app/components/downloader/Downloader";

const DownloadPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <Downloader />;
};

export default DownloadPage;
