import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export const Container: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

export const LoadingContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.loadingContainer}>{children}</View>
);

export const ErrorContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.errorContainer}>{children}</View>
);

export const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.errorText}>{children}</Text>
);

export const RetryButton: React.FC<{ children: React.ReactNode; onPress: () => void }> = ({ children, onPress }) => (
  <TouchableOpacity style={styles.retryButton} onPress={onPress}>{children}</TouchableOpacity>
);

export const RetryButtonText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.retryButtonText}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
