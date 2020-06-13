/* eslint-disable react-native/no-inline-styles */
// External libs
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import RNDocumentScanner from 'react-native-document-scanner';
import Icon from 'react-native-vector-icons/AntDesign';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCapturing: false,
      isCropping: false,
      isValidatingImageCropping: false,
      image: [],
      allowScanning: true,
    };
  }

  /**
   * When crop button is clicked
   */
  _handlePressCrop = () => {
    this.setState({isValidatingImageCropping: true}, () => {
      setTimeout(this._startImageCropping, 0);
    });
  };

  /**
   * Start image cropping
   */
  _startImageCropping = () => {
    this.scanner.cropImage().then(({image}) => {
      let tempArr = this.state.image;
      tempArr.push(image);

      this.setState(
        {
          allowScanning: false,
          image: tempArr,
          isValidatingImageCropping: false,
        },
        () => {
          console.log('after cropping', this.state.image);
        },
      );
    });
  };

  render() {
    const {
      isCapturing,
      isCropping,
      isValidatingImageCropping,
      image,
      allowScanning,
    } = this.state;

    if (allowScanning) {
      return (
        <View style={styles.container} sv>
          {/* Document scanner */}
          <RNDocumentScanner
            ref={(ref) => (this.scanner = ref)}
            onStartCapture={() => this.setState({isCapturing: true})}
            onEndCapture={() =>
              this.setState({isCapturing: false, isCropping: true})
            }
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />

          {/* Button to scan document */}
          <Button
            disabled={!isCropping}
            onPress={this._handlePressCrop}
            title="Validate"
            color="#800080"
          />

          {/* Loading during capture */}
          {(isCapturing || isValidatingImageCropping) && (
            <ActivityIndicator style={styles.loading} animating />
          )}
        </View>
      );
    } else {
      return (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <FlatList
            horizontal
            style={{padding: 20}}
            data={image}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}`}
            renderItem={({item, index}) => {
              return (
                <View style={{marginHorizontal: 20}}>
                  <TouchableOpacity style={styles.deleteIcon}>
                    <Icon name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Image
                    style={styles.image}
                    source={{uri: item}}
                    resizeMode="contain"
                  />
                </View>
              );
            }}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => this.setState({image: [], allowScanning: true})}
              style={[styles.btn, {backgroundColor: 'skyblue'}]}>
              <Text style={styles.btnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({allowScanning: true, isCropping: false})
              }
              style={[styles.btn, {backgroundColor: 'purple'}]}>
              <Text style={[styles.btnText, {color: '#fff'}]}>
                Add more Document ({this.state.image.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let data = {
                  image: image,
                  selectedIndex: this.props.route.params.selectedDoc,
                };
                this.props.navigation.goBack();
                this.props.route.params.onDone(data);
              }}
              style={[styles.btn, {backgroundColor: 'green'}]}>
              <Text style={[styles.btnText, {color: '#fff'}]}>done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={[styles.btn, {backgroundColor: 'darkgray'}]}>
              <Text style={[styles.btnText, {color: '#fff'}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  btn: {
    marginHorizontal: 25,
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#000',
  },
  image: {
    marginTop: 10,
    marginRight: 10,
    height: HEIGHT / 2.5,
    width: WIDTH / 1.5,
    backgroundColor: '#000',
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});
