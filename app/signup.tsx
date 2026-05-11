import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleContent } from '@/components/title_contant';
import { Colors } from '@/constants/theme';

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
    setFormData(prevState => 
        ({ ...prevState, [key]: text }));

        if (key === 'password') {
            handlePasswordError(text);
        }   

        if (key === 'confirm') {
            handleConfirmError(text,);
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

        setFormErrors(prevState => ({ ...prevState, email: error }));
        return error.length > 0;
    };

    const handlePasswordError = (password: string) => {
        const errors: string[] = [];    
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }

        if (password.match(/[a-z]/)) {
            errors.push('Password must contain at least one lowercase letter.');
        }

        if(!password.match(/[A-Z]/)) {
            errors.push('Password must contain at least one uppercase letter.');
        }

        if (!password.match(/[0-9]/)) {
            errors.push('Password must contain at least one number.');
        }

        if (!password.match(/[^a-zA-Z0-9]/)) {
            errors.push('Password must contain at least one special character.');
        }

        setFormErrors(prevState => ({ ...prevState, password: errors }));
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
      <TitleContent/>  

        <View style={{ marginTop: 40, marginBottom: 40 }}>
        <ThemedText>Email</ThemedText>
        <TextInput
          style={styles.formInput}
          value={formData.email}
          onChangeText={(text) => onChange(text, 'email')}
          placeholder="Enter your email"
        />
        {formErrors.email ? <ThemedText style={{ color: 'red' }}>{formErrors.email}</ThemedText> : null}
      </View>

      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <ThemedText>Password</ThemedText>
        <TextInput
          style={styles.formInput}
          value={formData.password}
          onChangeText={(text) => onChange(text, 'password')}
          placeholder="Enter your password"
          secureTextEntry
        />
        {formErrors.password.map((error, index) => (
          <ThemedText key={index} style={{ color: 'red' }}>
            {error}
          </ThemedText>
        ))}
      </View>

      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <ThemedText>Confirm Password</ThemedText>
        <TextInput
          style={styles.formInput}
          value={formData.confirm}
          onChangeText={(text) => onChange(text, 'confirm')}
          placeholder="Confirm your password"
          secureTextEntry
        />
        {formErrors.confirm ? <ThemedText style={{ color: 'red' }}>{formErrors.confirm}</ThemedText> : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        padding: 20,
        backgroundColor: Colors.light.background,       
    },
    formInput: {
        borderColor: Colors.light.text, 
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,        
        color: Colors.light.text,
        marginBottom: 10,
    },
});     

