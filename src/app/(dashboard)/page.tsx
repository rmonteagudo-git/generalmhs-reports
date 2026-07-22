import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserById } from "@/server/users";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user?.id
    ? await getUserById(Number(session.user.id))
    : null;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-muted-foreground">
          Resumen general de General Mental Health Services.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            Sesión activa. Aquí irán los reportes más adelante.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nombre:</span>{" "}
            {user?.name ?? session?.user?.name ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            {user?.email ?? session?.user?.email ?? "—"}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
