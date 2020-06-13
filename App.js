/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';

//files
import Document from './assets/images/document.png';
import PlusIcon from 'react-native-vector-icons/AntDesign';

export const WIDTH = Dimensions.get('window').width;

export class Home extends Component {
  state = {
    missingDocuments: [
      {docName: 'Physical Form'},
      {docName: 'Proof of Insurance'},
    ],
    uploadedDocuments: [],
    addModal: false,
    documentName: '',
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }

  /*
  .##........#######...######...####..######...######.
  .##.......##.....##.##....##...##..##....##.##....##
  .##.......##.....##.##.........##..##.......##......
  .##.......##.....##.##...####..##..##........######.
  .##.......##.....##.##....##...##..##.............##
  .##.......##.....##.##....##...##..##....##.##....##
  .########..#######...######...####..######...######.
  */

  onDone = (data) => {
    let lastDocName = this.state.missingDocuments[data.selectedIndex].docName;
    this.state.missingDocuments.splice(0, data.selectedIndex);
    let tempArr = this.state.uploadedDocuments;

    console.log(data);
    tempArr.push({
      image: data.image,
      docName: lastDocName,
    });
    this.setState({uploadedDocuments: tempArr});
  };

  _addDocument = () => {
    let tempArr = this.state.missingDocuments;
    tempArr.push({docName: this.state.documentName});
    this.setState({addModal: false, missingDocuments: tempArr});
  };

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##...
  */

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SWOL Scan PDF</Text>
        <TouchableOpacity
          onPress={() => this.setState({addModal: true})}
          style={{alignItems: 'center'}}>
          <PlusIcon name="plus" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        {this.state.addModal && (
          <View style={styles.addModal}>
            <TextInput
              value={this.state.documentName}
              placeholder="Enter Document Name"
              onChangeText={(val) => this.setState({documentName: val})}
              style={styles.input}
            />
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => this.setState({addModal: false})}
                style={[styles.btn, {backgroundColor: 'yellow'}]}>
                <Text style={styles.btnText}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._addDocument()}
                style={[styles.btn, {backgroundColor: 'skyblue'}]}>
                <Text style={styles.btnText}>add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text style={styles.bodyTitle}>Upload Mandatory documents</Text>
        <View>
          <View style={styles.underLine}>
            <Text style={styles.sectionTitle}>missing documents</Text>
          </View>
          <FlatList
            data={this.state.missingDocuments}
            numColumns={3}
            keyExtractor={(item, index) => `${item}`}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.docContainer}
                  onPress={() => this.renderScanningOptions(index)}>
                  <Image source={Document} style={styles.docImage} />
                  <Text style={styles.docName}>{item.docName}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {this.state.uploadedDocuments.length >= 1 && (
          <View>
            <View style={styles.underLine}>
              <Text style={styles.sectionTitle}>uploaded documents</Text>
            </View>
            <FlatList
              data={this.state.uploadedDocuments}
              numColumns={3}
              keyExtractor={(item, index) => `${item}`}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.docContainer}
                    onPress={() => this.renderScanningOptions(index)}>
                    <Image source={Document} style={styles.docImage} />
                    <Text style={styles.docName}>{item.docName}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  renderScanningOptions = (index) => {
    Alert.alert(
      'SWOL scan PDF',
      'choose any Option for scan the document',
      [
        {
          text: 'Scan Document',
          onPress: () =>
            this.props.navigation.navigate('Scanner', {
              selectedDoc: index,
              onDone: this.onDone,
            }),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 55 : 10,
    backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    fontWeight: '600',
  },
  bodyContainer: {
    flex: 1,
    padding: 15,
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionTitle: {
    color: 'darkgray',
    textTransform: 'uppercase',
    marginTop: 20,
  },
  underLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
    paddingBottom: 5,
    marginBottom: 20,
  },
  docContainer: {
    width: (WIDTH - 30) / 3,
    marginBottom: 25,
  },
  docImage: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: 'purple',
    marginBottom: 10,
  },
  docName: {
    textAlign: 'center',
  },
  input: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingLeft: 15,
    borderColor: 'darkgray',
    borderWidth: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  btn: {
    width: '45%',
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
});

export default Home;
