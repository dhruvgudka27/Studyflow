import { Resend } from "resend";
import { prisma } from "./prisma";
import { EmailEventType } from "@prisma/client";
import { TaskCreatedEmail } from "@/emails/TaskCreatedEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_fallback_key");

interface SendTaskNotificationParams {
  recipientEmail: string;
  studentName: string;
  taskTitle: string;
  courseTitle: string;
  courseCode: string;
  priority: string;
  dueDate: string;
  estimatedMinutes: number;
}

/**
 * Triggers a transactional notification following a successful Prisma mutation.
 * Persists the initial record to the EmailDeliveryLog table.
 */
export async function dispatchTaskCreatedEmail(params: SendTaskNotificationParams) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@studyflow.edu";
  const subject = `[StudyFlow Alert] New Task: ${params.taskTitle} (${params.courseCode})`;

  console.log(`✉️ Initiating transactional email dispatch to ${params.recipientEmail}...`);

  // First create the queued log entry
  const logEntry = await prisma.emailDeliveryLog.create({
    data: {
      recipientEmail: params.recipientEmail,
      templateName: "TaskCreatedEmail",
      subject,
      status: EmailEventType.QUEUED,
      metadata: {
        taskTitle: params.taskTitle,
        courseCode: params.courseCode,
        priority: params.priority,
      },
    },
  });

  try {
    // Only attempt real Resend network call if a real non-dummy API key is set
    const apiKey = process.env.RESEND_API_KEY;
    const isMock = !apiKey || apiKey.startsWith("re_test_") || apiKey.includes("dummy") || apiKey.includes("mock");

    if (isMock) {
      console.log(`[Resend Mock Mode] Simulated delivery of "${subject}" to ${params.recipientEmail}`);
      const mockResendMessageId = `mock_msg_${Date.now()}`;
      
      const updated = await prisma.emailDeliveryLog.update({
        where: { id: logEntry.id },
        data: {
          status: EmailEventType.SENT,
          resendMessageId: mockResendMessageId,
          metadata: {
            ...((logEntry.metadata as any) || {}),
            deliveryMode: "simulated_mock_dev",
            deliveredAt: new Date().toISOString(),
          },
        },
      });
      return { success: true, messageId: mockResendMessageId, logId: updated.id };
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [params.recipientEmail],
      subject,
      react: React.createElement(TaskCreatedEmail, params),
    });

    if (error) {
      console.error("❌ Resend API returned error:", error);
      await prisma.emailDeliveryLog.update({
        where: { id: logEntry.id },
        data: {
          status: EmailEventType.FAILED,
          metadata: {
            ...((logEntry.metadata as any) || {}),
            error: error.message,
          },
        },
      });
      return { success: false, error: error.message };
    }

    console.log(`✅ Transactional email dispatched successfully. Resend ID: ${data?.id}`);
    await prisma.emailDeliveryLog.update({
      where: { id: logEntry.id },
      data: {
        status: EmailEventType.SENT,
        resendMessageId: data?.id,
      },
    });

    return { success: true, messageId: data?.id, logId: logEntry.id };
  } catch (err: any) {
    console.error("❌ Unexpected email dispatch failure:", err);
    await prisma.emailDeliveryLog.update({
      where: { id: logEntry.id },
      data: {
        status: EmailEventType.FAILED,
        metadata: { error: err.message },
      },
    });
    return { success: false, error: err.message };
  }
}
