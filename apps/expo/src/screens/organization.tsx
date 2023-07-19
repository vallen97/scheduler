import React from "react";

import { Button, Text, TextInput, ToastAndroid, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

import { trpc } from "../utils/trpc";
import { Employee } from ".prisma/client";

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

const CreateOrg = () => {
  const { mutate: createorganization } =
    trpc.organization.createOrganization.useMutation({});

  const { userId } = useAuth();

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [employeeID, setEmployeeID] = React.useState<any>("");
  const [daysNotToWork, setdaysNotToWork] = React.useState<any>(null);
  const [employeesWorking, setEmployeesWorking] = React.useState<any>(null);

  setEmployeeID(userId);

  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <TextInput
        onChangeText={setName}
        placeholder="Enter Organizations name"
      />
      <TextInput
        onChangeText={setEmail}
        placeholder="Enter Organizations email"
      />

      <Button
        title="Create Organizaiton"
        onPress={() => {
          createorganization({
            name: name,
            email: email,
            employeeID: employeeID,
            daysNotToWork: daysNotToWork,
            employeesWorking: employeesWorking,
          });
        }}
      />
    </View>
  );
};

const ShowEmployees = () => {
  const { data: allEmployeesByOrgID }: any =
    trpc.employees.getAllEmployeesByOrgID.useQuery({
      orgID: "125a5f23-dbd3-46c9-b1dc-47a0dfc0f0ed",
    });

  const { mutate: removeOrg } = trpc.employees.removeOrgID.useMutation({});

  function removeOrgID(userID: string) {
    removeOrg({ employeeID: userID });
    showToast("Emplopyee Successfully removed");
  }

  if (allEmployeesByOrgID?.length > 0)
    return (
      <View>
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Employees Below
        </Text>
        {allEmployeesByOrgID?.map((employee: Employee) => {
          return (
            <View key={employee.id}>
              <Text className="mx-auto pb-2 text-5xl font-bold text-white">
                Name: {employee.name}
              </Text>
              <Button
                title="Remove Employee"
                onPress={() => {
                  removeOrgID(employee.id);
                }}
              />
            </View>
          );
        })}
      </View>
    );
  else {
    return (
      <View>
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          No Employees
        </Text>
      </View>
    );
  }
};



export const OrganizationScreen = () => {
  const { userId } = useAuth();

  const { data: employeeByID } = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

  const { mutate: createorganization } =
    trpc.organization.createOrganization.useMutation({});

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [employeeID, setEmployeeID] = React.useState<any>("");
  const [daysNotToWork, setDaysNotToWork] = React.useState<any>();

  function createORg(
    name: string,
    email: string,
    ID: any,
    daysNotToWork: any,
    employeesWorking: number,
  ) {
    createorganization({
      name: name,
      email: email,
      employeeID: ID,
      daysNotToWork: daysNotToWork,
      employeesWorking: employeesWorking,
    });

    showToast("Organization Successfully added");
  }

  if (employeeByID?.role != "EMPLOYEE") {
    const { data: orgInfo } = trpc.organization.getOrganizationByID.useQuery({
      id: "125a5f23-dbd3-46c9-b1dc-47a0dfc0f0ed",
    });

    return (
      <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <View className="h-full w-full p-4">
          <View>
            <ShowEmployees />
          </View>
          <SignOut />
        </View>
      </SafeAreaView>
    );
  } else
    return (
      <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <View className="h-full w-full p-4">
          <View>
            <View className="rounded-lg border-2 border-gray-500 p-4">
              <TextInput
                onChangeText={setName}
                placeholder="Enter Organizations name"
              />
              <TextInput
                onChangeText={setEmail}
                placeholder="Enter Organizations email"
              />

              <Button
                title="Create Organizaiton"
                onPress={() => {
                  createORg(name, email, employeeByID?.id, daysNotToWork, 1);
                }}
              />
            </View>
          </View>
          <SignOut />
        </View>
      </SafeAreaView>
    );
};
