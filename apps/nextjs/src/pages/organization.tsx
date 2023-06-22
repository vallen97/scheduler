import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const organization: NextPage = () => {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [buttonName, setButtonName] = useState("Create organization");

  // Create
  const { mutate: createorganization } =
    trpc.organization.createOrganization.useMutation({});

  // Read
  const { data } = trpc.organization.getAllOrganization.useQuery();

  // Update
  const { mutate: updateorganization } =
    trpc.organization.updateOrganization.useMutation({});
  // Delete
  const { mutate: deleteEmplayee } =
    trpc.organization.deleteOrganization.useMutation({});

  function btnCreateorganization() {
    console.log("In Button organization Create");
    // console.log("Button PRessed");

    if (name == null || name == "") {
      alert("A name needs to be filled in");
      setName("");
      return;
    }

    // should onlt happen is there is not an ID to be edited
    if (id == null || id == "") {
      createorganization({ name: name });

      setName("");
    } else {
      updateorganization({ id: id, name: name });
      setID("");

      setName("");
    }

    setButtonName("Create organization");
    data;
  }

  function btnDeleteorganization(id: string) {
    deleteEmplayee({ id: id });
  }

  return (
    <>
      <Head>
        <title>Create An Organization</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ color: "black" }}
            />
          </label>
          <button onClick={btnCreateorganization}>{buttonName}</button>

          <div className="flex h-[60vh] w-[90vw] justify-center overflow-y-scroll px-4 text-2xl">
            {data ? (
              <div className="flex flex-col gap-4">
                {data?.map((organization) => {
                  return (
                    <div key={organization.id}>
                      <label>Name: {organization.name}</label>
                      {/* <input type="submit" value="Submit" /> */}
                      <button
                        onClick={() => {
                          setButtonName("Edit");
                          setID(organization.id);
                          setName(organization.name);
                        }}
                        className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => btnDeleteorganization(organization.id)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Loading organization..</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default organization;
