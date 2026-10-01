import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from "@react-email/components";

interface TaskCreatedEmailProps {
  studentName?: string;
  taskTitle: string;
  courseTitle: string;
  courseCode: string;
  priority: string;
  dueDate: string;
  estimatedMinutes: number;
}

export const TaskCreatedEmail = ({
  studentName = "Student",
  taskTitle,
  courseTitle,
  courseCode,
  priority,
  dueDate,
  estimatedMinutes,
}: TaskCreatedEmailProps) => {
  const isUrgent = priority === "URGENT" || priority === "HIGH";

  return (
    <Html>
      <Head />
      <Preview>StudyFlow Task Alert: {taskTitle} ({courseCode})</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>STUDYFLOW</Heading>
            <Text style={subtitle}>Academic Productivity Management</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={heading}>
              New Academic Task Scheduled
            </Heading>
            <Text style={paragraph}>
              Hello <strong>{studentName}</strong>,
            </Text>
            <Text style={paragraph}>
              A new study commitment has been recorded in your academic ledger for{" "}
              <strong>{courseTitle} ({courseCode})</strong>.
            </Text>

            <Section style={taskBox}>
              <Text style={taskTitleStyle}>📌 {taskTitle}</Text>
              <Text style={taskMeta}>
                <strong>Priority:</strong>{" "}
                <span style={isUrgent ? urgentBadge : normalBadge}>{priority}</span>
              </Text>
              <Text style={taskMeta}>
                <strong>Due Date:</strong> {dueDate}
              </Text>
              <Text style={taskMeta}>
                <strong>Estimated Effort:</strong> {estimatedMinutes} minutes
              </Text>
            </Section>

            <Section style={btnContainer}>
              <Button style={button} href="http://localhost:3000/dashboard">
                Launch StudyFlow Workspace
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Department of AI & Data Science | StudyFlow Academic Platform.
            This is an automated transactional lifecycle notification.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TaskCreatedEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f4f6f9",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "24px 16px",
  maxWidth: "580px",
};

const header: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
};

const logo: React.CSSProperties = {
  color: "#2563eb",
  fontSize: "26px",
  fontWeight: "bold",
  letterSpacing: "1px",
  margin: 0,
};

const subtitle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  margin: "4px 0 0 0",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const heading: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#0f172a",
  marginTop: 0,
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
};

const taskBox: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderLeft: "4px solid #3b82f6",
  borderRadius: "6px",
  padding: "16px",
  margin: "20px 0",
};

const taskTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1e293b",
  margin: "0 0 8px 0",
};

const taskMeta: React.CSSProperties = {
  fontSize: "13px",
  color: "#475569",
  margin: "4px 0",
};

const urgentBadge: React.CSSProperties = {
  backgroundColor: "#fee2e2",
  color: "#dc2626",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: 600,
  fontSize: "12px",
};

const normalBadge: React.CSSProperties = {
  backgroundColor: "#e0f2fe",
  color: "#0284c7",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: 600,
  fontSize: "12px",
};

const btnContainer: React.CSSProperties = {
  textAlign: "center",
  marginTop: "24px",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: 600,
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
};

const hr: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "24px 0 12px 0",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center",
  lineHeight: "18px",
};
