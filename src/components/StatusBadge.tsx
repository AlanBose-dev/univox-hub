import { Badge } from "@/components/ui/badge";

type Status = "pending" | "under_review" | "resolved";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      className: "bg-warning/10 text-warning border-warning/20",
    },
    under_review: {
      label: "Under Review",
      variant: "secondary" as const,
      className: "bg-accent/10 text-accent border-accent/20",
    },
    resolved: {
      label: "Resolved",
      variant: "secondary" as const,
      className: "bg-success/10 text-success border-success/20",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
