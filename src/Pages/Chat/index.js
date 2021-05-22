import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { View, StatusBar, SafeAreaView, Text } from 'react-native';
import styles from './styles';
import { GiftedChat, Send, Bubble, Time } from 'react-native-gifted-chat'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconss from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from "@react-native-firebase/firestore"
import moment from "moment"
import { FlatList } from 'react-native-gesture-handler';
import { TextInput } from 'react-native';
export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const Title = props.route.params.Title;
    const credit = props.route.params.credit;
    const type = props.route.params.type;
    const distance = props.route.params.distance;
    const address = props.route.params.address;
    const Image = props.route.params.images;
    const spaceid = props.route.params.id
    const host = props.route.params.host
    const [TExt, setText] = useState('')
    const [uid, setuid] = useState('')
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            starterFunc()
        });
        return () => {
            unsubscribe;
        };
    }, [])
    async function starterFunc() {
        let token = await AsyncStorage.getItem('token');
        setuid(token)
        createChat()
    }
    async function createChat() {
        let token = await AsyncStorage.getItem('token');

        await firestore().collection('conversations').doc(token + '_' + spaceid).get().then(async (doc) => {
            if (doc.data()) {
                await firestore().collection('conversations').doc(token + '_' + spaceid).collection('message').onSnapshot(chats)
            }
            else {
                await firestore().collection('conversations').doc(token + '_' + spaceid).set({
                    chatContainIDs: [token, spaceid],
                    StartedByUser: {
                        StartedBy: token,
                        // StartedByName: Name,
                        profilePic: ''
                    },
                    StartedWithUser: {
                        StartedWith: spaceid,
                        reciverName: props.route.params.host,
                        profilePic: Image
                    },
                    creatorID: token + '_' + spaceid,
                    lastMsg: {},
                    createdTime: firestore.FieldValue.serverTimestamp(),

                }, { merge: true }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            }
        })
    }
    const chats = async (querySnapshot) => {
        var source = querySnapshot.metadata.hasPendingWrites ? "Local" : 'Server'
        console.log(source)
        let data = []

        if (source == 'Local') return;
        else
            querySnapshot.docChanges().forEach((changes) => {
                console.log(changes, 'dadasd')
                data.push(changes.doc.data())
            })
        setMessages(data)
    }

    const onSend = async () => {
        let token = await AsyncStorage.getItem('token');
        let idd = new Date().getTime().toString()
        let idea = token + '_' + spaceid
        let jsonobject = {
            addedby: token,
            reciver: spaceid,
            message: TExt,
            reciverName: host,
            createdAt: new Date(),
            createdTime: moment().format('hh:mm'),
            messageid: idd
        }
        let t = [...messages]
        t.push(jsonobject)
        setMessages(t)
        setText('')
        let temp;
        try {
            await firestore().collection('conversations').doc(idea).collection('message').doc(idd).set(jsonobject)
            await firestore().collection('conversations').doc(idea).get().then((doc) => {
                if (doc.exists) {
                    temp = doc.data()
                } else {
                    console.log('No document found!');
                }
            })
            temp.lastMsg = jsonobject
            await firestore().collection('conversations').doc(idea).set(temp
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Fragment>
            <StatusBar barStyle={'dark-content'} backgroundColor='white' />
            <SafeAreaView
                style={(styles.container, { backgroundColor: 'white' })}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.headerView}>
                    <Icons.Button name='left' size={26} backgroundColor='white' color='black' ></Icons.Button>
                    <View style={styles.userView}>
                        <Icon name='user-circle' size={40} color='#C8C7CC' />

                    </View>
                    <View style={styles.statusView}>
                        <Text style={styles.nameTXT}>{host}</Text>
                        {/* <Text style={styles.statusTXT}>Active Now</Text> */}
                    </View>
                    <View style={styles.iconView}>
                        <Icon.Button name='phone' backgroundColor='white' color='black' />
                        <Icon.Button name='video-camera' backgroundColor='white' color='black' />
                    </View>

                </View>
                <View style={styles.mainViewContainer}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => {
                            return (
                                <View style={item.addedby == uid ? styles.mainChatView : styles.leftChatView}>
                                    <View style={item.addedby == uid ? styles.innerChatView : styles.leftinnerChatView}>
                                        <Text style={item.addedby != uid ? styles.textMsg : styles.RightextMsg}>{item.message}</Text>

                                    </View>
                                    <Text style={styles.time}>{item.createdTime}</Text>

                                </View>
                            )
                        }}
                    />
                    <View style={styles.inputView}>
                        <Iconss name='pluscircle' size={26} color='#ee737f' />
                        <TextInput
                            placeholder='Write Message'
                            style={styles.inputStyles}
                            onChangeText={(val) => {
                                setText(val)
                            }}
                            value={TExt}
                        />
                        <FontAwesome name='send' size={20} color='#ee737f' onPress={() => { onSend() }} />
                    </View>
                    {/* <GiftedChat
                        messages={messages}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: uid,
                        }}
                        placeholder='Write a message'
                        renderAvatar={() => null}
                        renderSend={(props) => {
                            return (
                                <Send
                                    {...props}
                                    containerStyle={{
                                        height: 50,
                                        width: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FontAwesome name='send' size={20} color='#ee737f' />

                                </Send>
                            )
                        }}
                        alwaysShowSend={true}
                        renderBubble={(props) => {
                            return (
                                <Bubble
                                    {...props}
                                    wrapperStyle={{
                                        left: styles.bubbleLeft,
                                        right: styles.bubbleRight
                                    }}
                                />

                            );
                        }}
                        renderTime={(props) => {
                            return (
                                <Time
                                    {...props}

                                />
                            )
                        }}
                    /> */}
                </View>
            </SafeAreaView>
            <SafeAreaView style={{ backgroundColor: 'white' }} />
        </Fragment>
    );
}