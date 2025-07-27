import { icons } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ErrorModal from './ErrorModal'


type ProfileLayoutProps = {
  userName: string
  userEmail: string
  userImageUrl: string
  userBirthDate: string
  userCountry: string
  userGender: string
  onSave: () => void
  publicPerfil?: boolean
}

export default function ProfileLayout({
  userName,
  userEmail,
  userImageUrl,
  userBirthDate,
  userCountry,
  userGender,
  onSave,
  publicPerfil
}: ProfileLayoutProps) {
  const [name, setName] = useState(userName)
  const [email, setEmail] = useState(userEmail)
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState(userBirthDate)
  const [country, setCountry] = useState(userCountry)
  const [gender, setGender] = useState(userGender)

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)

  const originalData = {
    name: userName,
    email: userEmail,
    birthDate: userBirthDate,
    country: userCountry,
    gender: userGender
  }

  const isChanged =
    name !== originalData.name ||
    email !== originalData.email ||
    password !== '' ||
    birthDate !== originalData.birthDate ||
    country !== originalData.country ||
    gender !== originalData.gender

  function handleSave() {
    setShowSaveModal(true)
  }

  function handleDiscard() {
    setName(originalData.name)
    setEmail(originalData.email)
    setPassword('')
    setBirthDate(originalData.birthDate)
    setCountry(originalData.country)
    setGender(originalData.gender)
  }

  async function sendProfileUpdateToServer() {
    try {
      const payload = {
        name,
        email,
        password,
        birthDate,
        country,
        gender
      }
      console.log('Enviando para API:', payload)
      // await api.post('/update-profile', payload)
      onSave()
    } catch (error) {
      console.warn('Erro ao salvar perfil:', error)
    }
  }

  return (
    <SafeAreaView className='px-1'>
      {isChanged && (
        <View className='absolute right-5 top-5 flex-row space-x-3 z-10'>
          <TouchableOpacity
            onPress={handleDiscard}
            className='bg-gray-200 px-4 py-2 rounded-xl'
          >
            <Text className='font-JakartaBold text-sm'>Descartar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            className='bg-indigo-600 px-4 py-2 rounded-xl'
          >
            <Text className='text-white font-JakartaBold text-sm'>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        className='px-5'
        contentContainerStyle={{ paddingBottom: 310 }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`border-[2px] rounded-xl bg-slate-200 ${publicPerfil ? "mt-[80px]" : "mt-10"}`}>
          {publicPerfil && (
            <View className='justify-start mt-5 ml-5 mb-[-40px] flex flex-row'>
              <TouchableOpacity>
                <Image source={icons.backArrow} className='w-10 h-10' />
              </TouchableOpacity>
            </View>
          )}

          <View className={`justify-end mr-5 flex flex-row ${publicPerfil ? '' : 'mt-5'}`}>
            <TouchableOpacity>
              <Image source={icons.eyecross} className='w-10 h-10' />
            </TouchableOpacity>
          </View>

          <View className='items-center justify-center mb-5 flex flex-row'>
            <Text className='font-JakartaBold text-3xl'>{userName ? name : 'Seu perfil'}</Text>
          </View>

          <TouchableOpacity className='w-[150px] h-[150px] self-center relative mb-6'>
            <Image
              source={userImageUrl ? userImageUrl : icons.defaultUser}
              className='w-full h-full rounded-full border-[3px]'
              resizeMode='cover'
            />
            <View className='absolute bottom-0 right-0 bg-white rounded-full p-1'>
              <Ionicons name='camera' size={40} color='black' />
            </View>
          </TouchableOpacity>

          <View className='justify-center items-center pb-10'>
            <Text className='text-xl font-JakartaExtraBold mb-3'>Tipo de Conta</Text>
            <View className='justify-center items-center flex flex-row'>
              <TouchableOpacity onPress={() => setShowAccountTypeModal(true)}>
                <View className='border-[2px] bg-green-300 rounded-full w-[120px] h-[40px] items-center justify-center mr-5'>
                  <Text className='text-xl font-JakartaExtraBold'>Passageiro</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowAccountTypeModal(true)}>
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

          <Text className='text-lg font-JakartaMedium mb-1'>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className='border border-gray-300 rounded-md px-4 py-5 mb-7'
            placeholder='Seu nome'
          />

          <Text className='text-lg font-JakartaMedium mb-1'>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className='border border-gray-300 rounded-md px-4 py-5 mb-7'
            placeholder='Seu E-mail'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />

          <Text className='text-lg font-JakartaMedium mb-1'>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            className='border border-gray-300 rounded-md px-4 py-5 mb-7'
            placeholder='Sua senha'
            secureTextEntry
          />

          <Text className='text-lg font-JakartaMedium mb-1'>Data de Nascimento</Text>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            className='border border-gray-300 rounded-md px-4 py-5 mb-7'
            placeholder='DD/MM/YYYY'
          />

          <Text className='text-lg font-JakartaMedium mb-1'>Sexo</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            className='border border-gray-300 rounded-md px-4 py-5 mb-7'
            placeholder='Masculino'
          />
        </View>
      </ScrollView>

      <ErrorModal
        isErrorVisible={showAccountTypeModal}
        title='Mudar tipo da conta?'
        errorMessage='Ao prosseguir, estará apto para usar as funções do tipo escolhido. Relaxa, você poderá voltar atrás.'
        onClose={() => setShowAccountTypeModal(false)}
        icon={icons.question}
        iconStyle='w-[150px] h-[150px]'
        secondOption
        onFirstButtonPress={() => {
          router.push('/(root)/(tabs)/rides')
          setShowAccountTypeModal(false)
        }}
      />

      <ErrorModal
        isErrorVisible={showSaveModal}
        title='Deseja salvar as alterações?'
        errorMessage='Suas mudanças serão atualizadas no seu perfil.'
        onClose={() => setShowSaveModal(false)}
        icon={icons.question}
        iconStyle='w-[150px] h-[150px]'
        secondOption
        onFirstButtonPress={() => {
          sendProfileUpdateToServer()
          setShowSaveModal(false)
        }}
      />
    </SafeAreaView>
  )
}
