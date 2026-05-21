// Import React hook for component state management
import { useState } from 'react';

// Import Expo Router navigation utilities
import {
  useRouter,
  Link,
  Stack,
} from 'expo-router';

// Import React Native components
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// Import custom themed UI components
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Import application title component
import { TitleContent } from '@/components/title_contant';

// Import Firebase authentication helper
import { login } from '@/services/firebase-auth';

// Import Firebase auth instance
import { getAuth } from 'firebase/auth';

/**
 * LoginScreen Component
 *
 * Handles:
 * - User authentication
 * - Form validation
 * - Firebase login
 * - Error handling
 * - Navigation to signup page
 */
export default function LoginScreen() {

  // =====================
  // STATE
  // =====================

  /**
   * Form state
   *
   * Stores:
   * - email
   * - password
   */
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  /**
   * Validation errors state
   */
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  /**
   * Loading state
   *
   * Used during Firebase authentication.
   */
  const [loading, setLoading] =
    useState(false);

  /**
   * Firebase authentication error
   */
  const [authError, setAuthError] =
    useState('');

  /**
   * Expo Router instance
   */
  const router = useRouter();

  // =====================
  // HANDLERS
  // =====================

  /**
   * handleChange()
   *
   * Updates form fields dynamically.
   *
   * @param key - Form field key
   * @param value - Input value
   */
  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================
  // VALIDATION
  // =====================

  /**
   * validate()
   *
   * Validates:
   * - Email format
   * - Password length
   *
   * @returns boolean
   */
  const validate = () => {

    let valid = true;

    /**
     * Reset validation errors
     */
    const newErrors = {
      email: '',
      password: '',
    };

    /**
     * Email validation
     */
    if (!form.email.includes('@')) {

      newErrors.email =
        'Invalid email address';

      valid = false;
    }

    /**
     * Password validation
     */
    if (form.password.length < 6) {

      newErrors.password =
        'Password too short (minimum 6 characters)';

      valid = false;
    }

    /**
     * Store validation errors
     */
    setErrors(newErrors);

    return valid;
  };

  // =====================
  // SUBMIT
  // =====================

  /**
   * handleLogin()
   *
   * Handles Firebase authentication.
   */
  const handleLogin = async () => {

    // Prevent login if validation fails
    if (!validate()) return;

    /**
     * Reset Firebase error
     */
    setAuthError('');

    try {

      setLoading(true);

      /**
       * Firebase authentication
       */
      await login(
        form.email,
        form.password
      );

      /**
       * Retrieve authenticated user
       */
      const auth = getAuth();

      const user = auth.currentUser;

      /**
       * Ensure user exists
       */
      if (!user) {

        setAuthError(
          'Unable to verify login. Please try again.'
        );

        return;
      }

      /**
       * Redirect to main tabs
       */
      router.replace('/(tabs)');

    } catch (err: any) {

      console.log(
        'Login error:',
        err
      );

      /**
       * Human-readable Firebase errors
       */
      switch (err.code) {

        case 'auth/user-not-found':

          setAuthError(
            'No account found with this email.'
          );

          break;

        case 'auth/wrong-password':

          setAuthError(
            'Incorrect password.'
          );

          break;

        case 'auth/invalid-email':

          setAuthError(
            'Invalid email address.'
          );

          break;

        case 'auth/too-many-requests':

          setAuthError(
            'Too many attempts. Please try again later.'
          );

          break;

        default:

          setAuthError(
            'Authentication error. Please try again.'
          );
      }

    } finally {

      setLoading(false);
    }
  };

  // =====================
  // UI
  // =====================

  return (

    <>
      {/* Hide default header */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ThemedView style={styles.container}>

        {/* Application title/logo */}
        <TitleContent />

        {/* FORM */}
        <View style={styles.formContainer}>

          {/* EMAIL INPUT */}
          <TextInput
            style={styles.input}

            placeholder="Email"
            placeholderTextColor="#888"

            value={form.email}

            onChangeText={(text) =>
              handleChange('email', text)
            }

            autoCapitalize="none"

            keyboardType="email-address"
          />

          {/* Email validation error */}
          {!!errors.email && (
            <ThemedText style={styles.error}>
              {errors.email}
            </ThemedText>
          )}

          {/* PASSWORD INPUT */}
          <TextInput
            style={styles.input}

            placeholder="Password"
            placeholderTextColor="#888"

            value={form.password}

            onChangeText={(text) =>
              handleChange('password', text)
            }

            secureTextEntry
          />

          {/* Password validation error */}
          {!!errors.password && (
            <ThemedText style={styles.error}>
              {errors.password}
            </ThemedText>
          )}

          {/* Firebase authentication error */}
          {!!authError && (
            <ThemedText style={styles.error}>
              {authError}
            </ThemedText>
          )}

          {/* LOGIN BUTTON */}
          <Pressable
            style={[
              styles.button,
              loading && { opacity: 0.6 },
            ]}

            onPress={handleLogin}

            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>

              {loading
                ? 'Signing in...'
                : 'Sign In'}

            </ThemedText>
          </Pressable>

          {/* SIGNUP LINK */}
          <Link
            href="/signup"
            asChild
          >
            <Pressable
              style={styles.linkContainer}
            >
              <ThemedText>
                Don&apos;t have an account?
              </ThemedText>

              <ThemedText style={styles.link}>
                Sign up
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

// =====================
// STYLES
// =====================

const styles = StyleSheet.create({

  /**
   * Main screen container
   */
  container: {
    flex: 1,

    padding: 20,

    alignItems: 'center',

    justifyContent: 'flex-start',

    backgroundColor: '#000000',
  },

  /**
   * Form wrapper
   */
  formContainer: {
    marginTop: 40,

    width: '100%',

    alignItems: 'center',
  },

  /**
   * Input field
   */
  input: {
    width: 300,

    padding: 14,

    borderWidth: 2,
    borderColor: '#7209B7',

    borderRadius: 14,

    marginBottom: 10,

    fontSize: 16,

    color: '#ffffff',
  },

  /**
   * Login button
   */
  button: {
    backgroundColor: '#7209B7',

    padding: 14,

    width: 300,

    borderRadius: 14,

    alignItems: 'center',

    marginTop: 10,
  },

  /**
   * Login button text
   */
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  /**
   * Validation and auth error text
   */
  error: {
    color: 'red',

    fontSize: 12,

    marginBottom: 8,

    alignSelf: 'flex-start',

    marginLeft: 40,
  },

  /**
   * Signup link container
   */
  linkContainer: {
    flexDirection: 'row',

    marginTop: 20,

    gap: 5,
  },

  /**
   * Signup link text
   */
  link: {
    fontWeight: 'bold',

    color: '#F72585',
  },
});