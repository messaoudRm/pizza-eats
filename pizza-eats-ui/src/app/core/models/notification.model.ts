export type NotificationListener = 'email' | 'sms' | 'push';

export const NOTIFICATION_LISTENERS: { value: NotificationListener; label: string; description: string }[] = [
  { value: 'email', label: 'Email', description: 'Un email à chaque changement de statut' },
  { value: 'sms', label: 'SMS', description: 'Un SMS à chaque changement de statut' },
  { value: 'push', label: 'Notification push', description: 'Une notification sur votre appareil' },
];
