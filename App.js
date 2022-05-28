import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Notificaions from "expo-notifications";

Notificaions.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function pushNotificationHandler() {
      const { status } = await Notificaions.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notificaions.requestPermissionsAsync();
        finalStatus = status;
      }
      if (status !== "granted") {
        Alert.alert(
          "Insufficient Permissions!",
          "Require permssions to push notifications!"
        );
        return;
      }
      const pushTokenData = await Notificaions.getExpoPushTokenAsync();
      console.log(pushTokenData);
      if (Platform.OS == "android") {
        Notificaions.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notificaions.AndroidImportance.DEFAULT,
        });
      }
    }
    pushNotificationHandler();
  }, []);
  useEffect(() => {
    const subscription = Notificaions.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
        console.log(notification.request.content.data.userName);
      }
    );

    const subscription2 = Notificaions.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification Received");
        console.log(response.notification.request.content.data.userName);
      }
    );
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);
  function sendNotificationHandler() {
    Notificaions.scheduleNotificationAsync({
      content: {
        title: "My first Notification",
        body: "This is the body of notification",
        data: { userName: "Sim" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[Pd8gqrOkpddbt9yAnTUhyB]",
        title: "Test",
        body: "this is a test!",
      }),
    });
  }
  return (
    <View style={styles.container}>
      <Button title="Send Notification" onPress={sendNotificationHandler} />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
