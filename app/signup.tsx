import { ThemedText } from '@/components/themed-text';
import { TitleContent } from '@/components/title_contant';
import { signup } from '@/services/firebase-auth';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type FormData = {
  nickname: string;
  email: string;
  password: string;
  confirm: string;
};

type FormErrors = {
  nickname: string;
  email: string;
  password: string[];
  confirm: string;
};

export default function SignupScreen() {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    nickname: '',
    email: '',
    password: [],
    confirm: '',
  });

  const onChange = (text: string, key: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [key]: text }));
    if (key === 'nickname') handleNicknameError(text);
    if (key === 'password') handlePasswordError(text);
    if (key === 'confirm') handleConfirmError(text);
  };

  const onSubmit = () => {
    const nicknameHasError = handleNicknameError(formData.nickname);
    const emailHasError = handleEmailError();
    const passwordHasError = formErrors.password.length > 0;
    const confirmHasError = formErrors.confirm.length > 0;

    if (nicknameHasError || emailHasError || passwordHasError || confirmHasError) return;

    signup(formData.email, formData.password, formData.nickname);
  };

  const handleNicknameError = (text: string) => {
    let error = '';
    if (text.trim().length === 0) error = 'Le pseudo est obligatoire.';
    else if (text.trim().length < 3) error = 'Minimum 3 caractères.';
    setFormErrors((prev) => ({ ...prev, nickname: error }));
    return error.length > 0;
  };

  const handleEmailError = () => {
    let error = '';
    if (formData.email.length === 0) error = "L'email est obligatoire.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) error = "L'email n'est pas valide.";
    setFormErrors((prev) => ({ ...prev, email: error }));
    return error.length > 0;
  };

  const handlePasswordError = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Minimum 8 caractères.');
    if (!password.match(/[a-z]/)) errors.push('1 minuscule requise.');
    if (!password.match(/[A-Z]/)) errors.push('1 majuscule requise.');
    if (!password.match(/[0-9]/)) errors.push('1 chiffre requis.');
    if (!password.match(/[^a-zA-Z0-9]/)) errors.push('1 caractère spécial requis.');
    setFormErrors((prev) => ({ ...prev, password: errors }));
    return errors.length > 0;
  };

  const handleConfirmError = (text: string) => {
    const error = text !== formData.password ? 'Les mots de passe ne correspondent pas.' : '';
    setFormErrors((prev) => ({ ...prev, confirm: error }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
            <ThemedText style={styles.label}>Pseudo</ThemedText>
            <TextInput
              style={styles.formInput}
              value={formData.nickname}
              onChangeText={(t) => onChange(t, 'nickname')}
              placeholder="Choisissez un pseudo"
              placeholderTextColor="#555"
              autoCapitalize="none"
            />
            {!!formErrors.nickname && (
              <ThemedText style={styles.errorText}>⚠ {formErrors.nickname}</ThemedText>
            )}
          </View>

          {/* EMAIL */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(t) => onChange(t, 'email')}
              placeholder="Enter your email"
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!formErrors.email && (
              <ThemedText style={styles.errorText}>⚠ {formErrors.email}</ThemedText>
            )}
          </View>

          {/* PASSWORD */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.formInput}
              value={formData.password}
              onChangeText={(t) => onChange(t, 'password')}
              placeholder="Enter your password"
              placeholderTextColor="#555"
              secureTextEntry
            />
            {formErrors.password.map((err, i) => (
              <ThemedText key={i} style={styles.errorText}>⚠ {err}</ThemedText>
            ))}
          </View>

          {/* CONFIRM */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <TextInput
              style={styles.formInput}
              value={formData.confirm}
              onChangeText={(t) => onChange(t, 'confirm')}
              placeholder="Confirm your password"
              placeholderTextColor="#555"
              secureTextEntry
            />
            {!!formErrors.confirm && (
              <ThemedText style={styles.errorText}>⚠ {formErrors.confirm}</ThemedText>
            )}
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.button} onPress={onSubmit} activeOpacity={0.8}>
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  
  keyboardView: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#000000',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F72585',
    alignItems: 'center',
  },

  form: {
     padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#1A1A2E',
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B8C0FF',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  errorText: {
    color: '#F72585',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    paddingLeft: 4,
  },

  button: {
    backgroundColor: '#7209B7',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});