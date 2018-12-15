import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, Image
} from 'react-native';

import { connect } from 'react-redux';
import { onEmployeeSignedIn } from './../Redux/ActionCreators';

import { signInEmployee } from './../Database/All_Schemas';

let logoIcon = require('./../Media/Temp/default.png');

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        username: '', 
        password: ''
    };
  }

  onSignIn(username, password) {
    signInEmployee(username, password)
    .then(employee => {
      if(employee == null)
        alert('Tài khoản hoặc mật khẩu không chính xác!');
      else {
        this.props.onEmployeeSignedIn(employee);
        this.setState({ username: '', password: ''});
        this.props.navigation.navigate('Screen_AppOrderNow');
      }
    })
    .catch(error => console.log("error - signIn", error));
  }

  render() {
    const { username, password } = this.state;
    const { container, wrapLogo, txtLogo, imgLogo, textInput, btnChange, btnText } = styles;
    return (
      <View style={container}>
        <View style={wrapLogo}>
          <Text style={txtLogo}>Order Now</Text>
          <Image 
            style={imgLogo}
            source={logoIcon}
          >
          </Image>
        </View>
        
        <View style={{ marginTop: 50 }}>
          <TextInput
              style={textInput}
              placeholder="Nhập tài khoản"
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              value={username}
              onChangeText={text => this.setState({ username: text })}
          />
          <TextInput
              style={textInput}
              placeholder="Nhập mật khẩu"
              autoCapitalize="none"
              secureTextEntry
              underlineColorAndroid='transparent'
              value={password}
              onChangeText={text => this.setState({ password: text })}
          />
          <TouchableOpacity 
              style={btnChange}
              onPress={() => this.onSignIn(username, password)}
          >
              <Text style={btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(null, { onEmployeeSignedIn })(SignIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92F1E2'
  },
  wrapLogo: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute' 
  },
  txtLogo: { 
    fontSize: 72, 
    color: '#2ABB9C' 
  },
  imgLogo: { 
    width: 350, 
    height: 350,
    tintColor: '#2ABB9C'
  },
  textInput: {
    width: 300,
    height: 45,
    marginHorizontal: 20,
    backgroundColor: 'whitesmoke',
    paddingLeft: 20,
    borderRadius: 20,
    marginBottom: 10,
    borderColor: '#2ABB9C',
    borderWidth: 1
  },
  btnChange: {
    width: 300,
    height: 45,
    marginHorizontal: 20,
    backgroundColor: '#2ABB9C',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  btnText: {
    color: 'whitesmoke', 
    fontWeight: '600', 
    paddingHorizontal: 20
  },
});