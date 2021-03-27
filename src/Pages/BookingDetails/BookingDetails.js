import React, { Fragment, useEffect, useState } from 'react';
import { View, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from 'react-native-elements';
import { styling } from './styling';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconss from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AlertCancel } from '../../Component/Modal/index';
const BookingDetails = ({ route }) => {
    const Datee = route.params.Date
    const Time = route.params.Time
    const props = route.params.props;
    const Title = route.params.Title;
    const credit = route.params.credit;
    const type = route.params.type;
    const distance = route.params.distance;
    const address = route.params.address;
    const bookID = route.params.bookID
    const name = route.params.name;
    console.log(route.params.bookID)
    console.log(route.params)
    const [isVisible, setisVisible] = useState(false)
    function cancelBook() {
        auth().onAuthStateChanged(user => {
            if (user) {
                firestore().collection('Booking').doc(Title).collection('Bookings').doc(user.uid).delete()
                firestore().collection('User').doc(user.uid).collection('Booking').doc(bookID).delete()

            }
        })
    }
    return (
        <Fragment>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
            <SafeAreaView backgroundColor='white' />

            <SafeAreaView style={styling.safeContainer} >
                <View style={styling.headerView}>
                    <Icons name='left' backgroundColor='white' color='black' size={30} onPress={() => { props.pop() }} />
                    <Iconss.Button name='dots-three-horizontal' size={30} backgroundColor='white' color='black' />
                </View>
                <View style={styling.mainContainer}>
                    <View style={styling.avatarView}>
                        <View style={styling.profileView}>

                        </View>
                        <View style={styling.nameView}>
                            <Text style={styling.nameTXT}>{name}</Text>
                            <TouchableOpacity style={styling.confirmOpacity}>
                                <Text style={styling.confirmTXT}>Confirmed</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styling.iconView}>
                            <TouchableOpacity style={styling.phoneView}>
                                <Icon name='phone' color='#FF2D55' />
                            </TouchableOpacity>


                            <TouchableOpacity style={styling.phoneView}>
                                <Icon name='comment' color='#FF2D55' />
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={styling.innerView}>
                        <View style={styling.labelView}>
                            <Text style={styling.labelTXT}>Start</Text>
                            <Text style={styling.labelendTXT}>End</Text>

                        </View>
                        <View style={styling.mainDayView}>
                            <View style={styling.dayView}>

                                <Text style={styling.dayTXT}>{Datee}</Text>
                                <Text style={styling.timeTXT}>{Time}</Text>
                            </View>
                            <View style={styling.arrowView}>
                                <Text>4h 0m</Text>
                                <Icon name='long-arrow-right' size={28} color='#C8C7CC' />

                            </View>
                            <View style={styling.dayView}>
                                <Text style={styling.dayTXT}>Monday,</Text>
                                <Text style={styling.dayTXT}>{Datee}</Text>
                                <Text style={styling.timeTXT}>{Time}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styling.innerView}>
                        <View style={styling.mainDayView}>
                            <View style={styling.cityView}>

                                <Text style={styling.timeTXT}>Address</Text>
                                <Text style={styling.dayTXT}>{address}</Text>
                                <Text style={styling.timeTXT}>{distance} mi away</Text>
                            </View>

                            <View style={styling.mapIconView}>
                                <Icon name='map-marker' size={30} color='#FF2D55' />
                            </View>
                        </View>
                    </View>

                    <View style={styling.cityView}>

                        <Text style={styling.timeTXT}>Price</Text>
                        <Text style={styling.dayTXT}>Total price ${credit}</Text>
                        <Text style={styling.timeTXT}>for 1 hr </Text>
                    </View>

                    <View style={styling.cityView}>
                        <Text style={styling.timeTXT}>Reminder</Text>
                        <Text style={styling.dayTXT}>30 minutes before</Text>
                        <Text style={styling.timeTXT}>30 minutes before</Text>

                    </View>
                    <View style={styling.signupView}>
                        <TouchableOpacity style={[styling.signupOpacity, { backgroundColor: '#FF2D55' }]} onPress={() => { props.navigate('HomeScreen') }}>
                            <Text style={[styling.signupText, { color: 'white' }]}>Proceed </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styling.signupView}>
                        <TouchableOpacity style={styling.signupOpacity} onPress={() => { setisVisible(true) }}>
                            <Text style={styling.signupText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <AlertCancel
                    isVisible={isVisible}
                    onPressYes={() => {
                        cancelBook()
                        setisVisible(false)
                        props.navigate('HomeScreen')
                    }}
                    onPressNo={() => { setisVisible(false) }}
                    onBackButtonPress={() => { setisVisible(false) }}
                    onBackdropPress={() => { setisVisible(false) }}
                />
            </SafeAreaView >
            <SafeAreaView style={{ backgroundColor: 'white' }} />
        </Fragment>
    )
}

export default BookingDetails;