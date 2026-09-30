import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {DOC_VERIFICATION_CONFIG, DocVerificationType} from '../data/docVerificationConfig';

interface DocLiveCameraScreenProps {
  docType: DocVerificationType;
  onCaptured: (photoUri: string) => void;
  onCancel?: () => void;
}

const DocLiveCameraScreen: React.FC<DocLiveCameraScreenProps> = ({
  docType,
  onCaptured,
  onCancel,
}) => {
  const config = DOC_VERIFICATION_CONFIG[docType];
  const [position, setPosition] = useState<'front' | 'back'>(
    config.useFrontCamera ? 'front' : 'back',
  );
  const device = useCameraDevice(position);
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [askedOnce, setAskedOnce] = useState(false);

  useEffect(() => {
    if (!hasPermission && !askedOnce) {
      setAskedOnce(true);
      requestPermission().then(granted => {
        if (!granted) {
          // Android stops showing the OS popup after one denial — the
          // only way forward at that point is the phone's own settings.
          // This alert is a fallback, not an extra "ask" screen: it only
          // appears if the person taps Deny on the native OS prompt.
          Alert.alert(
            'Camera access needed',
            'Camera access was denied. Please enable it in your phone settings to continue verification.',
            [
              {text: 'Cancel', style: 'cancel', onPress: onCancel},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ],
          );
        }
      });
    }
  }, [hasPermission, askedOnce, requestPermission, onCancel]);

  const handleCapture = useCallback(async () => {
    if (!camera.current || isCapturing) {
      return;
    }
    try {
      setIsCapturing(true);
      const photo = await camera.current.takePhoto({flash: 'off'});
      onCaptured(`file://${photo.path}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Capture failed', 'Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onCaptured]);

  const handlePickFromGallery = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        onCaptured(uri);
      }
    });
  };

  if (!hasPermission) {
    // Request happens silently in the useEffect above — no custom
    // "Grant Permission" screen; just a blank camera-colored view while
    // the one-time OS permission dialog is pending or being answered.
    return <View style={styles.permissionScreen} />;
  }

  if (!device) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>No camera device found.</Text>
        {onCancel && (
          // eslint-disable-next-line react-native/no-inline-styles
          <TouchableOpacity onPress={onCancel} style={{marginTop: 16}}>
            <Text style={styles.cancelText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Guide frame — open top/bottom card brackets, split in the middle */}
      <View style={styles.frameWrap} pointerEvents="none">
        <View style={styles.frameHalfTop} />
        <View style={styles.frameHalfBottom} />
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        activeOpacity={0.85}
        onPress={handleCapture}
        disabled={isCapturing}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setPosition(p => (p === 'front' ? 'back' : 'front'))}>
          <Ionicons name="camera-reverse-outline" size={30} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          disabled={isCapturing}
        />

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickFromGallery}>
          <Ionicons name="image-outline" size={20} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FRAME_WIDTH = 300;
const FRAME_HALF_HEIGHT = 110;
const FRAME_GAP = 80;
const FRAME_HEIGHT = FRAME_HALF_HEIGHT * 2 + FRAME_GAP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: colors.primaryGreen,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    color: colors.white,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  frameWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    marginLeft: -FRAME_WIDTH / 2,
    marginTop: -FRAME_HEIGHT / 2,
  },
  // Top half of the card outline — open at the bottom edge.
  frameHalfTop: {
    width: FRAME_WIDTH,
    height: FRAME_HALF_HEIGHT,
    borderColor: colors.white,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  // Bottom half of the card outline — open at the top edge.
  frameHalfBottom: {
    width: FRAME_WIDTH,
    height: FRAME_HALF_HEIGHT,
    marginTop: FRAME_GAP,
    borderColor: colors.white,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  // Figma: 100 x 48, radius 30, top 86 / right-aligned near screen edge
  verifyButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    height: 48,
    borderRadius: 30,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  galleryButton: {
    position: 'absolute',
    right: 24,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DocLiveCameraScreen;