import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Login() {
    const [Data,setdata]=useState();

    useEffect(()=>{
        async function Load(){
            try{
                const responce= await axios.get("http://192.168.190.233:5000/data");
                if(responce){
                    console.log(responce.data);
                    setdata(responce.data);
                }else{
                    console.log("eror occured");
                }
            }
            catch(error){
                console.error(error);
            }
        }
        Load();
    },[])
    return (
        <View style={styles.container}>
        <Text>{Data}</Text>
        <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
