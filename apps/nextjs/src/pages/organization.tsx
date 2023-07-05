import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const DontWorkTheseDays = () => {
  const { data }: any = trpc.organization.getAllDaysNotToWork.useQuery();

  const { mutate: deleteDate } = trpc.organization.deleteDate.useMutation({});

  console.log(data);

  if (!data) return <div>Something went wrong</div>;

  let temp = Object.values(data);
  console.log(temp);
  for (let i = 0; i < temp.length; i++) {
    console.log("Date: ", temp[i]);
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {temp ? (
            <>
              {temp.map((date: any) => {
                return (
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      {date.date.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{date.description}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteDate({ id: date.id })}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <p>Loading organization..</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AddDontWorkDays = () => {
  const { mutate: updateDaysNotToWork } =
    trpc.organization.addDaysNotToBeWorked.useMutation({});

  const [id, setID] = useState<string>("");
  const [daysNotToWork, setDaysNotToWork] = useState<any>();

  const [days, setDays] = useState<Array<Date>>([]);
  const [time, setTime] = useState<Array<any>>([]);
  const [date, setDate] = useState<any>();
  const [dateDesc, setDateDesc] = useState<string>("");

  return (
    <>
      <h1>Add A date Not to Work</h1>

      <input
        type="date"
        id="start"
        name="trip-start"
        value={new Date().toISOString().split("T")[0]}
        min={new Date().toISOString().split("T")[0]}
        max="2024-12-31"
        onChange={(e: any) => setDays([...days, e.target.value])}
      ></input>

      {/* For Time */}
      {/* <input type="time"  /> */}
      <input
        onChange={(e: any) => setTime([...time, e.target.value])}
        type="time"
        id="appt"
        name="appt"
        min="0:00"
        max="23:59"
      ></input>

      {...days.map((day: any, index: number) => {
        return (
          <div>
            <label>
              {index}: Date:
              <input
                type="text"
                value={day.toString()}
                onChange={(e: any) => setDate(e.target.value)}
                style={{ color: "black" }}
              />
            </label>
            <input
              type="text"
              onChange={(e: any) => setDateDesc(e.target.value)}
              style={{ color: "black" }}
              placeholder="Enter Description for this Day Off"
            />
            <button
              onClick={() => {
                setDaysNotToWork([
                  ...daysNotToWork,
                  [
                    {
                      id: id,
                      date: date,
                      description: dateDesc,
                    },
                  ],
                ]);
              }}
            >
              Submit
            </button>
            <button
              onClick={() => {
                updateDaysNotToWork({
                  date: date,
                  description: dateDesc,
                  organizatonID: id,
                });
                // setDays(days.splice(index, 1));
                let tempDays = days;
                console.log(tempDays);
                tempDays.splice(index, 1);

                console.log(tempDays);
                setDays(tempDays);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </>
  );
};

const organization: NextPage = () => {
  const [id, setID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [buttonName, setButtonName] = useState<string>("Create organization");
  const [email, setEmail] = useState<string>("");
  const [employeeID, SetEmployeeID] = useState<string>("");
  const [daysNotToWork, setDaysNotToWork] = useState<any>();
  const [employeesWorking, setEmployeesWorking] = useState<number>(1);

  // Create
  const { mutate: createorganization } =
    trpc.organization.createOrganization.useMutation({});

  // Read
  const { data } = trpc.organization.getAllOrganization.useQuery();

  // const { data: orgDaysNotToWork } =
  //   trpc.organization.getAllDaysNotToWork.useQuery();

  // console.log(orgDaysNotToWork);

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
      createorganization({
        name: name,
        email: email,
        employeeID: employeeID,
        daysNotToWork: daysNotToWork,
        employeesWorking: employeesWorking,
      });

      setName("");
    } else {
      createorganization({
        name: name,
        email: email,
        employeeID: employeeID,
        daysNotToWork: daysNotToWork,
        employeesWorking: employeesWorking,
      });
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
          <h1>Add An Organization</h1>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => console.log("Select Date: ", e.target.value)}
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
          <button onClick={btnCreateorganization}>{buttonName}</button>
          <AddDontWorkDays />

          <DontWorkTheseDays />

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
