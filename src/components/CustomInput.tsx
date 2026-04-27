import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CustomInputProps extends TextInputProps {
  error?: boolean;
}

export function CustomInput({ error = false, style, ...rest }: CustomInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.card,
          borderColor: error ? theme.danger : theme.border,
          color: theme.text,
        },
        style,
      ]}
      placeholderTextColor={theme.subtitle}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
});