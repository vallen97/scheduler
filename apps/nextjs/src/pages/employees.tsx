import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const Employees: NextPage = () => {
  const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [buttonName, setButtonName] = useState("Create Employee");

  // Create
  const { mutate: createEmployee } = trpc.employees.createEmployee.useMutation(
    {},
  );

  // Read
  const { data } = trpc.employees.getAllEmployees.useQuery();

  // Update
  const { mutate: updateEmployee } = trpc.employees.updateEmplayee.useMutation(
    {},
  );
  // Delete
  const { mutate: deleteEmplayee } = trpc.employees.deleteEmployee.useMutation(
    {},
  );

  function btnCreateEmployee() {
    console.log("In Button Employee Create");
    // console.log("Button PRessed");
    if (email == null || email == "") {
      alert("An email needs to be filled in");
      setEmail("");
      return;
    }
    if (name == null || name == "") {
      alert("A name needs to be filled in");
      setName("");
      return;
    }

    // should onlt happen is there is not an ID to be edited
    if (id == null || id == "") {
      createEmployee({ email: email, name: name });
      setEmail("");
      setName("");
    } else {
      updateEmployee({ id: id, email: email, name: name });
      setID("");
      setEmail("");
      setName("");
    }

    setButtonName("Create Employee");
    data;
  }

  function btnDeleteEmployee(id: string) {
    deleteEmplayee({ id: id });
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
          </h1>

          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ color: "black" }}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ color: "black" }}
            />
          </label>
          <button onClick={btnCreateEmployee}>{buttonName}</button>

          <div className="flex h-[60vh] w-[90vw] justify-center overflow-y-scroll px-4 text-2xl">
            {data ? (
              <div className="flex flex-col gap-4">
                {data?.map((employees) => {
                  return (
                    <div key={employees.id}>
                      <label>Name: {employees.name}</label>
                      <label> Email: {employees.email} </label>
                      {/* <input type="submit" value="Submit" /> */}
                      <button
                        onClick={() => {
                          setButtonName("Edit");
                          setID(employees.id);
                          setEmail(employees.email);
                          setName(employees.name);
                        }}
                        className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                      >
                        Edit
                      </button>
                      <button onClick={() => btnDeleteEmployee(employees.id)}>
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Loading Employees..</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default Employees;
