import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
 
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleContent } from '@/components/title_contant';
 
import { login } from '@/services/firebase-auth';
import { getAuth } from 'firebase/auth';
 
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
 
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
 
  const router = useRouter();
 
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
 
    setAuthError('');
 
    try {
      setLoading(true);
 
      // Connexion Firebase
      await login(form.email, form.password);
 
      // Vérification que l'utilisateur est bien connecté
      const auth = getAuth();
      const user = auth.currentUser;
 
      if (!user) {
        setAuthError("Impossible de vérifier la connexion. Réessayez.");
        return;
      }
 
      // Redirection vers modal.tsx
      router.replace('/modal');
 
    } catch (err: any) {
      console.log('Erreur login:', err);
 
      // Messages d'erreur Firebase lisibles
      switch (err.code) {
        case 'auth/user-not-found':
          setAuthError("Aucun compte trouvé avec cet email.");
          break;
        case 'auth/wrong-password':
          setAuthError("Mot de passe incorrect.");
          break;
        case 'auth/invalid-email':
          setAuthError("Email invalide.");
          break;
        case 'auth/too-many-requests':
          setAuthError("Trop de tentatives. Réessayez plus tard.");
          break;
        default:
          setAuthError("Erreur de connexion. Réessayez.");
      }
    } finally {
      setLoading(false);
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
          placeholderTextColor="#888"
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
          placeholderTextColor="#888"
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
        {!!errors.password && (
          <ThemedText style={styles.error}>{errors.password}</ThemedText>
        )}
 
        {/* FIREBASE ERROR */}
        {!!authError && (
          <ThemedText style={styles.error}>{authError}</ThemedText>
        )}
 
        {/* BUTTON */}
        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Connexion...' : 'Se connecter'}
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
    color: '#ffffff',
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