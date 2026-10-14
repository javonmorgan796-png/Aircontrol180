import type {
  CameraPermissionRequest,
  CameraPermissionStatus,
} from './cameraPermission';

export async function checkCameraPermission(): Promise<CameraPermissionStatus> {
  return 'unknown';
}

export async function requestCameraPermission(): Promise<CameraPermissionRequest> {
  return {
    available: false,
    status: 'unknown',
    message:
      'Camera permissions are available only in the Android app. No permission or camera access is available in this browser preview.',
  };
}
