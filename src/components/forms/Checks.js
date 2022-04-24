import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const array = [
  {
    id: '0',
    key: 'Fully Furnished',
    checked: false,
  },
  {
    id: '1',
    key: 'Semi Furnished',
    checked: false,
  },
  {
    id: '2',
    key: 'Non Furnished',
    checked: false,
  },
  {
    id: '3',
    key: 'Water Supply',
    checked: false,
  },
  {
    id: '4',
    key: 'Parking',
    checked: false,
  },
  {
    id: '5',
    key: 'Internet',
    checked: false,
  },
];

const Checks = ({selectedFeature, value, postFeatures = ''}) => {
  {
    Array.isArray(postFeatures) &&
      postFeatures.map((feature, index) => {
        array.map(arr => {
          if (arr.key == feature.trim()) {
            arr.checked = true;
          }
        });
      });
  }

  const [data, setData] = useState(array);

  useEffect(() => {
    if (!Array.isArray(postFeatures)) {
      let newData = [];
      data.map((dat, key) => {
        dat.checked = false;
        newData.push(dat);
      });
      setData(JSON.parse(JSON.stringify(newData)));
    }
  }, [value]);

  const handleCheck = id => {
    const selectedData = data;
    const index = selectedData.findIndex(x => x.id === id);
    selectedData[index].checked = !selectedData[index].checked;
    let newSelectedData = JSON.parse(JSON.stringify(selectedData));
    setData(newSelectedData);

    const listSelected = data.filter(item => item.checked == true);
    let selectedFeatures = [];
    listSelected.forEach((item, index) => {
      selectedFeatures[index] = item.key.trim();
    });
    {
      selectedFeature(selectedFeatures);
    }
  };

  const List = () => {
    return data.map((item, key) => {
      return (
        <View key={key} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <Checkbox
              style={styles.checkbox}
              uncheckedColor="#F6897F"
              color="#F6897F"
              status={item.checked ? 'checked' : 'unchecked'}
              onPress={() => handleCheck(item.id)}
            />
          </View>
          <Text style={styles.option}>{item.key}</Text>
        </View>
      );
    });
  };

  return (
    <View>
      <List />
    </View>
  );
};

export default Checks;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginHorizontal: wp('6%'),
    transform: [{scaleX: wp('0.25%')}, {scaleY: wp('0.25%')}],
  },
  option: {
    fontFamily: 'Segoe UI',
    fontSize: wp('5%'),
    color: 'black',
  },
});
