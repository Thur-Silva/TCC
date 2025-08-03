  import { icons } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import InfoCard from 'components/infoCard'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
    publicPerfil,
  }: ProfileLayoutProps) {
    const [name, setName] = useState(userName)
    const [email, setEmail] = useState(userEmail)
    const [birthDate, setBirthDate] = useState(userBirthDate)
    const [country, setCountry] = useState(userCountry)
    const [gender, setGender] = useState(userGender)
    const [activeTab, setActiveTab] = useState('pessoal')
    const [isEditing, setIsEditing] = useState(false)

    const [showSaveModal, setShowSaveModal] = useState(false)
    const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)

    const originalData = {
      name: userName,
      email: userEmail,
      birthDate: userBirthDate,
      country: userCountry,
      gender: userGender,
    }

    const isChanged =
      name !== originalData.name ||
      email !== originalData.email ||
      birthDate !== originalData.birthDate ||
      country !== originalData.country ||
      gender !== originalData.gender

    function handleSave() {
      setShowSaveModal(true)
    }

    function handleDiscard() {
      setName(originalData.name)
      setEmail(originalData.email)
      setBirthDate(originalData.birthDate)
      setCountry(originalData.country)
      setGender(originalData.gender)
      setIsEditing(false)
    }

    async function sendProfileUpdateToServer() {
      try {
        const payload = {
          name,
          email,
          birthDate,
          country,
          gender,
        }
        console.log('Enviando para API:', payload)
        // await api.post('/update-profile', payload)
        onSave()
        setIsEditing(false)
      } catch (error) {
        console.warn('Erro ao salvar perfil:', error)
      }
    }

    return (
      <SafeAreaView className={`flex-1 bg-white pb-[200px] ${publicPerfil ? 'pt-10' : 'pt-[150px]'}`}>
        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header e Avatar */}
          <View className="items-center mt-5 mb-8">
            {publicPerfil && (
              <TouchableOpacity className="absolute left-0 top-0 mt-5 ml-5">
                <Ionicons name="arrow-back-outline" size={32} color="#1456a7" />
              </TouchableOpacity>
            )}

            <TouchableOpacity className="w-[150px] h-[150px] self-center relative mb-4">
              <Image
                source={userImageUrl ? { uri: userImageUrl } : icons.defaultUser}
                className="w-full h-full rounded-full border-[3px] border-[#1456a7]"
                resizeMode="cover"
              />
              {!publicPerfil && (
                <View className="absolute bottom-0 right-0 bg-[#4598ff] rounded-full p-2 border-2 border-white">
                  <Ionicons name="camera" size={24} color="white" />
                </View>
              )}
            </TouchableOpacity>

            <Text className="font-JakartaBold text-3xl text-[#1456a7]">{userName}</Text>
            {publicPerfil && (
              <>
                <Text className="text-base font-JakartaMedium text-gray-600 mt-1">
                  @{name.toLowerCase().replace(/\s/g, '')}
                </Text>
                <Text className="text-center mt-2 text-gray-700 px-10">
                  Gosta de viagens longas, paisagens bonitas e boa conversa.
                </Text>
              </>
            )}
          </View>

          {/* Tabs de Navegação */}
          {!publicPerfil && (
            <View className="flex-row justify-around mb-8">
              <TouchableOpacity onPress={() => setActiveTab('pessoal')} className="items-center">
                <Text
                  className={`font-JakartaBold text-lg ${activeTab === 'pessoal' ? 'text-[#1456a7]' : 'text-gray-400'}`}
                >
                  Dados Pessoais
                </Text>
                {activeTab === 'pessoal' && <View className="h-1 w-full bg-[#1456a7] mt-1 rounded-full" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('estatisticas')} className="items-center">
                <Text
                  className={`font-JakartaBold text-lg ${activeTab === 'estatisticas' ? 'text-[#1456a7]' : 'text-gray-400'}`}
                >
                  Estatísticas
                </Text>
                {activeTab === 'estatisticas' && <View className="h-1 w-full bg-[#1456a7] mt-1 rounded-full" />}
              </TouchableOpacity>
            </View>
          )}

          {/* Conteúdo dinâmico com base nas tabs */}
          {activeTab === 'pessoal' && (
            <View>
              <Text className="text-2xl font-JakartaBold mb-4 mt-4 text-[#1456a7]">Dados Pessoais</Text>
              <InfoCard
                label="Nome"
                value={name}
                iconName="person-outline"
                editable={!publicPerfil}
                isEditing={isEditing}
                onChangeText={setName}
                onPress={() => setIsEditing(true)}
              />
              {!publicPerfil && (
                <>
                  <InfoCard
                    label="Email"
                    value={email}
                    iconName="mail-outline"
                    editable={true}
                    isEditing={isEditing}
                    onChangeText={setEmail}
                onPress={() => setIsEditing(true)}
                  />
                  <InfoCard
                    label="Data de Nascimento"
                    value={birthDate}
                    iconName="calendar-outline"
                    editable={true}
                    isEditing={isEditing}
                    onChangeText={setBirthDate}
                onPress={() => setIsEditing(true)}
                  />
                  <InfoCard
                    label="Gênero"
                    value={gender}
                    iconName="body-outline"
                    editable={true}
                    isEditing={isEditing}
                    onChangeText={setGender}
                onPress={() => setIsEditing(true)}
                  />
                  <TouchableOpacity className="mt-4 p-4 rounded-xl bg-gray-100 flex-row items-center justify-between" onPress={()=> router.push('/(root)/(configTabs)/changePassword')}>
                    <Text className="font-JakartaBold text-base text-[#1456a7]">Mudar Senha</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#1456a7" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {activeTab === 'estatisticas' && (
            <View className="mt-8">
              <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Estatísticas e Conquistas</Text>
              <View className="flex-row justify-between mb-6">
                <View className="items-center p-4 rounded-xl bg-[#eef5ff] shadow-sm flex-1 mx-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">128</Text>
                  <Text className="text-gray-500 mt-1">Corridas</Text>
                </View>
                <View className="items-center p-4 rounded-xl bg-[#eef5ff] shadow-sm flex-1 mx-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">4.8</Text>
                  <Text className="text-gray-500 mt-1">Avaliação</Text>
                </View>
                <View className="items-center p-4 rounded-xl bg-[#eef5ff] shadow-sm flex-1 mx-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">3</Text>
                  <Text className="text-gray-500 mt-1">Anos Ativo</Text>
                </View>
              </View>
              <Text className="text-lg font-JakartaBold mb-2 text-[#1456a7]">Conquistas</Text>
              <View className="flex-row flex-wrap">
                <View className="bg-[#4598ff] rounded-full px-4 py-2 m-1">
                  <Text className="text-white font-JakartaMedium">⭐ Motorista 5 Estrelas</Text>
                </View>
                <View className="bg-[#4598ff] rounded-full px-4 py-2 m-1">
                  <Text className="text-white font-JakartaMedium">🚘 100+ Corridas</Text>
                </View>
              </View>
            </View>
          )}

          {/* Campos visíveis apenas no perfil público */}
          {publicPerfil && (
            <View className="mt-8">
              <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Estatísticas</Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">128</Text>
                  <Text className="text-gray-500">Corridas</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">4.8</Text>
                  <Text className="text-gray-500">Avaliação</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="font-JakartaBold text-xl text-[#1456a7]">3</Text>
                  <Text className="text-gray-500">Anos ativo</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botões Flutuantes (FAB) para Perfil Pessoal */}
        {!publicPerfil && (
          <View className="absolute bottom-5 right-5 z-50">
            {isEditing ? (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleDiscard}
                  className="bg-gray-200 p-4 rounded-full shadow-md  mb-[200px]"
                >
                  <Ionicons name="close-outline" size={24} color="#1456a7" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="bg-[#1456a7] p-4 rounded-full shadow-md  mb-[200px]"
                >
                  <Ionicons name="save-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-[#1456a7] p-4 rounded-full shadow-md mb-[200px]"
              >
                <Ionicons name="create-outline" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botão Flutuante (FAB) para Perfil Público */}
        {publicPerfil && (
          <TouchableOpacity
            onPress={() => {
              // Lógica para avaliar ou denunciar
            }}
            className="absolute bottom-5 right-5 z-50 bg-[#4598ff] p-4 rounded-full shadow-md"
          >
            <Ionicons name="star-outline" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Modals */}
        <ErrorModal
          isErrorVisible={showAccountTypeModal}
          title="Mudar tipo da conta?"
          errorMessage="Ao prosseguir, estará apto para usar as funções do tipo escolhido. Relaxa, você poderá voltar atrás."
          onClose={() => setShowAccountTypeModal(false)}
          icon={icons.question}
          iconStyle="w-[150px] h-[150px]"
          secondOption
          onFirstButtonPress={() => {
            router.push('/(root)/(tabs)/rides')
            setShowAccountTypeModal(false)
          }}
        />

        <ErrorModal
          isErrorVisible={showSaveModal}
          title="Deseja salvar as alterações?"
          errorMessage="Suas mudanças serão atualizadas no seu perfil."
          onClose={() => setShowSaveModal(false)}
          icon={icons.question}
          iconStyle="w-[150px] h-[150px]"
          secondOption
          onFirstButtonPress={() => {
            sendProfileUpdateToServer()
            setShowSaveModal(false)
          }}
        />
      </SafeAreaView>
    )
  }