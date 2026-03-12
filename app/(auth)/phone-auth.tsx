import { useState, useRef } from 'react';
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
import {
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type Step = 'phone' | 'otp';

export default function PhoneAuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;
  const border = Colors[colorScheme].border;
  const textColor = Colors[colorScheme].text;

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    const cleaned = phone.trim();
    if (!cleaned || cleaned.length < 10) {
      setError('Enter a valid phone number with country code (e.g. +91...).');
      return;
    }
    setLoading(true);
    try {
      // Phone auth with Firebase JS SDK requires RecaptchaVerifier (web-based).
      // In Expo Go, full invisible reCAPTCHA isn't supported natively.
      // For now we show a placeholder; real phone auth will work after EAS build
      // with @react-native-firebase or a custom reCAPTCHA web flow.
      setError('Phone OTP requires a native build (EAS). Use email or Google sign-in for now.');
      setLoading(false);
    } catch (e: any) {
      setError(e.message ?? 'Failed to send OTP.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (!otp.trim() || otp.length < 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp.trim());
      const result = await signInWithCredential(auth, credential);
      const ref = doc(db, 'users', result.user.uid);
      await setDoc(
        ref,
        {
          name: result.user.displayName ?? result.user.phoneNumber ?? '',
          email: result.user.email ?? '',
          phone: result.user.phoneNumber ?? '',
          createdAt: serverTimestamp(),
          ridingStyle: '',
          skillLevel: 'beginner',
        },
        { merge: true },
      );
    } catch (e: any) {
      setError(e.message ?? 'Invalid code.');
      setLoading(false);
    }
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
          <Text style={styles.tagline}>Sign in with your phone.</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {step === 'phone' ? (
            <>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={[styles.input, { borderColor: border, color: textColor }]}
                placeholder="+91 98765 43210"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!loading}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: tint },
                  pressed && styles.pressed,
                  loading && styles.disabled,
                ]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send OTP</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.label}>Enter 6-digit code</Text>
              <TextInput
                style={[styles.input, { borderColor: border, color: textColor }]}
                placeholder="123456"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                editable={!loading}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: tint },
                  pressed && styles.pressed,
                  loading && styles.disabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify</Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable style={styles.backLink} onPress={() => router.back()}>
            <Text style={[styles.backLinkText, { color: tint }]}>Back to login</Text>
          </Pressable>
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
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
  backLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  backLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
