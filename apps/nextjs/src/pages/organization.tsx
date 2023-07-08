import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

/*
  TODO: Work on the sighin page
  Note: There seems to be a way to get userID 
        https://stackoverflow.com/questions/71916477/get-user-id-as-a-string-from-clerk
        We might want to store that in our DB, and check if that user is an admin and can use this page
  ClerksJS:
    avaughnallen97@gmail.com
    g7ac5D$ScAa#82Et91
*/

const DontWorkTheseDays = () => {
  const { data }: any = trpc.organization.getAllDaysNotToWork.useQuery();

  const { mutate: deleteDate } = trpc.organization.deleteDate.useMutation({});

  if (!data) return <div>Something went wrong</div>;

  let temp = Object.values(data);

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
                // console.log(tempDays);
                tempDays.splice(index, 1);

                // console.log(tempDays);
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

const PaidTimeOff = () => {
  const { data } = trpc.organization.getAllDaysApprovedOff.useQuery();

  const { mutate: getEmployeeByID } =
    trpc.employees.findEmployeeById.useMutation({});

  const { mutate: updateApprovedDaysOff } =
    trpc.organization.UpdateDaysApprovedOff.useMutation({});

  const [showApproved, setShowApproved] = useState<boolean>(false);

  const { userId } = useAuth();
  const user = useUser();
  

  function getEmployee(id: string) {
    console.log("Button Pressed to find a certain employee id");
    console.log(getEmployeeByID({ id: id }));
  }

  if (!data) return <div>There was an Error</div>;

  function approveLeave(
    id: number,
    day: Date,
    employeeId: string,
    approverID: string,
    approverName: string,
    isApproved: boolean,
  ) {
    var nowDate = new Date();
    updateApprovedDaysOff({
      id: id,
      day: day,
      approvedByID: approverID,
      approvedByName: approverName,
      dateApproved: nowDate,
      timeApproved: nowDate,
      isApproved: isApproved,
      employeeID: employeeId,
    });
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <button
        onClick={() => setShowApproved(!showApproved)}
        className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
      >
        Show Approved Time Off
      </button>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Approvers Name
            </th>
            <th scope="col" className="px-6 py-3">
              Approved Date
            </th>
            <th scope="col" className="px-6 py-3">
              Approved Time
            </th>
            <th scope="col" className="px-6 py-3">
              Employee Info
            </th>
            <th scope="col" className="px-6 py-3">
              Approve Request
            </th>
            <th scope="col" className="px-6 py-3">
              Deny Request
            </th>
          </tr>
        </thead>

        {data.length ? (
          <tbody>
            {data.map((dayOff: any) => {
              if (!dayOff.isApproved && !showApproved)
                return (
                  <tr
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    key={dayOff.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {dayOff.day.toLocaleDateString()}
                    </th>
                    <td className="px-6 py-4">{dayOff.approvedByName}</td>
                    <td className="px-6 py-4">
                      {dayOff.dateApproved.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {dayOff.timeApproved.toLocaleTimeString("en-US")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => getEmployee(dayOff.employeeID)}
                        className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                      >
                        Get Info
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          approveLeave(
                            dayOff.id,
                            dayOff.day,
                            dayOff.employeeID,
                            userId, // Might Need a session to store the ID of whoever is loggedin
                            "Approved by admin", // Might need a session to store the name of the person that approved the leave request
                            true,
                          )
                        }
                        className="mr-2 mb-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
                      >
                        Approve
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          approveLeave(
                            dayOff.id,
                            dayOff.day,
                            dayOff.employeeID,
                            userId,
                            user.user?.fullName,
                            false,
                          )
                        }
                        className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                );
              else if (dayOff.isApproved && showApproved)
                return (
                  <tr
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    key={dayOff.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {dayOff.day.toLocaleDateString()}
                    </th>
                    <td className="px-6 py-4">{dayOff.approvedByName}</td>
                    <td className="px-6 py-4">
                      {dayOff.dateApproved.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {dayOff.timeApproved.toLocaleTimeString("en-US")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => getEmployee(dayOff.employeeID)}
                        className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                      >
                        Get Info
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          approveLeave(
                            dayOff.id,
                            dayOff.day,
                            dayOff.employeeID,
                            userId,
                            user.user?.fullName,
                            true,
                          )
                        }
                        className="mr-2 mb-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
                      >
                        Approve
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          approveLeave(
                            dayOff.id,
                            dayOff.day,
                            dayOff.employeeID,
                            userId.toString(),
                            user.user?.fullName,
                            false,
                          )
                        }
                        className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                      >
                        Deny
                      </button>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        ) : (
          <div>There is nothing to display</div>
        )}
      </table>
    </div>
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

  const { isSignedIn, userId } = useAuth();

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
    // console.log("In Button organization Create");
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

  {
    if (isSignedIn) {
      return (
        <>
          <Head>
            <title>Create An Organization</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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

              <PaidTimeOff />

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
                            onClick={() =>
                              btnDeleteorganization(organization.id)
                            }
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
    }
  }
  {
    !isSignedIn && (
      <p className="text-center text-2xl text-white">
        <Link href="/sign-in">Sign In</Link>
      </p>
    );
  }
};

export default organization;
