/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock the entire App navigator since testing full navigation is complex
jest.mock('../src/navigation/AppNavigator', () => {
  return function MockedAppNavigator() {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, {}, React.createElement(Text, {}, 'Mock App Navigator'));
  };
});

import App from '../App';

describe('App', () => {
  test('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Mock App Navigator')).toBeTruthy();
  });
});
