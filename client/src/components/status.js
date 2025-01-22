export function statusColor(e) {
  switch (e.statusId) {
    case 1:
      return "grey-4";
    case 2:
      return "amber-2";
    case 3:
      return "green-2";
    default:
      return "";
  }
}

export function textStatusColor(e) {
  switch (e.statusId) {
    case 1:
      return "text-grey-8";
    case 2:
      return "text-amber-9";
    case 3:
      return "text-green-9";
    default:
      return "";
  }
}
