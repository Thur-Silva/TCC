import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriveStore } from "@/store";
import { router } from "expo-router";
import { FlatList, View } from "react-native";

const ConfirmRide =()=>{
    
    const { drivers, selectedDriver, setSelectedDriver } = useDriveStore();

    return(
        <RideLayout title="Escolha um motorista" snapPoints={['65%', '85%']}>
            <FlatList data={drivers} renderItem={({item})=>(
                <DriverCard selected={selectedDriver!} setSelected={()=>setSelectedDriver(Number(item.id)!)} item={item}/>
            )}
            ListFooterComponent={()=>(
                <View className="mx-5 mt-5">
                    <CustomButton
                        title="Selecionar"
                       onPress={()=>router.push('/(root)/book-ride')}
                    />
                </View>
            )}
            />
        </RideLayout>
    );

};

export default ConfirmRide;