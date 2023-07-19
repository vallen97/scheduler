import React from "react";

import {
  Button,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

import { trpc } from "../utils/trpc";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const AddOrg: React.FC<{ employee: any }> = ({ employee }) => {
  const [orgID, setOrgID] = React.useState<string>("");
  const [showOrgError, setShowOrgError] = React.useState<boolean | null>(null);

  const findORG = trpc.organization.findOrganizationById.useMutation({});
  const { mutate: updateEmployeeORGID } =
    trpc.employees.updateEmplayeeOrgID.useMutation({});

  const user = useUser();


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
          console.log("successfully added organization");
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

  if (!employee)
    return (
      <View className="py-2">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create An Account
        </Text>
      </View>
    );

  return (
    <View className="py-2">
      <TextInput
        className="mb-2 rounded border-2 border-gray-500 p-2 text-white"
        onChangeText={setOrgID}
        placeholder="Enter Organization ID"
      />

      <Button
        title="Add Organization"
        color="#f194ff"
        onPress={() => addOrgID(orgID, employee.id)}
      />
    </View>
  );
};

export const EmployeeScreen = () => {
  const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const { data: AllEmployee }: any = trpc.employees.getAllEmployees.useQuery();

  const { isSignedIn, userId } = useAuth();
  const user = useUser();

  const { data: employeeByID } = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

  const { mutate: createEmployee } = trpc.employees.createEmployee.useMutation(
    {},
  );

  console.log(employeeByID);
  console.log(userId);

  function btnCreateEmployee(userID: any, userFullName: any, userEmail: any) {
    if (AllEmployee?.length > 1) {
      createEmployee({
        email: userEmail,
        name: userFullName,
        organizationID: "",
        organizationName: "",
        role: "EMPLOYEE", 
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

  return (
    <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create <Text className="text-[#cc66ff]">T3</Text> Turbo
        </Text>

        {employeeByID ? (
          <AddOrg employee={employeeByID} />
        ) : (
          <View>
            <Button
              title="Add Employee"
              color="#f194ff"
              onPress={() => {
                console.log("Add Employee");
                btnCreateEmployee(
                  userId,
                  user.user?.fullName,
                  user.user?.emailAddresses.toString(),
                );
              }}
            />
          </View>
        )}

        <SignOut />
      </View>
    </SafeAreaView>
  );
};
