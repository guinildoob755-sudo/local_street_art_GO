import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabThreeScree() {
  return ( 
    <ThemedView style={styles.titleContainer}>
      <ThemedText
        type="title"
        style={{
          fontWeight: 'bold',
        }}>
        Profile
      </ThemedText>
      <Pressable onPress={() => console.log("Logout")}>
        <ThemedText type="link">Logout</ThemedText>
      </Pressable>
    </ThemedView>
    


    
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
