import React, { useState } from 'react';
import {
  Image, StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  FontAwesome, Fontisto, MaterialCommunityIcons,
} from '@expo/vector-icons';
import delay from 'delay';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import Btn from './_components/Btn';
import Header from './_components/Header';
import {
  setData, setMessage, resetState, setBio,
} from '../redux/features/user';

const genders = [
  { key: 'man', value: 'Laki Laki' },
  { key: 'woman', value: 'Perempuan' },
  { key: 'anonym', value: 'Anonymous' },
];

function MessageView(props) {
  const { message } = props;
  const { error, success } = message;
  if (error) return <Text className="text-rose-700">{ error }</Text>;
  if (success) return <Text className="text-emerald-600">{ success }</Text>;
  return null;
}

function Profile(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [gender, setGender] = useState('anonym');

  // Handle press events.
  const press = {
    toHome() {
      navigation.navigate('Home');
    },

    async editPicture() {
      const url = '/api/auth/login';
      const body = user.data;
      console.log('edit profile');
    },

    async save() {
      const url = '/api/auth/login';
      const body = user.data;
      dispatch(setMessage({}));
      await axios.post(url, body).then(({ data }) => {
        dispatch(setMessage({ success: data.msg }));
        (async () => {
          await delay(600);
          navigation.navigate('Profile');
          dispatch(resetState());
        })();
      }).catch(({ response }) => {
        dispatch(setMessage({ error: response.data.msg }));
      });
      console.log('disimpan');
    },
  };

  return (

    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="bg-white h-screen">

          <Header title="Profile Saya" backTo="Home" navigation={navigation} />

          <View className="items-center">
            <View className="my-6">
              <View className="rounded-full border-orange-400" style={{ borderWidth: 6 }}>
                <Image className="w-36 h-36 rounded-full" source={require('../assets/image2.png')} />
              </View>
              <TouchableOpacity activeOpacity={0.8} className="bg-orange-500 absolute bottom-0 right-0 p-4 rounded-full" onPress={press.editPicture}>
                <FontAwesome name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-7 pt-4">

            <View className="flex-row rounded-md p-3 w-full items-center mb-5 bg-gray-100">
              <FontAwesome name="user" size={24} style={style.inputIcon} />
              <TextInput
                className="w-10/12 pl-4 placeholder:text-s placeholder:text-black"
                onChangeText={(value) => dispatch(setBio({ key: 'name', value }))}
                placeholder="Nama"
                value={user.data.name}
              />
            </View>

            <View className="flex-row relative z-10 rounded-md p-3 w-full items-center mb-5 bg-gray-100">
              <Fontisto name="transgender" size={24} style={style.inputIcon} />
              <SelectList
                data={user.data.gender}
                setSelected={(val) => setGender(val)}
                save="key"
                search={false}
                boxStyles={style.selectBox}
                dropdownStyles={style.selectDropdown}
                dropdownItemStyles={style.selectItem}
                defaultOption={user.data.gender}
                onSelect={() => dispatch(setBio({ key: 'gender', gender }))}
              />
            </View>

            <View className="flex-row rounded-md p-3 w-full items-center bg-gray-100">
              <MaterialCommunityIcons name="playlist-edit" size={24} style={style.inputIcon} />
              <TextInput
                className="w-10/12 pl-1 placeholder:text-s placeholder:text-black"
                placeholder="Bio"
                onChangeText={((value) => dispatch(setBio({ key: 'description', value })))}
                value={user.data.description}
              />
            </View>

            <Btn text="Simpan" click={press.save} />

          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  inputIcon: {
    color: '#C5C5C7',
    paddingHorizontal: 4,
  },
  selectBox: {
    borderWidth: 0,
    position: 'absolute',
    top: -22,
    left: -8,
    width: 280,
  },
  selectDropdown: {
    position: 'absolute',
    zIndex: 10,
    top: 18,
    left: -18,
    borderColor: '#E6E6E6',
    backgroundColor: '#F1F1F1',
    width: 280,
  },
  selectItem: {
    margin: 5,
    borderRadius: 4,
    backgroundColor: '#E6E6E6',
  },
});

export default Profile;
