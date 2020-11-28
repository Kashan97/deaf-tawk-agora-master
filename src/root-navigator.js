/* @flow */

import * as React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Pages, { routesMap } from './pages';
import {title} from './settings';

import EventBus from 'eventing-bus';
const routes = Object.keys(routesMap)
  .map(id => ({ id, item: routesMap[id] }))
  .reduce((acc, { id, item }) => {
    const Comp = item;
    const Screen = props => <Comp {...props} />;

    Screen.navigationOptions = props => ({
      header: null,
      /* $FlowFixMe */
      ...(typeof Comp.navigationOptions === 'function'
        ? Comp.navigationOptions(props)
        : Comp.navigationOptions),
    });

    return {
      ...acc,
      [id]: { screen: Screen },
    };
  }, {});

export default createStackNavigator(
  {
    home: { screen: Pages },
    ...routes,
  },
  // {
  //   navigationOptions: ({ navigation }) => ({
  //     title,
  //     gestureResponseDistance: {
  //       horizontal: 45,
  //     },
  //     header: null,
  //   }),
  // }
);

const styles = StyleSheet.create({
  colors: {
    backgroundColor: "#02a5de"
  }
})
