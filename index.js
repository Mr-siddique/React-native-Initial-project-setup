/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from "react-redux";
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';
console.log("projectSetup")
AppRegistry.registerComponent(appName, () => App);
//TODO: revert gemfile and gemfile.lock if the issue is not fixed