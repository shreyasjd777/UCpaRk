import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>Discover what else our app has to offer!</ThemedText>
      <Collapsible title="User Preferences">
        <ThemedText>
          Update your preferences to customize your experience such as light and dark mode.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Buy a Parking Pass">
        <ThemedText>
          Click the link to learn more about UCR parking passes and to buy one for yourself.
        </ThemedText>
        <ExternalLink href="https://transportation.ucr.edu">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Upgrade to Our Pro Version">
        <ThemedText>
          For only $5 per month, get access to our AI algorithm that predicts traffic trends and gets you to class on time every day.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
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
