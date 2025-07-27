import ProfileLayout from "@/components/profilesLayout";
import { SafeAreaView } from "react-native-safe-area-context";
const Profile = () => {
    return(
        <SafeAreaView>
            <ProfileLayout
                userName="John Doe"
                userEmail=""
                userImageUrl="https://example.com/image.jpg"
                userBirthDate="1990-01-01"
                userCountry="USA"
                onSave={() => {}}
                userGender=""
            />
        </SafeAreaView>
    );
};

export default Profile;