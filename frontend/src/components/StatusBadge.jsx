const statusClass = {
  Applied: "status applied",
  Interview: "status interview",
  Offer: "status offer",
  Rejected: "status rejected",
};

export default function StatusBadge({ status }) {
  return <span className={statusClass[status] || "status"}>{status}</span>;
}
