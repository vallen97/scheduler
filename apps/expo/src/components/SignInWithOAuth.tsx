import React from "react";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import * as AuthSession from "expo-auth-session";

const SignInWithOAuth = () => {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  if (!isLoaded) return null;

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setSession(completeSignIn.createdSessionId);
    } catch (err) {
      // @ts-ignore
    }
  };

  const handleSignInWithDiscordPress = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
      });

      await signIn.create({
        strategy: "oauth_discord",
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";

      const authResult = await AuthSession.startAsync({
        authUrl: externalVerificationRedirectURL.toString(),
        returnUrl: redirectUrl,
      });

      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        // Create user
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: authResult.params.rotating_token_nonce,
        });
        await setSession(signUp.createdSessionId);
      }
    } catch (err) {}
  };

  return (
    <View className="mt-10 rounded-lg border-2 border-[#CCF78B] p-4">
      <View>
        <Text
          style={{ color: "#ffffff", textAlign: "center", marginBottom: 10 }}
        >
          Sign in to use the app
        </Text>
        <View>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
              borderColor: "#BBE1FA",
            }}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            placeholderTextColor="#fff"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
              borderColor: "#BBE1FA",
            }}
            value={password}
            placeholder="Password..."
            placeholderTextColor="#fff"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#FABBE1",
            borderColor: "#F78BCC",
            borderWidth: 2,

            right: 0,
            minHeight: 60,
            alignSelf: "flex-end",
            marginLeft: 6,
            marginRight: 8,
            justifyContent: "center",
            width: 108,
            borderRadius: 10,
          }}
          onPress={onSignInPress}
        >
          <Text style={{ color: "#000000", textAlign: "center" }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInWithOAuth;
