import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Styles from 'App/Styles';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Styles.Colors.primary,
  }
});

class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Home');
    }, 800);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={[
            Styles.Helpers.center,
            { fontSize: 32, fontWeight: 'bold', color: Styles.Colors.white }
          ]}>
            {'PropertyApp'}
          </Text>
          <ActivityIndicator style={{ marginTop: width * 0.25 }} />
        </View>
      </View>
    );
  }
}

export default Splash;
