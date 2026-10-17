import { PermissionsAndroid, Platform } from 'react-native';

export type CameraPermissionStatus = 'unknown' | 'granted' | 'denied';

export type CameraPermissionRequest = {
  available: boolean;
  status: CameraPermissionStatus;
  message: string;
};

export async function checkCameraPermission(): Promise<CameraPermissionStatus> {
  if (Platform.OS !== 'android') {
    return 'unknown';
  }

  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return hasPermission ? 'granted' : 'denied';
  } catch (error) {
    return 'denied';
  }
}

export async function requestCameraPermission(): Promise<CameraPermissionRequest> {
  if (Platform.OS !== 'android') {
    return {
      available: false,
      status: 'unknown',
      message:
        'Camera permissions are available only in the Android app. No permission or camera access is available in this browser preview.',
    };
  }

  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera to stream video feed.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return {
        available: true,
        status: 'granted',
        message: 'Camera permission granted.',
      };
    } else {
      return {
        available: true,
        status: 'denied',
        message: 'Camera permission denied.',
      };
    }
  } catch (error) {
    return {
      available: true,
      status: 'denied',
      message: 'Failed to request camera permission.',
    };
  }
}
