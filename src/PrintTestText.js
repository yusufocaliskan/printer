import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';

import CustomButton from './components/CustomButton';

const PrintTestText = () => {
  const [getText, setText] = useState('Telefondan : Test Çıktı.');

  return (
    <View>
      <View style={styles.btn}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'lightgray',
            padding: 10,
            marginBottom: 20,
            height: 150,
            textAlignVertical: 'top',
            borderRadius: 10,
          }}
          placeholder="Bir şeyler yaz."
          multiline={true}
          onChangeText={text => setText(text)}
        />
        <CustomButton
          onPress={async () => {
            await BluetoothEscposPrinter.printerUnderLine(2);
            await BluetoothEscposPrinter.printText(getText + '\r\n', {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1,
            });
            await BluetoothEscposPrinter.printerUnderLine(0);
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Yazdır"
          textStye={{textAlign: 'center'}}
        />
      </View>
    </View>
  );
};

export default PrintTestText;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
  },
});
