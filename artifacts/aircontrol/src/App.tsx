import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AirControl (native)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#080B12' },
  card: { width: 220, height: 220, borderRadius: 24, backgroundColor: '#0D1421', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#EAF0FF', fontSize: 18, fontWeight: '700' },
});
