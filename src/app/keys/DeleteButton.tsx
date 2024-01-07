"use client";

import { useState } from "react";

import { deleteKey } from "@/lib/gfwDataAPI";

import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
} from "semantic-ui-react";

import { GFWAPIKey } from "@/lib/types";

interface DeleteButtonProps {
  api_key: GFWAPIKey;
}

const DeleteButton = ({ api_key }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [async, setAsync] = useState({
    status: "",
    message: `Are you sure you want to delete this API key: "${api_key.alias}"`,
  });

  const handleClick = async () => {
    setAsync({
      status: "Loading",
      message: "Trying to delete...",
    });

    const deletedKey = await deleteKey(api_key.api_key);

    if (deletedKey.status === "success") {
      setAsync({
        status: "Success",
        message: "Deleted",
      });
    } else {
      setAsync({
        status: "Failed",
        message: deletedKey.message
          ? deletedKey.message
          : `Could not delete this API key: "${api_key.alias}"`,
      });
    }
  };

  return (
    <Modal
      size="tiny"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button color="red" size="tiny">
          Delete
        </Button>
      }
    >
      <ModalHeader>Confirm</ModalHeader>
      <ModalContent>{async.message}</ModalContent>
      <ModalActions>
        <Button
          content="Cancel"
          onClick={() => setOpen(false)}
          loading={async.status === "Loading"}
          disabled={async.status === "Loading" || async.status === "Success"}
        />
        <Button
          content="Yes, please delete this key"
          onClick={handleClick}
          loading={async.status === "Loading"}
          disabled={async.status === "Loading" || async.status === "Success"}
          negative
        />
      </ModalActions>
    </Modal>
  );
};

export default DeleteButton;
