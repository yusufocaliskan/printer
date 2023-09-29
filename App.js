import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  PermissionsAndroid,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
import {styles} from './styles';
import CustomButton from './src/components/CustomButton';

const App = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [isScaning, setIsScaning] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    //Check if bluetooth is open.
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );

    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      rsp => {
        deviceAlreadPaired(rsp);
      },
    );
    DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
      deviceFoundEvent(rsp);
    });
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      () => {
        setName('');
        setBoundAddress('');
      },
    );
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
      () => {
        ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
      },
    );
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;

      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      console.log('foundDs', foundDs);
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);

            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);

    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
        setIsDisable(false);
      },
      e => {
        setLoading(false);

        alert(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    setIsScaning(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        console.log('fdsddd-->', fds);
        setLoading(false);
        setIsScaning(false);
      },
      er => {
        setLoading(false);
        setIsScaning(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'Bluetooth izini',
          message: 'Bluetooth izini',
          buttonNeutral: 'Daha sonra',
          buttonNegative: 'Iptal',
          buttonPositive: 'Onayla',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerActionButtonView}>
        <View>
          <Text style={{color: bleOpend ? '#47BF34' : '#A8A9AA'}}>
            {bleOpend ? ' Bluetoth Açık' : 'Bluetoth Kapalı'}
          </Text>
        </View>
      </View>
      <View style={styles.sectionView}>
        <Text style={styles.sectionTitle}>Yazdır</Text>
        <SamplePrint />
      </View>

      {!bleOpend && (
        <Text style={styles.bluetoothInfo}>
          Bluetooth aktif, uygulmayı kullanmak için Bluetoth aktif olmalı.
        </Text>
      )}

      {boundAddress.length > 0 && (
        <View style={styles.sectionView}>
          <Text style={styles.sectionTitle}>Bağlı yazıcılar </Text>
          <ItemList
            label={name}
            value={boundAddress}
            onPress={() => unPair(boundAddress)}
            actionText="Beni unut"
            color="blue"
          />
        </View>
      )}

      <View style={styles.sectionView}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={styles.sectionTitle}>Aktif Cihazlar </Text>
          <View>
            {!isScaning && bleOpend && (
              <CustomButton
                onPress={() => scanBluetoothDevice()}
                title="Tarama Yap"
                style={{paddingVertical: 4}}
                textStye={{fontSize: 14}}
              />
            )}
            {isScaning && <ActivityIndicator animating={true} size={30} />}
          </View>
        </View>
        {!isScaning && (
          <View style={styles.containerList}>
            {foundDs.map((item, index) => {
              return (
                <ItemList
                  key={index}
                  onPress={!loading ? () => connect(item) : null}
                  label={item.name}
                  value={item.address}
                  connected={item.address === boundAddress}
                  actionText={loading ? 'bi saniye...' : 'Bağlan'}
                  color={!loading ? 'orange' : 'gray'}
                  isDisable={loading}
                />
              );
            })}
          </View>
        )}
      </View>

      <View style={{height: 100}} />
    </ScrollView>
  );
};

export default App;
