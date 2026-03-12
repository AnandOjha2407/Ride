import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import GoogleLogo from '@/components/GoogleLogo';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;
  const border = Colors[colorScheme].border;
  const textColor = Colors[colorScheme].text;

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const setError = useAuthStore((s) => s.setError);

  const { request, promptAsync } = useGoogleSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    await login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Ride24/7</Text>
          <Text style={styles.tagline}>Group Riding, Organized.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Log in</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* ── Email / password ── */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: border, color: textColor }]}
            placeholder="rider@example.com"
            placeholderTextColor={Colors[colorScheme].tabIconDefault}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, { borderColor: border, color: textColor }]}
            placeholder="Your password"
            placeholderTextColor={Colors[colorScheme].tabIconDefault}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: tint },
              pressed && styles.pressed,
              isLoading && styles.disabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Log in</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: border }]} />
            <Text style={styles.dividerText}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: border }]} />
          </View>

          {/* ── Google button ── */}
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.pressed,
              isLoading && styles.disabled,
            ]}
            onPress={() => promptAsync()}
            disabled={!request || isLoading}
          >
            <GoogleLogo size={20} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          {/* ── Phone auth ── */}
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              { borderColor: border, marginTop: 12 },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push('/(auth)/phone-auth')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText, { color: textColor }]}>
              Sign in with Phone
            </Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/signup')}>
              <Text style={[styles.switchLink, { color: tint }]}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 6,
  },
  form: {},
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#dadce0',
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 18,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    opacity: 0.5,
  },
  socialButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    opacity: 0.7,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
