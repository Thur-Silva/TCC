import CustomButton from "@/components/CustomButton";
import DecorationClouds from "@/components/decorationClouds";
import ErrorModal from "@/components/ErrorModal";
import HomeHeader from "@/components/HomeHeader";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAtuh";
import SuccessModal from "@/components/SuccessModal";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fecth";
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";




const SingUp = () => {

    const [form, setForm] = useState({
        name:'',
        email:'',
        password:''
    })

    const [verification, setVerification] =useState({
        state: 'default',
        error:'',
        code:'',
    })
    const [isErrorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [ShowSuccessModal, setShowSuccessModal] = useState(false);
    

    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')



 const onSignUpPress = async () => {
    if (!isLoaded) return

    if (
         verification.state === "pending" 
      || verification.state === "failed" 
      || verification.error
    ) return

    // TODO: mudar a lógica pois se o user mudar as cedrendicias, é preciso autorizar o reenvio do email   

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })


      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification,
        state:'pending'
      })

    } catch (err: any) {
        setErrorMessage(err?.errors?.[0]?.longMessage || "Ocorreu um erro");
        setErrorVisible(true);
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code:verification.code,
      })

      
      if (signUpAttempt.status === 'complete') {
       const res = await fetchAPI('/(api)/user', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          clerkId: signUpAttempt.createdUserId
        })
       })
       
        await setActive({ session: signUpAttempt.createdSessionId })
        setVerification({
            ...verification,
            state:'success'
        })
      } else {
        setVerification({
            ...verification,
            state:'failed',
            error:"A verificação da conta falhou."
        })
      }
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString?.() || ''
            const isUserAlreadyExists =
            errorMessage.includes('duplicate key') ||
            errorMessage.includes('users_pkey') ||
            err?.code === '23505'

          if (!isUserAlreadyExists) {
            console.error('Erro inesperado ao criar usuário:', err)
            throw err
          }
          
            setVerification({
                ...verification,
                state:'failed',
                error: err?.errors?.[0]?.longMessage || 'Erro desconhecido',
            })
    }
  }

    return(
        <ScrollView className="bg-white flex-1">

          <HomeHeader showInput={false} globalClassName="pt-10 mb-20" />
            <View className="bg-white flex-1">
                <View className="relative w-full h-[250px]">
                    <View className="">
                        <Text className="text-3xl font-JakartaSemiBold absolute bottom-5 left-5 ">
                            Crie sua conta
                        </Text>
                    </View>

                    <View className="p-5">
                        <InputField
                        label="Nome"
                        placeholder = "Insira seu nome"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value)=>{ setForm({ ... form, name:value})}}
                        />

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
                        <CustomButton title="Cadastrar" onPress={onSignUpPress} className="mt-6"/>

                        <OAuth />

                        <Link href="/sign-in"
                         className="text-lg text-center text-general-200 mt-10"
                         >
                            <Text> Já possui uma conta? </Text>
                            <Text className="text-primary-500"> Entrar </Text>
                        </Link>
                    </View>
                </View>

            {/* Error Modal */}

            <ErrorModal
            isErrorVisible={isErrorVisible}
            errorMessage={errorMessage}
             onClose={() => setErrorVisible(false)}
            />

              {/* Pendding Modal */}

            <ReactNativeModal
              isVisible ={verification.state ==='pending' || verification.state ==='failed'}
              statusBarTranslucent={true}
              onModalHide={()=>{
                if(verification.state === 'success') setShowSuccessModal(true) 
                }}
              onBackdropPress={() => setVerification({ ...verification, state: 'default', error: '' })}
              onBackButtonPress={() => setVerification({ ...verification, state: 'default', error: '' })}
            >
                <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <Text className="text-2xl font-JakartaExtraBold mb-2 ">
                        Verificação
                    </Text>

                    <Text className="font-Jakarta mb-5">
                        Enviamos um código de verificação para {form.email}
                    </Text>

                    <InputField
                    label="Código"
                    icon={icons.lock}
                    placeholder="1234567"
                    value={verification.code}
                    keyboardType="numeric"
                    onChangeText={(code)=> setVerification({... verification, code})}/>

                    {verification.error && (
                        <Text className="text-red-500 text-sm mt-1">
                            {verification.error}
                        </Text>
                    )}

                    <CustomButton
                    title="Verificar E-mail"
                    onPress={onVerifyPress}
                    className="mt-5 bg-success-500"/>

                </View>
            </ReactNativeModal>

              {/* Success Modal */}

            <SuccessModal
                ShowSuccessModal={ShowSuccessModal}
                description="Você se cadastrou em nosso sistema."
                onClose={()=> setShowSuccessModal(false)}
                link={"/(root)/(tabs)/home"}
            />
            </View>

            <DecorationClouds className="mt-12"/>
        </ScrollView>
    );
};

export default SingUp;