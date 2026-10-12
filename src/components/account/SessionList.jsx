"use client";

import { LogOut, Monitor, Smartphone } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";
import { formatDateTime } from "@/lib/format";

/** A short, readable device label from a user-agent string. */
function describeDevice(userAgent = "") {
  const browsers = [
    [/Edg\//, "Edge"],
    [/OPR\//, "Opera"],
    [/Chrome\//, "Chrome"],
    [/Firefox\//, "Firefox"],
    [/Safari\//, "Safari"],
  ];
  const systems = [
    [/Windows/, "Windows"],
    [/Android/, "Android"],
    [/iPhone|iPad/, "iOS"],
    [/Mac OS X/, "macOS"],
    [/Linux/, "Linux"],
  ];
  const name = browsers.find(([pattern]) => pattern.test(userAgent))?.[1] ?? "Browser";
  const os = systems.find(([pattern]) => pattern.test(userAgent))?.[1] ?? "Unknown device";
  return { label: `${name} on ${os}`, isMobile: /Mobile|Android|iPhone/.test(userAgent) };
}

export default function SessionList({ sessions }) {
  const { run, isPending, errorMessage } = useAsyncAction();
  const others = sessions.filter((session) => !session.isCurrent);

  return (
    <div>
      {errorMessage && <Alert tone="error" className="mb-4">{errorMessage}</Alert>}
      <ul className="divide-y divide-line">
        {sessions.map((session) => {
          const device = describeDevice(session.userAgent);
          const Icon = device.isMobile ? Smartphone : Monitor;
          return (
            <li key={session.id} className="flex items-center gap-4 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-muted">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
                  {device.label}
                  {session.isCurrent && <Badge tone="success">This device</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {session.ip && `${session.ip} | `}Last active {formatDateTime(session.lastSeenAt)} | Signed in{" "}
                  {formatDateTime(session.createdAt)}
                </p>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isPending}
                  onClick={() => run(() => api.delete(`/account/sessions/${session.id}`))}
                >
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {others.length > 0 && (
        <Button
          variant="danger-outline"
          icon={LogOut}
          className="mt-4"
          isLoading={isPending}
          onClick={() => run(() => api.delete("/account/sessions"))}
        >
          Sign out of all other devices
        </Button>
      )}
    </div>
  );
}
