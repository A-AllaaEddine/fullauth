import { signIn, signOut, useSession } from '@fullauth/react-native';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Home = () => {
  const { session, update } = useSession();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>user: {session?.user?.name ?? ''}</Text>
        <Text style={styles.text}>status: {session?.user?.status ?? ''}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.pressable}>
          <Text
            style={styles.text}
            onPress={async () => {
              await signIn('credentials', {
                email: 'test@test.com',
                password: 'test12345',
              });
              await update();
            }}
          >
            Sign In
          </Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={async () => {
            await update({
              name: 'lazydev',
            });
          }}
        >
          <Text style={styles.text}>Update</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={async () => {
            await signOut();
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
