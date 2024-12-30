import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, ScrollView, View, Image } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView
      className={"flex-1 bg-white"}
      showsVerticalScrollIndicator={false}
    >
      <View className={"flex-1 bg-white"}>
        <View className={"relative mt-16"}>
          <Text
            className={"text-2xl text-black font-JakartaSemiBold text-center"}
          >
            Sign In
          </Text>
          <Image
            source={require("../../assets/images/signin.png")}
            // style={{ width: 300, height: 300 }}
            className={"text-center mx-auto mt-4"}
          />
        </View>
        <View className={"p-5"}>
          <InputField
            label={"Email"}
            placeholder={"Enter your email"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label={"Password"}
            placeholder={"Enter password"}
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title={"Sign In"}
            onPress={onSignInPress}
            className={"mt-6"}
          />
          <OAuth />
          <Link
            href={"/sign-up"}
            className={"text-lg text-center text-general-200 mt-10"}
          >
            <Text>Don't have an account?</Text>
            <Text className={"text-[#F98C53]"}> Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
