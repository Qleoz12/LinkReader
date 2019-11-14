/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ArticleListComponent from './components/ArticleListComponent';
AppRegistry.registerComponent(appName, () => ArticleListComponent);
