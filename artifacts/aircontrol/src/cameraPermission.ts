export type CameraPermissionStatus = 'unknown' | 'granted' | 'denied';

export type CameraPermissionRequest = {
  available: boolean;
  status: CameraPermissionStatus;
  message: string;
};

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
