import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, FlatList, Alert
} from 'react-native';

import realm from './../../../Database/All_Schemas';
import { filterUnpaidBill, updateBill } from './../../../Database/All_Schemas';

import getFormattedMoney from './../../../Api/FormattedMoney';

const { width, height } = Dimensions.get("window");

export default class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUnpaidBill: [],
      search: ''
    };
    this.onReloadData();
    realm.addListener('change', () => {
      this.onReloadData();
    })
  }

  onReloadData() {
    filterUnpaidBill()
    .then(listUnpaidBill => this.setState({ listUnpaidBill }))
    .catch(error => this.setState({ listUnpaidBill: [] }));
  }

  onPaidBill(bill, table) {
    Alert.alert(
      'Thanh toán',
      `Bàn số ${table} tổng tiền cần thanh toán ${bill.total.getFormattedMoney(0)} VNĐ`,
      [
        {
          text: 'Yes', onPress: () => {
            updateBill(bill)
            .then(() => alert('Thanh toán thành công'))
            .catch(error => alert('Thanh toán thất bại'));
          }
        },
        {
          text: 'No', onPress: () => {},
          style: 'cancel'
        }       
      ],
      { cancelable: true }
    )    
  }

  render() {
    const { listUnpaidBill, search } = this.state;
    const { navigation } = this.props;
    const { container, wrapSearch, inputSearch,
            wrapList, wrapItem, wrapLeftItem, wrapRightItem, txtTitle, btnXem, btnThanhtoan, btnText 
          } = styles;
    return (
      <View style={container}>
        <View style={wrapSearch}>
          <TextInput 
            style={inputSearch}
            placeholder="Search"
            underlineColorAndroid='transparent'
            value={search}
            onChangeText={text => this.setState({ search: text })}
          />
        </View>       


        <FlatList
          style={wrapList}
          data={listUnpaidBill}
          renderItem={({item}) => 
            <View style={wrapItem}>
              <View style={wrapLeftItem}>
                <Text style={txtTitle}>Bàn {item.table}</Text>
                <TouchableOpacity 
                  style={btnXem}
                  onPress={() => navigation.navigate('Screen_BillDetail', { table: item.table })}>
                  <Text style={btnText}>Xem chi tiết</Text>
                </TouchableOpacity>
              </View>

              <View style={wrapRightItem}>
                <Text style={txtTitle}>Tổng tiền: {item.total.getFormattedMoney(0)} VNĐ</Text>
                <TouchableOpacity 
                  style={btnThanhtoan}
                  onPress={() => this.onPaidBill(
                      {id: item.bill.id, status: true, time: new Date(), total: item.total},
                      item.table
                    )
                  }
                >
                  <Text style={btnText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>  
          }
          keyExtractor={item => item.bill.id.toString()}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  // ---> Header <---
  wrapSearch: {
    paddingHorizontal: 10
  },
  inputSearch: {
    width: width - 20,
    height: height / 16,
    backgroundColor: 'whitesmoke',
    padding: 10,
    marginVertical: 5
  },
  // ---> List bill <---
  wrapList: { 
    paddingHorizontal: 5 
  },
  wrapItem: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    marginTop: 5 
  },
  wrapLeftItem: { flex: 3, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' },
  wrapRightItem: { flex: 7, justifyContent: 'center', alignItems: 'center' },
  txtTitle: { 
    fontSize: 24, 
    paddingVertical: 5 
  },
  btnXem: { paddingHorizontal: 5, marginBottom: 5, backgroundColor: '#2ABB9C' },
  btnThanhtoan: { paddingHorizontal: 65, marginBottom: 5, backgroundColor: '#2ABB9C' },
  btnText: { fontSize: 18 }
});
