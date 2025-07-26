import CustomButton from "./CustomButton";

const Payment = ()=>{

    const onPaymentSheet = async ()=>{

    }; 
    return(
        <>
            <CustomButton
            title='Aceitar Corrida'
            className="my-10"
            onPress={onPaymentSheet}
            />
        </>
    );
};

export default Payment;