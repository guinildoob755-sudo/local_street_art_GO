import { useState } from 'react';
import { StyleSheet,TextInput,TouchableOpacity,View,} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleContent } from '@/components/title_contant';

type FormData = {
  email: string;
  password: string;
  confirm: string;
};

type FormErrors = {
  email: string;
  password: string[];
  confirm: string;
};

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirm: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: [],
    confirm: '',
  });

  const onChange = (text: string, key: keyof FormData) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: text,
    }));

    if (key === 'password') {
      handlePasswordError(text);
    }

    if (key === 'confirm') {
      handleConfirmError(text);
    }
  };

  const onSubmit = () => {
    const emailHasError = handleEmailError();
    const passwordHasError = formErrors.password.length > 0;
    const confirmHasError = formErrors.confirm.length > 0;

    if (emailHasError || passwordHasError || confirmHasError) {
      return;
    }

    console.log('Form submitted successfully:', formData);
  };

  const handleEmailError = () => {
    let error = '';

    if (formData.email.length === 0) {
      error = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      error = 'Email is invalid.';
    }

    setFormErrors((prevState) => ({
      ...prevState,
      email: error,
    }));

    return error.length > 0;
  };

  const handlePasswordError = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Minimum 8 characters.');
    }

    if (!password.match(/[a-z]/)) {
      errors.push('1 lowercase letter required.');
    }

    if (!password.match(/[A-Z]/)) {
      errors.push('1 uppercase letter required.');
    }

    if (!password.match(/[0-9]/)) {
      errors.push('1 number required.');
    }

    if (!password.match(/[^a-zA-Z0-9]/)) {
      errors.push('1 special character required.');
    }

    setFormErrors((prevState) => ({
      ...prevState,
      password: errors,
    }));

    return errors.length > 0;
  };

  const handleConfirmError = (text: string) => {
    if (text !== formData.password) {
      setFormErrors((prevState) => ({
        ...prevState,
        confirm: 'Passwords do not match.',
      }));
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        confirm: '',
      }));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TitleContent />

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Email</ThemedText>

        <TextInput
          style={styles.formInput}
          value={formData.email}
          onChangeText={(text) => onChange(text, 'email')}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {formErrors.email ? (
          <ThemedText style={styles.errorText}>
            {formErrors.email}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Password</ThemedText>

        <TextInput
          style={styles.formInput}
          value={formData.password}
          onChangeText={(text) => onChange(text, 'password')}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {formErrors.password.map((error, index) => (
          <ThemedText key={index} style={styles.errorText}>
            • {error}
          </ThemedText>
        ))}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>
          Confirm Password
        </ThemedText>

        <TextInput
          style={styles.formInput}
          value={formData.confirm}
          onChangeText={(text) => onChange(text, 'confirm')}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {formErrors.confirm ? (
          <ThemedText style={styles.errorText}>
            {formErrors.confirm}
          </ThemedText>
        ) : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <ThemedText style={styles.buttonText}>
          Create Account
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 24,
    paddingVertical: 40,

    justifyContent: 'center',
  },

  formGroup: {
    width: '100%',
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A0CA3',

    marginBottom: 10,
  },

  formInput: {
    width: '100%',

    backgroundColor: '#FFFFFF',

    borderWidth: 2,
    borderColor: '#7209B7',
    borderRadius: 18,

    paddingVertical: 16,
    paddingHorizontal: 18,

    color: '#3A0CA3',

    fontSize: 16,
    fontWeight: '600',

    shadowColor: '#F72585',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 5,
  },

  errorText: {
    color: '#F72585',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#F72585',

    paddingVertical: 18,

    borderRadius: 18,

    alignItems: 'center',

    marginTop: 10,

    shadowColor: '#F72585',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});