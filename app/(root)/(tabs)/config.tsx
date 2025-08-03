import ErrorModal from '@/components/ErrorModal';
import HomeHeader from '@/components/HomeHeader';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

// Componente para um item de configuração com ícone e texto
const ConfigItem = ({
    label,
    value,
    onPress,
    iconName,
    isDestructive = false,
    showChevron = true,
}: {
    label: string;
    value?: string;
    onPress?: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    isDestructive?: boolean;
    showChevron?: boolean;
}) => (
    <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center justify-between p-4 mb-2 rounded-xl ${
            isDestructive ? 'bg-red-50' : 'bg-[#eef5ff]'
        }`}
    >
        <View className="flex-row items-center flex-1">
            <Ionicons name={iconName} size={24} color={isDestructive ? '#dc2626' : '#1456a7'} />
            <View className="ml-4 flex-1">
                <Text
                    className={`text-lg font-JakartaSemiBold ${
                        isDestructive ? 'text-red-600' : 'text-[#1456a7]'
                    }`}
                >
                    {label}
                </Text>
                {value && (
                    <Text className="text-sm font-JakartaRegular text-gray-500 mt-1">
                        {value}
                    </Text>
                )}
            </View>
        </View>
        {showChevron && (
            <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={isDestructive ? '#dc2626' : '#4598ff'}
            />
        )}
    </TouchableOpacity>
);

// Componente para um item de configuração com switch
const ConfigSwitch = ({
    label,
    value,
    onValueChange,
    iconName,
    description,
}: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    iconName: keyof typeof Ionicons.glyphMap;
    description?: string;
}) => (
    <View className="flex-row items-center justify-between p-4 mb-2 rounded-xl bg-[#eef5ff]">
        <View className="flex-row items-center flex-1">
            <Ionicons name={iconName} size={24} color="#1456a7" />
            <View className="ml-4 flex-1">
                <Text className="text-lg font-JakartaSemiBold text-[#1456a7]">{label}</Text>
                {description && (
                    <Text className="text-sm font-JakartaRegular text-gray-500 mt-1">
                        {description}
                    </Text>
                )}
            </View>
        </View>
        <Switch
            onValueChange={onValueChange}
            value={value}
            trackColor={{ false: '#767577', true: '#4598ff' }}
            thumbColor={value ? '#f4f3f4' : '#f4f3f4'}
        />
    </View>
);

export default function ConfigScreen() {
    const { signOut } = useAuth();
    const { user } = useUser();
    
    // Removendo estados e funções de módulos ausentes
    const [enableDriverMode, setEnableDriverMode] = useState(false);
    const [messageSound, setMessageSound] = useState(true);
    const [syncMessages, setSyncMessages] = useState(true);
    const [enableOfflineMode, setEnableOfflineMode] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showClearCacheModal, setShowClearCacheModal] = useState(false);
    const [storageUsage, setStorageUsage] = useState('0 KB');
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected !== null ? state.isConnected : false);
        });

        // A simulação de uso do cache agora é um valor estático, já que as funções de cache não existem
        setStorageUsage('128 KB');

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        signOut();
            router.replace('/sign-in'); // é importante usar o replace 2x para evitar que o usuário volte para a tela de home após sair
          setTimeout(() => {
            router.replace('/sign-in');
        }, 100);
    };

    const handleClearCache = async () => {
        setShowClearCacheModal(true);
    };

    const confirmClearCache = async () => {
        // As funções de cache foram removidas, então esta função não faz nada.
        // setStorageUsage('0 KB'); // Simula a limpeza
        setShowClearCacheModal(false);
    }
    
    return (
        <SafeAreaView className="flex-1 bg-white mb-[100px]">
            <HomeHeader showInput={true} globalClassName='mt-14' />

            <ScrollView
                className="px-5 pt-8"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-3xl font-JakartaExtraBold text-[#1456a7] mb-8">
                    Configurações
                </Text>

                {/* Seção da Conta */}
                <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Conta</Text>
                <ConfigItem
                    label="E-mail"
                    value={user?.primaryEmailAddress?.emailAddress}
                    iconName="mail-outline"
                    showChevron={false}
                />
                <ConfigItem
                    label="Alterar Senha"
                    onPress={() => router.push({ pathname: '/(root)/(configTabs)/changePassword' })}
                    iconName="lock-closed-outline"
                />
                <ConfigItem
                    label="Sair"
                    onPress={handleLogout}
                    iconName="log-out-outline"
                    isDestructive
                />
                
                {/* Seção de Preferências */}
                <Text className="text-2xl font-JakartaBold mt-8 mb-4 text-[#1456a7]">
                    Preferências
                </Text>
                <ConfigSwitch
                    label="Modo Motorista"
                    description="Alterna entre perfil de passageiro e motorista."
                    iconName="car-sport-outline"
                    value={enableDriverMode}
                    onValueChange={setEnableDriverMode}
                />
                 <ConfigSwitch
                    label="Sons de Mensagem"
                    description="Reproduz sons para novas mensagens."
                    iconName="volume-medium-outline"
                    value={messageSound}
                    onValueChange={setMessageSound}
                />
                <ConfigSwitch
                    label="Sincronização de Chats"
                    description="Sincroniza automaticamente suas conversas."
                    iconName="cloud-upload-outline"
                    value={syncMessages}
                    onValueChange={setSyncMessages}
                />
                <ConfigItem
                    label="Limpar Cache de Chats"
                    onPress={() => {}} // Função removida
                    iconName="chatbox-ellipses-outline"
                />

                {/* Seção de Dados e Armazenamento */}
                <Text className="text-2xl font-JakartaBold mt-8 mb-4 text-[#1456a7]">
                    Armazenamento e Cache
                </Text>
                <ConfigItem
                    label="Uso de Armazenamento"
                    value={storageUsage}
                    iconName="server-outline"
                    showChevron={false}
                />
                <ConfigItem
                    label="Limpar Todo o Cache"
                    onPress={handleClearCache}
                    iconName="trash-outline"
                    isDestructive
                />
                
                {/* Seção de Sistema */}
                <Text className="text-2xl font-JakartaBold mt-8 mb-4 text-[#1456a7]">Sistema</Text>
                <ConfigItem
                    label="Versão do Aplicativo"
                    value={Constants.expoConfig?.version}
                    iconName="information-circle-outline"
                    showChevron={false}
                />
                <ConfigItem
                    label="Status da Rede"
                    value={isOnline ? 'Online' : 'Offline'}
                    iconName={isOnline ? 'wifi-outline' : 'warning-outline'}
                    showChevron={false}
                />
                <ConfigSwitch
                    label="Modo Offline"
                    description="Desativa a sincronização automática em redes móveis."
                    iconName="cellular-outline"
                    value={enableOfflineMode}
                    onValueChange={setEnableOfflineMode}
                />

                {/* Seção de Suporte */}
                <Text className="text-2xl font-JakartaBold mt-8 mb-4 text-[#1456a7]">Suporte</Text>
                <ConfigItem
                    label="Fale Conosco"
                    onPress={() => {}} // Lógica para abrir e-mail ou chat de suporte
                    iconName="help-circle-outline"
                />
                <ConfigItem
                    label="Política de Privacidade"
                    onPress={() => {}} // Lógica para abrir link
                    iconName="document-text-outline"
                />
                <ConfigItem
                    label="Termos de Uso"
                    onPress={() => {}} // Lógica para abrir link
                    iconName="reader-outline"
                />
            </ScrollView>
            
            {/* Modals */}
            <ErrorModal
                isErrorVisible={showLogoutModal}
                title="Deseja mesmo sair?"
                errorMessage="Você precisará fazer login novamente para acessar sua conta."
                onClose={() => setShowLogoutModal(false)}
                firstButtonText="Sair"
                onFirstButtonPress={confirmLogout}
                secondOption
            />
            <ErrorModal
                isErrorVisible={showClearCacheModal}
                title="Limpar todo o cache?"
                errorMessage="Isso apagará dados de chats e corridas salvos localmente. A ação não pode ser desfeita."
                onClose={() => setShowClearCacheModal(false)}
                firstButtonText="Limpar Cache"
                onFirstButtonPress={confirmClearCache}
                secondOption
            />
        </SafeAreaView>
    );
}