import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../services/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Download, Users } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nContext";

export function SubscribersManager() {
  const { t } = useI18n();
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: adminApi.getSubscribers,
  });

  const exportCsv = () => {
    if (!subscribers) return;
    const headers = "Email,Date Subscribed\n";
    const rows = (subscribers as any[]).map(s => `${s.email},${new Date(s.subscribed_at || s.created_at).toISOString()}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary">Subscribers</h1>
          <p className="text-muted-foreground">Manage your newsletter and marketing audience</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold" onClick={exportCsv} disabled={!subscribers?.length}>
          <Download className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Export CSV</span>
        </Button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-6">Email Address</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-6">Subscription Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted/20" />
                    <p>No subscribers found in your database.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (subscribers as any[])?.map((sub: { id: string; email: string; subscribed_at?: string; created_at?: string }) => (
                <TableRow key={sub.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-bold text-foreground py-4 px-6">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground py-4 px-6">
                    {format(new Date(sub.subscribed_at || sub.created_at || new Date()), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
