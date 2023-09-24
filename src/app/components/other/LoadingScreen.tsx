"use client";

import { Placeholder } from "semantic-ui-react";

const LoadingScreen = ({ stack = 1 }: { stack: number }) => {
  return (
    <div className="py-5">
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
  );
};

export default LoadingScreen;
