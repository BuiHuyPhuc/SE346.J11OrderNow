import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,Alert, FlatList, Image, Dimensions, TextInput
} from 'react-native';

import realm from './../../../Database/All_Schemas';
import { queryAllCategoryFood, filterFoodByCategoryFoodId, insertNewBill, insertNewBillDetail,
 tableStatus, filterCategoryFoodOrFood, deleteAllBillAndBillDetail, queryAllBill, queryAllBillDetail } from './../../../Database/All_Schemas';

import { connect } from 'react-redux';

import HeaderBack from './../HeaderBack';
import ComboboxTable from './ComboboxTable';
import SourceImage from './../../../Api/SourceImage';
import getFormattedMoney from './../../../Api/FormattedMoney';

import FlatListCategoryFood from './FlatListCategoryFood';
import FlatListFood from './FlatListFood';

let monnuongIcon = require('./../../../Media/Category/mon-nuong.png');
const imgMonNuong = SourceImage(monnuongIcon);

const { width, height } = Dimensions.get("window")

const MainView = null;

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      listData: [],
      nameList: 'categoryFood',
      categoryFoodId: null,
      search: '',
      isFilter: false,
    };
    this.onReloadData();
    realm.addListener('change', () => {
      this.state.isFilter ? this.onFilterData() : this.onReloadData();
    })
  }

  onBackCategoryFood() {
    queryAllCategoryFood()
    .then(listData => this.setState({ listData, nameList: 'categoryFood', categoryFoodId: null, search: '', isFilter: false }))
    .catch(error => this.setState({ listData: [] }));
  }

  onNavigationFood(categoryFoodId) {
    filterFoodByCategoryFoodId(categoryFoodId)
    .then(listData => this.setState({ listData, nameList: 'food', categoryFoodId }))
    .catch(error => this.setState({ listData: [] }));
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  onReloadData() {
    const { listData, nameList, categoryFoodId } = this.state;
    if(nameList === 'categoryFood') {
      queryAllCategoryFood()
      .then(listData => this.setState({ listData }))
      .catch(error => this.setState({ listData: [] }));
    } else {
      filterFoodByCategoryFoodId(categoryFoodId)
      .then(listData => this.setState({ listData }))
      .catch(error => this.setState({ listData: [] }));
    }
  }

  onFilterData(searchText) {
    filterCategoryFoodOrFood(searchText)
    .then(listFilter => {
      console.log("listFilter", listFilter);
      this.setState({ listData: listFilter.listData, nameList: listFilter.nameList, isFilter: true });
    })
    .catch(error => this.setState({ listData: [] }));
  }

  //////////////////// Show bill - billDetail ////////////////////
  onShowBill() {
    queryAllBill()
    .then(listBill => console.log("listBill", listBill))
    .catch(error => alert('Xem listBill thất bại'));
  }

  onShowBillDetail() {
    queryAllBillDetail()
    .then(listBillDetal => console.log("listBillDetal", listBillDetal))
    .catch(error => alert('Xem listBillDetal thất bại'));
  }
  //////////////////// Show bill - billDetail ////////////////////


  //////////////////// Tăng - giảm số lượng món cần gọi ////////////////////
  onIncrease(itemId) {
    const newListFood = this.state.listData.map(e => {
      if(e.food.id !== itemId)
        return e;
      return { food: e.food, quantity: e.quantity + 1 };
    })
    this.setState({ listData: newListFood });
  }

  onDecrease(itemId) {
    const newListFood = this.state.listData.map(e => {
      if(e.food.id !== itemId)
        return e;
      return { food: e.food, quantity: e.quantity <= 1 ? 1 : e.quantity - 1 };
    })
    this.setState({ listData: newListFood  });
  }
  //////////////////// Tăng - giảm số lượng món cần gọi ////////////////////


  //Tạo hóa đơn mới khi bàn trống gọi món
  onCreateNewBill(item) {
    insertNewBill({
      id: Math.floor(Date.now() / 1000)
    })
    .then(newBill => {
      insertNewBillDetail({
        id: Math.floor(Date.now() / 1000),
        quantity: item.quantity,
        status: false,
        time: new Date(),
        idEmployee: this.props.employee.id,
        idTable: this.props.table,
        idFood: item.food.id,
        idBill: newBill.id
      })
      .then(newBillDetail => alert(`Thêm ${item.food.name} số lượng ${item.quantity} thành công`))
      .catch(error => alert('ONCREATEBILLDETAIL - Thêm thất bại'));
    })
    .catch(error => alert('ONCREATEBILL - Thêm thất bại'));
  }

  //Thêm món vào hóa đơn khi bàn đang sử dụng gọi thêm món
  onAddBillOld(item, idBill) {
    insertNewBillDetail({
      id: Math.floor(Date.now() / 1000),
      quantity: item.quantity,
      status: false,
      time: new Date(),
      idEmployee: this.props.employee.id,
      idTable: this.props.table,
      idFood: item.food.id,
      idBill: idBill
    })
    .then(newBillDetail => alert(`Thêm ${item.food.name} số lượng ${item.quantity} thành công`))
    .catch(error => alert('ONCREATEBILLDETAIL - Thêm thất bại'));
  }

  //Xử lý của button Thêm món
  onInsertOrder(item) {
    tableStatus(this.props.table)
    .then(idBill => idBill === null ? this.onCreateNewBill(item) : this.onAddBillOld(item, idBill))
    .catch(error => alert('onInsertOrder thất bại'));
  }

  render() {
    const { listData, nameList, search } = this.state;
    const { table, employee } = this.props;
    const { container, wrapHeader, inputSearch, wrapAllFeature, wrapFeature, btnFeature,
            wrapListData, headerBack, btnBack, txtBack,
            wrapText, txtNameCategory,
            wrapItemFood, wrapInfoFood, txtFood, wrapSoLuongFood, btnFood 
          } = styles;

    console.log("nameList", nameList);
    const MainView = nameList == 'categoryFood' ?
    <FlatListCategoryFood 
      listCategoryFood={listData}
      onNavigationFood={categoryFoodId => this.onNavigationFood(categoryFoodId)}
    /> 
    : 
    <FlatListFood
      listFood={listData}
      onIncrease={foodId => this.onIncrease(foodId)}
      onDecrease={foodId => this.onDecrease(foodId)}
      onInsertOrder={food => this.onInsertOrder(food)}
    />
    //<View />

    return (
      <View style={container}>
        <View style={wrapHeader}>
          <TextInput 
            style={inputSearch}
            placeholder="Search"
            underlineColorAndroid='transparent'
            value={search}
            onChangeText={text => {
              this.setState({ search: text });
              if(text === '')
                this.onBackCategoryFood();
              else
                this.onFilterData(text);
            }}
          />

          <View style={wrapAllFeature}>
            <ComboboxTable />

            <View style={wrapFeature}>
              <TouchableOpacity
                style={btnFeature}
                onPress={() => this.onShowBill()}
              >
                <Text>a</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={btnFeature}
                onPress={() => this.onShowBillDetail()}
              >
                <Text>a</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {nameList === 'categoryFood' ? null : (
          <View style={headerBack}>
            <TouchableOpacity
                style={btnBack}
                onPress={() => this.onBackCategoryFood()}
            >
              <Image source={require('./../../../Media/Icon/left.png')} />
            </TouchableOpacity>
          </View>
        )}

        {MainView}        
        
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    employee: state.employeeSignedIn,
    table: state.chooseTable
  };
}

export default connect(mapStatetoProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  // ---> Header <---
  wrapHeader: {
    paddingHorizontal: 10,
    marginBottom: 5
  },
  inputSearch: {
    width: width - 20,
    height: height / 16,
    backgroundColor: 'whitesmoke',
    padding: 10,
    marginVertical: 5
  },
  wrapAllFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  wrapFeature: {
    flexDirection: 'row',
  },
  btnFeature: {
    backgroundColor: '#2ABB9C',
    marginLeft: 5,
    width: 32,
    height: 32
  },
  // ---> Header Back <---
  headerBack: {
    height: height / 12,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10
  },
  txtBack: {
    fontSize: 20
  },
  ///////////// FlatList/////////////
  wrapListData: {
    paddingHorizontal: 5
  },
  // ---> List CategoryFood <---
  wrapText: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  txtNameCategory: {
    fontSize: 24
  },
  // ---> List Food <---
  wrapItemFood: {    
    flexDirection: 'row',
    marginTop: 5
  },
  wrapInfoFood: {
    marginLeft: 10,
    marginTop: -5,
    justifyContent: 'space-around'
  },
  txtFood: {
    fontSize: 18
  },
  wrapSoLuongFood: {
    flexDirection: 'row'
  },
  btnFood: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});