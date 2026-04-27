import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary' | 'success';
  icon?: ReactNode;
}

export function CustomButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  icon,
}: CustomButtonProps) {
  const { theme } = useTheme();

  const background = {
    primary: theme.primary,
    danger: theme.danger,
    secondary: theme.surfaceMuted,
    success: theme.success,
  };

  const textColor = variant === 'secondary' ? theme.text : '#ffffff';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.button, { backgroundColor: background[variant] }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontWeight: '800',
    fontSize: 15,
  },
});