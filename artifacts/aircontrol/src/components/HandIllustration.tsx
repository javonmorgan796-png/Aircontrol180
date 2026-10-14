import React from 'react';
import { StyleSheet, View } from 'react-native';

function Finger({ style }: { style: object }) {
  return <View style={[styles.finger, style]} />;
}

export function HandIllustration() {
  return (
    <View
      accessible
      accessibilityLabel="Custom five-finger hand illustration"
      testID="five-finger-hand-illustration"
      style={styles.illustration}
    >
      <View style={styles.handGlow} />
      <View style={styles.hand}>
        <View style={styles.fingerRow}>
          <Finger style={styles.pinky} />
          <Finger style={styles.ring} />
          <Finger style={styles.middle} />
          <Finger style={styles.index} />
        </View>
        <View style={styles.palm}>
          <View style={styles.palmLine} />
          <View style={styles.palmCrossOne} />
          <View style={styles.palmCrossTwo} />
          <View style={styles.palmNode} />
        </View>
        <View style={styles.thumb} />
        <View style={styles.wrist} />
        <View style={styles.wristLine} />
      </View>
      <View style={styles.scanLine} />
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />
    </View>
  );
}

const outline = '#678DFF';
const styles = StyleSheet.create({
  illustration: { width: 226, height: 247, alignItems: 'center', justifyContent: 'center' },
  handGlow: { position: 'absolute', width: 175, height: 175, borderRadius: 90, backgroundColor: 'rgba(69, 91, 213, 0.11)' },
  hand: { width: 152, height: 202, alignItems: 'center', position: 'relative' },
  fingerRow: { width: 133, height: 83, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5, zIndex: 2 },
  finger: { backgroundColor: '#182949', borderWidth: 1.5, borderColor: outline, borderBottomWidth: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  pinky: { width: 24, height: 52 },
  ring: { width: 25, height: 68 },
  middle: { width: 26, height: 82 },
  index: { width: 25, height: 65 },
  palm: { width: 103, height: 77, marginTop: -1, backgroundColor: '#192B4D', borderWidth: 1.5, borderColor: outline, borderRadius: 25, zIndex: 3, overflow: 'hidden' },
  palmLine: { position: 'absolute', width: 1, height: 44, backgroundColor: 'rgba(133, 164, 255, 0.58)', top: 12, left: 51 },
  palmCrossOne: { position: 'absolute', width: 52, height: 1, backgroundColor: 'rgba(133, 164, 255, 0.58)', left: 25, top: 30, transform: [{ rotate: '-19deg' }] },
  palmCrossTwo: { position: 'absolute', width: 37, height: 1, backgroundColor: 'rgba(175, 131, 255, 0.65)', left: 19, top: 48, transform: [{ rotate: '20deg' }] },
  palmNode: { position: 'absolute', width: 9, height: 9, borderRadius: 5, left: 46, top: 33, backgroundColor: '#B5C5FF', borderWidth: 2, borderColor: '#647EFF' },
  thumb: { position: 'absolute', zIndex: 1, width: 26, height: 61, left: 13, top: 99, backgroundColor: '#1B2B4D', borderWidth: 1.5, borderColor: outline, borderRadius: 14, transform: [{ rotate: '-43deg' }] },
  wrist: { width: 65, height: 43, marginTop: -2, backgroundColor: '#172746', borderLeftWidth: 1.5, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: outline, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, zIndex: 2 },
  wristLine: { width: 42, height: 1, position: 'absolute', bottom: 15, backgroundColor: 'rgba(152, 171, 255, 0.65)', zIndex: 3 },
  scanLine: { position: 'absolute', width: 179, height: 1, top: 112, backgroundColor: 'rgba(127, 155, 255, 0.46)' },
  corner: { position: 'absolute', width: 15, height: 15, borderColor: '#776BED' },
  cornerTopLeft: { top: 10, left: 9, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTopRight: { top: 10, right: 9, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBottomLeft: { bottom: 11, left: 9, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBottomRight: { bottom: 11, right: 9, borderBottomWidth: 1, borderRightWidth: 1 },
});
