import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the welcome screen as the entry point
  return <Redirect href="/welcome" />;
}