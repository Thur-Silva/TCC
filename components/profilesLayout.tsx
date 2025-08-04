import { icons } from '@/constants'
import { fetchAPI } from '@/lib/fecth'
import { Ionicons } from '@expo/vector-icons'
import InfoCard from 'components/infoCard'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ErrorModal from './ErrorModal'

type ProfileLayoutProps = {
  userName: string
  userEmail: string
  userImageUrl: string
  userBirthDate: string
  userGender: string
  userBio: string
  clerkId: string
  onSave: () => void
  publicPerfil?: boolean
}

const GENDERS = ['Masculino', 'Feminino', 'Prefiro não informar']

export default function ProfileLayout({
  userName,
  userEmail,
  userImageUrl,
  userBirthDate,
  userGender,
  userBio,
  clerkId,
  onSave,
  publicPerfil,
}: ProfileLayoutProps) {
  const [name, setName] = useState(userName || '')
  const [email, setEmail] = useState(userEmail || '')
  const [birthDate, setBirthDate] = useState(userBirthDate || '')
  const [displayBirthDate, setDisplayBirthDate] = useState(userBirthDate ? userBirthDate.replace(/-/g, '/') : '')
  const [gender, setGender] = useState(userGender || '')
  const [bio, setBio] = useState(userBio || '')
  const [profileImage, setProfileImage] = useState(userImageUrl || '')
  const [activeTab, setActiveTab] = useState('pessoal')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)
  const [showDriverModeModal, setShowDriverModeModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showGenderModal, setShowGenderModal] = useState(false)

  const originalData = {
    name: userName || '',
    email: userEmail || '',
    birthDate: userBirthDate || '',
    gender: userGender || '',
    bio: userBio || '',
    profileImage: userImageUrl || '',
  }

  const isChanged =
    name !== originalData.name ||
    birthDate !== originalData.birthDate ||
    gender !== originalData.gender ||
    bio !== originalData.bio ||
    profileImage !== originalData.profileImage

  // Função para validar email
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Função para validar data de nascimento
  function isValidBirthDate(dateString: string): boolean {
    if (!dateString || dateString.trim() === '') return true
    
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = dateString.match(dateRegex)
    if (!match) return false
    
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)

    const date = new Date(year, month - 1, day)
    const today = new Date()

    return date instanceof Date && !isNaN(date.getTime()) && date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year && date <= today
  }

  // Função para formatar data para o padrão PostgreSQL (YYYY-MM-DD)
  function formatDateForDB(dateString: string): string | null {
    if (!dateString || dateString.trim() === '') return null
    
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  function isValidName(name: string): boolean {
    return !!name && name.trim().length >= 2 && name.trim().length <= 100
  }

  // Função para validar bio
  function isValidBio(bio: string): boolean {
    return !bio || bio.length <= 500
  }

  // Função para validar gênero
  function isValidGender(gender: string): boolean {
    if (!gender || gender.trim() === '') return true
    return GENDERS.map(g => g.toLowerCase()).includes(gender.toLowerCase())
  }
  
  // NOVA FUNÇÃO: Lidar com a entrada da data
  function handleBirthDateChange(text: string) {
    let rawText = text.replace(/[^0-9]/g, '')
    
    if (rawText.length > 8) rawText = rawText.substring(0, 8)
    
    if (rawText.length > 4) rawText = `${rawText.substring(0, 2)}/${rawText.substring(2, 4)}/${rawText.substring(4)}`
    else if (rawText.length > 2) rawText = `${rawText.substring(0, 2)}/${rawText.substring(2)}`

    setDisplayBirthDate(rawText)
    
    if (rawText.length === 10) {
      setBirthDate(rawText)
    } else {
      setBirthDate('')
    }
  }

  function handleSave() {
    if (isChanged) {
      // Validações
      if (!isValidName(name)) {
        setErrorMessage('Nome deve ter entre 2 e 100 caracteres.')
        setShowErrorModal(true)
        return
      }

      if (birthDate && !isValidBirthDate(birthDate)) {
        setErrorMessage('Data de nascimento inválida. Use o formato DD/MM/YYYY.')
        setShowErrorModal(true)
        return
      }

      if (!isValidBio(bio)) {
        setErrorMessage('Bio deve ter no máximo 500 caracteres.')
        setShowErrorModal(true)
        return
      }

      if (gender && !isValidGender(gender)) {
        setErrorMessage('Gênero inválido. Escolha uma das opções.')
        setShowErrorModal(true)
        return
      }

      setShowSaveModal(true)
    }
  }

  function handleDiscard() {
    setName(originalData.name || '')
    setEmail(originalData.email || '')
    setBirthDate(originalData.birthDate || '')
    setDisplayBirthDate(originalData.birthDate ? originalData.birthDate.replace(/-/g, '/') : '')
    setGender(originalData.gender || '')
    setBio(originalData.bio || '')
    setProfileImage(originalData.profileImage || '')
    setIsEditing(false)
  }

  async function handleImagePicker() {
    if (publicPerfil) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      })

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0]
        
        if (selectedImage.base64) {
          const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`
          setProfileImage(base64Image)
          setIsEditing(true)
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error)
      setErrorMessage('Não foi possível selecionar a imagem.')
      setShowErrorModal(true)
    }
  }

  async function sendProfileUpdateToServer() {
    if (!clerkId) {
      setErrorMessage('ID do usuário não encontrado.')
      setShowErrorModal(true)
      return
    }

    try {
      setIsLoading(true)
      
      const updates: Record<string, any> = {}
      
      if (name !== originalData.name) {
        if (!isValidName(name)) {
          throw new Error('Nome inválido')
        }
        updates.name = name.trim()
      }
      
      if (birthDate !== originalData.birthDate) {
        if (birthDate && !isValidBirthDate(birthDate)) {
          throw new Error('Data de nascimento inválida')
        }
        const formattedDate = formatDateForDB(birthDate)
        if (formattedDate) {
          updates.birth_date = formattedDate
        } else if (!birthDate) {
          updates.birth_date = null
        }
      }
      
      if (gender !== originalData.gender) {
        if (!isValidGender(gender)) {
          throw new Error('Gênero inválido')
        }
        updates.gender = gender.trim().toLowerCase()
      }
      
      if (bio !== originalData.bio) {
        if (!isValidBio(bio)) {
          throw new Error('Bio muito longa')
        }
        updates.bio = bio.trim()
      }
      
      if (profileImage !== originalData.profileImage) {
        updates.profile_img = profileImage
      }

      if (Object.keys(updates).length === 0) {
        setIsEditing(false)
        return
      }

      console.log('Enviando atualizações:', updates)

      const response = await fetchAPI(`/(api)/user?clerkId=${clerkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      console.log('Resposta da API:', response)
      
      onSave()
      setIsEditing(false)
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar perfil'
      setErrorMessage(`Não foi possível salvar as alterações: ${errorMessage}`)
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  function confirmDriverMode() {
    setShowDriverModeModal(false)
    router.push({ pathname: '/(root)/(configTabs)/driverRegistration' })
  }

  return (
    <SafeAreaView className={`flex-1 bg-white pb-[200px] ${publicPerfil ? 'pt-10' : 'pt-[150px]'}`}>
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header e Avatar */}
        <View className="items-center mt-5 mb-8">
          {publicPerfil && (
            <TouchableOpacity 
              className="absolute left-0 top-0 mt-5 ml-5"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={32} color="#1456a7" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            className="w-[150px] h-[150px] self-center relative mb-4"
            onPress={handleImagePicker}
            disabled={publicPerfil}
          >
            <Image
              source={profileImage ? { uri: profileImage } : icons.defaultUser}
              className="w-full h-full rounded-full border-[3px] border-[#1456a7]"
              resizeMode="cover"
            />
            {!publicPerfil && (
              <View className="absolute bottom-0 right-0 bg-[#4598ff] rounded-full p-2 border-2 border-white">
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <Text className="font-JakartaBold text-3xl text-[#1456a7]">{name}</Text>
          {publicPerfil && (
            <Text className="text-base font-JakartaMedium text-gray-600 mt-1">
              @{name.toLowerCase().replace(/\s/g, '')}
            </Text>
          )}

          {/* Layout para a Bio */}
          {(!publicPerfil || (publicPerfil && bio)) && (
            <TouchableOpacity
              className="w-full px-5 mt-4"
              onPress={() => !publicPerfil && setIsEditing(true)}
              activeOpacity={1}
              disabled={publicPerfil}
            >
              <Text className="font-JakartaBold text-lg text-[#1456a7] mb-2">Bio</Text>
              <TextInput
                className={`bg-gray-100 p-4 rounded-xl text-base font-JakartaMedium text-[#1456a7] min-h-[100px] ${
                  isEditing ? 'border-2 border-[#4598ff]' : ''
                }`}
                value={bio || ''}
                onChangeText={(text) => setBio(text || '')}
                multiline={true}
                editable={isEditing && !publicPerfil}
                placeholder="Escreva algo sobre você..."
                placeholderTextColor="#A0A0A0"
                maxLength={500}
              />
              {isEditing && (
                <Text className="text-gray-400 text-sm mt-1 text-right">
                  {(bio || '').length}/500 caracteres
                </Text>
              )}
            </TouchableOpacity>
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
                  editable={false} // Campo inalterável
                  isEditing={false}
                  onChangeText={setEmail}
                  containerClassName="bg-gray-200" // Estilo para campo desabilitado
                  onPress={() => {}}
                />
                
                {/* Campo de Data de Nascimento com nova lógica */}
                <InfoCard
                  label="Data de Nascimento"
                  value={displayBirthDate}
                  iconName="calendar-outline"
                  editable={true}
                  isEditing={isEditing}
                  onChangeText={handleBirthDateChange}
                  onPress={() => setIsEditing(true)}
                  placeholder="DD/MM/YYYY"
                  keyboardType="numeric"
                  maxLength={10}
                />
                
                {/* Campo de Gênero com Modal de Seleção SEM depender do modo de edição */}
                <InfoCard
                  label="Gênero"
                  value={gender}
                  iconName="body-outline"
                  editable={true} // Mantém o campo clicável
                  isEditing={false} // Mantém o input de texto desabilitado
                  onPress={() => {
                    // Ação de abrir o modal é a única permitida neste campo
                    if (!publicPerfil) {
                      setShowGenderModal(true)
                    }
                  }} 
                />
                
                <TouchableOpacity
                  className="mt-4 p-4 rounded-xl bg-gray-100 flex-row items-center justify-between"
                  onPress={() => router.push('/(root)/(configTabs)/changePassword')}
                >
                  <Text className="font-JakartaBold text-base text-[#1456a7]">Mudar Senha</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color="#1456a7" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-4 p-4 rounded-xl bg-gray-100 flex-row items-center justify-between"
                  onPress={() => setShowDriverModeModal(true)}
                >
                  <Text className="font-JakartaBold text-base text-[#1456a7]">Ativar Modo Motorista</Text>
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
                className="bg-gray-200 p-4 rounded-full shadow-md mb-[200px]"
                disabled={isLoading}
              >
                <Ionicons name="close-outline" size={24} color="#1456a7" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className={`${isChanged ? 'bg-[#1456a7]' : 'bg-gray-400'} p-4 rounded-full shadow-md mb-[200px]`}
                disabled={!isChanged || isLoading}
              >
                <Ionicons 
                  name={isLoading ? "hourglass-outline" : "save-outline"} 
                  size={24} 
                  color="white" 
                />
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
          router.push('/')
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
        firstButtonText={isLoading ? "Salvando..." : "Salvar"}
      />

      <ErrorModal
        isErrorVisible={showDriverModeModal}
        title="Ativar Modo Motorista?"
        errorMessage="Para ativar o modo motorista, é necessário fornecer algumas informações adicionais e do seu veículo."
        onClose={() => setShowDriverModeModal(false)}
        firstButtonText="Continuar"
        onFirstButtonPress={confirmDriverMode}
        secondButtonText="Cancelar"
        onSecondButtonPress={() => setShowDriverModeModal(false)}
        icon={icons.question}
        secondOption
      />

      <ErrorModal
        isErrorVisible={showErrorModal}
        title="Erro de Validação"
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
        iconStyle="w-[110px] h-[110px]"
      />

      {/* Modal de Seleção de Gênero */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGenderModal}
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-3/4 shadow-lg">
            <Text className="text-xl font-JakartaBold mb-4 text-[#1456a7] text-center">Selecione o Gênero</Text>
            {GENDERS.map((item) => (
              <Pressable
                key={item}
                className={`py-3 px-4 my-1 rounded-lg ${gender.toLowerCase() === item.toLowerCase() ? 'bg-[#1456a7]' : 'bg-gray-100'}`}
                onPress={() => {
                  setGender(item)
                  setShowGenderModal(false)
                  setIsEditing(true) // Adiciona essa linha para entrar no modo de edição ao selecionar
                }}
              >
                <Text className={`text-center font-JakartaMedium text-base ${gender.toLowerCase() === item.toLowerCase() ? 'text-white' : 'text-[#1456a7]'}`}>
                  {item}
                </Text>
              </Pressable>
            ))}
            <Pressable
              className="mt-4 py-3 px-4 rounded-lg bg-gray-200"
              onPress={() => setShowGenderModal(false)}
            >
              <Text className="text-center font-JakartaBold text-base text-[#1456a7]">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}