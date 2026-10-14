import { PermissionsAndroid } from 'react-native';
import type {
  CameraPermissionRequest,
  CameraPermissionStatus,
} from './cameraPermission';

export async function checkCameraPermission(): Promise<CameraPermissionStatus> {
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  return granted ? 'granted' : 'unknown';
}

export async function requestCameraPermission(): Promise<CameraPermissionRequest> {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Allow AirControl camera access?',
      message:
        'Camera permission is required for a future hand-control feature. Granting access alone does not enable recognition. AirControl currently does not capture or process camera video.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not now',
    },
  );

  return {
    available: true,
    status:
      result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied',
    message: '',
  };
}
