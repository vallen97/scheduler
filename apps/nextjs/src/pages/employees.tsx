import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
// import { Roles } from "@acme/db";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";

const enum Roles {
  EMPLOYEE,
  MANAGER,
  OWNER,
  ASSISTANT_MANAGER,
}

const roleArr: Array<string> = [
  "EMPLOYEE",
  "MANAGER",
  "OWNER",
  "ASSISTANT_MANAGER",
];

enum DaysToWork {
  id,
  day,
  startTime,
  endTime,
  employeeID,
}

enum DaysApproved {
  id,
  day,
  approvedByID,
  approvedByName,
  dateApproved,
  timeApproved,
  employeeID,
}

const Employees: NextPage = () => {
  const [id, setID] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [buttonName, setButtonName] = useState<String>("Create Employee");
  const [organizationID, setOrganizationID] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [roles, setRoles] = useState<Roles>(Roles["EMPLOYEE"]);
  const [daysToWork, setDayToWork] = useState<DaysToWork | null>(null);
  const [daysApproved, setDayApproved] = useState<DaysApproved | null>(null);
  const [numberOfDaysOff, setNumberOfDaysOff] = useState<number>(0);
  const [numberOfSickDays, setNumberOfSickDays] = useState<number>(0);
  const [numberOfPaidTimeOffDays, setNumberOfPaidTimeOffDays] =
    useState<number>(0);

  const { isSignedIn, userId } = useAuth();

  const user = useUser();

  // Create
  const { mutate: createEmployee } = trpc.employees.createEmployee.useMutation(
    {},
  );

  const { data } = trpc.employees.findEmployeeById.useMutation({
    id: userId,
  });

  console.log(data);

  function btnCreateEmployee(
    userID: string | null | undefined,
    userFullName: string | null | undefined,
    userEmail: string | null | undefined,
  ) {
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
      createEmployee({
        email: email,
        name: name,
        organizationID: "", // Note: we might beable to get the organization name from the ID
        organizationName: "",
        role: "EMPLOYEE", // Todo: meed to make a prisma type to get the roles. On the organization page we should allow the manager to set the toels
        DaysToWork: {},
        daysApproved: {},
        numberOfDaysOff: 0,
        sickDays: 0,
        paidTimeOff: 0,
      });
      setID("");
      setEmail("");
      setName("");

      setOrganizationID("");
      setOrganizationName("");
      setRoles(Roles["EMPLOYEE"]);
      setDayToWork(null);
      setDayApproved(null);
      setNumberOfDaysOff(0);
      setNumberOfSickDays(0);
      setNumberOfPaidTimeOffDays(0);
    } else {
      // updateEmployee({ id: id, email: email, name: name });
      // setID("");
      // setEmail("");
      // setName("");
    }

    setButtonName("Create Employee");
  }

  if (isSignedIn) {
    data ? (
      <div className="flex flex-col gap-4">
        <div>ID: {data.id}</div>
        <div>Email: {data.email}</div>
        <div>Name: {data.name}</div>
        <div>organizationID: {data.organizationID}</div>
        <div>Organization Name: {data.organizationName}</div>
        <div>role: {data.role}</div>
        <div>ID: {data.id}</div>
      </div>
    ) : (
      <div>
        <p>
          We do not have any records of you. Would you like to make an Employee
          Account?
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
    );
  } else if (!isSignedIn) return <div>Sigh in</div>;
};
export default Employees;
