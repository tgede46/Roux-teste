import { StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  backChevron: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginTop: -2,
  },
  backLabel: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.text,
  },
  title: {
    marginTop: 28,
    marginBottom: 28,
    fontFamily: fonts.bold,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  inputWrap: {
    borderWidth: 1.5,
    borderColor: colors.text,
    borderRadius: 26,
  },
  inputWrapFocused: {
    borderColor: colors.teal,
  },
  inputWrapError: {
    borderColor: '#C0392B',
  },
  fieldError: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#C0392B',
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 18,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  inputWithToggle: {
    paddingRight: 8,
  },
  togglePassword: {
    width: 44,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 6,
  },
  forgot: {
    fontFamily: fonts.regular,
    color: colors.teal,
    fontSize: 15,
    marginTop: 2,
    marginBottom: 28,
  },
  linkPressed: {
    opacity: 0.55,
  },
  buttonPulse: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.text,
  },
  button: {
    backgroundColor: colors.text,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.bold,
    color: colors.white,
    fontSize: 17,
  },
  createAccount: {
    marginTop: 28,
    alignItems: 'center',
  },
  createAccountText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  overlayText: {
    marginTop: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
});
