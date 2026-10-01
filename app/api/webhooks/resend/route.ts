import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailEventType } from "@prisma/client";
import { Webhook } from "svix";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headersList = request.headers;

    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // In production with real webhook secret, enforce cryptographic verification
    if (webhookSecret && !webhookSecret.includes("mock") && !webhookSecret.includes("dummy")) {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: "Missing required svix signature headers" },
          { status: 400 }
        );
      }

      try {
        const wh = new Webhook(webhookSecret);
        wh.verify(rawBody, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err: any) {
        console.error("❌ Resend Webhook signature verification failed:", err.message);
        return NextResponse.json(
          { error: "Invalid cryptographic webhook signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, data } = payload;
    // Resend payload types: "email.sent", "email.delivered", "email.bounced", "email.complained"
    console.log(`📥 Ingested Resend Webhook Event: [${type}] for message ${data?.email_id || data?.id}`);

    let eventStatus: EmailEventType = EmailEventType.SENT;
    if (type === "email.delivered") {
      eventStatus = EmailEventType.DELIVERED;
    } else if (type === "email.bounced") {
      eventStatus = EmailEventType.BOUNCED;
    } else if (type === "email.complained") {
      eventStatus = EmailEventType.COMPLAINED;
    }

    const resendMessageId = data?.email_id || data?.id;

    if (resendMessageId) {
      // Find existing log entry or create a fresh delivery record
      const existing = await prisma.emailDeliveryLog.findUnique({
        where: { resendMessageId },
      });

      if (existing) {
        await prisma.emailDeliveryLog.update({
          where: { id: existing.id },
          data: {
            status: eventStatus,
            metadata: {
              ...((existing.metadata as any) || {}),
              webhookEvent: type,
              processedAt: new Date().toISOString(),
              eventDetails: data,
            },
          },
        });
      } else {
        await prisma.emailDeliveryLog.create({
          data: {
            recipientEmail: data?.to?.[0] || "unknown@studyflow.edu",
            templateName: "TransactionalDispatch",
            subject: data?.subject || "StudyFlow Notification",
            status: eventStatus,
            resendMessageId,
            metadata: {
              webhookEvent: type,
              processedAt: new Date().toISOString(),
              eventDetails: data,
            },
          },
        });
      }
    }

    return NextResponse.json({
      received: true,
      event: type,
      status: eventStatus,
      messageId: resendMessageId,
    });
  } catch (error: any) {
    console.error("❌ Resend Webhook processing error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook event", details: error.message },
      { status: 500 }
    );
  }
}
