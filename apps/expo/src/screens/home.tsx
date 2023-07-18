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
        title="Sign Out"
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
  const { data: allEmployeesByOrgID } =
    trpc.employees.getAllEmployeesByOrgID.useQuery({
      orgID: "125a5f23-dbd3-46c9-b1dc-47a0dfc0f0ed",
    });
  console.log("orgID Employees Start");
  console.log(allEmployeesByOrgID);
  console.log("orgID Employees End");

  if (allEmployeesByOrgID?.length > 1)
    return (
      <View>
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Employees Below
        </Text>
        {allEmployeesByOrgID?.map((employee) => {
          return <Text>Name: {employee.name}</Text>;
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

// Clerks ID: user_2SIjRI8wDK9GwtzyISceiq7dg0y

export const HomeScreen = () => {
  const { userId } = useAuth();

  const { data: employeeByID } = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

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
            <Text className="mx-auto pb-2 text-5xl font-bold text-white">
              <CreateOrg />
            </Text>
          </View>
          <SignOut />
        </View>
      </SafeAreaView>
    );
};
