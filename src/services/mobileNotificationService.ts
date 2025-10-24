import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { notificationService } from "./notificationService";

class MobileNotificationService {
  private isNative = false;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async initialize() {
    if (!this.isNative) {
      // Fallback to web notifications
      return notificationService.requestPermission();
    }

    try {
      // Request permissions for push notifications
      const result = await PushNotifications.requestPermissions();

      if (result.receive === "granted") {
        // Register for push notifications
        await PushNotifications.register();

        // Listen for registration
        PushNotifications.addListener("registration", (token) => {
          // TODO: Send token to your server for push notifications
        });

        // Listen for push notifications
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {},
        );

        // Listen for notification actions
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {},
        );

        return true;
      }
    } catch (error) {
      console.error("Error initializing push notifications:", error);
    }

    return false;
  }

  async showJobNotification(job: any) {
    if (!this.isNative) {
      return notificationService.showJobNotification(job);
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "New Job Available",
            body: `${job.type} delivery from ${job.pickup_address} to ${job.delivery_address}`,
            id: parseInt(job.id.replace(/-/g, "").substring(0, 8), 16),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: "default",
            attachments: [],
            actionTypeId: "job_action",
            extra: {
              jobId: job.id,
              type: job.type,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error showing local notification:", error);
    }
  }

  async requestPermissions() {
    if (this.isNative) {
      return this.initialize();
    }
    return notificationService.requestPermission();
  }
}

export const mobileNotificationService = new MobileNotificationService();
