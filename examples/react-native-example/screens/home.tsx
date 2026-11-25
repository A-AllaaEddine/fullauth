import { signIn, signOut, useSession } from '@fullauth/react-native';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const baseUrl = process.env.EXPO_PUBLIC_FULLAUTH_URL!;

const Home = () => {
  const { session, update } = useSession();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>user: {session?.user?.name ?? ''}</Text>
        <Text style={styles.text}>status: {session?.status ?? ''}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.pressable} onPress={async () => {
          await signIn({
            baseUrl,
            provider: 'credentials',
            credentials: { email: 'replace-with-form-email', password: 'replace-with-form-password' },
          });
          await update();
        }}>
          <Text style={styles.text}>
            Sign In
          </Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={async () => {
            await update({
              name: 'replace-with-validated-name',
            });
          }}
        >
          <Text style={styles.text}>Update</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={async () => {
            await signOut({ baseUrl });
            await update();
          }}
        >
          <Text style={styles.text}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  pressable: {
    width: 'auto',
    height: 'auto',
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  textContainer: {
    // flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
