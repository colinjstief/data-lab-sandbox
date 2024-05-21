import { Placeholder } from "semantic-ui-react";
import Header from "@/app/(components)/(layout)/Header";

const LoadingScreen = ({
  stack = 1,
  header = true,
}: {
  stack: number;
  header?: boolean;
}) => {
  return (
    <>
      {header && <Header title="..." description="..." />}
      <div className="p-5">
        {Array.from({ length: stack }).map((_, index) => (
          <Placeholder key={index}>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="full" />
              <Placeholder.Line length="full" />
              <Placeholder.Line length="full" />
            </Placeholder.Paragraph>
          </Placeholder>
        ))}
      </div>
    </>
  );
};

export default LoadingScreen;
