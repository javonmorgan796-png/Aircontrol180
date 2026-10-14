import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { BrandMark } from './components/BrandMark';
import { HandIllustration } from './components/HandIllustration';
import {
  checkCameraPermission,
  requestCameraPermission,
} from './cameraPermission';

type TabName = 'Home' | 'Gestures' | 'Settings';
type GestureName =
  | 'Open Palm'
  | 'Palm Up'
  | 'Palm Down'
  | 'Pinch'
  | 'Swipe Left'
  | 'Swipe Right'
  | 'Closed Fist';

const GESTURES: GestureName[] = [
  'Open Palm',
  'Palm Up',
  'Palm Down',
  'Pinch',
  'Swipe Left',
  'Swipe Right',
  'Closed Fist',
];
const ACTIONS = [
  'No action',
  'Play / pause',
  'Next track',
  'Previous track',
  'Volume up',
  'Volume down',
  'Mute / unmute',
  'Scroll up',
  'Scroll down',
];

const initialActions: Record<GestureName, string> = {
  'Open Palm': 'Play / pause',
  'Palm Up': 'Volume up',
  'Palm Down': 'Volume down',
  Pinch: 'Mute / unmute',
  'Swipe Left': 'Previous track',
  'Swipe Right': 'Next track',
  'Closed Fist': 'No action',
};

const gestureHint: Record<GestureName, string> = {
  'Open Palm': 'A steady, open hand',
  'Palm Up': 'Palm facing the ceiling',
  'Palm Down': 'Palm facing the floor',
  Pinch: 'Thumb and index finger meet',
  'Swipe Left': 'A quick motion to the left',
  'Swipe Right': 'A quick motion to the right',
  'Closed Fist': 'Fingers gently curled in',
};

function Pill({
  children,
  tone = 'blue',
}: {
  children: string;
  tone?: 'blue' | 'muted' | 'purple';
}) {
  return (
    <View style={[styles.pill, tone === 'purple' ? styles.pillPurple : tone === 'muted' ? styles.pillMuted : null]}>
      <View style={[styles.pillDot, tone === 'purple' ? styles.pillDotPurple : tone === 'muted' ? styles.pillDotMuted : null]} />
      <Text style={[styles.pillText, tone === 'muted' ? styles.pillTextMuted : null]}>{children}</Text>
    </View>
  );
}

function TabBar({
  active,
  onSelect,
}: {
  active: TabName;
  onSelect: (tab: TabName) => void;
}) {
  const tabs: { name: TabName; icon: string }[] = [
    { name: 'Home', icon: 'H' },
    { name: 'Gestures', icon: 'G' },
    { name: 'Settings', icon: 'S' },
  ];
  return (
    <View style={styles.tabBar} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const selected = active === tab.name;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityLabel={`${tab.name} tab`}
            accessibilityState={{ selected }}
            testID={`tab-${tab.name.toLowerCase()}`}
            onPress={() => onSelect(tab.name)}
            style={styles.tabButton}
          >
            <Text style={[styles.tabIcon, selected && styles.tabIconActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab.name}</Text>
            {selected ? <View style={styles.tabIndicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function ActionSelector({
  value,
  onChange,
  accessibilityLabel,
  testID,
}: {
  value: string;
  onChange: (action: string) => void;
  accessibilityLabel: string;
  testID: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}, assigned ${value}. Tap to change.`}
      testID={testID}
      onPress={() => setOpen(!open)}
      style={styles.actionSelector}
    >
      <Text style={styles.actionValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.chevron}>{open ? '−' : '⌄'}</Text>
      {open ? (
        <View style={styles.actionMenu}>
          {ACTIONS.map((action) => (
            <Pressable
              key={action}
              accessibilityRole="button"
              accessibilityLabel={`Assign ${action} to ${accessibilityLabel}`}
              testID={`${testID}-${action.toLowerCase().replace(/[^a-z]+/g, '-')}`}
              onPress={() => {
                onChange(action);
                setOpen(false);
              }}
              style={[styles.actionOption, action === value && styles.actionOptionSelected]}
            >
              <Text style={[styles.actionOptionText, action === value && styles.actionOptionTextSelected]}>{action}</Text>
              {action === value ? <Text style={styles.optionCheck}>✓</Text> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

function HomeScreen({
  onNavigate,
  onStart,
  permissionStatus,
  actions,
}: {
  onNavigate: (tab: TabName) => void;
  onStart: () => void;
  permissionStatus: 'unknown' | 'granted' | 'denied';
  actions: Record<GestureName, string>;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  return (
    <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.topHeader}>
        <View style={styles.brandLockup}>
          <BrandMark size={42} />
          <View>
            <Text style={styles.brandName}>AIRCONTROL</Text>
            <Text style={styles.brandSub}>PERSONAL MOTION INTERFACE</Text>
          </View>
        </View>
        <View style={styles.versionMark}><Text style={styles.versionText}>01</Text></View>
      </View>

      <View style={styles.heroCopy}>
        <Text style={styles.heroKicker}>A NEW WAY TO REACH</Text>
        <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Your hands.{'\n'}Your command.</Text>
        <Text style={styles.heroDescription}>A thoughtfully designed gesture layer for the things you do every day.</Text>
      </View>

      <View style={styles.handStage}>
        <View style={[styles.orbit, styles.orbitOne]} />
        <View style={[styles.orbit, styles.orbitTwo]} />
        <View style={[styles.orbit, styles.orbitThree]} />
        <View style={styles.stageIndex}><Text style={styles.stageIndexText}>GESTURE INTERFACE</Text><View style={styles.stageIndexLine} /></View>
        <HandIllustration />
        <View style={styles.stageFoot}><View style={styles.stageDot} /><Text style={styles.stageFootText}>STATIC ILLUSTRATION</Text><Text style={styles.stageFootCode}>AC—01</Text></View>
      </View>

      <View style={styles.availabilityCard}>
        <View style={styles.availabilityHead}>
          <View style={styles.availabilityBadge}><Text style={styles.availabilityBadgeText}>i</Text></View>
          <View style={styles.availabilityCopy}>
            <Text style={styles.availabilityTitle}>Recognition isn’t available yet</Text>
            <Text style={styles.availabilityDetail}>AirControl’s gesture detection is not implemented. No hands are being tracked.</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start Air Control. Gesture detection is currently unavailable."
          testID="start-air-control"
          onPress={onStart}
          style={({ pressed }) => [styles.startButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.startButtonText}>Start Air Control</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </Pressable>
        <Text style={styles.buttonFootnote}>PREVIEW ONLY · DOES NOT START DETECTION</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusCell}>
          <Text style={styles.statusLabel}>HAND TRACKING</Text>
          <Pill tone="muted">Unavailable</Pill>
        </View>
        <View style={styles.statusDivider} />
        <Pressable accessibilityRole="button" accessibilityLabel={`Camera permission status: ${permissionStatus}. Open settings for camera controls.`} testID="home-camera-status" onPress={() => onNavigate('Settings')} style={styles.statusCell}>
          <Text style={styles.statusLabel}>CAMERA ACCESS</Text>
          <Pill tone={permissionStatus === 'granted' ? 'blue' : 'purple'}>{permissionStatus === 'granted' ? 'Allowed' : permissionStatus === 'denied' ? 'Not allowed' : 'Not requested'}</Pill>
        </Pressable>
      </View>

      <View style={styles.shortcutHeading}>
        <View><Text style={styles.eyebrow}>CONTROL LIBRARY</Text><Text style={styles.shortcutTitle}>Gestures, your way.</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Browse all gesture shortcuts" testID="browse-gestures" onPress={() => onNavigate('Gestures')} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>VIEW ALL</Text><Text style={styles.viewAllArrow}>↗</Text>
        </Pressable>
      </View>
      <View style={styles.shortcutGrid}>
        {[
          { code: '01', gesture: 'Open Palm' as GestureName, accent: 'blue' },
          { code: '02', gesture: 'Pinch' as GestureName, accent: 'purple' },
          { code: '03', gesture: 'Swipe Right' as GestureName, accent: 'blue' },
          { code: '04', gesture: 'Closed Fist' as GestureName, accent: 'purple' },
        ].map((item) => (
          <Pressable key={item.code} accessibilityRole="button" accessibilityLabel={`${item.gesture}, assigned ${actions[item.gesture]}. Edit gesture.`} testID={`shortcut-${item.code}`} onPress={() => onNavigate('Gestures')} style={({ pressed }) => [styles.shortcutCard, pressed && styles.cardPressed]}>
            <View style={styles.shortcutTop}><Text style={styles.shortcutCode}>{item.code}</Text><View style={[styles.shortcutSignal, item.accent === 'purple' && styles.shortcutSignalPurple]} /></View>
            <Text style={styles.shortcutName}>{item.gesture}</Text>
            <Text style={styles.shortcutAction}>{actions[item.gesture]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyIcon}>◇</Text>
        <Text style={styles.privacyText}>Private by design. Camera access is only a permission—by itself it does not enable recognition.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Open camera privacy settings" testID="privacy-settings-link" onPress={() => onNavigate('Settings')}><Text style={styles.privacyLink}>DETAILS</Text></Pressable>
      </View>
    </ScrollView>
  );
}

function GesturesScreen({
  actions,
  setActions,
}: {
  actions: Record<GestureName, string>;
  setActions: React.Dispatch<React.SetStateAction<Record<GestureName, string>>>;
}) {
  const [expanded, setExpanded] = useState<GestureName | null>(null);
  return (
    <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.eyebrow}>YOUR CONTROL LANGUAGE</Text>
        <Text style={styles.pageTitle}>Gestures</Text>
        <Text style={styles.pageIntro}>Choose what each movement should do. These are saved as preferences; recognition is not yet available.</Text>
      </View>
      <View style={styles.gestureSummary}>
        <View style={styles.summaryOrb}><Text style={styles.summaryOrbText}>07</Text></View>
        <View style={styles.summaryCopy}><Text style={styles.summaryTitle}>Seven ways to signal</Text><Text style={styles.summaryDetail}>Every gesture can be assigned independently.</Text></View>
        <View style={styles.summaryStatus}><View style={styles.statusTinyDot} /><Text style={styles.summaryStatusText}>SETUP</Text></View>
      </View>
      <View style={styles.gestureList}>
        {GESTURES.map((gesture, index) => {
          const isExpanded = expanded === gesture;
          return (
            <View key={gesture} style={[styles.gestureCard, isExpanded && styles.gestureCardOpen]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${gesture}, assigned ${actions[gesture]}. ${isExpanded ? 'Collapse' : 'Edit'} assignment.`}
                accessibilityState={{ expanded: isExpanded }}
                testID={`gesture-row-${index + 1}`}
                onPress={() => setExpanded(isExpanded ? null : gesture)}
                style={styles.gestureRow}
              >
                <View style={styles.gestureNumber}><Text style={styles.gestureNumberText}>{String(index + 1).padStart(2, '0')}</Text></View>
                <View style={styles.gestureCopy}><Text style={styles.gestureName}>{gesture}</Text><Text style={styles.gestureHint}>{gestureHint[gesture]}</Text></View>
                <View style={styles.gestureAssigned}><Text style={styles.assignedLabel}>ASSIGNED</Text><Text style={styles.assignedValue} numberOfLines={1}>{actions[gesture]}</Text></View>
                <Text style={styles.gestureChevron}>{isExpanded ? '−' : '+'}</Text>
              </Pressable>
              {isExpanded ? (
                <View style={styles.gestureEditor}>
                  <Text style={styles.editorLabel}>WHEN YOU MAKE THIS GESTURE</Text>
                  <ActionSelector
                    value={actions[gesture]}
                    onChange={(action) => setActions((current) => ({ ...current, [gesture]: action }))}
                    accessibilityLabel={gesture}
                    testID={`gesture-action-${index + 1}`}
                  />
                  <Text style={styles.editorNote}>Assignment only. Gesture recognition is not active.</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.gestureFoot}>
        <View style={styles.infoLine} />
        <Text style={styles.gestureFootText}>A gesture assignment never activates the camera. Configure access separately in Settings.</Text>
      </View>
    </ScrollView>
  );
}

function Stepper({
  label,
  detail,
  value,
  unit,
  minimum,
  maximum,
  step,
  onChange,
  testID,
}: {
  label: string;
  detail: string;
  value: number;
  unit: string;
  minimum: number;
  maximum: number;
  step: number;
  onChange: (value: number) => void;
  testID: string;
}) {
  const progress = ((value - minimum) / (maximum - minimum)) * 100;
  const change = (direction: number) => onChange(Math.min(maximum, Math.max(minimum, value + direction * step)));
  return (
    <View style={styles.settingCard}>
      <View style={styles.settingTopLine}>
        <View style={styles.settingCopy}><Text style={styles.settingTitle}>{label}</Text><Text style={styles.settingDetail}>{detail}</Text></View>
        <View style={styles.settingReadout}><Text style={styles.settingValue}>{value}</Text><Text style={styles.settingUnit}>{unit}</Text></View>
      </View>
      <View style={styles.stepperRow}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} testID={`${testID}-decrease`} onPress={() => change(-1)} style={styles.stepperButton}><Text style={styles.stepperSign}>−</Text></Pressable>
        <View style={styles.rangeTrack}><View style={[styles.rangeFill, { width: `${progress}%` }]} /><View style={[styles.rangeThumb, { left: `${progress}%` }]} /></View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} testID={`${testID}-increase`} onPress={() => change(1)} style={styles.stepperButton}><Text style={styles.stepperSign}>+</Text></Pressable>
      </View>
      <View style={styles.rangeLabels}><Text style={styles.rangeLabel}>{minimum}{unit}</Text><Text style={styles.rangeLabel}>{maximum}{unit}</Text></View>
    </View>
  );
}

function SettingsScreen({
  sensitivity,
  setSensitivity,
  duration,
  setDuration,
  permissionStatus,
  onRequestCamera,
  localProcessing,
  setLocalProcessing,
  retainData,
  setRetainData,
  analytics,
  setAnalytics,
}: {
  sensitivity: number;
  setSensitivity: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  permissionStatus: 'unknown' | 'granted' | 'denied';
  onRequestCamera: () => void;
  localProcessing: boolean;
  setLocalProcessing: (value: boolean) => void;
  retainData: boolean;
  setRetainData: (value: boolean) => void;
  analytics: boolean;
  setAnalytics: (value: boolean) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.eyebrow}>TUNE YOUR INSTRUMENT</Text>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageIntro}>Small adjustments. A more personal control surface.</Text>
      </View>

      <View style={styles.settingsGroup}>
        <View style={styles.groupHeading}><Text style={styles.groupTitle}>GESTURE FEEL</Text><Text style={styles.groupIndex}>01 / 03</Text></View>
        <Stepper label="Sensitivity" detail="How much motion a gesture may take" value={sensitivity} unit="%" minimum={10} maximum={90} step={5} onChange={setSensitivity} testID="sensitivity" />
        <Stepper label="Gesture duration" detail="Minimum hold time before a gesture" value={duration} unit="ms" minimum={200} maximum={1000} step={50} onChange={setDuration} testID="duration" />
        <Text style={styles.controlDisclaimer}>These values are saved as local preferences. They do not change detection; recognition has not been implemented.</Text>
      </View>

      <View style={styles.settingsGroup}>
        <View style={styles.groupHeading}><Text style={styles.groupTitle}>CAMERA ACCESS</Text><Text style={styles.groupIndex}>02 / 03</Text></View>
        <View style={styles.cameraCard}>
          <View style={styles.cameraCardHeader}>
            <View style={styles.cameraGlyph}><View style={styles.cameraLens} /></View>
            <View style={styles.cameraInfo}>
              <Text style={styles.cameraTitle}>Device camera</Text>
              <Text style={styles.cameraDesc}>{permissionStatus === 'granted' ? 'Android permission is granted.' : permissionStatus === 'denied' ? 'Android reports that access is not granted.' : 'Permission has not been requested.'}</Text>
            </View>
            <Pill tone={permissionStatus === 'granted' ? 'blue' : 'muted'}>{permissionStatus === 'granted' ? 'Allowed' : permissionStatus === 'denied' ? 'Denied' : 'Off'}</Pill>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={permissionStatus === 'granted' ? 'Check camera permission status' : 'Request Android camera permission'} testID="request-camera-permission" onPress={onRequestCamera} style={({ pressed }) => [styles.permissionButton, pressed && styles.buttonPressed]}>
            <Text style={styles.permissionButtonText}>{permissionStatus === 'granted' ? 'Check permission' : 'Request camera permission'}</Text>
            <Text style={styles.permissionArrow}>→</Text>
          </Pressable>
          <View style={styles.cameraCaveat}><View style={styles.caveatMark}><Text style={styles.caveatMarkText}>!</Text></View><Text style={styles.cameraCaveatText}>Camera access alone does not enable hand recognition. AirControl does not currently capture or process camera video.</Text></View>
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <View style={styles.groupHeading}><Text style={styles.groupTitle}>PRIVACY</Text><Text style={styles.groupIndex}>03 / 03</Text></View>
        <View style={styles.privacyCard}>
          <PrivacyToggle title="On-device processing" detail="Preference for any future recognition processing." value={localProcessing} onValueChange={setLocalProcessing} testID="privacy-on-device" />
          <View style={styles.preferenceDivider} />
          <PrivacyToggle title="Save gesture history" detail="Keep a local history of gestures." value={retainData} onValueChange={setRetainData} testID="privacy-history" />
          <View style={styles.preferenceDivider} />
          <PrivacyToggle title="Share diagnostic data" detail="Preference only. No diagnostics are currently sent." value={analytics} onValueChange={setAnalytics} testID="privacy-diagnostics" />
        </View>
        <View style={styles.privacyStatement}>
          <Text style={styles.privacyStatementTitle}>Nothing is being watched.</Text>
          <Text style={styles.privacyStatementText}>AirControl currently has no gesture recognition, video capture, or history collection. Camera permission does not start a camera session. Your privacy choices above are preferences for future capabilities only.</Text>
        </View>
      </View>
      <Text style={styles.footerStamp}>AIRCONTROL  /  PERSONAL DEVICE PREFERENCES</Text>
    </ScrollView>
  );
}

function PrivacyToggle({
  title,
  detail,
  value,
  onValueChange,
  testID,
}: {
  title: string;
  detail: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID: string;
}) {
  return (
    <View style={styles.privacyToggleRow}>
      <View style={styles.privacyToggleCopy}><Text style={styles.privacyToggleTitle}>{title}</Text><Text style={styles.privacyToggleDetail}>{detail}</Text></View>
      <Switch
        accessibilityLabel={title}
        testID={testID}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#29354D', true: '#315FF5' }}
        thumbColor={value ? '#EAF0FF' : '#92A0B6'}
        ios_backgroundColor="#29354D"
      />
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabName>('Home');
  const [preferences, setPreferences] = useState({
    actions: initialActions,
    sensitivity: 55,
    duration: 450,
    localProcessing: true,
    retainData: false,
    analytics: false,
  });
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('aircontrol.preferences.v1')
      .then((stored) => {
        if (!mounted || !stored) return;
        const parsed = JSON.parse(stored) as Partial<typeof preferences>;
        setPreferences((current) => ({
          ...current,
          ...parsed,
          actions:
            parsed.actions && typeof parsed.actions === 'object'
              ? { ...current.actions, ...parsed.actions }
              : current.actions,
        }));
      })
      .catch(() => {
        if (mounted) setNotice('Saved preferences could not be loaded. Defaults are in use.');
      })
      .finally(() => {
        if (mounted) setPreferencesLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    AsyncStorage.setItem('aircontrol.preferences.v1', JSON.stringify(preferences)).catch(() => {
      setNotice('Preferences could not be saved on this device.');
    });
  }, [preferences, preferencesLoaded]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let mounted = true;
    checkCameraPermission()
      .then((status) => {
        if (mounted) setPermissionStatus(status);
      })
      .catch(() => {
        if (mounted) setPermissionStatus('unknown');
      });
    return () => {
      mounted = false;
    };
  }, []);

  const requestCamera = async () => {
    try {
      const result = await requestCameraPermission();
      if (!result.available) {
        setNotice(result.message);
        return;
      }
      setPermissionStatus(result.status);
      setNotice(
        result.status === 'granted'
          ? 'Camera permission is granted. Recognition and camera capture are still unavailable.'
          : 'Camera permission was not granted. No camera was opened.',
      );
    } catch {
      setNotice('AirControl could not request camera permission. No camera was opened.');
    }
  };

  const currentScreen = tab === 'Home'
    ? <HomeScreen onNavigate={setTab} onStart={() => setNotice('Gesture recognition is not implemented yet. The camera was not opened.')} permissionStatus={permissionStatus} actions={preferences.actions} />
    : tab === 'Gestures'
      ? <GesturesScreen
          actions={preferences.actions}
          setActions={(actions) =>
            setPreferences((current) => ({
              ...current,
              actions: typeof actions === 'function' ? actions(current.actions) : actions,
            }))
          }
        />
      : <SettingsScreen
          sensitivity={preferences.sensitivity}
          setSensitivity={(sensitivity) =>
            setPreferences((current) => ({ ...current, sensitivity }))
          }
          duration={preferences.duration}
          setDuration={(duration) =>
            setPreferences((current) => ({ ...current, duration }))
          }
          permissionStatus={permissionStatus}
          onRequestCamera={requestCamera}
          localProcessing={preferences.localProcessing}
          setLocalProcessing={(localProcessing) =>
            setPreferences((current) => ({ ...current, localProcessing }))
          }
          retainData={preferences.retainData}
          setRetainData={(retainData) =>
            setPreferences((current) => ({ ...current, retainData }))
          }
          analytics={preferences.analytics}
          setAnalytics={(analytics) =>
            setPreferences((current) => ({ ...current, analytics }))
          }
        />;

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor="#080B12" />
      <View style={styles.ambientTop} pointerEvents="none" />
      <View style={styles.ambientSide} pointerEvents="none" />
      <View style={styles.appFrame}>
        <View style={styles.contentArea} key={tab}>{currentScreen}</View>
        {notice ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss message"
            testID="dismiss-app-notice"
            onPress={() => setNotice(null)}
            style={styles.notice}
          >
            <Text style={styles.noticeText}>{notice}</Text>
            <Text style={styles.noticeDismiss}>×</Text>
          </Pressable>
        ) : null}
        <TabBar active={tab} onSelect={setTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, minHeight: '100%', backgroundColor: '#080B12', alignItems: 'center', overflow: 'hidden' },
  ambientTop: { position: 'absolute', top: -130, right: -80, width: 310, height: 310, borderRadius: 155, backgroundColor: 'rgba(36, 75, 205, 0.11)' },
  ambientSide: { position: 'absolute', top: 430, left: -145, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(89, 41, 179, 0.06)' },
  appFrame: { width: '100%', maxWidth: 520, flex: 1, minHeight: '100%', backgroundColor: 'transparent' },
  contentArea: { flex: 1 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 15, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#425882', backgroundColor: '#18233B', paddingHorizontal: 13, paddingVertical: 11 },
  noticeText: { flex: 1, color: '#C7D4F4', fontSize: 11, lineHeight: 16 },
  noticeDismiss: { color: '#A8B9E4', fontSize: 18, paddingHorizontal: 2 },
  pageContent: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 30 },
  topHeader: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandName: { color: '#F2F5FC', fontSize: 14, fontWeight: '800', letterSpacing: 2.5 },
  brandSub: { color: '#75829A', fontSize: 8, letterSpacing: 1.3, marginTop: 4, fontWeight: '700' },
  versionMark: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: '#26334A', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(18, 27, 44, 0.72)' },
  versionText: { color: '#8DA8E9', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroCopy: { marginBottom: 2 },
  heroKicker: { color: '#8493AC', fontSize: 9, fontWeight: '800', letterSpacing: 2.5, marginBottom: 10 },
  heroTitle: { color: '#F5F7FC', fontSize: 39, lineHeight: 43, letterSpacing: -1.6, fontWeight: '700' },
  heroTitleCompact: { fontSize: 36, lineHeight: 40 },
  heroDescription: { color: '#9AA7BC', fontSize: 13, lineHeight: 20, marginTop: 11, maxWidth: 310 },
  handStage: { height: 300, marginTop: 8, marginBottom: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbit: { position: 'absolute', borderRadius: 300, borderWidth: 1, borderColor: 'rgba(79, 121, 255, 0.12)' },
  orbitOne: { width: 272, height: 272 },
  orbitTwo: { width: 218, height: 218, borderColor: 'rgba(90, 71, 220, 0.18)' },
  orbitThree: { width: 162, height: 162, borderStyle: 'dashed', borderColor: 'rgba(91, 132, 255, 0.14)' },
  stageIndex: { position: 'absolute', top: 9, left: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  stageIndexText: { color: '#5F7190', fontSize: 8, letterSpacing: 1.4, fontWeight: '700' },
  stageIndexLine: { width: 28, height: 1, backgroundColor: '#293B5C' },
  stageFoot: { position: 'absolute', bottom: 4, flexDirection: 'row', alignItems: 'center', gap: 7 },
  stageDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#8B75FF' },
  stageFootText: { color: '#70809A', fontSize: 8, letterSpacing: 1.4, fontWeight: '700' },
  stageFootCode: { color: '#46546D', fontSize: 8, letterSpacing: 1, marginLeft: 8 },
  availabilityCard: { borderRadius: 20, borderWidth: 1, borderColor: '#25324A', padding: 15, backgroundColor: 'rgba(16, 23, 38, 0.95)' },
  availabilityHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginBottom: 14 },
  availabilityBadge: { width: 23, height: 23, borderRadius: 8, backgroundColor: '#222B48', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#394671' },
  availabilityBadgeText: { color: '#A9B7FF', fontSize: 12, fontWeight: '800' },
  availabilityCopy: { flex: 1 },
  availabilityTitle: { color: '#E7ECF7', fontSize: 13, fontWeight: '700', marginTop: 1 },
  availabilityDetail: { color: '#8794A9', fontSize: 11, lineHeight: 16, marginTop: 4 },
  startButton: { minHeight: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#365FE8', borderWidth: 1, borderColor: '#5E80FF', shadowColor: '#305EF0', shadowOpacity: 0.18, shadowRadius: 16, elevation: 4 },
  buttonPressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  startButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.25 },
  startButtonArrow: { color: '#DDE6FF', fontSize: 20, position: 'absolute', right: 17, top: 11 },
  buttonFootnote: { color: '#7182A0', textAlign: 'center', fontSize: 8, fontWeight: '700', letterSpacing: 1.35, marginTop: 10 },
  statusRow: { height: 72, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#202A3D', marginBottom: 24 },
  statusCell: { flex: 1, gap: 8 },
  statusLabel: { color: '#71809A', fontSize: 8, letterSpacing: 1.35, fontWeight: '800' },
  statusDivider: { height: 31, width: 1, backgroundColor: '#273147', marginHorizontal: 19 },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(61, 115, 246, 0.3)', backgroundColor: 'rgba(44, 91, 208, 0.12)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, gap: 6 },
  pillPurple: { borderColor: 'rgba(137, 111, 247, 0.32)', backgroundColor: 'rgba(112, 81, 207, 0.12)' },
  pillMuted: { borderColor: '#303A4D', backgroundColor: '#141B29' },
  pillDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#6F9BFF' },
  pillDotPurple: { backgroundColor: '#A28CFF' },
  pillDotMuted: { backgroundColor: '#77849A' },
  pillText: { color: '#A9C1FF', fontSize: 9, fontWeight: '700' },
  pillTextMuted: { color: '#A0A9B8' },
  shortcutHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13 },
  eyebrow: { color: '#7889A7', fontSize: 9, fontWeight: '800', letterSpacing: 1.8 },
  shortcutTitle: { color: '#EDF1FA', fontSize: 20, letterSpacing: -0.4, fontWeight: '700', marginTop: 6 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingLeft: 10 },
  viewAllText: { color: '#9AB2FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  viewAllArrow: { color: '#8C9EFF', fontSize: 13 },
  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shortcutCard: { width: '48.5%', minHeight: 91, borderRadius: 16, borderWidth: 1, borderColor: '#222E43', backgroundColor: 'rgba(17, 25, 40, 0.92)', paddingHorizontal: 13, paddingVertical: 11 },
  cardPressed: { borderColor: '#526CC5', opacity: 0.82 },
  shortcutTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shortcutCode: { color: '#72809A', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  shortcutSignal: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#67A2FF' },
  shortcutSignalPurple: { backgroundColor: '#A37BFF' },
  shortcutName: { color: '#E8EDF7', fontSize: 13, fontWeight: '700', marginTop: 8 },
  shortcutAction: { color: '#8997AD', fontSize: 10, marginTop: 4 },
  privacyNote: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 19, paddingHorizontal: 3 },
  privacyIcon: { color: '#8EA6E9', fontSize: 15 },
  privacyText: { flex: 1, color: '#7F8CA1', fontSize: 10, lineHeight: 15 },
  privacyLink: { color: '#9FB6FF', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  tabBar: { height: 76, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#212A3C', backgroundColor: '#0B101A', paddingBottom: 4 },
  tabButton: { flex: 1, height: 66, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabIcon: { color: '#6F7C91', fontSize: 18, lineHeight: 22 },
  tabIconActive: { color: '#92AAFF' },
  tabLabel: { color: '#6D798D', fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  tabLabelActive: { color: '#C5D2FF' },
  tabIndicator: { position: 'absolute', bottom: 0, width: 20, height: 2, borderRadius: 2, backgroundColor: '#7193FF' },
  screenHeader: { paddingTop: 12, marginBottom: 25 },
  pageTitle: { color: '#F0F3FA', fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -1.2, marginTop: 8 },
  pageIntro: { color: '#98A5B9', fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 380 },
  gestureSummary: { height: 83, borderRadius: 18, backgroundColor: '#10192A', borderColor: '#273653', borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 16 },
  summaryOrb: { width: 47, height: 47, borderRadius: 16, backgroundColor: '#18264A', borderWidth: 1, borderColor: '#374B80', alignItems: 'center', justifyContent: 'center' },
  summaryOrbText: { color: '#B2C2FF', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  summaryCopy: { marginLeft: 12, flex: 1 },
  summaryTitle: { color: '#E5EAF5', fontSize: 13, fontWeight: '700' },
  summaryDetail: { color: '#8492A8', fontSize: 10, marginTop: 5 },
  summaryStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusTinyDot: { height: 5, width: 5, borderRadius: 3, backgroundColor: '#8B78F2' },
  summaryStatusText: { color: '#A99BFF', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  gestureList: { gap: 8 },
  gestureCard: { borderRadius: 16, borderWidth: 1, borderColor: '#202C41', backgroundColor: 'rgba(17, 24, 38, 0.92)', overflow: 'visible', zIndex: 1 },
  gestureCardOpen: { borderColor: '#465CB2', zIndex: 4 },
  gestureRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 },
  gestureNumber: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#18233A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#293A5D' },
  gestureNumberText: { color: '#91A9EF', fontSize: 10, fontWeight: '700' },
  gestureCopy: { flex: 1, marginLeft: 10 },
  gestureName: { color: '#E4EAF5', fontSize: 12, fontWeight: '700' },
  gestureHint: { color: '#7F8DA3', fontSize: 9, marginTop: 5 },
  gestureAssigned: { alignItems: 'flex-end', maxWidth: 94 },
  assignedLabel: { color: '#64738C', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
  assignedValue: { color: '#A9B9EB', fontSize: 9, fontWeight: '600', marginTop: 5 },
  gestureChevron: { color: '#7182A0', fontSize: 17, marginLeft: 8, width: 12, textAlign: 'center' },
  gestureEditor: { paddingHorizontal: 13, paddingTop: 10, paddingBottom: 13, borderTopWidth: 1, borderTopColor: '#293654' },
  editorLabel: { color: '#71809A', fontSize: 8, letterSpacing: 1.2, fontWeight: '800', marginBottom: 8 },
  actionSelector: { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: '#334462', backgroundColor: '#0D1421', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionValue: { color: '#E1E8F6', fontSize: 12, fontWeight: '600', flex: 1 },
  chevron: { color: '#9FAFE4', fontSize: 16, marginLeft: 8 },
  actionMenu: { position: 'absolute', top: 45, left: 0, right: 0, borderRadius: 13, borderWidth: 1, borderColor: '#3A4B6B', backgroundColor: '#111A2A', zIndex: 20, padding: 5, shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 12, elevation: 10 },
  actionOption: { minHeight: 35, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8 },
  actionOptionSelected: { backgroundColor: '#202D4D' },
  actionOptionText: { color: '#A7B2C5', fontSize: 11 },
  actionOptionTextSelected: { color: '#D5DEFF', fontWeight: '700' },
  optionCheck: { color: '#A8BAFF', fontSize: 12, fontWeight: '700' },
  editorNote: { color: '#75839A', fontSize: 9, marginTop: 8 },
  gestureFoot: { flexDirection: 'row', marginTop: 20, gap: 10, alignItems: 'flex-start', paddingHorizontal: 3 },
  infoLine: { width: 2, height: 28, borderRadius: 2, backgroundColor: '#826DF1' },
  gestureFootText: { flex: 1, color: '#7F8CA0', fontSize: 10, lineHeight: 15 },
  settingsGroup: { marginBottom: 25 },
  groupHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  groupTitle: { color: '#9DAAC0', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  groupIndex: { color: '#596780', fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  settingCard: { backgroundColor: '#111927', borderWidth: 1, borderColor: '#253248', borderRadius: 16, padding: 14, marginBottom: 9 },
  settingTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingCopy: { flex: 1, paddingRight: 8 },
  settingTitle: { color: '#E4EAF4', fontSize: 12, fontWeight: '700' },
  settingDetail: { color: '#8390A5', fontSize: 9, lineHeight: 14, marginTop: 4 },
  settingReadout: { flexDirection: 'row', alignItems: 'baseline' },
  settingValue: { color: '#B5C5FF', fontSize: 21, fontWeight: '700', letterSpacing: -0.5 },
  settingUnit: { color: '#8394BB', fontSize: 9, marginLeft: 3, fontWeight: '700' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 13 },
  stepperButton: { width: 28, height: 28, borderRadius: 9, backgroundColor: '#1B2740', borderWidth: 1, borderColor: '#34466C', alignItems: 'center', justifyContent: 'center' },
  stepperSign: { color: '#B4C4FF', fontSize: 17, lineHeight: 20 },
  rangeTrack: { flex: 1, height: 4, borderRadius: 3, backgroundColor: '#29354C', position: 'relative' },
  rangeFill: { height: 4, borderRadius: 3, backgroundColor: '#6686FF' },
  rangeThumb: { position: 'absolute', top: -5, marginLeft: -7, width: 14, height: 14, borderRadius: 7, backgroundColor: '#DDE4FF', borderWidth: 3, borderColor: '#6B83EF' },
  rangeLabels: { marginLeft: 39, marginRight: 39, marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  rangeLabel: { color: '#66748A', fontSize: 8 },
  controlDisclaimer: { color: '#78869D', fontSize: 9, lineHeight: 14, marginTop: 3 },
  cameraCard: { borderRadius: 17, borderWidth: 1, borderColor: '#293752', backgroundColor: '#101827', padding: 14 },
  cameraCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cameraGlyph: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#202B48', borderWidth: 1, borderColor: '#3A4D7B', alignItems: 'center', justifyContent: 'center' },
  cameraLens: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#A5B7FF', backgroundColor: '#293B65' },
  cameraInfo: { flex: 1 },
  cameraTitle: { color: '#E3E9F5', fontSize: 12, fontWeight: '700' },
  cameraDesc: { color: '#8996AB', fontSize: 9, lineHeight: 14, marginTop: 4 },
  permissionButton: { height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#3A568C', backgroundColor: '#1C2A47', marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  permissionButtonText: { color: '#C2D0FF', fontSize: 11, fontWeight: '700' },
  permissionArrow: { color: '#A4B9FF', fontSize: 17, position: 'absolute', right: 13 },
  cameraCaveat: { flexDirection: 'row', gap: 8, marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#253047' },
  caveatMark: { width: 15, height: 15, borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#806DBD' },
  caveatMarkText: { color: '#B4A4F6', fontSize: 9, fontWeight: '800' },
  cameraCaveatText: { color: '#8794A9', fontSize: 9, lineHeight: 14, flex: 1 },
  privacyCard: { borderRadius: 17, borderWidth: 1, borderColor: '#263349', backgroundColor: '#101826', paddingHorizontal: 13 },
  privacyToggleRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 8 },
  privacyToggleCopy: { flex: 1, paddingRight: 4 },
  privacyToggleTitle: { color: '#E2E8F2', fontSize: 11, fontWeight: '700' },
  privacyToggleDetail: { color: '#8290A5', fontSize: 9, lineHeight: 13, marginTop: 4 },
  preferenceDivider: { height: 1, backgroundColor: '#263146' },
  privacyStatement: { paddingHorizontal: 3, paddingTop: 14 },
  privacyStatementTitle: { color: '#C0CAEC', fontSize: 11, fontWeight: '700' },
  privacyStatementText: { color: '#8390A4', fontSize: 10, lineHeight: 16, marginTop: 6 },
  footerStamp: { color: '#56647A', fontSize: 8, letterSpacing: 1.2, fontWeight: '700', textAlign: 'center', marginTop: 3, marginBottom: 8 },
});
