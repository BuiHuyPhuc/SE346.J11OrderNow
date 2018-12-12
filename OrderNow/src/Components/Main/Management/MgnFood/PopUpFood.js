import React, { Component } from 'react';
import {
	StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert, Picker
} from 'react-native';
import Dialog, { DialogTitle } from 'react-native-popup-dialog';

import realm from './../../../../Database/All_Schemas';
import { queryAllCategoryFood } from './../../../../Database/All_Schemas';

import { connect } from 'react-redux';
import { onCancelPopup, onClickUpdate, onAddNewFood, onUpdateFood, onDeleteFood,
		 onLoadListCategoryFood } from './../../../../Redux/ActionCreators';

let monnuongIcon = require('./../../../../Media/Category/mon-nuong.png');

class PopUpFood extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			name: '',
			price: '',
			selectedCategoryFoodId: ''
		};
	}

	componentDidMount() {
		queryAllCategoryFood()
		.then(list => {
			this.setState({ list })
		})
		.catch(error => this.setState({ list: [] }));
	}

	onAdd(newFood, categoryFoodId) {
		const { name, price } = this.state;
		const { onCancelPopup, onAddNewFood } = this.props;
		if(name == '' || price == '')
			return alert('Vui lòng điền đầy đủ thông tin!');
		console.log("CATEGORY_FOOD_ID", categoryFoodId)
		onAddNewFood(newFood, categoryFoodId);
		onCancelPopup();
	}

	// onUpdate(categoryFood) {
	// 	const { onCancelPopup, onUpdateCategoryFood } = this.props;
	// 	onUpdateCategoryFood(categoryFood)
	// 	onCancelPopup();
	// }

	// onDelete(categoryFood) {
	// 	const { onCancelPopup, onDeleteCategoryFood } = this.props;
	// 	Alert.alert(
	// 		'Xóa',
	// 		`Xóa loại món ăn: ${categoryFood.name}`,
	// 		[
	// 		{
	// 				text: 'Yes', onPress: () => {
	// 					onDeleteCategoryFood(categoryFood.id);
	// 					onCancelPopup();
	// 				}
	// 			},
	// 			{
	// 				text: 'No', onPress: () => onCancelPopup(),
	// 				style: 'cancel'
	// 			}				
	// 		],
	// 		{ cancelable: true }
	// 	);
	// }

	renderItem() {
    	items = [];
    	for(let item of this.state.listCategoryFood) {
    		items.push(<Picker.Item key={item} value={item.id} label={item.name} />)
    	}
    	return items;
    }

	render() {
		const { name, price, selectedCategoryFoodId } = this.state;
		const { title, categoryFood, isSave, isUpdate, visible, chooseCategoryFoodId,
				onCancelPopup, onClickUpdate } = this.props;
		const { wrapUpdate_Delete, btnFeature, wrapDialog, textInput, cmbCategoryFood, 
				wrapBtnImage, imgLoaiMon, wrapAllBtn, wrapBtn, btnText } = styles;

		const btnUpdate_delete = (
			<View style={wrapUpdate_Delete}>
				<TouchableOpacity
	              style={btnFeature}
	              onPress={() => {}}
	            >
	              <Text>U</Text>
	            </TouchableOpacity>
	            <TouchableOpacity
	              style={btnFeature}
	              onPress={() => {}}
	            >
	              <Text>D</Text>
	            </TouchableOpacity>
			</View>
		);

		return (
			<Dialog
				dialogTitle={<DialogTitle title={title} />}
				width={0.8} height={400}
				//onShow={() => categoryFood == null ? this.setState({ name: '' }) : this.setState({ name: categoryFood.name })}
				visible={visible}
			>
				{isUpdate ? btnUpdate_delete : null}

				<View style={wrapDialog}>
					<View pointerEvents={isSave ? "auto" : "none"}>
						<TextInput
							style={textInput}
							placeholder="Nhập tên món ăn mới"
							autoCapitalize="none"
	              			underlineColorAndroid='transparent'
							onChangeText={text => this.setState({ name: text })}
							value={name}
						/>
						<TextInput
							style={textInput}
							placeholder="Nhập giá món ăn mới"
							autoCapitalize="none"
	              			underlineColorAndroid='transparent'
							onChangeText={text => this.setState({ price: text })}
							value={price}
						/>
						<Picker
					        selectedValue={selectedCategoryFoodId}
					        style={cmbCategoryFood}
					        mode="dropdown"
					        onValueChange={(itemValue, itemIndex) => {
					        	this.setState({ selectedCategoryFoodId: itemValue });
					        	console.log("ID", selectedCategoryFoodId);
					        }}
					    >
					    	{ this.renderItem() }
					    </Picker>
						<View style={wrapBtnImage}>
							<TouchableOpacity
								style={wrapBtn}
								onPress={() => {}}
							>
								<Text style={btnText}>Chọn ảnh</Text>
							</TouchableOpacity>
							<Image 
								style={imgLoaiMon}
								source={monnuongIcon}
							/>
						</View>
					</View>
					
					<View style={wrapAllBtn}>
						<TouchableOpacity
							style={wrapBtn}
							disabled={!isSave}
							onPress={() => this.onAdd({name, price}, selectedCategoryFoodId)}
						>
							<Text style={btnText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={wrapBtn}
							onPress={() => onCancelPopup()}
						>
							<Text style={btnText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Dialog>
		);
	}
}

function mapStateToProps(state) {
	return {
		title: state.popUpFood.title,
		food: state.popUpFood.food,		
		isSave: state.showPopup.isSave,
		isUpdate: state.showPopup.isUpdate,
		visible: state.showPopup.visible
	};
}

export default connect(mapStateToProps, { onCancelPopup, onClickUpdate,
	onAddNewFood, onUpdateFood, onDeleteFood })(PopUpFood);

const styles = StyleSheet.create({
  // ---> Update - Delete <---
  wrapUpdate_Delete: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 20
  },
  btnFeature: {
    backgroundColor: '#2ABB9C',
    marginLeft: 5,
    width: 32,
    height: 32
  },
  // ---> Add <---
  wrapDialog: {
    marginTop: 10
  },
  textInput: {
    height: 45,
    marginHorizontal: 20,
    backgroundColor: 'whitesmoke',
    paddingLeft: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderColor: '#2ABB9C',
    borderWidth: 1
  },
  cmbCategoryFood: {
  	height: 45,
    marginHorizontal: 20,
    marginBottom: 20
  },
  wrapBtnImage: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	marginHorizontal: 20,
  	marginBottom: 20,
  },
  imgLoaiMon: {
  	width: 75,
  	height: 50
  },
  wrapAllBtn: {
  	flexDirection: 'row',
  	justifyContent: 'center',
  	marginVertical: 10
  },
  wrapBtn: {
    marginHorizontal: 5,
    backgroundColor: '#2ABB9C',
    borderRadius: 20,
    width: 100,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  btnText: {
    color: 'whitesmoke', 
    fontWeight: '600', 
    paddingHorizontal: 20
  }
});
