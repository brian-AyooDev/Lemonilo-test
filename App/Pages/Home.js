import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Header,
  Icon,
  Left,
  Text,
} from 'native-base';
import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppActions from 'App/Actions';

import DummyData from 'App/Assets/DummyData';

import * as Styles from 'App/Styles';
import * as Hooks from 'App/Helpers/Hooks';
import * as Http from 'App/Helpers/Http';

import lang from 'App/Helpers/Languages';
import Swiper from 'App/Components/Swiper';
import SwitchButton from 'App/Components/SwitchButton';
import RNPickerSelect from 'App/Components/PickerSelect';

const { width, height } = Dimensions.get('window');
const TAG = "Home ";

class Home extends Component {
  static navigationOptions = () => ({ headerShown: false });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dataDiscover: [],
      dataOfficeTower: [],
      dataComplexBuy: [],
      dataComplexRent: [],
      dataCoworkingSpace: [],

      loginEmail: false,
    };
  }

  componentDidMount() {
    this.initSearchConfig();
    this.loadDummyData();
  }

  changeLogin = () => {
    if (!this.state.loginEmail) {
      this.slideRight()
    } else {
      this.slideLeft()
    }
    this.setState({ loginEmail: !this.state.loginEmail });
    Hooks.consoleLog(TAG + 'login value: ', this.state.loginEmail);
  }

  handleViewRef = ref => this.view = ref;

  slideRight = () => this.view.animate({
    0: {
      translateX: 0,
    },
    0.5: {
      translateX: 100,
    },
    1: {
      translateX: 150,
    },
    2: {
      translateX: 300,
    }
  });

  slideLeft = () => this.view.animate({
    0: {
      translateX: 100,
    },
    0.5: {
      translateX: -0.3,
    },
    1: {
      translateX: -0.5,
    },
    2: {
      translateX: -1,
    }
  });

  initSearchConfig() {
    let config = {
      searchUnit: Hooks.APARTMENT,
      searchLocation: 'Jakarta_Pusat',
      searchType: Hooks.RENT_TYPE,
    };
    this.props.setSearchConfig(config);
  }

  loadDummyData() {
    this.setState({
      dataDiscover: DummyData['dataDiscover'],
      dataOfficeTower: DummyData['dataOfficeTower'],
      dataComplexBuy: DummyData['dataComplexBuy'],
      dataComplexRent: DummyData['dataComplexRent'],
      dataCoworkingSpace: DummyData['dataCoworkingSpace'],
    });
  }

  discover(item, type, searchType = Hooks.RENT_TYPE) {
    this.props.setUnitData({
      unitType: type,
      data: item
    });
    this.props.setSearchConfig({
      searchType: searchType
    })
    this.props.navigation.navigate('Details');
  }

  renderHeader() {
    return (
      <Header
        style={[
          {
            backgroundColor: Styles.Colors.white
          }
        ]}
      >
        <Left style={[
          Styles.Helpers.center,
          Styles.Helpers.mainSpaceAround,
          {
            flex: 0.15,
          }
        ]}>
          <TouchableOpacity style={[
            Styles.Helpers.center
          ]}>
            <Icon
              name={'menu'}
              type={'MaterialCommunityIcons'}
              style={{
                color: Styles.Colors.primary
              }}
            />
          </TouchableOpacity>
        </Left>
        <View style={[
          Styles.Helpers.crossStart,
          Styles.Helpers.mainCenter,
          { flex: 0.85 }
        ]}>
          <Text style={[
            Styles.Helpers.textLeft,
            { fontSize: 20, fontWeight: 'bold' }
          ]}>
            {'PropertyApp'}
          </Text>
        </View>
      </Header>
    );
  }

  renderBanner() {
    return (
      <View>
        <ImageBackground
          source={{ uri: 'https://res.cloudinary.com/dpqdlkgsz/image/upload/v1/homepage/hero.png' }}
          style={[
            Styles.Helpers.mainCenter,
            {
              resizeMode: "cover",
              height: width / 3,
            }
          ]}
        >
          <View style={[{
            marginRight: 15,
          }]}>
            <Text style={{
              fontSize: 27,
              fontWeight: 'bold',
              textAlign: 'right'
            }}>{'Properti'}</Text>
            <Text style={{
              fontSize: 27,
              fontWeight: 'bold',
              textAlign: 'right'
            }}>{'di Ujung Jari'}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  renderSearchCard() {
    let options = [
      { key: 0, label: 'Apartemen', value: Hooks.APARTMENT },
      { key: 1, label: 'Kantor', value: Hooks.OFFICE },
    ];

    let optionsLocation = [
      { key: 2, label: 'Jakarta Pusat', value: 'Jakarta_Pusat' },
      { key: 3, label: 'Jakarta Selatan', value: 'Jakarta_Selatan' },
    ];

    return (
      <View style={[
        {
          margin: 20,
        }
      ]}>
        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.mainSpaceBetween,
        ]}>
          <View style={[
            {
              marginRight: 5,
              flex: 1
            }
          ]}>
            <Text style={[{
              fontSize: 12
            }]}>
              {'Cari'}
            </Text>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              onValueChange={item => {
                this.props.setSearchConfig({ searchUnit: item });
                (item == Hooks.OFFICE) ?
                  this.props.setSearchConfig({ searchType: Hooks.RENT_TYPE }) :
                  null;
                this.props.refreshApp();
              }}
              items={options}
              value={this.props.searchConfig.searchUnit}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 10,
                  right: 5,
                },
              }}
              InputAccessoryView={null}
              Icon={() => {
                return (
                  <Icon
                    name={'chevron-down'}
                    type={'MaterialCommunityIcons'}
                    style={{
                      color: Styles.Colors.grayDark,
                      fontSize: 20,
                    }}
                  />
                );
              }}
            />
          </View>
          {
            this.props.searchConfig.searchUnit == Hooks.APARTMENT &&
            <View style={[
              Styles.Helpers.mainCenter,
              {
                marginLeft: 5,
              }
            ]}>
              <Text style={[{
                fontSize: 12
              }]}>
                {'Saya Ingin'}
              </Text>
              <SwitchButton
                onValueChange={(val) => {
                  this.props.setSearchConfig({ searchType: val });
                  Hooks.consoleLog(TAG + "val: ", this.props.searchConfig.searchType);
                }}
                activeSwitch={this.props.searchConfig.searchType}
                value1={Hooks.RENT_TYPE}
                value2={Hooks.BUY_TYPE}
                text1={'Sewa'}
                text2={'Beli'}
                switchWidth={100}
                switchHeight={40}
                switchdirection={'ltr'}
                switchBorderRadius={10}
                switchSpeedChange={250}
                switchBorderColor={Styles.Colors.primary}
                switchBackgroundColor={Styles.Colors.white}
                btnBorderColor={Styles.Colors.primary}
                btnBackgroundColor={Styles.Colors.primary}
                fontColor={'black'}
                activeFontColor={Styles.Colors.white}
              />
            </View>
          }
        </View>

        <View style={[
          Styles.Helpers.row,
          {
            marginTop: 10,
          }
        ]}>
          <View style={[
            {
              marginRight: 5,
              flex: 1
            }
          ]}>
            <Text style={[{
              fontSize: 12
            }]}>
              {'Pilih Lokasi'}
            </Text>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              onValueChange={item => {
                this.props.setSearchConfig({ searchLocation: item });
                this.props.refreshApp();
              }}
              items={optionsLocation}
              value={this.props.searchConfig.searchLocation}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 10,
                  right: 5,
                },
              }}
              InputAccessoryView={null}
              Icon={() => {
                return (
                  <Icon
                    name={'chevron-down'}
                    type={'MaterialCommunityIcons'}
                    style={{
                      color: Styles.Colors.grayDark,
                      fontSize: 20,
                    }}
                  />
                );
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            Styles.Helpers.center,
            {
              zIndex: -100,
              backgroundColor: Styles.Colors.primary,
              height: 40,
              paddingHorizontal: 10,
              marginTop: 20,
              borderRadius: 5
            }
          ]}
          onPress={() => this.props.navigation.navigate('Lists')}
        >
          <Text style={{
            color: Styles.Colors.white
          }}>
            {'Cari'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderTileCategory() {
    let data = [
      { id: 0, name: 'Unit Apartemen', icon: 'home-modern', iconType: 'MaterialCommunityIcons', bgColor: Styles.Colors.primary },
      { id: 2, name: 'Rumah', icon: 'home-city', iconType: 'MaterialCommunityIcons', bgColor: Styles.Colors.primary },
      { id: 3, name: 'Kantor', icon: 'office-building', iconType: 'MaterialCommunityIcons', bgColor: Styles.Colors.primary },
      { id: 4, name: 'Titip Jual / Sewa', icon: 'pricetag', iconType: 'Ionicons', bgColor: 'orange' },
    ];

    let tileComp = [];

    for (let item of data) {
      tileComp.push(
        <TouchableOpacity
          key={item.id + "_" + item.name}
          style={[
            Styles.Helpers.center,
            Styles.MainStyles.boxShadow2,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              height: Styles.Metrics.xxlImg,
              width: Styles.Metrics.xxlImg
            }
          ]}
        >
          <View style={[
            Styles.Helpers.center,
            Styles.Helpers.xxlImg, {
              borderRadius: Styles.Metrics.lImg,
              backgroundColor: item.bgColor,
              padding: 5,
              overflow: 'hidden'
            }
          ]}>
            <Icon
              name={item.icon}
              type={item.iconType}
              style={{
                color: Styles.Colors.white,
                fontSize: Styles.Metrics.xsImg
              }}
            />
          </View>
          <Text style={[
            Styles.Helpers.textCenter,
            {
              marginTop: 5,
              fontSize: 8,
            }
          ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[
        Styles.MainStyles.boxShadow2,
        Styles.Helpers.row,
        Styles.Helpers.fill,
        Styles.Helpers.mainSpaceAround,
        {
          marginVertical: 20,
          marginHorizontal: 20,
        }
      ]}>
        {tileComp}
      </View>
    );
  }

  renderPromoBanner() {
    let dataBanner1 = [
      { id: 0, img: Styles.Images.exp_service_3, title: 'Ribuan Listings Terverifikasi', subtitle: 'Pencarian properti lebih cepat dan mudah' },
      { id: 1, img: Styles.Images.exp_service_2, title: 'Pengetahuan Properti Terbaik', subtitle: 'Agen kami terpilih berkat pengalaman dan pengetahuan yang luas' },
      { id: 2, img: Styles.Images.exp_service_5, title: 'Transparan & Terpercaya', subtitle: 'Komitmen untuk memberikan layanan yang jujur dan transparan' },
    ];

    let bannerComp1 = [];

    for (let item of dataBanner1) {
      bannerComp1.push(
        <View
          key={item.title + "_" + item.subtitle}
          style={[
            Styles.Helpers.mainCenter,
            {
              marginHorizontal: 50,
            }
          ]}
        >
          <Image
            style={[
              Styles.Helpers.xlImgBox
            ]}
            source={item.img}
          />
          <Text style={[
            {
              paddingTop: 10,
              fontSize: 14,
              fontWeight: 'bold'
            }
          ]}>
            {item.title}
          </Text>
          <Text style={[
            {
              paddingTop: 10,
              fontSize: 12,
            }
          ]}>
            {item.subtitle}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={[{
          fontWeight: 'bold',
          fontSize: 18,
          marginHorizontal: 20,
          marginTop: 30,
          marginBottom: 10,
        }]}>
          {'Agen properti terpercaya berbasis teknologi'}
        </Text>

        <View style={[{
          padding: 20,
        }]}>
          <Swiper
            showsButtons
            showsPagination={false}
            loop={false}
            style={{
              height: 150,
            }}
          >
            {bannerComp1}
          </Swiper>
        </View>
      </View>
    );
  }

  renderDiscover() {
    let data = this.state.dataDiscover;
    let discoverComponent = [];

    if (data.hasOwnProperty('data')) {
      for (let item of data['data']) {
        discoverComponent.push(
          <TouchableOpacity
            key={item.id}
          >
            <ImageBackground
              source={{ uri: Http.COMPLEX_IMAGE_URL + item.banner }}
              imageStyle={{
                borderRadius: 10,
              }}
              style={[
                Styles.Helpers.crossCenter,
                Styles.Helpers.mainEnd,
                {
                  marginHorizontal: 5,
                  marginVertical: 10,
                  borderRadius: 10,
                  resizeMode: "cover",
                  width: 150,
                  height: 180,
                }
              ]}
            >
              <Text style={{
                color: Styles.Colors.white,
                fontWeight: 'bold',
                marginBottom: 30,
              }}>
                {item.name}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        );
      }
    }

    return (
      <View style={{
        marginHorizontal: 10,
        marginBottom: 20,
      }}>
        <Text style={[{
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 10,
          marginBottom: 10,
        }]}>
          {'Telusuri'}
        </Text>
        <ScrollView
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={[
            Styles.Helpers.row,
            Styles.Helpers.left,
          ]}
        >
          {discoverComponent}
        </ScrollView>
      </View>
    );
  }

  renderComplex(type = Hooks.BUY_TYPE) {
    let data;
    type == Hooks.BUY_TYPE ?
      data = this.state.dataComplexBuy :
      data = this.state.dataComplexRent

    let component = [];

    if (data.hasOwnProperty('data')) {
      component.push(
        <FlatList
          key={'flatlistComplex'}
          contentContainerStyle={[Styles.Helpers.mainCenter]}
          data={data['data']}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => "renderTower_" + item.id + "_" + index}
          ListEmptyComponent={() => {
            return (
              <View>
                {
                  !this.state.isLoading &&
                  <View style={[
                    Styles.Helpers.center,
                    Styles.Helpers.fill,
                  ]}>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 14,
                      paddingVertical: 20
                    }}>
                      {lang('label.no_data')}
                    </Text>
                  </View>
                }
              </View>
            );
          }}
          renderItem={
            ({ item, index }) => {
              return (
                <View style={[
                  Styles.Helpers.row
                ]}>
                  {this._renderComplexCard(item, index, type)}

                  {/* Card See All */}
                  {
                    index == (data['data'].length - 1) &&
                    <TouchableOpacity
                      style={[
                        Styles.MainStyles.boxShadow2,
                        Styles.Helpers.fill,
                        Styles.Helpers.center,
                        {
                          backgroundColor: Styles.Colors.white,
                          borderRadius: 10,
                          margin: 5,
                          width: 200
                        }
                      ]}
                    >
                      <Icon
                        name={'chevron-with-circle-right'}
                        type={'Entypo'}
                        style={{
                          color: Styles.Colors.primary,
                          fontSize: 35,
                        }}
                      />
                      <Text style={[{
                        fontSize: 14,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginHorizontal: 50,
                        marginTop: 10,
                      }]}>
                        {'Lihat Lainnya'}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              );
            }
          }
        />
      );
    }

    return (
      <View style={{
        marginHorizontal: 10,
        marginBottom: 20,
      }}>
        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.mainSpaceBetween,
          Styles.Helpers.crossCenter,
          {
            marginHorizontal: 10,
          }
        ]}>
          <Text numberOfLines={2} style={[{
            fontWeight: 'bold',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 10,
          }]}>
            {
              type == Hooks.BUY_TYPE ?
                'Beli - Apartemen Populer' :
                'Sewa - Apartemen Populer'
            }
          </Text>
          <TouchableOpacity>
            <Text style={[{
              fontSize: 12,
              color: Styles.Colors.primary,
              marginTop: 10,
              marginBottom: 10,
            }]}>
              {'Lihat semua'}
            </Text>
          </TouchableOpacity>
        </View>
        {component}
      </View>
    );
  }

  renderTower() {
    let data = this.state.dataOfficeTower;
    let towerComp = [];

    if (data.hasOwnProperty('data')) {
      towerComp.push(
        <FlatList
          key={'renderTower'}
          contentContainerStyle={[Styles.Helpers.mainCenter]}
          data={data['data']}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => "renderTower_" + item.id + "_" + index}
          ListEmptyComponent={() => {
            return (
              <View>
                {
                  !this.state.isLoading &&
                  <View style={[
                    Styles.Helpers.center,
                    Styles.Helpers.fill,
                  ]}>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 14,
                      paddingVertical: 20
                    }}>
                      {lang('label.no_data')}
                    </Text>
                  </View>
                }
              </View>
            );
          }}
          renderItem={
            ({ item, index }) => {
              return (
                <View style={[
                  Styles.Helpers.row
                ]}>
                  {this._renderTowerCard(item, index)}

                  {/* Card See All */}
                  {
                    index == (data['data'].length - 1) &&
                    <TouchableOpacity
                      style={[
                        Styles.MainStyles.boxShadow2,
                        Styles.Helpers.fill,
                        Styles.Helpers.center,
                        {
                          backgroundColor: Styles.Colors.white,
                          borderRadius: 10,
                          margin: 5,
                          width: 200
                        }
                      ]}
                    >
                      <Icon
                        name={'chevron-with-circle-right'}
                        type={'Entypo'}
                        style={{
                          color: Styles.Colors.primary,
                          fontSize: 35,
                        }}
                      />
                      <Text style={[{
                        fontSize: 14,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginHorizontal: 50,
                        marginTop: 10,
                      }]}>
                        {'Lihat Lainnya'}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              );
            }
          }
        />
      );
    }

    return (
      <View style={{
        marginHorizontal: 10,
        marginBottom: 20,
      }}>
        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.mainSpaceBetween,
          Styles.Helpers.crossCenter,
          {
            marginHorizontal: 10,
          }
        ]}>
          <Text numberOfLines={2} style={[{
            fontWeight: 'bold',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 10,
          }]}>
            {'Sewa - Ruang Kantor Populer'}
          </Text>
          <TouchableOpacity>
            <Text style={[{
              fontSize: 12,
              color: Styles.Colors.primary,
              marginTop: 10,
              marginBottom: 10,
            }]}>
              {'Lihat semua'}
            </Text>
          </TouchableOpacity>
        </View>
        {towerComp}
      </View>
    );
  }

  renderCoworkingSpace() {
    let data = this.state.dataCoworkingSpace;
    let component = [];

    if (data.hasOwnProperty('data')) {
      component.push(
        <FlatList
          key={'renderCoworkingSpace'}
          contentContainerStyle={[Styles.Helpers.mainCenter]}
          data={data['data']}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => "renderTower_" + item.id + "_" + index}
          ListEmptyComponent={() => {
            return (
              <View>
                {
                  !this.state.isLoading &&
                  <View style={[
                    Styles.Helpers.center,
                    Styles.Helpers.fill,
                  ]}>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 14,
                      paddingVertical: 20
                    }}>
                      {lang('label.no_data')}
                    </Text>
                  </View>
                }
              </View>
            );
          }}
          renderItem={
            ({ item, index }) => {
              return (
                <View style={[
                  Styles.Helpers.row
                ]}>
                  {this._renderCoworkingSpaceCard(item, index)}

                  {/* Card See All */}
                  {
                    index == (data['data'].length - 1) &&
                    <TouchableOpacity
                      style={[
                        Styles.MainStyles.boxShadow2,
                        Styles.Helpers.fill,
                        Styles.Helpers.center,
                        {
                          backgroundColor: Styles.Colors.white,
                          borderRadius: 10,
                          margin: 5,
                          width: 200
                        }
                      ]}
                    >
                      <Icon
                        name={'chevron-with-circle-right'}
                        type={'Entypo'}
                        style={{
                          color: Styles.Colors.primary,
                          fontSize: 35,
                        }}
                      />
                      <Text style={[{
                        fontSize: 14,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginHorizontal: 50,
                        marginTop: 10,
                      }]}>
                        {'Lihat Lainnya'}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              );
            }
          }
        />
      );
    }

    return (
      <View style={{
        marginHorizontal: 10,
        marginBottom: 20,
      }}>
        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.mainSpaceBetween,
          Styles.Helpers.crossCenter,
          {
            marginHorizontal: 10,
          }
        ]}>
          <Text numberOfLines={2} style={[{
            fontWeight: 'bold',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 10,
          }]}>
            {'Telusuri CoWorking Space'}
          </Text>
          <TouchableOpacity>
            <Text style={[{
              fontSize: 12,
              color: Styles.Colors.primary,
              marginTop: 10,
              marginBottom: 10,
            }]}>
              {'Lihat semua'}
            </Text>
          </TouchableOpacity>
        </View>
        {component}
      </View>
    );
  }

  _renderTowerCard(item, index) {
    return (
      <View style={[
        Styles.Helpers.row,
      ]}>
        <TouchableOpacity
          onPress={() => this.discover(item, Hooks.OFFICE)}
          style={[
            Styles.MainStyles.boxShadow2,
            Styles.MainStyles.crossSpaceBetween,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              margin: 5
            }
          ]}
        >
          <ImageBackground
            source={{ uri: Http.TOWER_IMAGE_URL + item.images.images_exterior[0].url }}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            style={[
              Styles.Helpers.crossCenter,
              Styles.Helpers.mainEnd,
              {
                borderRadius: 10,
                resizeMode: "cover",
                width: 250,
                height: 300,
              }
            ]}
          />
          <View style={[
            {
              margin: 10
            }
          ]}>
            <Text style={{
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
              {item.name}
            </Text>
            <Text style={{
              color: Styles.Colors.grayDark,
              fontSize: 10,
              marginBottom: 5,
            }}>
              {'Mulai dari'}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              justifyContent: 'center',
              fontSize: 14
            }}>
              {Hooks.formatCurrency(item.aggregation.price.base_rent)}
              <Text style={{ justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{' / sqm / bulan'}</Text>
            </Text>

            <View style={[
              Styles.Helpers.row,
              {
                marginTop: 5,
              }
            ]}>
              <Icon
                name={'map-marker'}
                type={'MaterialCommunityIcons'}
                style={{
                  color: Styles.Colors.grayDark,
                  fontSize: 12,
                }}
              />
              <Text style={{
                color: Styles.Colors.grayDark,
                fontSize: 10,
                marginBottom: 5,
              }}>
                {item.aggregation.address.district + ', ' + item.aggregation.address.city}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderComplexCard(item, index, type = Hooks.BUY_TYPE) {
    return (
      <View style={[
        Styles.Helpers.row,
      ]}>
        <TouchableOpacity
          onPress={() => this.discover(item, Hooks.APARTMENT, type)}
          style={[
            Styles.MainStyles.boxShadow2,
            Styles.MainStyles.crossSpaceBetween,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              margin: 5
            }
          ]}
        >
          <ImageBackground
            source={{ uri: Http.TOWER_IMAGE_URL + item.images.images_exterior[0].url }}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            style={[
              Styles.Helpers.crossCenter,
              Styles.Helpers.mainEnd,
              {
                borderRadius: 10,
                resizeMode: "cover",
                width: 250,
                height: 150,
              }
            ]}
          />
          <View style={[
            {
              margin: 10
            }
          ]}>
            <Text style={{
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
              {item.name}
            </Text>
            <Text style={{
              color: Styles.Colors.grayDark,
              fontSize: 10,
              marginBottom: 5,
            }}>
              {'Mulai'}
            </Text>

            {
              type == Hooks.BUY_TYPE ?
                <Text style={{
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  fontSize: 14
                }}>
                  {Hooks.formatCurrency(
                    item.aggregation.unit[0].value,
                    'IDR',
                    0,
                    true,
                  )}
                </Text>
                :
                <Text style={{
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  fontSize: 14
                }}>
                  {Hooks.formatCurrency(item.aggregation.unit[0].value)}
                  <Text style={{ justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{' / bulan'}</Text>
                </Text>
            }

            <View style={[
              Styles.Helpers.row,
              {
                marginTop: 5,
              }
            ]}>
              <Icon
                name={'map-marker'}
                type={'MaterialCommunityIcons'}
                style={{
                  color: Styles.Colors.grayDark,
                  fontSize: 12,
                }}
              />
              <Text style={{
                color: Styles.Colors.grayDark,
                fontSize: 10,
                marginBottom: 5,
              }}>
                {Hooks.sentenceCase(item.address_city)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View >
    );
  }

  _renderCoworkingSpaceCard(item, index) {
    return (
      <View style={[
        Styles.Helpers.row,
      ]}>
        <TouchableOpacity
          style={[
            Styles.MainStyles.boxShadow2,
            Styles.MainStyles.crossSpaceBetween,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              margin: 5
            }
          ]}
        >
          <ImageBackground
            source={{ uri: Http.TOWER_IMAGE_URL + item.images.images_interior[0].url }}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            style={[
              Styles.Helpers.crossCenter,
              Styles.Helpers.mainEnd,
              {
                borderRadius: 10,
                resizeMode: "cover",
                width: 200,
                height: 150,
              }
            ]}
          />
          <View style={[
            {
              margin: 10
            }
          ]}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
              style={{
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              {item.tower.name}
            </Text>
            <Text style={{
              color: Styles.Colors.grayDark,
              fontSize: 10,
              marginBottom: 5,
              marginTop: 5,
            }}>
              {'Harga sewa mulai'}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              justifyContent: 'center',
              fontSize: 14
            }}>
              {Hooks.formatCurrency(item.price.web_price)}
              <Text style={{ justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{' / pax / bulan'}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    Hooks.consoleLog(TAG, "render");
    return (
      <SafeAreaView
        style={[
          Styles.Helpers.fill,
          {
            backgroundColor: Styles.Colors.white,
            width,
          }
        ]}
        forceInset={{ top: 'never' }}
      >
        {this.renderHeader()}
        <ScrollView
          bounces={false}
        >
          {this.renderBanner()}
          <View style={{
            // zIndex: 100
          }}>
            {this.renderSearchCard()}
          </View>

          <View style={{
            backgroundColor: Styles.Colors.whiteSmoke,
            paddingTop: 1
          }}>
            {this.renderTileCategory()}
          </View>

          <View style={[
            Styles.MainStyles.boxShadow5,
            {
              backgroundColor: Styles.Colors.white,
            }
          ]}>
            {this.renderPromoBanner()}
            {this.renderDiscover()}
            {this.renderComplex(Hooks.BUY_TYPE)}
            {this.renderComplex(Hooks.RENT_TYPE)}
            {this.renderTower()}
            {this.renderCoworkingSpace()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Styles.Colors.grayDark,
    color: Styles.Colors.black,
    paddingLeft: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: width - 60,
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Styles.Colors.grayDark,
    color: Styles.Colors.black,
    paddingLeft: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: Styles.Colors.grayDark
  }
});

const mapStateToProps = state => ({
  refresh_app: state.refresh_app,
  searchConfig: state.searchConfig,
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
