import React, { useState, Fragment } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Text, Input, colors } from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome';
import { styling } from './styling';
import auth from '@react-native-firebase/auth';
import PhoneInput from 'react-native-phone-input';
import { wp, hp } from '../../Global/Styles/Scalling';
import InputF from '../../Component/InputField/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from '../../../i18n/I18n';

const Signup = (props) => {
    const [Names, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [check, setcheck] = useState(false)
    const [emailError, seterrEmail] = useState(false);
    const [passError, seterrPass] = useState(false);
    const [nameError, seterrName] = useState(false);
    const [phoneError, seterrPhone] = useState(false);
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const Signin = () => {
        auth()
            .createUserWithEmailAndPassword(Email, Password)
            .then((userCredentials) => {
                userCredentials.user.updateProfile({
                    displayName: Names,

                })
                AsyncStorage.setItem('token', JSON.stringify(userCredentials.user.uid))

                props.navigation.navigate('VerfiyCode', { Phone: phone, props: props, Email: Email, Password: Password, uid: userCredentials.user.uid })
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    {
                        seterrEmail('Email already registered')
                        seterrName('')
                        seterrPass('')
                    }
                }
                if (error.code === 'auth/invalid-email') {
                    {
                        seterrEmail('Enter valid email')
                    }
                }
                console.error(error);
            });
    }
    const checkField = () => {
        if (Email == '') { seterrEmail('Enter Email') }
        if (Password == '') { seterrPass('Enter Password') }
        if (Names == '') { seterrName('Enter Name') }
        if (phone == '') { seterrPhone('true') }
        if (Email != '' && Password != '' && Names != '' && phone != '') {
            Signin()
        }
    }

    return (
        <Fragment>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
            <SafeAreaView backgroundColor='white' />
            <SafeAreaView style={styling.safeContainer} >
                <ScrollView>

                    <View style={styling.mainContainer}>

                        <View style={styling.innerContainer}>
                            <View style={styling.headerView}>

                                <View style={styling.welcomeView}>
                                    <Text style={styling.welcomeLabel}>{I18n.t('Welcome')} </Text>
                                    <Text style={styling.welcomeLabel}>{I18n.t('User')} </Text>
                                </View>
                                <View style={styling.signupHeader}>
                                    <Text style={styling.siguplabel}>{I18n.t('SignupContinure')}</Text>
                                </View>
                            </View>
                            <View style={styling.avatarView}>
                            </View>
                        </View>
                        <View style={styling.formView}>
                            <InputF
                                label={I18n.t('Name')}
                                placeholder={I18n.t('Name')}
                                onChange={(val) => {
                                    setName(val)
                                    console.log(val)
                                    if (val == '') {
                                        seterrName(true)
                                    }
                                    else seterrName(false)
                                }}
                                value={Names}
                                errName={nameError}
                            />

                            <InputF
                                label={I18n.t('Email')}
                                placeholder='abc@gmail.com'
                                onChange={(val) => {
                                    setEmail(val)
                                    console.log(val)
                                    {
                                        reg.test(Email) ? seterrEmail(false) : seterrEmail(true)
                                    }
                                }}
                                value={Email}
                                errorEmail={emailError}

                            />
                            <Text style={styling.inputLabel}>Phone Number</Text>

                            <PhoneInput
                                style={{
                                    width: wp(85), height: hp(8), borderBottomWidth: 0.5, borderColor: 'grey'
                                    , alignSelf: 'center'
                                }}
                                onChangePhoneNumber={(val) => setPhone(val)}
                            />
                            {phoneError && <Text style={{
                                color: 'red',
                                marginTop: hp(0.3),
                                fontSize: wp(3), marginHorizontal: wp(4)
                            }}>Enter Valid Number</Text>}
                            <InputF
                                label={I18n.t('Password')}
                                placeholder={I18n.t('Password')}
                                onChange={(val) => {
                                    setPassword(val)
                                    console.log(val)
                                    if (val == '') {
                                        seterrPass(true)
                                    }
                                    else seterrPass(false)
                                }}
                                value={Password}
                                errName={passError}
                                secureTextEntry
                            />
                        </View>
                        <View style={styling.checkView}>
                            <Icons name='check-circle' size={20}
                                onPress={() => {
                                    if (check == false) {
                                        setcheck(true)
                                    }
                                    else setcheck(false)
                                }}
                                color={check ? '#4CD964' : 'black'}
                            />
                            <Text style={styling.agreeTXT}>  {I18n.t('agreeto')}</Text>
                            <TouchableOpacity>
                                <Text style={styling.termsTXT}> {I18n.t('termscondition')}</Text>

                            </TouchableOpacity>
                        </View>
                        <View style={styling.signupView}>
                            <TouchableOpacity style={styling.signupOpacity} onPress={() => {
                                checkField()
                            }}>
                                <Text style={styling.signupText}>{I18n.t('SignUp')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styling.signinView}>
                            <Text style={styling.signinTXT}>{I18n.t('HaveAccount')} </Text>
                            <TouchableOpacity onPress={() => { props.navigation.navigate('LoginScreen') }}>
                                <Text style={styling.opacitysigninTXT}>{I18n.t('SignIn')}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>

            </SafeAreaView>
            <SafeAreaView style={{ backgroundColor: 'white' }} />

        </Fragment>
    )
}

export default Signup;