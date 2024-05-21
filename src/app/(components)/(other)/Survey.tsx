"use client";

import { useState } from "react";
import { Icon } from "semantic-ui-react";

const Survey = ({ pageId, userId }: { pageId: string; userId: string }) => {
  const [selected, setSelected] = useState<string>("");

  const handleClick = async ({ sentiment }: { sentiment: string }) => {
    setSelected(sentiment);

    const payload = {
      userId: userId,
      pageId: pageId,
      feedback: sentiment,
    };

    //await sendFeedbackToContentful(payload);
  };

  return (
    <div className="fixed top-5 right-5 flex gap-2">
      <div className="p-1 cursor-pointer">
        <Icon
          name={`thumbs up`}
          color={selected === "like" ? "green" : undefined}
          onClick={() => handleClick({ sentiment: "like" })}
        />
      </div>
      <div className="p-1 cursor-pointer">
        <Icon
          name={`thumbs down`}
          color={selected === "dislike" ? "red" : undefined}
          onClick={() => handleClick({ sentiment: "dislike" })}
        />
      </div>
    </div>
  );
};

export default Survey;
