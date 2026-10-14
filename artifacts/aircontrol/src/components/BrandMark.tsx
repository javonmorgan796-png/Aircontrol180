import React from 'react';
import { StyleSheet, View } from 'react-native';

export function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <View
      accessibilityLabel="AirControl mark"
      testID="aircontrol-mark"
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.31 }]}
    >
      <View style={styles.outerRing} />
      <View style={styles.centerCore} />
      <View style={[styles.ray, styles.rayOne]} />
      <View style={[styles.ray, styles.rayTwo]} />
      <View style={[styles.ray, styles.rayThree]} />
      <View style={[styles.ray, styles.rayFour]} />
      <View style={styles.markDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: '#111A2D',
    borderWidth: 1,
    borderColor: '#344B82',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outerRing: {
    position: 'absolute',
    width: '72%',
    height: '72%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(102, 145, 255, 0.36)',
  },
  centerCore: {
    width: '25%',
    height: '25%',
    borderRadius: 9,
    backgroundColor: '#779AFF',
    shadowColor: '#6887FF',
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 4,
  },
  ray: { position: 'absolute', width: 2, height: '20%', backgroundColor: '#8FAAFF', borderRadius: 2 },
  rayOne: { top: '10%' },
  rayTwo: { bottom: '10%' },
  rayThree: { left: '10%', height: 2, width: '20%' },
  rayFour: { right: '10%', height: 2, width: '20%' },
  markDot: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#C5D2FF', top: '21%', right: '22%' },
});
