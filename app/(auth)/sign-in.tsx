import CustomButton from "@/components/CustomButton";
import ErrorModal from "@/components/ErrorModal";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAtuh";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";



const SignIn = () => {

    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    const [isErrorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showErrorModal = (error: any) => {
        setErrorMessage(error);
        setErrorVisible(true);
    };

    const [form, setForm] = useState({
        email:'',
        password:''
    })

    const onSignInPress= useCallback( async () =>{ 
        if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(root)/(tabs)/home')
      } else {
         showErrorModal(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
        showErrorModal(err.errors[0].longMessage)
    }
    }, [isLoaded, form.email, form.password]);
    return(
        <ScrollView className="bg-white flex-1">
            <View className="bg-white flex-1">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar}
                    className="z-0 w-full h-[250px]"
                    />

                    <Text className="text-3xl font-JakartaSemiBold absolute bottom-5 left-5 ">
                        Entre na sua conta
                    </Text>

                    <View className="p-5">
                        <InputField
                        label="Email"
                        placeholder = "Insira seu E-mail"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value)=>{ setForm({ ... form, email:value})}}
                        />

                        <InputField
                        label="Senha"
                        placeholder = "Insira sua senha"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value)=>{ setForm({ ... form, password:value})}}
                        />
                        
                        {/*Autenticação*/}
                        <CustomButton title="Login" onPress={onSignInPress} className="mt-6"/>

                        <OAuth />

                        <Link href="/(auth)/sign-up"
                         className="text-lg text-center text-general-200 mt-10"
                         >
                            <Text> Não possui uma conta? </Text>
                            <Text className="text-primary-500"> Cadastrar </Text>
                        </Link>

                        {/* Modals */}

                         <ErrorModal
                            isErrorVisible={isErrorVisible}
                            errorMessage={errorMessage}
                            onClose={() => setErrorVisible(false)}
                        />

                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignIn;