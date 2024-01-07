"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createKey } from "@/lib/gfwDataAPI";
import { wait } from "@/lib/utils";
import { GFWAPICreateKeyFormSchema, GFWAPICreateKeyForm } from "@/lib/types";

import { Button, Form, Message } from "semantic-ui-react";

const KeyForm = () => {
  const [async, setAsync] = useState({
    status: "",
    message: "",
    color: "blue",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GFWAPICreateKeyForm>({
    resolver: zodResolver(GFWAPICreateKeyFormSchema),
  });

  // errors: {
  //   email: {
  //     type: 'required',
  //     message: 'Email is required',
  //     ref: input
  //   },
  //   password: {
  //     ...
  //   }
  // }

  const onSubmit = async (data: GFWAPICreateKeyForm) => {
    setAsync({
      status: "Loading",
      message: "Reticulating splines...",
      color: "blue",
    });
    const domainsArray = data.domains ? JSON.parse(data.domains) : [];
    const newKey = await createKey({
      alias: data.alias,
      organization: data.organization,
      email: data.email,
      domains: domainsArray,
      neverExpires: data.neverExpires,
    });

    if (newKey.status === "success") {
      setAsync({
        status: "Success",
        message: "Succesfully created new API key",
        color: "green",
      });
      reset();
    } else {
      setAsync({
        status: "Failed",
        message: newKey.message ? newKey.message : "Unknown error",
        color: "red",
      });
    }
    await wait(3500);
    setAsync({
      status: "",
      message: "",
      color: "blue",
    });
  };

  return (
    <div className="w-full text-left shadow-md border border-gray-300 rounded p-5 mb-10">
      <h2 className="text-xl font-bold mb-5">Create a new API key</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group widths="equal" className="mb-6">
          <Form.Field error={!!errors.alias}>
            <label>Alias</label>
            <p className="pb-2">Nick name for API Key</p>
            <input
              {...register("alias", { required: "Alias is required" })}
              placeholder="My awesome new key"
            />
          </Form.Field>
          <Form.Field error={!!errors.organization}>
            <label>Organization</label>
            <p className="pb-2">Name of organization or Website</p>
            <input
              {...register("organization", {
                required: "Organization is required",
              })}
              placeholder="World Resources Institute"
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal" className="mb-6">
          <Form.Field error={!!errors.email}>
            <label>Email</label>
            <p className="pb-2">Email address for the point of contact</p>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="duncanrager@gmail.com"
              type="email"
            />
          </Form.Field>
          <Form.Field error={!!errors.neverExpires}>
            <label>Set to never expire</label>
            <p className="pb-2">
              Set API Key to never expire, only admin uses can set this to True.
              Note that you must be an admin user for this to work.
            </p>
            <div className="ui checkbox">
              <input type="checkbox" {...register("neverExpires", {})} />
              <label>Set key to never expire</label>
            </div>
          </Form.Field>
        </Form.Group>
        {/* <Form.Field className="mb-6">
          <label>Domains</label>
          <p className="pb-2">
            Array of domains which can be used this API key. If no domain is
            listed, the key will be set by default to the lowest rate limiting
            tier. When making request using the API key, make sure you add the
            correct origin header matching a whitelisted domain. You can use
            wildcards for subdomains such as *.yourdomain.com. Our validation
            methord for wildcard will allow only subdomains. So make sure you
            also add yourdomain.com if you use root without any subdomains.
            www.yourdomain.com and yourdomain.com are two different domains in
            terms of security. Include www. if required.
          </p>
          <input
            {...register("domains")}
            placeholder='["www.yourdomain.com", "*.yourdomain.com", "yourdomain.com", "localhost"]'
          />
        </Form.Field> */}
        <Button
          disabled={async.status === "Loading"}
          loading={async.status === "Loading"}
          type="submit"
        >
          Create New Key
        </Button>
      </Form>
      {(!!Object.values(errors).length || async.message) && (
        <Message color={async.color as any}>
          <Message.Header>{async.status}</Message.Header>
          {!!Object.values(errors).length &&
            Object.entries(errors).map(([key, error]) => {
              return <p key={key}>{error.message}</p>;
            })}
          {!!async.message && <p>{async.message}</p>}
        </Message>
      )}
    </div>
  );
};

export default KeyForm;
