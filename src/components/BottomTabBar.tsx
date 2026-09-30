import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

export type TabKey = 'home' | 'application' | 'settings';

interface Tab {
  key: TabKey;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}

const TABS: Tab[] = [
  {key: 'home', label: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline'},
  {
    key: 'application',
    label: 'Application',
    activeIcon: 'reader',
    inactiveIcon: 'reader-outline',
  },
  {
    key: 'settings',
    label: 'Settings',
    activeIcon: 'settings',
    inactiveIcon: 'settings-outline',
  },
];

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabPress?: (tab: TabKey) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, {paddingBottom: insets.bottom}]}>
      <View style={styles.activeIndicatorTrack}>
        <View
          style={[
            styles.activeIndicator,
            {
              left: `${
                TABS.findIndex(t => t.key === activeTab) * (100 / TABS.length)
              }%`,
              width: `${100 / TABS.length}%`,
            },
          ]}
        />
      </View>
      <View style={styles.row}>
        {TABS.map(tab => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => onTabPress?.(tab.key)}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.inactiveIcon}
                size={22}
                color={isActive ? colors.primaryGreen : colors.tabInactive}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  isActive ? styles.labelActive : styles.labelInactive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  activeIndicatorTrack: {
    height: 2,
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.primaryGreen,
  },
  row: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
  labelActive: {
    color: colors.primaryGreen,
    fontWeight: '600',
  },
  labelInactive: {
    color: colors.tabInactive,
  },
});

export default BottomTabBar;