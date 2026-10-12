import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import ProfileForm from "@/components/account/ProfileForm";
import SessionList from "@/components/account/SessionList";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { requireUser } from "@/server/auth/guards";
import { getCurrentSession } from "@/server/auth/session";
import { listSessions } from "@/server/services/sessionService";

export const metadata = { title: "Account settings" };

export default async function AccountSettingsPage() {
  const user = await requireUser("/account/settings");
  const session = await getCurrentSession();
  const sessions = await listSessions(user._id, session._id);

  return (
    <>
      <PageHeader title="Account settings" description="Your profile, password and signed-in devices." />
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card title="Profile">
          <ProfileForm initialName={user.name} email={user.email} />
        </Card>
        <Card title="Password" description="Changing it signs you out on every other device.">
          <ChangePasswordForm />
        </Card>
        <Card
          title="Where you're signed in"
          description="If you don't recognize a device, sign it out and change your password."
          className="xl:col-span-2"
        >
          <SessionList sessions={sessions} />
        </Card>
      </div>
    </>
  );
}
