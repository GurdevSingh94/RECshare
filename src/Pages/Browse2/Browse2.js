import React, { Fragment, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Text, Input } from 'react-native-elements';
import { styling } from './styling';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/FontAwesome5';
import Matriel from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from 'react-native-searchable-dropdown';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { wp, hp } from '../../Global/Styles/Scalling';
import IconFont from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-picker/picker'
import AlertModal from '../../Component/AlertModal/index';
import { I18n } from '../../../i18n/I18n';
import { fontFamily } from '../../Global/Styles/font';
import Modal from "react-native-modal"
import country from '../../Component/dummy'
const Browse2 = (props) => {
  const [status, setStatus] = useState('');
  const [data, setDAta] = useState([]);
  const [cityVis, setCityVIs] = useState(false)
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState();
  const [filter, setfilter] = useState('');
  const [filterData, setFilterData] = useState('');
  const [isVisible, setisVisible] = useState(false);
  const [token, setToken] = useState('');
  const [city, setCity] = useState('')
  const [dataload, setdataload] = useState(true);
  const [listcountry, setListCoutnry] = useState(country)
  useEffect(() => {
    let mounted = true;
    setdataload(true);

    StartFunction().then(() => {
      if (mounted) {
        setdataload(false);
      }
    });
    const unsubscribe = props.navigation.addListener('focus', () => {
      StartFunction();
    });
    return function cleanup() {
      (mounted = false), unsubscribe;
    };
  }, []);
  async function StartFunction() {
    setdataload(true);

    await get();
    await filters();
  }

  async function get() {
    let t = await AsyncStorage.getItem('token');
    setToken(t);
    const list = [];
    const snapshot = await firestore().collection('Data').get();

    snapshot.forEach((doc) => {
      if (doc.exists) {
        list.push(doc.data());
      } else {
        console.log('No document found!');
      }
    });
    setDAta(list);
    if (filter == '') {
      setFilterData([...list]);
    }
    setdataload(false);

    // setdataload(false)
  }
  async function catGet(data) {
    const snapshot = await firestore()
      .collection('Data')
      .where('type', '==', data)
      .get();
    const list = [];
    snapshot.forEach((doc) => {
      list.push(doc.data());
    });
    setDAta([...list]);
    setdataload(false);

    // if (filter == '') {
    setFilterData([...list]);
    // }
  }
  async function filters() {
    try {
      await AsyncStorage.getItem('Filter').then((datas) => {
        if (datas) {
          let parsed1 = JSON.parse(datas);
          setfilter(parsed1);

          sortData(parsed1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function sortData(parsed1) {
    console.log(parsed1);
    let a = parsed1?.Rating;

    const list = [];
    if (parsed1?.Rating != '') {
      if (parsed1?.Checked == 'HighestFirst') {
        const snapshot = await firestore()
          .collection('Data')
          .where('Rating', '<=', a)
          .orderBy('Rating', 'desc')
          .get();
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        console.log(filterData);
        setFilterData([...list]);
      } else if (parsed1?.Checked == 'LowestFirst') {
        const snapshot = await firestore()
          .collection('Data')
          .where('Rating', '<=', a)
          .orderBy('Rating', 'asc')
          .get();
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        console.log(filterData);
        setFilterData([...list]);
      }
    } else if (parsed1?.SPrice != '' && parsed1?.EPrice != '') {
      console.log('price');
      if (parsed1?.Checked == 'Pricelowestfirst') {
        const snapshot = await firestore()
          .collection('Data')
          .orderBy('credit', 'asc')
          .get();
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setFilterData([...list]);
      } else if (parsed1?.Checked == 'Pricehigestfirst') {
        const snapshot = await firestore()
          .collection('Data')
          .orderBy('credit', 'desc')
          .get();
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setFilterData([...list]);
      }
    }
  }

  // const list = () => {
  //     data.forEach(item => {
  //         let list = [...listData]
  //         list.push({
  //             Type: item.Space
  //         })
  //         setListData(list)
  //     })
  // }
  const favourite = async (item, index) => {
    let tk = await AsyncStorage.getItem('token');
    let alreadyLiked = liked(item);

    console.log(alreadyLiked, item, index);
    if (alreadyLiked == true) {
      data[index].isLikedBy = item?.isLikedBy?.filter((like) => {
        return like != tk;
      });
      console.log(data, 'sda');
      await firestore()
        .collection('Data')
        .doc(data[index].spaceid)
        .set(data[index]);

      setDAta(data);
    } else {
      await data[index].isLikedBy?.push(tk);
      console.log(data, '----');

      await firestore()
        .collection('Data')
        .doc(data[index].spaceid)
        .set(data[index]);
      setDAta(data);
    }
    get();
  };

  const liked = (item) => {
    if (item.isLikedBy == undefined) {
      return false;
    } else if (item.isLikedBy != undefined && item.isLikedBy.length == 0) {
      return false;
    } else if (item.isLikedBy.length > 0) {
      let myLikes = item.isLikedBy?.filter((like) => {
        return like === token;
      });
      if (myLikes.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  //   item?.isLikedBy?.includes(Token)?
  return (
    <Fragment>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        hidden={false}
        backgroundColor="white"
      />
      <SafeAreaView style={styling.safeContainer}>
        {dataload ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator color={'red'} size={'large'} />
          </View>
        ) : (
          <ScrollView>
            <View style={styling.mainContainer}>
              <View style={{ marginLeft: wp(3) }}>
                <Text style={styling.labelTXT}>{I18n.t('Willyouplan')}</Text>
                <TouchableOpacity style={styling.cityView}
                  onPress={() => setCityVIs(true)}
                >
                  <Text style={styling.cityTXT}>{city ? city : 'San Francisco'}? </Text>
                  <Icons name="angle-down" size={30} color="#FF2D55" />
                </TouchableOpacity>
              </View>
              <View style={styling.innerContainer}>
                <View style={styling.searchBar}>
                  <TouchableOpacity
                    style={{
                      height: hp(7),
                      width: wp(90),
                      borderRadius: wp(2),
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: wp(2),
                    }}
                    onPress={() => props.navigation.navigate('Search2')}>
                    <Icon
                      name="search1"
                      size={18}
                      style={{ color: '#bbb' }}
                      onPress={() => {
                        props.navigation.navigate('SpaceDetail', {
                          Space: search,
                          props: props.navigation,
                        });
                      }}
                    />
                    <Text
                      style={{
                        color: '#bbb',
                        paddingLeft: wp(4),
                        fontFamily: fontFamily.SFUIText,
                        fontSize: wp(4),
                      }}>
                      Search for everything???
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styling.innerDetailView}>
                <View style={{}}>
                  <View style={styling.categoryView}>
                    <View>
                      <Text style={styling.CategoryTXT}>
                        {I18n.t('Categories')}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styling.seeALLOpacity}
                        onPress={() => {
                          props.navigation.navigate('Categories');
                        }}>
                        <Text style={styling.seeALLTXT}>
                          {I18n.t('See all')}
                        </Text>
                        <Icon name="right" size={10} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styling.cardContainer}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity
                        style={styling.mainCardView}
                        onPress={() => {
                          props.navigation.navigate('SpaceList', { type: 'Private' })
                        }}
                      >
                        <View style={styling.cardView}>
                          <Icons name="building" color="white" size={50} />
                        </View>
                        <View style={styling.cardTXTView}>
                          <Text style={styling.carHeading}>
                            {I18n.t('Private')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styling.mainCardView}
                        onPress={() => {
                          props.navigation.navigate('SpaceList', { type: 'Meeting' })
                        }}
                      >
                        <View style={styling.cardView1}>
                          <Icons name="people-carry" color="white" size={50} />
                        </View>
                        <View style={styling.cardTXTView}>
                          <Text style={styling.carHeading}>
                            {I18n.t('Meeting')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styling.mainCardView}
                        onPress={() => {
                          props.navigation.navigate('SpaceList', { type: 'Seminar' })
                        }}
                      >
                        <View style={styling.cardView22}>
                          <Icons
                            name="chalkboard-teacher"
                            color="white"
                            size={50}
                          />
                        </View>
                        <View style={styling.cardTXTView}>
                          <Text style={styling.carHeading}>
                            {I18n.t('Seminar')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styling.mainCardView}
                        // onPress={() => {
                        //   catGet('Offices');
                        //   }}
                        onPress={() => {
                          props.navigation.navigate('SpaceList', { type: 'Offices' })
                        }}

                      >
                        <View
                          style={[
                            styling.cardView22,
                            { backgroundColor: '#FF9500' },
                          ]}>
                          <Matriel
                            name="office-building"
                            color="white"
                            size={60}
                          />
                        </View>
                        <View style={styling.cardTXTView}>
                          <Text style={styling.carHeading}>
                            {I18n.t('Office')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
                <View>
                  <View style={styling.maininnerContainer}>
                    <View>
                      <Text style={styling.CategoryTXT}>Nearby Spaces</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styling.seeALLOpacity}
                        onPress={() => props.navigation.navigate('Search2')}>
                        <Text style={styling.seeALLTXT}>
                          {I18n.t('See all')}
                        </Text>
                        <Icon name="right" size={10} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styling.cardContainer}>
                    {data.length > 0 ? (
                      <FlatList
                        data={data}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={styling.nearInnerView}
                              onPress={() => {
                                props.navigation.navigate('SpaceDetail', {
                                  Space: item.spaceid,
                                  props: props.navigation,
                                });
                              }}>
                              <ImageBackground
                                style={styling.nearbyCard}
                                source={{ uri: item.Image }}
                                imageStyle={styling.nearbyCard}>
                                <Icon
                                  name="heart"
                                  size={26}
                                  color={
                                    item?.isLikedBy?.includes(token)
                                      ? 'red'
                                      : 'white'
                                  }
                                  onPress={() => {
                                    // setStatus(item.Space)
                                    favourite(item, index);
                                  }}
                                />
                                <View style={styling.imageViewText}>
                                  <Text style={{ color: 'white' }}>
                                    ${item.credit}/hr
                                  </Text>
                                </View>
                              </ImageBackground>
                              <View>
                                <Text style={styling.CategoryTXT}>
                                  {item.Space}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row' }}>
                                <Icons
                                  name="map-marker-alt"
                                  color="#666666"
                                  size={15}
                                />
                                <Text style={styling.carLabel}>
                                  {' '}
                                  {item.distance} mi {I18n.t('Away')},{' '}
                                  {item.guest} {I18n.t('guest')}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    ) : (
                      <Text>No Space found</Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={styling.buttonOpacityView}>
                <TouchableOpacity
                  style={styling.mapOpacity}
                  onPress={() => {
                    props.navigation.navigate('Map');
                  }}>
                  <Entypo name="map" size={20} />
                  <Text> {I18n.t('Map')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styling.filterOpacity}
                  onPress={() => {
                    props.navigation.navigate('Filter');
                  }}>
                  <AntDesign name="filter" size={20} />
                  <Text> {I18n.t('Filter')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styling.cardContainer22}>
                <FlatList
                  data={filterData}
                  contentContainerStyle={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styling.innerCardContainer22}
                        onPress={() => {
                          props.navigation.navigate('SpaceDetail', {
                            Space: item.spaceid,
                            props: props.navigation,
                          });
                        }}>
                        <Image
                          source={{ uri: item.Image }}
                          style={styling.cardView2}
                        />
                        <View style={styling.txtView}>
                          <Text style={styling.cardheadTXT}>{item.Space}</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <IconFont
                              name="map-marker-alt"
                              color="#666666"
                              size={16}
                            />
                            <Text style={styling.cardheadLabels}>
                              {' '}
                              {item.distance} mi {I18n.t('Away')}{' '}
                            </Text>
                          </View>
                          {(item.Rating == 5 && (
                            <Text
                              style={[
                                styling.cardheadLabel,
                                { color: '#FF9500' },
                              ]}>
                              ???????????????
                            </Text>
                          )) ||
                            (item.Rating == 4 && (
                              <Text
                                style={[
                                  styling.cardheadLabel,
                                  { color: '#FF9500' },
                                ]}>
                                ????????????
                              </Text>
                            )) ||
                            (item.Rating == 3 && (
                              <Text
                                style={[
                                  styling.cardheadLabel,
                                  { color: '#FF9500' },
                                ]}>
                                ?????????
                              </Text>
                            )) ||
                            (item.Rating == 2 && (
                              <Text
                                style={[
                                  styling.cardheadLabel,
                                  { color: '#FF9500' },
                                ]}>
                                ??????
                              </Text>
                            )) ||
                            (item.Rating && (
                              <Text
                                style={[
                                  styling.cardheadLabel,
                                  { color: '#FF9500' },
                                ]}>
                                ???
                              </Text>
                            ))}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>

          </ScrollView>
        )}

        <AlertModal isVisible={isVisible} />

      </SafeAreaView>
      <Modal isVisible={cityVis}
        backdropColor='white'
        backdropOpacity={1}
        onBackButtonPress={() => {
          setCityVIs(false)

        }}
        onBackdropPress={() => {
          setCityVIs(false)

        }}

      >
        <ScrollView style={{ width: wp(100), height: hp(100), paddingTop: hp(-2), marginTop: hp(-2) }}>
          <View style={{ width: wp(90), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Icon
              name='close'
              size={24}
              color='grey'
              onPress={() => { setCityVIs(false) }}
            />
            <TextInput
              placeholder='Search Country......'
              placeholderTextColor='black'
              style={{ width: wp(80), color: 'black', backgroundColor: 'white', borderWidth: wp(0.2), borderColor: '#bbb', borderRadius: 5 }}
              onChangeText={val => {
                const newData = country.filter(item => {
                  const itemData = `${item.name.toUpperCase()}`;

                  const textData = val.toUpperCase();

                  return itemData.indexOf(textData) > -1;
                });
                setListCoutnry(newData)

                if (val == '') setListCoutnry(country)
              }}
            />
          </View>
          <View>
            {listcountry.map((item) => {
              return (
                <TouchableOpacity style={{ paddingVertical: hp(2), width: wp(90), borderBottomWidth: wp(0.2), borderBottomColor: '#bbb' }}
                  onPress={() => {
                    setCity(item.name)
                    setCityVIs(false)
                    setListCoutnry(country)
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )
            }
            )}
          </View>

        </ScrollView>
      </Modal>
      <SafeAreaView style={{ backgroundColor: 'white' }} />
    </Fragment >
  );
};

export default Browse2;
