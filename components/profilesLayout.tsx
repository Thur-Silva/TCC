import { icons, images } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import CustomButton from './CustomButton'
import ErrorModal from './ErrorModal'


type ProfileLayoutProps = {
  userName: string
  userEmail: string
  userImageUrl: string
  onSave: () => void
  publicPerfil?: boolean
}

export default function ProfileLayout({ userName, userEmail, userImageUrl, onSave, publicPerfil}: ProfileLayoutProps) {
  const [name, setName] = useState(userName.charAt(0).toUpperCase() + userName.slice(1))
  const [email, setEmail] = useState(userEmail)
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [country, setCountry] = useState('')


 const [ShowSuccessModal, setShowSuccessModal] = useState(false);
     const [isErrorVisible, setErrorVisible] = useState(false);
 
  


  return (
     <SafeAreaView className='px-1'>
        <ScrollView
      className="px-5"
      contentContainerStyle={{ paddingBottom: 310 }}
      showsVerticalScrollIndicator={false}
    >

    <View className={border-[2px] rounded-xl bg-slate-200 ${publicPerfil ? "mt-[80px]" : "mt-10"}}>
        {publicPerfil &&(
        <View className='justify-start mt-5 ml-5 mb-[-40px] flex flex-row'>
            <TouchableOpacity>
                <Image source={icons.backArrow} className='w-10 h-10'/>
            </TouchableOpacity>
        </View>
        )}

        <View className={justify-end mr-5 flex flex-row ${publicPerfil ? "" : "mt-5"}}>
            <TouchableOpacity>
                <Image source={icons.eyecross} className='w-10 h-10'/>
            </TouchableOpacity>
        </View>

        <View className={items-center justify-center mb-5 flex flex-row}>
          <Text className='font-JakartaBold text-3xl'>{userName ? name : "Seu perfil"}</Text>
        </View>
      <TouchableOpacity className="w-[150px] h-[150px] self-center relative mb-6">
        <Image
          source={userImageUrl ? userImageUrl : images.womanImageProfile}
          className="w-full h-full rounded-full border-[3px]"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 right-0 bg-white rounded-full p-1">
          <Ionicons name="camera" size={40} color="black" />
        </View>
      </TouchableOpacity>


  <View className='justify-center items-center pb-10'>
     <Text className='text-xl font-JakartaExtraBold mb-3'>Tipo de Conta</Text>
      <View className='justify-center items-center flex flex-row'>

        <TouchableOpacity onPress={()=>{ setErrorVisible(true) }}>
            <View className='border-[2px]  bg-green-300 rounded-full w-[120px] h-[40px] items-center justify-center mr-5'>
                <Text className='text-xl font-JakartaExtraBold'>Passageiro</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{ setErrorVisible(true) }}>
            <View className='border-[2px] bg-gray-300 rounded-full w-[120px] h-[40px] items-center justify-center'>
                <Text className='text-xl font-JakartaExtraBold'>Motorista</Text>
            </View>
        </TouchableOpacity> 

      </View>
  </View>
</View>

    <View className='border-[2px] rounded-xl bg-slate-100 mt-10 px-5'>

         <View className='justify-center items-center'>
             <Text className='text-2xl font-JakartaBold mb-3 mt-16'>Dados Pessoais</Text>
        </View>

      <Text className="text-lg font-JakartaMedium mb-1">Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-md px-4 py-5 mb-7"
        placeholder={${publicPerfil ? name : "Seu nome"}}

      />

      <Text className="text-lg font-JakartaMedium mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-md px-4 py-5 mb-7"
              placeholder={${publicPerfil ? name : "Seu E-mail"}}
        keyboardType="email-address"
      />

      <Text className="text-lg font-JakartaMedium mb-1">Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-md px-4 py-5 mb-7"
                placeholder={${publicPerfil ? name : "Seu nome"}}
        secureTextEntry
      />

      <Text className="text-lg font-JakartaMedium mb-1">Data de Nascimento</Text>
      <TextInput
        value={birthDate}
        onChangeText={setBirthDate}
        className="border border-gray-300 rounded-md px-4 py-5 mb-7"
        placeholder="DD/MM/YYYY"
      />

          <Text className="text-lg font-JakartaMedium mb-1">Sexo</Text>
      <TextInput
        value={birthDate}
        onChangeText={setBirthDate}
        className="border border-gray-300 rounded-md px-4 py-5 mb-7"
        placeholder="Masculino"
      />

    </View>
        <View className='justify-center items-center mt-5'>
            {/*
            TODO: Fazer com que apareça somente se haver alterações em quaisquer itens. Deve ficar no canto superior direito com opção:
            Salvar --> Salva todas alterações
            Descartar --> Volta todas alterações como um Crtl+z
             */}
            <CustomButton 
            title='Salvar'/>  
        </View>
    </ScrollView>

            <ErrorModal
            isErrorVisible={isErrorVisible}
            title='Mudar tipo da conta?'
            errorMessage="Ao prosseguir, estará apto para usar as funções do tipo escolhido. Relaxa, você poderá voltar atrás."
             onClose={() => setErrorVisible(false)}
             icon={icons.question}
             iconStyle='w-[150px] h-´150px]'
             secondOption
             onFirstButtonPress={()=> {
                router.push("/(root)/(tabs)/rides");
                setErrorVisible(false);
            }}
            />
    </SafeAreaView>
  );
}


