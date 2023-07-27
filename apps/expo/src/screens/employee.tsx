import React from "react";

import { Button, Text, TextInput, ToastAndroid, View } from "react-native";
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

const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
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

          updateEmployeeORGID({
            id: employeeID,
            organizationID: orgID,
            organizationName: data.name,
          });
        }
      });
    showToast("Emplopyee Successfully added");
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        {employeeByID ? (
          <AddOrg employee={employeeByID} />
        ) : (
          <View>
            <Text>
              You do not have an employee ID, Press Add Employee to make one
            </Text>
            <Button
              title="Add Employee"
              color="#f194ff"
              onPress={() => {
                btnCreateEmployee(
                  userId,
                  user.user?.fullName,
                  user.user?.emailAddresses.toString(),
                );
                setRefreshing(true);
              }}
            />
          </View>
        )}

        <SignOut />
      </View>
    </SafeAreaView>
  );
};
