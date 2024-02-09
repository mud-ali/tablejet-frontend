import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';
import { GET_ALL_TEACHERS_PERIODS } from '../graphql/Queries';
import { client } from '../../../App';
import { Period } from '../types/types';
// // import messaging from '../webcompat/firebase-messaging/index.web';
import messaging from '../webcompat/firebase-messaging/index.web';
// import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
    const authStatus = await notifee.requestPermission();

    if (Platform.OS === 'android') {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        console.log('Android detected... creating channel: ', channelId);
    }

    if (authStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('Authorized');
        console.log(`Token: ${await messaging().getToken()}`);
    } else {
        console.log('Not Authorized; status: ', authStatus.authorizationStatus);
    }
}

const defaultStatus = {
    authorizationStatus: AuthorizationStatus.DENIED,
    ios: {},
    android: {},
    web: {},
};
export async function hasNotifPermission(): Promise<boolean> {
    const notifSettings =
        Platform.OS === 'web'
            ? defaultStatus
            : await notifee.getNotificationSettings();
    const authStatus = notifSettings.authorizationStatus;
    return authStatus === AuthorizationStatus.AUTHORIZED;
}

async function coalescePeriods(
    periods: Period[] | undefined | null,
): Promise<Period[]> {
    if (periods == null || typeof periods === 'undefined') {
        const { data } = await client.query({
            query: GET_ALL_TEACHERS_PERIODS,
        });
        return data.periods;
    } else {
        return periods;
    }
}

// Subscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will subscribe to all periods.
export async function subscribeToNotification(
    teacherId: string,
    periods?: Period[],
) {
    periods = await coalescePeriods(periods);

    periods.forEach((period: Period) => {
        const topic = `${period.id}.${teacherId}`;
        console.log(`Subscribing to topic: ${topic}`);
        messaging().subscribeToTopic(topic);
    });

    // Subscribing to blank period for blast notifs
    const topic = `00000000-0000-0000-0000-000000000000.${teacherId}`;
    console.log(`Subscribing to topic: ${topic}`);
    messaging().subscribeToTopic(topic);
}

// Unsubscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will unsubscribe from all periods.
export async function unsubscribeToNotification(
    teacherId: string,
    periods?: Period[],
) {
    periods = await coalescePeriods(periods);
    periods.forEach((period: Period) => {
        const topic = `${period.id}.${teacherId}`;
        console.log(`Unsubscribing from topic: ${topic}`);
        messaging().unsubscribeFromTopic(topic);
    });

    // Subscribing to blank period for blast notifs
    const topic = `00000000-0000-0000-0000-000000000000.${teacherId}`;
    console.log(`Unsubscribing topic: ${topic}`);
    messaging().unsubscribeFromTopic(topic);
}
