import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { SignIn, useAuth, useUser } from "@clerk/nextjs";



const Employees: NextPage = () => {
  const { isSignedIn, userId } = useAuth();
  const user = useUser();
  if (isSignedIn) {
    const [id, setID] = useState<string>("");
    const [organizationID, setOrganizationID] = useState<string>("");

    const [showOrgError, setShowOrgError] = useState<boolean | null>(null);

    // Create
    const { mutate: createEmployee } =
      trpc.employees.createEmployee.useMutation({});

    const { mutate: updateEmployeeORGID } =
      trpc.employees.updateEmplayeeOrgID.useMutation({});

    const { data } = trpc.employees.findEmployeeById.useQuery({
      clerkID: userId,
    });

    const tempID: string = "8b1d6250-e56b-4619-98a2-7f0c035ac91e";

    const findORG = trpc.organization.findOrganizationById.useMutation({});

    const addEntry = trpc.organization.add.useMutation();

    async function addOrgID(orgID: string, employeeID: string) {
      const tempData = findORG
        .mutateAsync({
          id: orgID,
        })
        .then((data: any) => {
          if (data == null || typeof data === "undefined") {
            setShowOrgError(false);
          } else {
            setShowOrgError(true);

            updateEmployeeORGID({
              id: employeeID,
              organizationID: orgID,
              organizationName: data.name,
            });
          }
        });
      await sleep(5000);
      setShowOrgError(null);
    }

    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function btnCreateEmployee(userID: any, userFullName: any, userEmail: any) {
      const { data: AllEmployee }: any =
        trpc.employees.getAllEmployees.useQuery();

      if (id == null || id == "") {
        if (AllEmployee?.length > 1) {
          createEmployee({
            email: userEmail,
            name: userFullName,
            organizationID: "", // Note: we might beable to get the organization name from the ID
            organizationName: "",
            role: "EMPLOYEE", // Todo: meed to make a prisma type to get the roles. On the organization page we should allow the manager to set the toels
            DaysToWork: {},
            daysApproved: {},
            numberOfDaysOff: 0,
            sickDays: 0,
            paidTimeOff: 0,
            clerkID: userID,
          });
        } else {
          createEmployee({
            email: userEmail,
            name: userFullName,
            organizationID: "",
            organizationName: "",
            role: "OWNER",
            DaysToWork: {},
            daysApproved: {},
            numberOfDaysOff: 0,
            sickDays: 0,
            paidTimeOff: 0,
            clerkID: userID,
          });
        }
      }
      setOrganizationID("");
    }

    return (
      <div className="px-8">
        <main className="flex-col place-content-center  justify-center">
          {showOrgError == false ? (
            <div role="alert">
              <div className="rounded-t bg-red-500 px-4 py-2 font-bold text-white">
                Danger
              </div>
              <div className="rounded-b border border-t-0 border-red-400 bg-red-100 px-4 py-3 text-red-700">
                <p>There was an error finding that organization.</p>
              </div>
            </div>
          ) : showOrgError == true ? (
            <div
              className="rounded-b border-t-4 border-teal-500 bg-teal-100 px-4 py-3 text-teal-900 shadow-md"
              role="alert"
            >
              <div className="flex">
                <div className="py-1">
                  <svg
                    className="mr-4 h-6 w-6 fill-current text-teal-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">
                    Succussfully added the organization ID
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <br />
          {data ? (
            <div className="flex flex-col gap-4">
              {data.organizationID ? (
                <></>
              ) : (
                <div>
                  <input
                    className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
                    type="text"
                    placeholder="Enter Organization ID"
                    aria-label="Organization ID"
                    onChange={(e) => setOrganizationID(e.target.value)}
                  />

                  <br />

                  <button
                    className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 py-1 px-2 text-sm text-white hover:border-teal-700 hover:bg-teal-700"
                    type="button"
                    onClick={() => addOrgID(organizationID, data.id)}
                  >
                    Submit
                  </button>
                </div>
              )}

              <AddDontWorkDays />
              <ShowRequestedDays />
            </div>
          ) : (
            <div>
              <p>
                We do not have any records of you. Would you like to make an
                Employee Account?
              </p>
              <button
                onClick={() =>
                  btnCreateEmployee(
                    userId,
                    user.user?.fullName,
                    user.user?.emailAddresses.toString(),
                  )
                }
              >
                Create Account
              </button>
            </div>
          )}
        </main>
      </div>
    );
  } else {
    return <SignIn />;
  }
};
export default Employees;

const AddDontWorkDays = () => {
  const { mutate: updateDaysNotToWork } =
    trpc.employees.daysApprovedOff.useMutation({});
  const { isSignedIn, userId } = useAuth();

  const { data }: any = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

  const [date, setDate] = useState<any>();

  return (
    <div className="bg-slate-200">
      <h1>Add a date to request off</h1>

      <input
        type="date"
        id="start"
        name="trip-start"
        min={new Date().toISOString().split("T")[0]}
        max="2024-12-31"
        onChange={(e: any) => {
          setDate(e.target.value);
        }}
      ></input>

      <div>
        <button
          onClick={() => {
            updateDaysNotToWork({
              day: new Date(date),
              approvedByID: "None",
              approvedByName: "None",
              dateApproved: new Date(0),
              timeApproved: new Date(0),
              employeeID: data.id,
            });
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const ShowRequestedDays = () => {
  const { mutate: updateDaysNotToWork } =
    trpc.employees.daysApprovedOff.useMutation({});
  const { isSignedIn, userId } = useAuth();

  const { data } = trpc.employees.getRequestedDaysOff.useQuery({
    employeeID: "7dc8f882-bce3-4456-b875-400ea413c241",
  });
  const [showApproved, setShowApproved] = useState<boolean>(false);

  const { mutate: deleteDayOff } =
    trpc.employees.deleteRequestedDayOff.useMutation({});

  function deleteLeave(id: number) {
    deleteDayOff({ id: id });
  }

  return (
    <>
      <div className=" relative overflow-x-auto bg-slate-300 shadow-md sm:rounded-lg">
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
                Delete Request
              </th>
            </tr>
          </thead>

          {data ? (
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
                          onClick={() => deleteLeave(dayOff.id)}
                          className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                        >
                          Delete
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
                          onClick={() => deleteLeave(dayOff.id)}
                          className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                        >
                          Delete Request
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
    </>
  );
};
