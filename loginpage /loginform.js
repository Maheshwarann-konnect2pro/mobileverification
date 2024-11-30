import { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import axios from "axios";
import { Alert } from "react-native";

export default function LoginForm({navigation}) {
    const [code, setCode] = useState();
    const [phonenumber, setPhone] = useState();
    const [profilename, setProfile] = useState();
    // const [userOtp, setUserOtp] = useState(["", "", "", ""]); // Array to store user-entered OTP
    const [Incorrect,setcorrect] = useState(false);
    const [userOtp, setUserOtp] = useState(Array(4).fill(""));
    const [isOtpSent, setIsOtpSent] = useState(false);

    async function handleNumber() {
        if (!phonenumber || !profilename) {
            Alert.alert("fill all columns");
            return;
        }
        if(phonenumber.length !== 10 || isNaN(phonenumber)){
            Alert.alert("enter a valid phone number");
            return;
        }
        try {
            const response = await axios.post("http://192.168.190.233:5000/submit", { profilename, phonenumber });
            if (response.data.message=="otp sent successfully") {
                setIsOtpSent(true);
                Alert.alert("otp sent successfully");
            }
        } catch (error) {
            console.log("Error occurred while connecting to API:", error.response?.data || error.message);
        }
    }

    async function handleVerify() {
        const enteredOtp = userOtp.join(""); // Combine user-entered digits into a single string
        try{
            const responce=await axios.post("http://192.168.190.233:5000/verify", { profilename, phonenumber,enteredOtp});

            if(responce.data.message=="user profile verified successfully"){
                Alert.alert("otp verified successfully ");
                navigation.replace("Login")
                setcorrect(false);
            }else{
                Alert.alert("otp verification failed,please try again");
                setcorrect(true);
            }
        }
        catch(error){
            Alert.alert("otp verification failed ,please try again");
            console.error(`error verifing otp ${error}`);
        }
    
    }

    return (
        <View style={styles.main}>
            <Text style={styles.heading}>Login</Text>
            <View style={styles.form}>
                <TextInput style={styles.name} placeholder="Name" onChangeText={setProfile}></TextInput>
                <TextInput
                    style={styles.name}
                    placeholder="Phone Number"
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                ></TextInput>
                <TouchableOpacity style={styles.submit} onPress={handleNumber}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
            {isOtpSent && (
                <View style={styles.maincode}> 
                    <View style={styles.codeContainer}>
                        {userOtp.map((digit, index) => (
                            <TextInput
                                style={styles.codeBox}
                                key={index}
                                maxLength={1}
                                keyboardType="numeric"
                                value={digit}
                                onChangeText={(text) => {
                                    const newOtp = [...userOtp];
                                    newOtp[index] = text;
                                    setUserOtp(newOtp);
                                  }}
                            />
                        ))}
                    </View>
                    {Incorrect && <Text style={styles.errorText}>enter correct otp</Text>}
                    <TouchableOpacity style={styles.verify} onPress={handleVerify}>
                        <Text style={styles.verifyText}>Verify OTP</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        paddingTop: 100,
        alignItems: "center",
        flex: 1,
        backgroundColor: "white",
        width:'100%',
    },
    heading: {
        color: "orangered",
        fontSize: 40,
    },
    form: {
        width: "100%",
        padding: 20,
        paddingTop: 70,
        gap: 20,
    },
    name: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        borderColor: "#C1C3D1",
        padding: 10,
    },
    submit: {
        height: 40,
        justifyContent: "center",
        backgroundColor: "green",
    },
    submitText: {
        color: "white",
        textAlign: "center",
    },
    maincode:{
        alignItems:"center",
    },
    codeContainer: {
        flexDirection: "row",
        gap: 10,
        paddingTop: 20,
        paddingBottom: 20,
        alignContent: "center",
    },
    codeBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#C1C3D1",
        textAlign: "center",
        fontSize: 20,
    },
    verify: {
        height: 40,
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 20,
        width:'70%',
    },
    verifyText: {
        color: "white",
        paddingLeft:30,
        paddingRight:30,
    },
    errorText:{
        color:'red',

    }
});
