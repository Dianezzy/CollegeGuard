import { Ionicons,MaterialIcons} from '@expo/vector-icons';
//  Font.loadAsync({
//   'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')
// })
import * as React from 'react';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <MaterialIcons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
