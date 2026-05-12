import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleContent } from '@/components/title_contant';
import { Link } from 'expo-router';

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
    const updatedForm = { ...formData, [key]: text };
    setFormData(updatedForm);

    if (key === 'password') {
      handlePasswordError(text);

      // recheck confirm si déjà rempli
      if (formData.confirm) {
        handleConfirmError(formData.confirm, text);
      }
    }

    if (key === 'confirm') {
      handleConfirmError(text, formData.password);
    }
  };

  const onSubmit = () => {
    const emailHasError = handleEmailError();
    const passwordHasError = formErrors.password.length > 0;
    const confirmHasError = formErrors.confirm.length > 0;

    if (emailHasError || passwordHasError || confirmHasError) {
      return;
    }

    console.log('Vous êtes inscrit.e !');
  };

  // EMAIL
  const handleEmailError = () => {
    let msg = '';

    if (formData.email.trim() === '') {
      msg = "L'adresse mail est obligatoire";
    } else if (!formData.email.includes('@')) {
      msg = "L'adresse mail n'est pas valide";
    }

    setFormErrors((prev) => ({
      ...prev,
      email: msg,
    }));

    return msg.length > 0;
  };

  // PASSWORD
  const handlePasswordError = (pwd: string) => {
    const msgs: string[] = [];

    if (pwd.length < 8) msgs.push('Minimum 8 caractères');
    if (!/[a-z]/.test(pwd)) msgs.push('Une minuscule requise');
    if (!/[A-Z]/.test(pwd)) msgs.push('Une majuscule requise');
    if (!/[0-9]/.test(pwd)) msgs.push('Un chiffre requis');
    if (!/[^a-zA-Z0-9]/.test(pwd)) msgs.push('Un caractère spécial requis');

    setFormErrors((prev) => ({
      ...prev,
      password: msgs,
    }));
  };

  // CONFIRM PASSWORD
  const handleConfirmError = (confirm: string, password?: string) => {
    const pwdToCompare = password ?? formData.password;

    let msg = '';

    if (confirm.trim() === '') {
      msg = 'Confirmation obligatoire';
    } else if (confirm !== pwdToCompare) {
      msg = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors((prev) => ({
      ...prev,
      confirm: msg,
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <TitleContent />

      <View style={{ marginTop: 40, marginBottom: 40 }}>

        {/* EMAIL */}
        <TextInput
          style={styles.formInput}
          placeholder="Adresse mail"
          value={formData.email}
          onChangeText={(text) => onChange(text, 'email')}
        />
        {!!formErrors.email && (
          <ThemedText>{formErrors.email}</ThemedText>
        )}

        {/* PASSWORD */}
        <TextInput
          style={styles.formInput}
          placeholder="Mot de passe"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => onChange(text, 'password')}
        />

        {formErrors.password.length > 0 && (
          <View>
            {formErrors.password.map((err, index) => (
              <ThemedText key={index}>{err}</ThemedText>
            ))}
          </View>
        )}

        {/* CONFIRM */}
        <TextInput
          style={styles.formInput}
          placeholder="Confirmation mot de passe"
          secureTextEntry
          value={formData.confirm}
          onChangeText={(text) => onChange(text, 'confirm')}
        />

        {!!formErrors.confirm && (
          <ThemedText>{formErrors.confirm}</ThemedText>
        )}

        {/* BUTTON */}
<Pressable
  onPress={onSubmit}
  style={({ pressed }) => [
    styles.loginButton,
    pressed && styles.buttonPressed,
  ]}
>
  <ThemedText style={styles.loginButtonText}>
    Se connecter
  </ThemedText>
</Pressable>

{/* SIGNUP LINK */}
<Link href="/signup" asChild>
  <Pressable style={styles.signupContainer}>
    <ThemedText style={styles.signupText}>
      Pas encore de compte ?
    </ThemedText>

    <ThemedText style={styles.signupLink}>
      S'inscrire
    </ThemedText>
  </Pressable>
</Link>
        

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  formInput: {
  width: 300,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginBottom: 14,

  backgroundColor: "#FFFFFF",

  borderWidth: 2,
  borderColor: "#7209B7",
  borderRadius: 16,

  color: "#3A0CA3",
  fontSize: 16,
  fontWeight: "600",

  shadowColor: "#F72585",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 6,

  elevation: 4,
},

  loginButton: {
  backgroundColor: '#111',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10,
},

buttonPressed: {
  opacity: 0.7,
},

loginButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

signupContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
  gap: 5,
},

signupText: {
  fontSize: 15,
},

signupLink: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#3b82f6',
},


});

