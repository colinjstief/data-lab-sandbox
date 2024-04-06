import ChatMap from "../components/chat-map/ChatMap";

const ChatMapPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <ChatMap />;
};

export default ChatMapPage;
