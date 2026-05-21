// Import custom themed text component
import { ThemedText } from '@/components/themed-text';

// Import application title/logo component
import { TitleContent } from '@/components/title_contant';

// Import Firebase signup helper
import { signup } from '@/services/firebase-auth';

// Import Expo Router navigation hook
import { useRouter } from 'expo-router';

// Import React hook for state management
import { useState } from 'react';

// Import React Native components
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * FormData Type
 *
 * Defines all signup form fields.
 */
type FormData = {
  nickname: string;
  email: string;
  password: string;
  confirm: string;
};

/**
 * FormErrors Type
 *
 * Defines validation errors
 * for each form field.
 */
type FormErrors = {
  nickname: string;
  email: string;
  password: string[];
  confirm: string;
};

/**
 * SignupScreen Component
 *
 * Handles:
 * - User registration
 * - Form validation
 * - Firebase signup
 * - Password security checks
 * - Error handling
 */
export default function SignupScreen() {

  /**
   * Expo Router instance
   */
  const router = useRouter();

  // =====================
  // STATE
  // =====================

  /**
   * Form values state
   */
  const [formData, setFormData] =
    useState<FormData>({
      nickname: '',
      email: '',
      password: '',
      confirm: '',
    });

  /**
   * Validation errors state
   */
  const [formErrors, setFormErrors] =
    useState<FormErrors>({
      nickname: '',
      email: '',
      password: [],
      confirm: '',
    });

  /**
   * Firebase error message
   */
  const [firebaseError, setFirebaseError] =
    useState('');

  /**
   * Loading state
   */
  const [loading, setLoading] =
    useState(false);

  // =====================
  // INPUT HANDLING
  // =====================

  /**
   * onChange()
   *
   * Updates form fields dynamically
   * and triggers validation.
   *
   * @param text - Input value
   * @param key - Form field key
   */
  const onChange = (
    text: string,
    key: keyof FormData
  ) => {

    /**
     * Update form field
     */
    setFormData((prev) => ({
      ...prev,
      [key]: text,
    }));

    /**
     * Clear Firebase error
     */
    setFirebaseError('');

    /**
     * Trigger validation
     */
    if (key === 'nickname') {
      handleNicknameError(text);
    }

    if (key === 'password') {
      handlePasswordError(text);
    }

    if (key === 'confirm') {
      handleConfirmError(text);
    }
  };

  // =====================
  // FORM SUBMISSION
  // =====================

  /**
   * onSubmit()
   *
   * Validates the form
   * and creates a Firebase account.
   */
  const onSubmit = async () => {

    /**
     * Run all validations
     */
    const nicknameHasError =
      handleNicknameError(
        formData.nickname
      );

    const emailHasError =
      handleEmailError();

    const passwordHasError =
      formErrors.password.length > 0;

    const confirmHasError =
      formErrors.confirm.length > 0;

    /**
     * Stop submission if errors exist
     */
    if (
      nicknameHasError ||
      emailHasError ||
      passwordHasError ||
      confirmHasError
    ) {
      return;
    }

    /**
     * Reset Firebase error
     */
    setFirebaseError('');

    try {

      setLoading(true);

      /**
       * Firebase signup
       */
      await signup(
        formData.email,
        formData.password,
        formData.nickname
      );

      /**
       * Redirect to main tabs
       */
      router.replace('/(tabs)');

    } catch (err: any) {

      console.log(
        'Signup error:',
        err.code
      );

      /**
       * Human-readable Firebase errors
       */
      switch (err.code) {

        case 'auth/email-already-in-use':

          setFirebaseError(
            'This email is already in use. Please sign in or use another email.'
          );

          break;

        case 'auth/invalid-email':

          setFirebaseError(
            'Invalid email address.'
          );

          break;

        case 'auth/weak-password':

          setFirebaseError(
            'Password is too weak.'
          );

          break;

        case 'auth/network-request-failed':

          setFirebaseError(
            'Network error. Please check your internet connection.'
          );

          break;

        default:

          setFirebaseError(
            'An error occurred. Please try again.'
          );
      }

    } finally {

      setLoading(false);
    }
  };

  // =====================
  // VALIDATION FUNCTIONS
  // =====================

  /**
   * handleNicknameError()
   *
   * Validates nickname field.
   *
   * @param text - Nickname value
   * @returns boolean
   */
  const handleNicknameError = (
    text: string
  ) => {

    let error = '';

    if (text.trim().length === 0) {

      error =
        'Nickname is required.';

    } else if (
      text.trim().length < 3
    ) {

      error =
        'Minimum 3 characters.';
    }

    setFormErrors((prev) => ({
      ...prev,
      nickname: error,
    }));

    return error.length > 0;
  };

  /**
   * handleEmailError()
   *
   * Validates email field.
   *
   * @returns boolean
   */
  const handleEmailError = () => {

    let error = '';

    if (
      formData.email.length === 0
    ) {

      error =
        'Email is required.';

    } else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {

      error =
        'Invalid email address.';
    }

    setFormErrors((prev) => ({
      ...prev,
      email: error,
    }));

    return error.length > 0;
  };

  /**
   * handlePasswordError()
   *
   * Validates password strength.
   *
   * Rules:
   * - Minimum 8 characters
   * - 1 lowercase letter
   * - 1 uppercase letter
   * - 1 number
   * - 1 special character
   *
   * @param password - Password value
   * @returns boolean
   */
  const handlePasswordError = (
    password: string
  ) => {

    const errors: string[] = [];

    if (password.length < 8) {
      errors.push(
        'Minimum 8 characters.'
      );
    }

    if (!password.match(/[a-z]/)) {
      errors.push(
        '1 lowercase letter required.'
      );
    }

    if (!password.match(/[A-Z]/)) {
      errors.push(
        '1 uppercase letter required.'
      );
    }

    if (!password.match(/[0-9]/)) {
      errors.push(
        '1 number required.'
      );
    }

    if (
      !password.match(
        /[^a-zA-Z0-9]/
      )
    ) {
      errors.push(
        '1 special character required.'
      );
    }

    setFormErrors((prev) => ({
      ...prev,
      password: errors,
    }));

    return errors.length > 0;
  };

  /**
   * handleConfirmError()
   *
   * Checks if passwords match.
   *
   * @param text - Confirmation password
   */
  const handleConfirmError = (
    text: string
  ) => {

    const error =
      text !== formData.password
        ? 'Passwords do not match.'
        : '';

    setFormErrors((prev) => ({
      ...prev,
      confirm: error,
    }));
  };

  // =====================
  // UI
  // =====================

  return (

    /**
     * Keyboard avoiding wrapper
     */
    <KeyboardAvoidingView
      style={styles.keyboardView}

      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }

        keyboardShouldPersistTaps="handled"

        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <TitleContent />
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* NICKNAME */}
          <View style={styles.formGroup}>

            <ThemedText style={styles.label}>
              Nickname
            </ThemedText>

            <TextInput
              style={styles.formInput}

              value={formData.nickname}

              onChangeText={(t) =>
                onChange(t, 'nickname')
              }

              placeholder="Choose a nickname"

              placeholderTextColor="#555"

              autoCapitalize="none"
            />

            {!!formErrors.nickname && (
              <ThemedText style={styles.errorText}>
                ⚠ {formErrors.nickname}
              </ThemedText>
            )}
          </View>

          {/* EMAIL */}
          <View style={styles.formGroup}>

            <ThemedText style={styles.label}>
              Email
            </ThemedText>

            <TextInput
              style={styles.formInput}

              value={formData.email}

              onChangeText={(t) =>
                onChange(t, 'email')
              }

              placeholder="Enter your email"

              placeholderTextColor="#555"

              keyboardType="email-address"

              autoCapitalize="none"
            />

            {!!formErrors.email && (
              <ThemedText style={styles.errorText}>
                ⚠ {formErrors.email}
              </ThemedText>
            )}
          </View>

          {/* PASSWORD */}
          <View style={styles.formGroup}>

            <ThemedText style={styles.label}>
              Password
            </ThemedText>

            <TextInput
              style={styles.formInput}

              value={formData.password}

              onChangeText={(t) =>
                onChange(t, 'password')
              }

              placeholder="Enter your password"

              placeholderTextColor="#555"

              secureTextEntry
            />

            {formErrors.password.map(
              (err, i) => (
                <ThemedText
                  key={i}
                  style={styles.errorText}
                >
                  ⚠ {err}
                </ThemedText>
              )
            )}
          </View>

          {/* PASSWORD CONFIRMATION */}
          <View style={styles.formGroup}>

            <ThemedText style={styles.label}>
              Confirm Password
            </ThemedText>

            <TextInput
              style={styles.formInput}

              value={formData.confirm}

              onChangeText={(t) =>
                onChange(t, 'confirm')
              }

              placeholder="Confirm your password"

              placeholderTextColor="#555"

              secureTextEntry
            />

            {!!formErrors.confirm && (
              <ThemedText style={styles.errorText}>
                ⚠ {formErrors.confirm}
              </ThemedText>
            )}
          </View>

          {/* FIREBASE ERROR */}
          {!!firebaseError && (
            <ThemedText
              style={styles.firebaseError}
            >
              ⚠ {firebaseError}
            </ThemedText>
          )}

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && { opacity: 0.6 },
            ]}

            onPress={onSubmit}

            activeOpacity={0.8}

            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </ThemedText>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================
// STYLES
// =====================

const styles = StyleSheet.create({

  /**
   * Main keyboard wrapper
   */
  keyboardView: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  /**
   * ScrollView content container
   */
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /**
   * Header section
   */
  header: {
    backgroundColor: '#000000',

    paddingVertical: 24,
    paddingHorizontal: 20,

    borderBottomWidth: 1,
    borderBottomColor: '#F72585',

    alignItems: 'center',
  },

  /**
   * Form container
   */
  form: {
    padding: 20,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 20,
    marginHorizontal: 20,

    backgroundColor: '#1A1A2E',
  },

  /**
   * Individual form group
   */
  formGroup: {
    marginBottom: 20,
    width: '100%',
  },

  /**
   * Input label
   */
  label: {
    fontSize: 13,

    fontWeight: '700',

    color: '#B8C0FF',

    marginBottom: 8,

    letterSpacing: 1,

    textTransform: 'uppercase',
  },

  /**
   * Input field
   */
  formInput: {
    marginTop: 4,

    width: '100%',

    backgroundColor: '#1A1A2E',

    borderWidth: 2,
    borderColor: '#7209B7',

    borderRadius: 18,

    paddingVertical: 16,
    paddingHorizontal: 18,

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '500',

    shadowColor: '#7209B7',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 5,
  },

  /**
   * Validation error text
   */
  errorText: {
    color: '#F72585',

    marginTop: 6,

    fontSize: 12,

    fontWeight: '600',

    letterSpacing: 0.3,

    paddingLeft: 4,
  },

  /**
   * Firebase error message
   */
  firebaseError: {
    color: '#FF4444',

    fontSize: 13,

    fontWeight: '700',

    textAlign: 'center',

    marginBottom: 12,

    paddingHorizontal: 10,
  },

  /**
   * Submit button
   */
  button: {
    backgroundColor: '#7209B7',

    paddingVertical: 18,

    borderRadius: 18,

    alignItems: 'center',

    marginTop: 10,

    width: '100%',

    shadowColor: '#F72585',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.4,

    shadowRadius: 12,

    elevation: 8,
  },

  /**
   * Submit button text
   */
  buttonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '800',

    letterSpacing: 1,

    textTransform: 'uppercase',
  },
});