import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleContent } from '@/components/title_contant';

import { login } from '@/services/firebase-auth';
import { Link } from 'expo-router';

export default function LoginScreen() {
  // =====================
  // STATE
  // =====================
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // =====================
  // HANDLERS
  // =====================
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================
  // VALIDATION
  // =====================
  const validate = () => {
    let valid = true;

    const newErrors = {
      email: '',
      password: '',
    };

    if (!form.email.includes('@')) {
      newErrors.email = "Email invalide";
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = "Mot de passe trop court (6 min)";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // =====================
  // SUBMIT
  // =====================
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login (form.email, form.password);
    } catch (err) {
      console.log('Erreur login:', err);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <ThemedView style={styles.container}>
      <TitleContent />

      <View style={styles.formContainer}>

        {/* EMAIL */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {!!errors.email && (
          <ThemedText style={styles.error}>{errors.email}</ThemedText>
        )}

        {/* PASSWORD */}
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
        {!!errors.password && (
          <ThemedText style={styles.error}>{errors.password}</ThemedText>
        )}

        {/* BUTTON */}
        <Pressable
          style={styles.button}
          onPress={handleLogin}

        >
          <ThemedText style={styles.buttonText}>
            Se connecter
          </ThemedText>
        </Pressable>

        {/* LINK REGISTER */}
        <Link href="/signup" asChild>
          <Pressable style={styles.linkContainer}>
            <ThemedText>Pas de compte ?</ThemedText>
            <ThemedText style={styles.link}>
              S'inscrire
            </ThemedText>
          </Pressable>
        </Link>

      </View>
    </ThemedView>
  );
}

// =====================
// STYLE
// =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000000',
  },

  formContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },

  input: {
    width: 300,
    padding: 14,
    borderWidth: 2,
    borderColor: '#7209B7',
    borderRadius: 14,
    marginBottom: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#7209B7',
    padding: 14,
    width: 300,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },

  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 5,
  },

  link: {
    fontWeight: 'bold',
    color: '#F72585',
  },
});