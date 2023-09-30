import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerList: {flex: 1, flexDirection: 'column'},
  bluetoothStatusContainer: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: 'white',
    paddingHorizontal: 14,
  }),
  bluetoothInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFC806',
    marginBottom: 20,
  },
  sectionTitle: {fontSize: 18, marginBottom: 12},
  printerInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  loaderView: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    marginVertical: 30,
  },
  loaderText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  sectionView: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  headerActionButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
