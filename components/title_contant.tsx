import { Colors } from '@/constants/theme';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';


export function TitleContent() {
  return <ThemedView>
    <View style={styles.content}>
        <View style={styles.titleContent}>
            <Image
                source={require('@/assets/images/logo_art.png')}
                style={styles.topLogo}
                />
            <ThemedText style={styles.title}>LocalStreetArt</ThemedText>
            <Image
                source={require('@/assets/images/logo_art.png')}
                style={styles.topLogo}
                />
        </View>
        <View style={styles.underline1}></View>
        <View style={styles.underline2}></View>
    </View>
    
  </ThemedView>;
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        justifyContent: "flex-start"
    },
    titleContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      },
      topLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
      },
      title: {
        fontSize: 24,
        fontFamily: 'Creepster',
        textTransform: "uppercase",
        textAlign: "center"
      },
      underline1: {
        width: 260,
        height:1,
        backgroundColor: Colors.light.text
      },
      underline2: {
        width: 200,
        height:1,
        backgroundColor: Colors.light.text,
        marginTop:4
      }
      });