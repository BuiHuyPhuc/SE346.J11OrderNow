import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Image, TextInput
} from 'react-native';

import realm from './../../../../Database/All_Schemas';
import { queryAllCategoryFood } from './../../../../Database/All_Schemas';

import { connect } from 'react-redux';
import { onCancelPopup, onShowPopupAdd, onShowPopupUpdateDelete, onLoadListCategoryFood,
         onPopupAddCategoryFood, onPopupUpdateDeleteCategoryFood } from './../../../../Redux/ActionCreators';

import HeaderBack from './../../HeaderBack';
import PopUpCategoryFood from './PopUpCategoryFood';

const { width, height } = Dimensions.get("window");

class MngCategoryFood extends Component {
  constructor (props) {
    super(props);
    this.state = {
      listCategoryFood: [],
      search: ''
    };
    this.onReloadData();
    realm.addListener('change', () => {
      this.onReloadData();           
    });
  }

  onReloadData() {
    queryAllCategoryFood()
    .then(listCategoryFood => this.setState({ listCategoryFood }))
    .catch(error => this.setState({ listCategoryFood: [] }));
  }
  
  render() {
    const { listCategoryFood, search } = this.state;
    const { navigation, onCancelPopup, onShowPopupAdd, onShowPopupUpdateDelete,
            onPopupAddCategoryFood, onPopupUpdateDeleteCategoryFood } = this.props;
    const { container, wrapHeader, inputSearch, wrapFeature, btnFeature, 
            wrapTable, headerTable, headerWrapLoai, headerWrapSoLuong, txtHeader,
            wrapItem, txtLoai, txtSoLuong 
          } = styles;
    return (
      <View style={container}>
        <HeaderBack 
          navigation={navigation}
          name="Management CategoryFood"
        />        
        
        <View style={wrapHeader}>
          <TextInput 
            style={inputSearch}
            placeholder="Search"
            underlineColorAndroid='transparent'
            value={search}
            onChangeText={text => this.setState({ search: text })}
          />
          <View style={wrapFeature}>
            <TouchableOpacity
              style={btnFeature}
              onPress={() => {                
                onShowPopupAdd();
                onPopupAddCategoryFood();
              }}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={wrapTable}>
          <View style={headerTable}>
            <View style={headerWrapLoai}>
              <TouchableOpacity 
                onPress={() => {}}>                
                <Text style={txtHeader}>Loại món</Text>
              </TouchableOpacity>              
            </View>
            <View style={headerWrapSoLuong}>
              <TouchableOpacity 
                onPress={() => {}}>
                <Text style={txtHeader}>Số lượng món</Text>
              </TouchableOpacity>              
            </View>           
          </View>

        
          <FlatList
            data={listCategoryFood}
            renderItem={({item}) =>
              <TouchableOpacity 
                style={wrapItem}
                onPress={() => {
                  onShowPopupUpdateDelete();
                  onPopupUpdateDeleteCategoryFood(item.categoryFood);
                }}
              >
                <View style={txtLoai}>
                  <Text>{item.categoryFood.name}</Text>
                </View>
                <View style={txtSoLuong}>
                  <Text>{item.foods.length}</Text>
                </View>       
              </TouchableOpacity> 
            }
            keyExtractor={item => item.categoryFood.id.toString()}
          />                                
        </View>  
        
        <PopUpCategoryFood />
      </View>
    );
  }
}

export default connect(null, { onCancelPopup, onShowPopupAdd, onShowPopupUpdateDelete,
  onPopupAddCategoryFood, onPopupUpdateDeleteCategoryFood })(MngCategoryFood);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ---> Header <---
  wrapHeader: {
    paddingHorizontal: 10
  },
  inputSearch: {
    width: width - 20,
    height: height / 16,
    backgroundColor: 'whitesmoke',
    padding: 10,
    marginVertical: 5
  },
  wrapFeature: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnFeature: {
    backgroundColor: '#2ABB9C',
    marginLeft: 5,
    width: 32,
    height: 32
  },
  // ---> Table Header <---
  wrapTable: {
    paddingHorizontal: 5,
    marginTop: 10
  },
  headerTable: {
    flexDirection: 'row'
  },
  headerWrapLoai: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  headerWrapSoLuong: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  txtHeader: { 
    fontWeight: 'bold'
  },
  // ---> Table Item <---
  wrapItem: { 
    flexDirection: 'row',
    marginTop: 5, 
    alignItems: 'center'
  },
  txtLoai: { flex: 2, alignItems: 'center' },
  txtSoLuong: { flex: 1, alignItems: 'center' },
});
