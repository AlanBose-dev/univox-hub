import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Concern = Database["public"]["Tables"]["concerns"]["Row"];

interface ConcernCardProps {
  concern: Concern;
  onClick?: () => void;
}

const ConcernCard = ({ concern, onClick }: ConcernCardProps) => {
  const urgencyConfig = {
    low: { label: "Low", className: "bg-muted text-muted-foreground" },
    medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
    high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const urgencyInfo = urgencyConfig[concern.urgency as keyof typeof urgencyConfig];

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-1">{concern.title}</CardTitle>
            <CardDescription className="line-clamp-2">{concern.description}</CardDescription>
          </div>
          <StatusBadge status={concern.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
          <Badge variant="outline" className="capitalize">
            {concern.category}
          </Badge>
          <Badge variant="secondary" className={urgencyInfo.className}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {urgencyInfo.label}
          </Badge>
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(concern.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConcernCard;
