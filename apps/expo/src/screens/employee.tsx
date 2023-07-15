import React from "react";

import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

import { trpc } from "../utils/trpc";

// ClerksJS:
// vaughnallen97@gmail.com
// g7ac5D$ScAa#82Et91

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

// Clerks ID: user_2SIjRI8wDK9GwtzyISceiq7dg0y

const AddOrg: React.FC<{ employee: any }> = ({ employee }) => {
  const [orgID, setOrgID] = React.useState<string>("");
  const [showOrgError, setShowOrgError] = React.useState<boolean | null>(null);

  const findORG = trpc.organization.findOrganizationById.useMutation({});
  const { mutate: updateEmployeeORGID } =
    trpc.employees.updateEmplayeeOrgID.useMutation({});

  const user = useUser();

  // Test Add OrgID: 8b1d6250-e56b-4619-98a2-7f0c035ac91e
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

export const HomeScreen = () => {
  const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const { data: AllEmployee } = trpc.employees.getAllEmployees.useQuery();

  const { isSignedIn, userId } = useAuth();
  const user = useUser();

  const { data: employeeByID } = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

  const { mutate: createEmployee } = trpc.employees.createEmployee.useMutation(
    {},
  );

  // console.log(employeeByID);

  function btnCreateEmployee(userID: any, userFullName: any, userEmail: any) {
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
