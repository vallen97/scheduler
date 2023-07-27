import React from "react";

import { Button, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { trpc } from "../utils/trpc";
import { EmployeeScreen } from "./employee";
import { OrganizationScreen } from "./organization";

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

export const HomeScreen = () => {
  const { userId } = useAuth();

  const { data: employeeByID } = trpc.employees.findEmployeeById.useQuery({
    clerkID: userId,
  });

  if (employeeByID?.role != "EMPLOYEE") return <OrganizationScreen />;
  else return <EmployeeScreen />;
};
